import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const WalletContextProviderDynamic = dynamic(
  () => import('@/contexts/WalletContextProvider').then(mod => mod.WalletContextProvider),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana AI Assistant",
  description: "Execute Solana transactions using natural language commands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProviderDynamic>{children}</WalletContextProviderDynamic>
      </body>
    </html>
  );
}