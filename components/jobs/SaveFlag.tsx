"use client";

import { Bookmark } from "lucide-react";
import { useAppData } from "@/components/providers/AppDataProvider";
import { cn } from "@/lib/utils/cn";

interface SaveFlagProps {
  jobId: string;
  jobTitle?: string;
  /** "icon" = compact icon button; "button" = labelled button. */
  variant?: "icon" | "button";
  className?: string;
}

export function SaveFlag({ jobId, jobTitle, variant = "icon", className }: SaveFlagProps) {
  const { isSaved, toggleSave, isApplied } = useAppData();
  const saved = isSaved(jobId);
  const applied = isApplied(jobId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void toggleSave(jobId, jobTitle);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition-colors",
          saved
            ? "border-seek-pink bg-seek-pink-light text-seek-pink-dark"
            : "border-line-strong bg-white text-seek-navy hover:bg-surface-muted",
          className,
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-seek-pink text-seek-pink")} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${jobTitle ?? "job"} from saved` : `Save ${jobTitle ?? "job"}`}
      title={applied ? "You've applied to this job" : saved ? "Saved" : "Save job"}
      className={cn(
        "focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-surface-muted",
        className,
      )}
    >
      <Bookmark
        className={cn(
          "h-5 w-5",
          saved ? "fill-seek-pink text-seek-pink" : "text-ink-secondary",
        )}
      />
    </button>
  );
}
