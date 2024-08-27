import { useTransactionStore } from '@/stores/transactionStore';
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-react';

export default function TransactionFeedback() {
  const { status, message, signature, setStatus } = useTransactionStore();

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

  const handleClose = () => {
    setStatus('idle', '');
  };

  return (
    <div className={`mt-4 p-4 rounded-lg ${statusColors[status]} text-white relative`}>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
        aria-label="Close"
      >
        <IconX size={20} />
      </button>
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