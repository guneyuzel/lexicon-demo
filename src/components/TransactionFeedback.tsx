import { useTransactionStore } from '@/stores/transactionStore';
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-react';

export default function TransactionFeedback() {
  const { status, message, signature } = useTransactionStore();

  if (status === 'idle') return null;

  const statusColors = {
    pending: 'bg-yellow-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const StatusIcon = () => {
    switch (status) {
      case 'pending':
        return <IconLoader2 className="animate-spin" />;
      case 'success':
        return <IconCheck />;
      case 'error':
        return <IconX />;
      default:
        return null;
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-lg ${statusColors[status]} text-white`}>
      <div className="flex items-center space-x-2">
        <StatusIcon />
        <span className="font-semibold">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
      <p className="mt-2">{message}</p>
      {signature && (
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block underline"
        >
          View transaction
        </a>
      )}
    </div>
  );
}