"use client";

import Link from "next/link";
import { CheckCircle2, MapPin, Sparkles, Wallet } from "lucide-react";
import type { JobWithEmployer } from "@/lib/types";
import { formatLocation, formatPostedAt, formatSalary } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { EmployerLogo } from "@/components/common/EmployerLogo";
import { SaveFlag } from "./SaveFlag";
import { useAppData } from "@/components/providers/AppDataProvider";

interface JobCardProps {
  job: JobWithEmployer;
  /** When provided, the card acts as a selectable item (split-view results). */
  onSelect?: (jobId: string) => void;
  selected?: boolean;
  /** Show the short bullet list (used on result cards, hidden in compact lists). */
  showBullets?: boolean;
}

export function JobCard({ job, onSelect, selected, showBullets = true }: JobCardProps) {
  const { isApplied } = useAppData();
  const applied = isApplied(job.id);
  const posted = formatPostedAt(job.postedAt);
  const isNew = posted === "Posted today" || posted === "Posted 1d ago";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <EmployerLogo src={job.employer.logo} name={job.employer.name} size={48} />
          <div className="min-w-0">
            <h3
              className={cn(
                "truncate text-base font-semibold sm:text-lg",
                selected ? "text-seek-pink-dark" : "text-seek-navy",
              )}
            >
              {job.title}
            </h3>
            <p className="truncate text-sm text-ink-secondary">{job.employer.name}</p>
          </div>
        </div>
        <SaveFlag jobId={job.id} jobTitle={job.title} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-ink-muted" />
          {formatLocation(job.location)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="h-4 w-4 text-ink-muted" />
          {formatSalary(job.salary)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{job.workType}</Badge>
        <Badge tone="neutral">{job.classification}</Badge>
        {job.featured ? <Badge tone="brand">Featured</Badge> : null}
        {isNew ? <Badge tone="positive">New</Badge> : null}
        {applied ? (
          <Badge tone="info" className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Applied
          </Badge>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-secondary">{job.teaser}</p>

      {showBullets && job.bullets.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {job.bullets.slice(0, 3).map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm text-ink-secondary">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tone-positive" />
              <span className="line-clamp-1">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {job.aiInsight ? (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-seek-pink-light/60 px-2 py-1 text-xs text-seek-pink-dark">
          <Sparkles className="h-3.5 w-3.5" />
          AI insight available
        </p>
      ) : null}

      <p className="mt-3 text-xs text-ink-muted">{posted}</p>
    </>
  );

  const baseClass = cn(
    "block w-full rounded-lg border bg-white p-4 text-left shadow-card transition-all focus-ring sm:p-5",
    selected
      ? "border-seek-pink ring-1 ring-seek-pink"
      : "border-line hover:border-line-strong hover:shadow-card-hover",
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(job.id)}
        aria-pressed={selected}
        className={baseClass}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/jobs/${job.id}`} className={baseClass}>
      {inner}
    </Link>
  );
}
