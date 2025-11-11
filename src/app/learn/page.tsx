export default function LearnPage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Learn</h1>
      <p className="text-[#64748b] mb-6">How prediction markets on PlayZone work</p>

      <div className="space-y-4 text-[#0f172a]">
        <section>
          <h2 className="text-lg font-semibold mb-1">What is a prediction market?</h2>
          <p>
            A prediction market lets participants trade on the outcome of future events. Prices reflect the
            collective probability of outcomes.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-1">Creating a market</h2>
          <p>
            Define a clear question, resolution criteria, and deadline. Liquidity providers seed initial depth, and
            traders take positions by buying outcome shares.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-1">Resolution</h2>
          <p>
            After the deadline, the market resolves according to the specified oracle or governance process. Winning
            shares pay out while losing shares become worthless.
          </p>
        </section>
      </div>
    </main>
  );
}


