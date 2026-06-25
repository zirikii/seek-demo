"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { AU_LOCATIONS } from "@/lib/constants/taxonomy";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  defaultKeywords?: string;
  defaultLocation?: string;
  /** "hero" = large landing variant; "compact" = inline results variant. */
  variant?: "hero" | "compact";
  className?: string;
}

export function SearchBar({
  defaultKeywords = "",
  defaultLocation = "",
  variant = "hero",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [keywords, setKeywords] = React.useState(defaultKeywords);
  const [location, setLocation] = React.useState(defaultLocation);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keywords.trim()) params.set("keywords", keywords.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const big = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl bg-white p-2 shadow-panel sm:flex-row sm:items-center",
        big ? "sm:rounded-full" : "rounded-lg",
        className,
      )}
      role="search"
      aria-label="Search jobs"
    >
      <div className="flex flex-1 items-center gap-2 border-line px-3 sm:border-r">
        <Search className="h-5 w-5 shrink-0 text-ink-muted" />
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords"
          aria-label="Enter keywords"
          className={cn(
            "w-full bg-transparent text-ink placeholder:text-ink-muted focus:outline-none",
            big ? "h-12 text-base" : "h-10 text-sm",
          )}
        />
      </div>

      <div className="flex flex-1 items-center gap-2 px-3">
        <MapPin className="h-5 w-5 shrink-0 text-ink-muted" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter suburb, city, or region"
          aria-label="Enter suburb, city, or region"
          list="seek-locations"
          className={cn(
            "w-full bg-transparent text-ink placeholder:text-ink-muted focus:outline-none",
            big ? "h-12 text-base" : "h-10 text-sm",
          )}
        />
        <datalist id="seek-locations">
          {AU_LOCATIONS.map((loc) => (
            <option key={loc} value={loc} />
          ))}
        </datalist>
      </div>

      <button
        type="submit"
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-seek-pink font-semibold text-white transition-colors hover:bg-seek-pink-dark",
          big ? "h-12 px-8 text-base" : "h-10 px-6 text-sm",
        )}
      >
        <Search className="h-5 w-5" />
        SEEK
      </button>
    </form>
  );
}
