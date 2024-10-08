"use client";

import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { IconCheck, IconX, IconExternalLink } from '@tabler/icons-react';

type Transaction = {
  signature: string;
  slot: number;
  err: any;
  memo: string | null;
  blockTime: number | null;
};

export default function TransactionHistory() {
  const { publicKey, connected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      connection.getSignaturesForAddress(publicKey, { limit: 10 }).then((sigs) => {
        const formattedTransactions: Transaction[] = sigs.map(sig => ({
          signature: sig.signature,
          slot: sig.slot,
          err: sig.err,
          memo: sig.memo,
          blockTime: sig.blockTime ?? null
        }));
        setTransactions(formattedTransactions);
      });
    }
  }, [connected, publicKey]);

  if (!connected || !publicKey) {
    return null;
  }

  const getSolscanLink = (signature: string) => {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  };

  return (
    <div className="bg-black p-8 rounded-lg shadow-lg border border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-white">Recent Transactions</h3>
      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li key={tx.signature} className="bg-white/5 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className={`flex items-center ${tx.err ? 'text-red-500' : 'text-green-500'}`}>
                {tx.err ? <IconX size={20} className="mr-2" /> : <IconCheck size={20} className="mr-2" />}
                {tx.err ? 'Failed' : 'Success'}
              </span>
              {tx.blockTime && (
                <span className="text-gray-400 text-sm">
                  {new Date(tx.blockTime * 1000).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm break-all text-white">
              <span className="font-semibold">Signature:</span>{" "}
              {tx.signature.slice(0, 20)}...{tx.signature.slice(-20)}
            </p>
            <a 
              href={getSolscanLink(tx.signature)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              View on Solscan
              <IconExternalLink size={16} className="ml-1" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}