"use client";

import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CommandCenter from "@/components/CommandCenter";
import { IconWallet, IconCoin } from '@tabler/icons-react';

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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !transition !duration-200" />
      </div>
      <div className="bg-black p-8 rounded-lg shadow-lg border border-white/10">
        <h3 className="text-2xl font-bold mb-6 text-white">Wallet Information</h3>
        {connected && publicKey ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <IconWallet className="w-6 h-6" />
              <span className="font-semibold">Address:</span>
              <span className="font-mono">{publicKey.toBase58()}</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <IconCoin className="w-6 h-6" />
              <span className="font-semibold">Balance:</span>
              <span>{balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}</span>
            </div>
          </div>
        ) : (
          <p className="text-white">Connect your wallet (devnet) to view balance and execute commands.</p>
        )}
      </div>
      <CommandCenter />
    </div>
  );
}