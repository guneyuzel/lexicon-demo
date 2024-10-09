"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseCommand } from "@/utils/parseCommand";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import { useTransactionStore } from "@/stores/transactionStore";
import VoiceCommand from "./VoiceCommand";
import { IconSend } from "@tabler/icons-react";
import TransactionFeedback from "./TransactionFeedback";
import { fetchUserTokens, TokenInfo } from "@/utils/fetchUserTokens";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { motion } from "framer-motion";

export default function CommandCenter() {
  const [command, setCommand] = useState("");
  const { publicKey, signTransaction, connected } = useWallet();
  const { setStatus, status, message, signature } = useTransactionStore();
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);
  const [messages, setMessages] = useState<
    Array<{
      type: "user" | "bot";
      content: string | React.ReactNode;
      id?: string;
    }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTransactionId, setCurrentTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      fetchUserTokens(connection, publicKey).then(setUserTokens);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (status !== "idle") {
      if (currentTransactionId) {
        // Update existing transaction feedback
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentTransactionId
              ? { ...msg, content: <TransactionFeedback /> }
              : msg
          )
        );
      } else {
        // Add new transaction feedback
        const newId = Date.now().toString();
        setCurrentTransactionId(newId);
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: <TransactionFeedback />, id: newId },
        ]);
      }
    } else {
      // Reset currentTransactionId when the transaction is complete
      setCurrentTransactionId(null);
    }
  }, [status, message, signature]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: command }]);

    if (!connected || !publicKey || !signTransaction) {
      setStatus("error", "Please connect your wallet first.");
      return;
    }

    try {
      setStatus("pending", "Processing transaction...");

      const parsedCommand = parseCommand(command);

      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const transaction = new Transaction();

      if (parsedCommand.token === "SOL") {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(parsedCommand.recipient),
            lamports: parsedCommand.amount * LAMPORTS_PER_SOL,
          })
        );
      } else {
        const tokenInfo = userTokens.find(
          (t) =>
            t.symbol?.toLowerCase() === parsedCommand.token.toLowerCase() ||
            t.name?.toLowerCase() === parsedCommand.token.toLowerCase()
        );
        if (!tokenInfo) {
          throw new Error(
            `Token ${parsedCommand.token} not found in your wallet.`
          );
        }

        const mintPublicKey = new PublicKey(tokenInfo.mint);
        const recipientPublicKey = new PublicKey(parsedCommand.recipient);

        const sourceTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          publicKey
        );

        const destinationTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          recipientPublicKey
        );

        // Check if the destination token account exists
        const destinationAccountInfo = await connection.getAccountInfo(
          destinationTokenAccount
        );

        if (!destinationAccountInfo) {
          // If the account doesn't exist, add an instruction to create it
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey,
              destinationTokenAccount,
              recipientPublicKey,
              mintPublicKey
            )
          );
        }

        // Add the transfer instruction
        transaction.add(
          createTransferInstruction(
            sourceTokenAccount,
            destinationTokenAccount,
            publicKey,
            parsedCommand.amount * Math.pow(10, tokenInfo.decimals)
          )
        );
      }

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const txSignature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      const confirmationStrategy: TransactionConfirmationStrategy = {
        signature: txSignature,
        blockhash: transaction.recentBlockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash())
          .lastValidBlockHeight,
      };

      const confirmation = await connection.confirmTransaction(
        confirmationStrategy
      );

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setStatus(
        "success",
        `Successfully sent ${parsedCommand.amount} ${parsedCommand.token} to ${parsedCommand.recipient}`,
        txSignature
      );
    } catch (error) {
      console.error("Error executing command:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setStatus("error", errorMessage);
    }

    setCommand("");
  };

  const handleTextChange = (text: string) => {
    setCommand(text);
  };

  return (
    <div className="bg-black p-8 rounded-lg shadow-lg border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">AI Command Center</h3>
      </div>
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages
          .filter((message) => message.content)
          .map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg ${
                message.type === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
              } ${message.type === "user" ? "max-w-[80%]" : "w-full"}`}
            >
              {message.content}
            </motion.div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter your command (e.g., 'Send 1 SOL to Alice')"
            className="w-full p-4 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-200"
            aria-label="Command input"
          />
          <VoiceCommand onTextChange={handleTextChange} language="en-US" />
        </div>
        <button
          type="submit"
          className="bg-white text-black p-4 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center"
          disabled={!connected}
        >
          <IconSend size={20} />
        </button>
      </form>
    </div>
  );
}
