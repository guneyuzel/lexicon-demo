"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseCommand } from "@/utils/parseCommand";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { useTransactionStore } from '@/stores/transactionStore';
import VoiceCommand from './VoiceCommand';
import TransactionFeedback from './TransactionFeedback';
import { IconSend } from '@tabler/icons-react';

export default function CommandCenter() {
  const [command, setCommand] = useState("");
  const { publicKey, signTransaction, connected } = useWallet();
  const { setStatus } = useTransactionStore();

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
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(parsedCommand.recipient),
          lamports: parsedCommand.amount * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const txSignature = await connection.sendRawTransaction(signedTransaction.serialize());

      const confirmation = await connection.confirmTransaction(txSignature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

    } catch (error) {
      console.error("Error executing command:", error);
      setStatus('error', error instanceof Error ? error.message : "An unknown error occurred");
    }

    setCommand("");
  };

  const handleVoiceCommand = (voiceCommand: string) => {
    setCommand(voiceCommand);
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
            placeholder="Enter your command (e.g., send 1 sol to Guney)"
            className="flex-grow p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Command input"
          />
          <VoiceCommand onCommand={handleVoiceCommand} />
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
      <div className="mt-6">
        <TransactionFeedback />
      </div>
    </div>
  );
}