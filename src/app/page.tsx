"use client";

import { markets } from "../lib/Market";
import { MarketCard } from "../components/market/MarketCard";

export default function Page() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Market</h1>
          <p className="text-[#64748b]">Browse all created predictions</p>
        </div>
        <a
          href="/create"
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white no-underline px-4 py-2 rounded-lg font-semibold"
        >
          Create market
        </a>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </section>
    </main>
  );
}


