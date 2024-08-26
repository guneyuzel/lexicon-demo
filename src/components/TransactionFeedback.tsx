"use client";

import { useTransactionStore } from '@/stores/transactionStore';

export default function TransactionFeedback() {
  const { status, message, signature } = useTransactionStore();

  if (status === 'idle') return null;

  const getSolscanLink = (signature: string) => {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  };

  return (
    <div className="mt-6 p-4 rounded bg-gray-700 border border-gray-600">
      <div className={`text-lg font-bold ${
        status === 'success' ? 'text-green-400' : 
        status === 'pending' ? 'text-yellow-400' : 'text-red-400'
      }`}>
        {status === 'success' ? 'Transaction Successful' : 
         status === 'pending' ? 'Transaction Pending' : 'Transaction Failed'}
      </div>
      {(status === 'success' || status === 'pending') && signature && (
        <div className="mt-2">
          <a 
            href={getSolscanLink(signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Check on Solscan
          </a>
        </div>
      )}
      {signature && (
        <div className="mt-2 text-sm text-gray-300">
          <span className="font-medium">Signature:</span>
          <span className="block mt-1 break-all text-xs">{signature}</span>
        </div>
      )}
      <div className="mt-2 text-sm text-gray-400 break-words">{message}</div>
    </div>
  );
}