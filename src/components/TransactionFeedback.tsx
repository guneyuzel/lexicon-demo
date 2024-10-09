import { useTransactionStore } from '@/stores/transactionStore';
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionFeedbackProps {
  transactionId: string;
}

export default function TransactionFeedback({ transactionId }: TransactionFeedbackProps) {
  const { transactions } = useTransactionStore();
  const transaction = transactions.find(t => t.id === transactionId);

  if (!transaction) return null;

  const { status, message, signature } = transaction;

  const statusConfig = {
    pending: { icon: IconLoader2, color: 'border-yellow-500', bg: 'bg-yellow-500/10' },
    success: { icon: IconCheck, color: 'border-green-500', bg: 'bg-green-500/10' },
    error: { icon: IconX, color: 'border-red-500', bg: 'bg-red-500/10' },
  };

  const { icon: StatusIcon, color, bg } = statusConfig[status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`p-4 rounded-lg ${bg} border ${color} shadow-lg`}
      >
        <div className="flex items-start">
          <div className={`p-2 rounded-full ${bg} ${color}`}>
            <StatusIcon className={`w-5 h-5 ${status === 'pending' ? 'animate-spin' : ''}`} />
          </div>
          <span className="font-semibold text-white ml-3">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="mt-2 text-gray-300">{message}</p>
        {signature && (
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-blue-400 hover:text-blue-300 transition-colors"
          >
            View transaction
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
}