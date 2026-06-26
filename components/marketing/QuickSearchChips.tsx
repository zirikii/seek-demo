"use client";

import Link from "next/link";

export function QuickSearchChips({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-white/80">Popular searches:</span>
      {chips.map((chip) => (
        <Link
          key={chip}
          href={`/jobs?keywords=${encodeURIComponent(chip)}`}
          className="focus-ring rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          {chip}
        </Link>
      ))}
    </div>
  );
}
