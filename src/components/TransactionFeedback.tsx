"use client";

import { useTransactionStore } from '@/stores/transactionStore';
import { useEffect, useState } from 'react';
import { IconCheck, IconClock, IconX } from '@tabler/icons-react';

export default function TransactionFeedback() {
  const { status, message, signature } = useTransactionStore();
  const [displayStatus, setDisplayStatus] = useState(status);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (status !== 'idle') {
      setDisplayStatus(status);
      setDisplayMessage(message);
    }
  }, [status, message]);

  if (displayStatus === 'idle') return null;

  const getSolscanLink = (signature: string) => {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  };

  const statusIcon = {
    success: <IconCheck className="text-green-400" size={24} />,
    pending: <IconClock className="text-yellow-400" size={24} />,
    error: <IconX className="text-red-400" size={24} />
  }[displayStatus];

  const statusText = {
    success: 'Transaction Successful',
    pending: 'Transaction Pending',
    error: 'Transaction Failed'
  }[displayStatus];

  return (
    <div className="mt-6 p-4 rounded bg-gray-700 border border-gray-600 shadow-lg">
      <div className="flex items-center mb-2">
        {statusIcon}
        <span className={`ml-2 text-lg font-bold ${
          displayStatus === 'success' ? 'text-green-400' : 
          displayStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {statusText}
        </span>
      </div>
      {signature && (
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
      <div className="mt-2 text-sm text-gray-400 break-words">{displayMessage}</div>
    </div>
  );
}