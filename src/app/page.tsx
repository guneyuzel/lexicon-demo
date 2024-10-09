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
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h2 className="text-2xl font-bold text-white">Lexicon AI</h2>
        <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !transition !duration-200" />
      </div>
      <div className="flex-grow overflow-hidden p-4">
        <CommandCenter />
      </div>
    </div>
  );
}