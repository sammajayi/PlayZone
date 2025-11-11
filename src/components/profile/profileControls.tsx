import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { ProfileIcon } from "./profileIcon";

type ProfileControlsProps = {
    variant: "desktop" | "mobile";
};

export function ProfileControls({ variant }: ProfileControlsProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (variant !== "desktop") {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [variant]);

    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain && !chain.unsupported;

                if (!connected) {
                    return (
                        <button
                            type="button"
                            onClick={openConnectModal}
                            className={`inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#0f172a] text-white text-sm font-semibold transition-colors hover:bg-[#0b1324] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] ${variant === "mobile" ? "w-full" : ""}`}
                        >
                            Sign in
                        </button>
                    );
                }

                if (variant === "mobile") {
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.04)] text-[#0f172a]">
                                <ProfileIcon />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-semibold leading-tight">{account?.displayName}</span>
                                    {chain?.name && <span className="text-xs text-[#64748b]">{chain.name}</span>}
                                </div>
                            </div>
                            <Link
                                href="/transaction"
                                onClick={() => setMenuOpen(false)}
                                className="w-full inline-flex justify-between items-center px-4 py-2 rounded-lg border border-[rgba(15,23,42,0.08)] text-sm font-medium text-[#0f172a] no-underline hover:bg-[rgba(15,23,42,0.04)] transition-colors"
                            >
                               Transaction History
                                <span aria-hidden="true">→</span>
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setMenuOpen(false)}
                                className="w-full inline-flex justify-between items-center px-4 py-2 rounded-lg border border-[rgba(15,23,42,0.08)] text-sm font-medium text-[#0f172a] no-underline hover:bg-[rgba(15,23,42,0.04)] transition-colors"
                            >
                                Settings
                                <span aria-hidden="true">→</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    disconnect();
                                }}
                                className="w-full inline-flex justify-between items-center px-4 py-2 rounded-lg border border-[rgba(239,68,68,0.35)] text-sm font-medium text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                            >
                                Log out
                                <span aria-hidden="true">⎋</span>
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(15,23,42,0.08)] text-sm font-semibold text-[#0f172a] hover:bg-[rgba(15,23,42,0.04)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a]"
                            aria-haspopup="menu"
                        >
                            <ProfileIcon />
                            <span>{account?.displayName}</span>
                        </button>
                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-48 rounded-xl border border-[rgba(15,23,42,0.08)] bg-white shadow-lg py-2 z-50"
                            >
                                <Link
                                    href="/transaction"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-[#0f172a] no-underline hover:bg-[rgba(15,23,42,0.04)]"
                                    role="menuitem"
                                >
                                   Transaction History
                                </Link>
                                <Link
                                    href="/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-[#0f172a] no-underline hover:bg-[rgba(15,23,42,0.04)]"
                                    role="menuitem"
                                >
                                    Settings
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        disconnect();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)]"
                                    role="menuitem"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}


