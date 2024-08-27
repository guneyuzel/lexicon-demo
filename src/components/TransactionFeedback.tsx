"use client";

import { useTransactionStore } from '@/stores/transactionStore';
import { useConnection } from '@solana/wallet-adapter-react';

export default function TransactionFeedback() {
  const { status, message, signature } = useTransactionStore();
  const { connection } = useConnection();

  if (status === 'idle') return null;

  const statusColors = {
    pending: 'bg-yellow-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const getExplorerLink = (signature: string) => {
    const cluster = connection.rpcEndpoint.includes('devnet')
      ? 'devnet'
      : connection.rpcEndpoint.includes('testnet')
      ? 'testnet'
      : 'mainnet';
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
  };

  return (
    <div className={`mt-4 p-4 rounded-lg ${statusColors[status]} text-white`}>
      <p className="font-bold mb-2">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
      <p>{message}</p>
      {signature && (
        <a
          href={getExplorerLink(signature)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline mt-2 inline-block"
        >
          View transaction
        </a>
      )}
    </div>
  );
}