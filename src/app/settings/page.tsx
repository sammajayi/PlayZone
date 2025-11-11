"use client";

import { useAccount, useDisconnect } from "wagmi";
import Link from "next/link";
import { ProfileIcon } from "../../components/profile/profileIcon";

export default function SettingsPage() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    if (!isConnected) {
        return (
            <main className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-semibold mb-2">Settings</h1>
                    <p className="text-[#64748b] mb-6">Please connect your wallet to access settings.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold mb-2">Settings</h1>
                    <p className="text-[#64748b]">Manage your account and preferences</p>
                </header>

                {/* Account Section */}
                <section className="mb-8">
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <ProfileIcon />
                            <div>
                                <h2 className="text-lg font-semibold text-[#0f172a]">Account</h2>
                                <p className="text-sm text-[#64748b]">Your account information</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                    Wallet Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <code className="text-sm bg-[rgba(15,23,42,0.04)] px-3 py-2 rounded-md font-mono text-[#0f172a]">
                                        {address}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(address || "")}
                                        className="text-[#64748b] hover:text-[#0f172a] p-1"
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

                            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)]">
                                <Link
                                    href="/transaction"
                                    className="inline-flex items-center gap-2 text-[#2563eb] hover:text-[#1d4ed8] text-sm font-medium no-underline"
                                >
                                    View Transaction History
                                    <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="mb-8">
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-[#0f172a] mb-2">Preferences</h2>
                        <p className="text-sm text-[#64748b] mb-6">Customize your experience</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                        Email Notifications
                                    </label>
                                    <p className="text-xs text-[#64748b]">Receive email updates about your activities</p>
                                </div>
                                <button
                                    type="button"
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[rgba(15,23,42,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2"
                                    aria-label="Toggle email notifications"
                                >
                                    <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                        Push Notifications
                                    </label>
                                    <p className="text-xs text-[#64748b]">Get notified about important updates</p>
                                </div>
                                <button
                                    type="button"
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[rgba(15,23,42,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2"
                                    aria-label="Toggle push notifications"
                                >
                                    <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                        Dark Mode
                                    </label>
                                    <p className="text-xs text-[#64748b]">Switch to dark theme</p>
                                </div>
                                <button
                                    type="button"
                                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[rgba(15,23,42,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f172a] focus:ring-offset-2"
                                    aria-label="Toggle dark mode"
                                >
                                    <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section>
                    <div className="border border-[rgba(15,23,42,0.08)] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-[#0f172a] mb-2">Security</h2>
                        <p className="text-sm text-[#64748b] mb-6">Manage your account security</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <label className="block text-sm font-medium text-[#0f172a] mb-1">
                                        Two-Factor Authentication
                                    </label>
                                    <p className="text-xs text-[#64748b]">Add an extra layer of security</p>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-medium"
                                >
                                    Enable
                                </button>
                            </div>

                            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)]">
                                <button
                                    type="button"
                                    onClick={() => disconnect()}
                                    className="text-sm text-[#ef4444] hover:text-[#dc2626] font-medium"
                                >
                                    Disconnect Wallet
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

