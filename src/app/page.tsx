"use client";

import { TransactionHistory } from "@/components/TransactionHistory";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Crypto Wallet Dashboard</h1>
        <div className="mb-8">
          {/* <ConnectWalletButton /> Теперь кнопка находится в NavBar */}
        </div>
        <TransactionHistory />
      </div>
    </main>
  );
}
