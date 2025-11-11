"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ProfileIcon } from "../../components/profile/profileIcon";
import { formatEther } from "viem";

export default function WalletPage() {
    const { address, isConnected, chain } = useAccount();
    const chainId = useChainId();
    const { data: balance, isLoading: balanceLoading } = useBalance({
        address,
    });

    if (!isConnected) {
        return (
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-2xl font-semibold mb-2">Wallet</h1>
                        <p className="text-[#64748b]">Connect your wallet to view your account details</p>
                    </header>
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-8 flex flex-col items-center justify-center">
                        <div className="mb-4">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-[#64748b]"
                                aria-hidden="true"
                            >
                                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 8L16 12L8 16V8Z" fill="currentColor" />
                            </svg>
                        </div>
                        <p className="text-[#64748b] mb-4 text-center">Please connect your wallet to continue</p>
                        <ConnectButton />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#0f172a] mb-4 no-underline"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Settings
                    </Link>
                    <h1 className="text-2xl font-semibold mb-2">Transaction History</h1>
                    <p className="text-[#64748b]">View your wallet details and transaction history</p>
                </header>

                {/* Account Overview */}
                <section className="mb-8">
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <ProfileIcon />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-[#0f172a]">Account Overview</h2>
                                <p className="text-sm text-[#64748b]">Your wallet information</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                    Wallet Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm bg-[rgba(15,23,42,0.04)] px-3 py-2 rounded-md font-mono text-[#0f172a] break-all">
                                        {address }
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => address && navigator.clipboard.writeText(address)}
                                        className="text-[#64748b] hover:text-[#0f172a] p-1 shrink-0"
                                        aria-label="Copy address"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path
                                                d="M8 5.00005C7.01165 5.00005 6.49359 5.00005 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.49359 5 7.01165 5 8.00005V16C5 16.9884 5 17.5065 5.21799 17.908C5.40973 18.2843 5.71569 18.5903 6.09202 18.782C6.49359 19 7.01165 19 8 19H16C16.9884 19 17.5065 19 17.908 18.782C18.2843 18.5903 18.5903 18.2843 18.782 17.908C19 17.5065 19 16.9884 19 16V8.00005C19 7.01165 19 6.49359 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5065 5.00005 16.9884 5.00005 16 5.00005H8Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M8 5.00005C8 4.05723 8 3.58582 8.29289 3.29292C8.58579 3.00003 9.05723 3.00003 10 3.00003H14C14.9428 3.00003 15.4142 3.00003 15.7071 3.29292C16 3.58582 16 4.05723 16 5.00005"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Balance Section */}
                <section className="mb-8">
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-[#0f172a] mb-2">Balance</h2>
                        <p className="text-sm text-[#64748b] mb-6">Your current wallet balance</p>

                        <div className="space-y-4">
                            <div className="bg-[rgba(15,23,42,0.04)] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#64748b] mb-1">Native Balance</p>
                                        {balanceLoading ? (
                                            <p className="text-2xl font-semibold text-[#0f172a]">Loading...</p>
                                        ) : (
                                            <p className="text-2xl font-semibold text-[#0f172a]">
                                                {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0.0000"}{" "}
                                                {balance?.symbol || "ETH"}
                                            </p>
                                        )}
                                    </div>
                                    {/* <div className="text-3xl" aria-hidden="true">
                                        💰
                                    </div> */}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-2 bg-[#0f172a] text-white rounded-lg font-medium hover:bg-[#0b1324] transition-colors"
                                >
                                    Send
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-2 border border-[rgba(15,23,42,0.08)] text-[#0f172a] rounded-lg font-medium hover:bg-[rgba(15,23,42,0.04)] transition-colors"
                                >
                                    Receive
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transaction History Section */}
                <section>
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-[#0f172a] mb-2">Transaction History</h2>
                        <p className="text-sm text-[#64748b] mb-6">View your recent transactions</p>

                        <div className="text-center py-8">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mx-auto text-[#64748b] mb-3"
                                aria-hidden="true"
                            >
                                <path
                                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-sm text-[#64748b]">No transactions yet</p>
                            <p className="text-xs text-[#64748b] mt-1">
                                Your transaction history will appear here once you start using the app
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

