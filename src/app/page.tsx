/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ChatbotPopup from "@/components/ChatbotPopup";
import { IconBrandGithub, IconRocket, IconShieldCheck, IconHome, IconUsers, IconHistory, IconBrandOpenai } from "@tabler/icons-react";
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
    <div className="min-h-screen bg-gradient-to-br from-black-900 to-black-900 text-white">
      <header className="bg-black-800 bg-opacity-50 py-4">
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
          <h2 className="text-5xl font-extrabold mb-6 bg-clip-text color-white">
            Lexicon: Your Web3 Assistant
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Experience the future of blockchain interaction with our AI-powered chatbot. Execute Solana transactions using simple, conversational commands.
          </p>
        </div>

        {/* Add ChatbotPopup to the center of the page */}
        <div className="flex justify-center mb-16">
          <ChatbotPopup />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>Connect your Solana wallet (devnet)</li>
              <li>Click the chat icon in the middle of the screen</li>
              <li>Type or speak your command (e.g., "Send 1 SOL to Alice")</li>
              <li>Review and confirm the transaction</li>
            </ol>
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Key Features</h3>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Natural language processing for easy interactions</li>
              <li>Voice command support for hands-free operation</li>
              <li>Secure, client-side transaction signing</li>
              <li>Support for SOL and SPL token transfers</li>
            </ul>
          </div>
        </div>

        {/* New section: What We're Building */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We're Building</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<IconRocket className="text-blue-400" size={48} />}
              title="SDK Integration"
              description="We're developing an SDK to seamlessly integrate Lexicon into any app, expanding its reach and utility across the ecosystem."
            />
            <FeatureCard 
              icon={<IconShieldCheck className="text-green-400" size={48} />}
              title="Live Data Integration"
              description="Integrating real-time API data to help users navigate and interact with any Web3 app effortlessly."
            />
            <FeatureCard 
              icon={<IconBrandOpenai className="text-purple-400" size={48} />}
              title="Specialized LLM for Solana"
              description="Creating a specialized LLM model focused on Solana-related events and data for more accurate and relevant interactions."
            />
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Get Started Now</h3>
          <p className="mb-6">Connect your wallet and click the chat icon in the center of the screen to start interacting with the Solana blockchain.</p>
          {connected ? (
            <div className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded">
              Wallet Connected: {balance?.toFixed(2)} SOL
            </div>
          ) : (
            <p className="text-gray-400">Connect your wallet to get started</p>
          )}
        </div>
      </main>
    </div>
  );
}

// Add this component at the end of the file
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}