"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ChatbotPopup from "@/components/ChatbotPopup";
import { IconHome, IconUsers, IconHistory } from "@tabler/icons-react";
import { useBalanceStore } from "@/stores/balanceStore";
import Image from "next/image";

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { balance, setBalance } = useBalanceStore();

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [connected, publicKey, setBalance]);

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <WalletMultiButton className="!bg-purple-600 !text-white hover:!bg-purple-700 !transition !duration-200" />
        </header>
        <div className="text-center mt-20">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Welcome to Lexicon AI
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Execute Solana transactions using natural language commands.
          </p>
          {connected && balance !== null && (
            <div className="flex items-center justify-center space-x-4 mb-8">
              <IconHome className="text-blue-500" size={24} />
              <span className="text-lg text-white">Connected</span>
              <IconHistory className="text-yellow-500" size={24} />
              <span className="text-lg text-white">
                {balance.toFixed(4)} SOL
              </span>
            </div>
          )}
        </div>
        <ChatbotPopup />
      </main>
    </div>
  );
}
