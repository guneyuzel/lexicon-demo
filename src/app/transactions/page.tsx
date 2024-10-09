"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TransactionHistory from "@/components/TransactionHistory";
import { IconHome, IconUsers, IconHistory } from "@tabler/icons-react";
import Link from "next/link";
import Image from 'next/image';

export default function TransactionsPage() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState("transactions");

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
            Transactions
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            View and manage your Solana transaction history.
          </p>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-4xl mx-auto">
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
}