"use client";

import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import CommandCenter from "@/components/CommandCenter";

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [connected, publicKey]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      {connected && publicKey && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-lg">Wallet: {publicKey.toBase58()}</p>
          <p className="text-lg">Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</p>
        </div>
      )}
      <CommandCenter />
    </div>
  );
}