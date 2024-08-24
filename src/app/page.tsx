"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import CommandInput from "@/components/CommandInput";
import ContactsList from "@/components/ContactsList";
import TransactionFeedback from "@/components/TransactionFeedback";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletConnectionCheck = dynamic(
  async () => {
    const { useWallet } = await import('@solana/wallet-adapter-react');
    return function WalletConnectionCheck({ children }: { children: React.ReactNode }) {
      const { connected } = useWallet();
      return connected ? <>{children}</> : null;
    };
  },
  { ssr: false }
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Solana AI Assistant</h1>
      <WalletMultiButtonDynamic />
      <WalletConnectionCheck>
        <div className="w-full max-w-md space-y-8 mt-8">
          <CommandInput />
          <ContactsList />
          <TransactionFeedback />
        </div>
      </WalletConnectionCheck>
    </main>
  );
}