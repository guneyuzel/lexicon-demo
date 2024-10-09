import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";

const WalletContextProviderDynamic = dynamic(
  () =>
    import("@/contexts/WalletContextProvider").then(
      (mod) => mod.WalletContextProvider
    ),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Lexicon",
  description: "Execute Solana transactions using natural language commands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <WalletContextProviderDynamic>
          <div className="flex">
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </WalletContextProviderDynamic>
      </body>
    </html>
  );
}
