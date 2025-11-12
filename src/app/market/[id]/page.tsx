"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { markets } from "../../../lib/Market";
import { Market } from "../../../types/market";
import { Clock, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useAccount } from "wagmi";

interface Comment {
    id: string;
    author: string;
    authorAddress: string;
    content: string;
    timestamp: string;
    vote?: "yes" | "no";
}

export default function MarketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [market, setMarket] = useState<Market | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);
    const [comments, setComments] = useState<Comment[]>([

    ]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const foundMarket = markets.find((m) => m.id === params.id);
        if (foundMarket) {
            setMarket(foundMarket);
        }
    }, [params.id]);

    useEffect(() => {
        if (!market) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const endDate = new Date(market.endDate).getTime();
            const diff = endDate - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeRemaining("Market Closed");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeRemaining(`${days} days, ${hours} hours, ${minutes} minutes`);
            } else if (hours > 0) {
                setTimeRemaining(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
            } else if (minutes > 0) {
                setTimeRemaining(`${minutes} minutes, ${seconds} seconds`);
            } else {
                setTimeRemaining(`${seconds} seconds`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [market]);

    const handleVote = (vote: "yes" | "no") => {
        if (!isConnected) {
            alert("Please connect your wallet to vote");
            return;
        }
        // TODO: Implement vote functionality
        console.log(`Voted ${vote} for market ${market?.id}`);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            alert("Please connect your wallet to comment");
            return;
        }
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: "You",
            authorAddress: address || "0x0000...0000",
            content: newComment,
            timestamp: new Date().toISOString(),
        };

        setComments([comment, ...comments]);
        setNewComment("");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCommentTime = (timestamp: string) => {
        const now = new Date();
        const commentTime = new Date(timestamp);
        const diffMs = now.getTime() - commentTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(timestamp);
    };

    if (!market) {
        return (
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-semibold mb-2">Market not found</h1>
                    <p className="text-[#64748b] mb-4">The market you're looking for doesn't exist.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#1d4ed8] no-underline"
                    >
                        <ArrowLeft size={16} />
                        Back to Markets
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1200px] mx-auto px-4 py-8">
            <Link
                href="/market"
                className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0f172a] mb-6 no-underline"
            >
                <ArrowLeft size={16} />
                Back to Markets
            </Link>

            {/* Market Header */}
            <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="text-2xl font-semibold text-[#0f172a]">{market.title}</h1>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    market.status === "open"
                                        ? "bg-[rgba(16,185,129,0.12)] text-[#065f46]"
                                        : "bg-[rgba(239,68,68,0.12)] text-[#7f1d1d]"
                                }`}
                            >
                                {market.status}
                            </span>
                        </div>
                        <p className="text-[#475569] text-base">{market.description}</p>
                    </div>
                </div>

                {/* Timer and Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[rgba(15,23,42,0.08)]">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#64748b]" aria-hidden="true" />
                        <div>
                            <p className="text-xs text-[#64748b]">Time Remaining</p>
                            <p className="text-sm font-semibold text-[#0f172a]">
                                {isExpired ? "Closed" : timeRemaining}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-[#64748b]">End Date</p>
                        <p className="text-sm font-semibold text-[#0f172a]">
                            {formatDate(market.endDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#64748b]">Volume</p>
                        <p className="text-sm font-semibold text-[#0f172a]">
                            {market.volume.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Vote Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-[rgba(15,23,42,0.08)]">
                    <button
                        onClick={() => handleVote("yes")}
                        disabled={isExpired || market.status === "closed"}
                        className="flex-1 px-6 py-3 bg-[rgba(16,185,129,0.12)] text-[#065f46] rounded-lg font-semibold hover:bg-[rgba(16,185,129,0.2)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleVote("no")}
                        disabled={isExpired || market.status === "closed"}
                        className="flex-1 px-6 py-3 bg-[rgba(239,68,68,0.12)] text-[#ef4444] rounded-lg font-semibold hover:bg-[rgba(239,68,68,0.2)] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Market Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Market Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-[#64748b] mb-1">Start Date</p>
                            <p className="text-sm font-medium text-[#0f172a]">
                                {formatDate(market.startDate)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#64748b] mb-1">End Date</p>
                            <p className="text-sm font-medium text-[#0f172a]">
                                {formatDate(market.endDate)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#64748b] mb-1">Resolution Time</p>
                            <p className="text-sm font-medium text-[#0f172a]">
                                {formatDate(market.resolutionTime)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#64748b] mb-1">Total Trades</p>
                            <p className="text-sm font-medium text-[#0f172a]">
                                {market.trades.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Recent Trades</h2>
                    <div className="space-y-3">
                        {market.trades.slice(0, 5).map((trade, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm pb-3 border-b border-[rgba(15,23,42,0.08)] last:border-0 last:pb-0"
                            >
                                <span className="text-[#64748b]">
                                    {formatDate(trade.time)}
                                </span>
                                <span className="font-medium text-[#0f172a]">
                                    {trade.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={20} className="text-[#0f172a]" aria-hidden="true" />
                    <h2 className="text-lg font-semibold text-[#0f172a]">Comments</h2>
                    <span className="text-sm text-[#64748b]">({comments.length})</span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={
                                isConnected
                                    ? "Add a comment..."
                                    : "Connect wallet to comment"
                            }
                            disabled={!isConnected}
                            className="flex-1 px-4 py-2 border border-[rgba(15,23,42,0.08)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a] disabled:bg-[rgba(15,23,42,0.04)] disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={!isConnected || !newComment.trim()}
                            className="px-4 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#0b1324] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send comment"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-sm text-[#64748b] text-center py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="pb-4 border-b border-[rgba(15,23,42,0.08)] last:border-0 last:pb-0"
                            >
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[rgba(15,23,42,0.08)] flex items-center justify-center">
                                            <span className="text-xs font-semibold text-[#0f172a]">
                                                {comment.author[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#0f172a]">
                                                {comment.author}
                                            </p>
                                            <p className="text-xs text-[#64748b]">
                                                {comment.authorAddress}
                                            </p>
                                        </div>
                                    </div>
                                    {comment.vote && (
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                comment.vote === "yes"
                                                    ? "bg-[rgba(16,185,129,0.12)] text-[#065f46]"
                                                    : "bg-[rgba(239,68,68,0.12)] text-[#ef4444]"
                                            }`}
                                        >
                                            Voted {comment.vote}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[#0f172a] mb-2">{comment.content}</p>
                                <p className="text-xs text-[#64748b]">
                                    {formatCommentTime(comment.timestamp)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}

