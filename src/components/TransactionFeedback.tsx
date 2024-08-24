"use client";

import { useTransactionStore } from '@/stores/transactionStore';

export default function TransactionFeedback() {
  const { status, message, signature } = useTransactionStore();

  if (status === 'idle') return null;

  return (
    <div className="w-full max-w-md mt-8 p-4 rounded bg-gray-100 border border-gray-300">
      <div className={`mb-2 font-bold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {status === 'success' ? 'Transaction Successful' : 'Transaction Failed'}
      </div>
      <div className="text-sm text-gray-700 break-words">{message}</div>
      {signature && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-semibold">Signature:</span>
          <span className="block mt-1 break-all">{signature}</span>
        </div>
      )}
    </div>
  );
}