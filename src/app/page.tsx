"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ChatbotPopup from "@/components/ChatbotPopup";
import { IconBrandGithub, IconRocket, IconShieldCheck, IconHome, IconUsers, IconHistory } from "@tabler/icons-react";
import { useBalanceStore } from "@/stores/balanceStore";
import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  const { publicKey, connected } = useWallet();
  const { balance, setBalance } = useBalanceStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: IconHome, label: "Dashboard" },
    { id: "contacts", icon: IconUsers, label: "Contacts" },
    { id: "transactions", icon: IconHistory, label: "Transactions" },
  ];

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

      <main className="container mx-auto px-4 py-12 overflow-y-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to Lexicon AI
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Execute Solana transactions using natural language commands. Experience the future of blockchain interaction.
          </p>
          <a 
            href="https://github.com/yourusername/lexicon-ai-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
          >
            <IconBrandGithub className="mr-2" />
            View on GitHub
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<IconRocket className="text-purple-400" size={48} />}
            title="Natural Language Processing"
            description="Interact with the Solana blockchain using simple, conversational commands."
          />
          <FeatureCard 
            icon={<IconShieldCheck className="text-green-400" size={48} />}
            title="Secure Transactions"
            description="Your funds remain secure with client-side signing and transparent transaction details."
          />
          <FeatureCard 
            icon={<IconBrandGithub className="text-blue-400" size={48} />}
            title="Open Source"
            description="Contribute to the project and help shape the future of blockchain interactions."
          />
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Try It Now</h3>
          <p className="mb-6">Connect your wallet and use the chat interface to start interacting with the Solana blockchain.</p>
          {connected ? (
            <div className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded">
              Wallet Connected: {balance?.toFixed(2)} SOL
            </div>
          ) : (
            <p className="text-gray-400">Connect your wallet to get started</p>
          )}
        </div>
      </main>

      <ChatbotPopup />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}