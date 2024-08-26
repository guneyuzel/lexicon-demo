"use client";

import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

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
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Recent Transactions</h3>
      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li key={tx.signature} className="bg-gray-700 p-4 rounded">
            <p className="text-sm break-all">
              <span className="font-semibold">Signature:</span>{" "}
              <a 
                href={getSolscanLink(tx.signature)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {tx.signature}
              </a>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span> {tx.err ? 'Failed' : 'Success'}
            </p>
            {tx.blockTime && (
              <p className="text-sm">
                <span className="font-semibold">Time:</span> {new Date(tx.blockTime * 1000).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}