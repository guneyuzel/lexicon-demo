"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ChatbotPopup from "@/components/ChatbotPopup";
import { IconHome, IconWallet, IconHistory, IconUsers, IconBrandOpenai } from "@tabler/icons-react";
import { useBalanceStore } from "@/stores/balanceStore";
import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { balance, setBalance } = useBalanceStore();
  const [activeTab, setActiveTab] = useState("dashboard");

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

  const menuItems = [
    { id: "dashboard", icon: IconHome, label: "Dashboard" },
    { id: "contacts", icon: IconUsers, label: "Contacts" },
    { id: "transactions", icon: IconHistory, label: "Transactions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <header className="bg-gray-800 bg-opacity-50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/lexicon.png" alt="Lexicon AI Logo" width={32} height={32} />
            <h1 className="text-2xl font-bold">Lexicon</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/${item.id === "dashboard" ? "" : item.id}`}
                className={`flex items-center space-x-2 ${
                  activeTab === item.id ? "text-purple-400" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <WalletMultiButton className="!bg-purple-600 !text-white hover:!bg-purple-700 !transition !duration-200 !rounded-full !px-6 !py-2" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mt-12 mb-16">
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to Lexicon AI
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Execute Solana transactions using natural language commands. Experience the future of blockchain interaction.
          </p>
          
          {connected && balance !== null ? (
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <IconHome className="text-blue-400" size={24} />
                <span className="text-lg">Connected</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <IconWallet className="text-yellow-400" size={24} />
                <span className="text-2xl font-bold">{balance.toFixed(4)} SOL</span>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => {}} // Add wallet connection logic here
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Connect Wallet
            </button>
          )}
        </div>
        
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-center">Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
              <IconWallet className="text-purple-400 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-semibold mb-2">Connect Wallet</h4>
              <p className="text-gray-400">Link your Solana wallet to get started</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
              <IconBrandOpenai className="text-purple-400 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-semibold mb-2">Use AI Commands</h4>
              <p className="text-gray-400">Interact using natural language</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
              <IconHistory className="text-purple-400 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-semibold mb-2">Track Transactions</h4>
              <p className="text-gray-400">View your transaction history</p>
            </div>
          </div>
        </div>
      </main>
      <ChatbotPopup />
    </div>
  );
}