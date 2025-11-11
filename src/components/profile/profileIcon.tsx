import { CircleUserRound } from 'lucide-react';

export function ProfileIcon() {
    return (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0f172a] text-white text-xs font-semibold">
            <CircleUserRound size={16} aria-hidden="true" />
        </span>
    );
}

