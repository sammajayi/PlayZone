"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Market } from "../../types/market";
import { Clock } from "lucide-react";

interface MarketCardProps {
    market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const endDate = new Date(market.endDate).getTime();
            const diff = endDate - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeRemaining("Closed");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
            } else if (hours > 0) {
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            } else if (minutes > 0) {
                setTimeRemaining(`${minutes}m ${seconds}s`);
            } else {
                setTimeRemaining(`${seconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [market.endDate]);

    const handleVote = (e: React.MouseEvent, vote: "yes" | "no") => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Implement vote functionality
        console.log(`Voted ${vote} for market ${market.id}`);
    };

    return (
        <Link
            href={`/market/${market.id}`}
            className="block border border-[rgba(15,23,42,0.08)] rounded-xl p-5 hover:border-[rgba(15,23,42,0.16)] hover:shadow-md transition-all no-underline"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-[#0f172a] line-clamp-2 flex-1">
                    {market.title}
                </h2>
                <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                        market.status === "open"
                            ? "bg-[rgba(16,185,129,0.12)] text-[#065f46]"
                            : "bg-[rgba(239,68,68,0.12)] text-[#7f1d1d]"
                    }`}
                >
                    {market.status}
                </span>
            </div>

            <p className="text-[#475569] text-sm mb-4 line-clamp-2">{market.description}</p>

            <div className="flex items-center gap-2 mb-4 text-sm text-[#64748b]">
                <Clock size={14} aria-hidden="true" />
                <span className="font-medium">
                    {isExpired ? "Closed" : timeRemaining}
                </span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-[rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#64748b]">Volume:</span>
                    <span className="font-semibold text-[#0f172a]">
                        {market.volume.toLocaleString()}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => handleVote(e, "yes")}
                        className="px-3 py-1.5 bg-[rgba(16,185,129,0.12)] text-[#065f46] rounded-lg text-sm font-medium hover:bg-[rgba(16,185,129,0.2)] transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={(e) => handleVote(e, "no")}
                        className="px-3 py-1.5 bg-[rgba(239,68,68,0.12)] text-[#ef4444] rounded-lg text-sm font-medium hover:bg-[rgba(239,68,68,0.2)] transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        </Link>
    );
}

