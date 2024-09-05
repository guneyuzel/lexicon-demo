"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseCommand } from "@/utils/parseCommand";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { useTransactionStore } from '@/stores/transactionStore';
import VoiceCommand from './VoiceCommand';
import { IconSend } from '@tabler/icons-react';
import TransactionFeedback from './TransactionFeedback';
import { fetchUserTokens, TokenInfo } from "@/utils/fetchUserTokens";
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";

export default function CommandCenter() {
  const [command, setCommand] = useState("");
  const { publicKey, signTransaction, connected } = useWallet();
  const { setStatus } = useTransactionStore();
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      fetchUserTokens(connection, publicKey).then(setUserTokens);
    }
  }, [connected, publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !signTransaction) {
      setStatus('error', "Please connect your wallet first.");
      return;
    }

    try {
      setStatus('pending', "Processing transaction...");
      const parsedCommand = parseCommand(command);
      
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
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
        const tokenInfo = userTokens.find(t => t.symbol == parsedCommand.token);
        if (!tokenInfo) {
          throw new Error(`Token ${parsedCommand.token} not found in your wallet.`);
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
        const destinationAccountInfo = await connection.getAccountInfo(destinationTokenAccount);

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
      const txSignature = await connection.sendRawTransaction(signedTransaction.serialize());

      const confirmation = await connection.confirmTransaction(txSignature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setStatus('success', `Successfully sent ${parsedCommand.amount} ${parsedCommand.token} to ${parsedCommand.recipient}`, txSignature);
    } catch (error) {
      console.error("Error executing command:", error);
      setStatus('error', error instanceof Error ? error.message : "An unknown error occurred");
    }

    setCommand("");
  };

  const handleTextChange = (text: string) => {
    setCommand(text);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-white">Command Center</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter your command (e.g., 'Send 1 SOL to Alice' or 'Transfer 2.5 USDC to abc123')"
            className="flex-grow p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Command input"
          />
          <VoiceCommand onTextChange={handleTextChange} language="en-US" />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          disabled={!connected}
        >
          <IconSend className="mr-2" size={20} />
          Execute Command
        </button>
      </form>
      <TransactionFeedback />
    </div>
  );
}