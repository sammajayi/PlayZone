// src/lib/markets.ts
import { Market } from "../types/market";

export const markets: Market[] = [
  {
    id: "1",
    title: "Will Ethereum exceed $4,000 by December 2025?",
    description:
      "Traders predict whether Ethereum’s price will surpass $4,000 by the end of 2025.",
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    resolutionTime: "2026-01-01T05:00:00Z",
    status: "open",
    volume: 2100,
    trades: [
      { time: "2025-11-06T10:00:00Z", amount: 200 },
      { time: "2025-11-06T12:00:00Z", amount: 150 },
      { time: "2025-11-07T09:00:00Z", amount: 300 },
    ],
  },
  {
    id: "2",
    title: "Will Bitcoin dominance stay above 50% in Q1 2026?",
    description:
      "Market predicts Bitcoin’s dominance over altcoins in early 2026.",
    startDate: "2025-10-10T00:00:00Z",
    endDate: "2025-11-10T23:59:59Z",
    resolutionTime: "2025-11-11T05:00:00Z",
    status: "closed",
    volume: 1300,
    trades: [
      { time: "2025-10-12T08:00:00Z", amount: 120 },
      { time: "2025-10-15T14:00:00Z", amount: 90 },
      { time: "2025-10-20T18:00:00Z", amount: 200 },
    ],
  },

  {
    id: '3',
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    description: 'Will Bitcoin close the year above $100,000?',
    volume: 120450,
    status: 'open',
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    resolutionTime: "2026-01-01T05:00:00Z",
    trades: [
      { time: "2025-11-06T10:00:00Z", amount: 200 },
      { time: "2025-11-06T12:00:00Z", amount: 150 },
      { time: "2025-11-07T09:00:00Z", amount: 300 },
    ],
  },
  {
    id: '4',
    title: 'Ethereum will hit 4k?',
    description: 'Will Ethereum close the year above $4,000?',
    volume: 45210,
    status: 'open',
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    resolutionTime: "2026-01-01T05:00:00Z",
    trades: [
      { time: "2025-11-06T10:00:00Z", amount: 200 },
      { time: "2025-11-06T12:00:00Z", amount: 150 },
      { time: "2025-11-07T09:00:00Z", amount: 300 },
    ],
  },
  {
    id: '5',
    title: 'Will Solana reach $300 by end of 2025?',
    description: 'Will Solana close the year above $300?',
    volume: 9331,
    status: 'closed',
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    resolutionTime: "2026-01-01T05:00:00Z",
    trades: [
      { time: "2025-11-06T10:00:00Z", amount: 200 },
      { time: "2025-11-06T12:00:00Z", amount: 150 },
      { time: "2025-11-07T09:00:00Z", amount: 300 },
    ],
  },

];
