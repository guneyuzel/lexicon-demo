import { create } from 'zustand';

type BalanceStore = {
  balance: number | null;
  setBalance: (balance: number) => void;
};

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: null,
  setBalance: (balance) => set({ balance }),
}));