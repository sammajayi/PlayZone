"use client";

import { useState } from 'react';

export default function CreateMarketPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [marketQuestion, setMarketQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const cryptoOptions = ["BTC", "ETH", "SOL", "USDC", "DAI"];

  function handleNext() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire to your contract/API
    alert(`Create market: ${marketQuestion}`);
  }

  return (
    <main className="max-w-[720px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">Create market</h1>
      <p className="text-[#64748b] mb-6">Define your parameter for new market prediction market.</p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step
                      ? "bg-[#0f172a] text-white"
                      : "bg-[rgba(15,23,42,0.08)] text-[#64748b]"
                    }`}
                >
                  {step}
                </div>
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${currentStep > step ? "bg-[#0f172a]" : "bg-[rgba(15,23,42,0.08)]"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">

        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Market Basics</h2>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="marketQuestion">
                Market Question
              </label>
              <input
                id="marketQuestion"
                value={marketQuestion}
                onChange={(e) => setMarketQuestion(e.target.value)}
                required
                className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                placeholder="e.g. Will BTC reach $80k by Dec 31?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                placeholder="Add context and resolution criteria"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleNext}
                disabled={!marketQuestion || !description}
                className="bg-[#0f172a] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="crypto">
                Select Crypto
              </label>
              <select
                id="crypto"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                required
                className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1] bg-white"
              >
                <option value="">Select a cryptocurrency</option>
                {cryptoOptions.map((crypto) => (
                  <option key={crypto} value={crypto}>
                    {crypto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="targetAmount">
                Target Amount
              </label>
              <input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                placeholder="e.g. 80000"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="border border-[rgba(15,23,42,0.12)] text-[#0f172a] px-4 py-2 rounded-lg font-semibold hover:bg-[rgba(15,23,42,0.04)]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedCrypto || !targetAmount}
                className="bg-[#0f172a] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Market Time */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Market Time</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="startTime">
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="endTime">
                  End Time
                </label>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full border border-[rgba(15,23,42,0.12)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="border border-[rgba(15,23,42,0.12)] text-[#0f172a] px-4 py-2 rounded-lg font-semibold hover:bg-[rgba(15,23,42,0.04)]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!startDate || !startTime || !endDate || !endTime}
                className="bg-[#0f172a] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}


