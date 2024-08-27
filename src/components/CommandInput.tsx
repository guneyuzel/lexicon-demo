"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseCommand } from "@/utils/parseCommand";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { useTransactionStore } from '@/stores/transactionStore';
import { useContactsStore } from '@/stores/contactsStore';

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const { publicKey, signTransaction, connected } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const { contacts, loadContacts } = useContactsStore();

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      const parsedCommand = parseCommand(command);
      console.log("Parsed command:", parsedCommand);

      let recipientPublicKey: PublicKey;
      try {
        recipientPublicKey = new PublicKey(parsedCommand.recipient);
      } catch (error) {
        throw new Error("Invalid recipient. Please use a valid contact name or public key.");
      }

      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: parsedCommand.amount * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log("Transaction sent:", signature);

      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      console.log("Transaction confirmed:", signature);
      setError(null);
    } catch (error) {
      console.error("Error executing command:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    }

    setCommand("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mt-8">
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter your command (e.g., send 1 sol to Guney)"
        className="w-full p-2 border border-gray-300 rounded text-black"
      />
      <button
        type="submit"
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={!connected}
      >
        Execute Command
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}