"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { parseCommand } from "@/utils/parseCommand";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { useTransactionStore } from '@/stores/transactionStore';

type Contact = {
  name: string;
  publicKey: string;
};

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const { publicKey, signTransaction, connected } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // TODO: Fetch contacts from the backend or global state
    const mockContacts: Contact[] = [
      { name: "Alice", publicKey: "ALiCeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
      { name: "Bob", publicKey: "BoBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
      { name: "Guney", publicKey: "GunEYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
    ];
    setContacts(mockContacts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      const parsedCommand = parseCommand(command);
      console.log("Parsed command:", parsedCommand);

      // Find the recipient's public key
      let recipientPublicKey: PublicKey;
      const contactMatch = contacts.find(contact => contact.name.toLowerCase() === parsedCommand.recipient.toLowerCase());
      if (contactMatch) {
        recipientPublicKey = new PublicKey(contactMatch.publicKey);
      } else {
        try {
          recipientPublicKey = new PublicKey(parsedCommand.recipient);
        } catch (error) {
          throw new Error("Invalid recipient. Please use a valid contact name or public key.");
        }
      }

      // Create a connection to the Solana network
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Create a new transaction
      const transaction = new Transaction();

      // Add the transfer instruction to the transaction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: parsedCommand.amount * LAMPORTS_PER_SOL,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log("Transaction sent:", signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      console.log("Transaction confirmed:", signature);
      setError(null);
      useTransactionStore.getState().setStatus('success', `Transaction confirmed: ${signature}`, signature);
    } catch (error) {
      console.error("Error executing command:", error);
      useTransactionStore.getState().setStatus('error', error instanceof Error ? error.message : "An unknown error occurred");
    }

    // Reset the input field
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