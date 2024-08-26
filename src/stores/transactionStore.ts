import { create } from "zustand";

interface TransactionStore {
  status: 'idle' | 'pending' | 'success' | 'error';
  message: string;
  signature: string | null;
  setStatus: (status: 'idle' | 'pending' | 'success' | 'error', message: string, signature?: string | null) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  status: 'idle',
  message: '',
  signature: null,
  setStatus: (status, message, signature = null) => set({ status, message, signature }),
}));