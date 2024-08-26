"use client";

import TransactionHistory from "@/components/TransactionHistory";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Transactions</h2>
      <TransactionHistory />
    </div>
  );
}