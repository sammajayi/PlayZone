export interface Market {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    resolutionTime: string;
    status: "open" | "closed";
    volume: number;
    trades: { time: string; amount: number }[];
  }
  