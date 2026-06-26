"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, ChevronRight, Clock, MapPin, Sparkles, Wallet } from "lucide-react";
import type { JobWithEmployer } from "@/lib/types";
import { formatLocation, formatPostedAt, formatSalary } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmployerLogo } from "@/components/common/EmployerLogo";
import { Markdown } from "@/components/common/Markdown";
import { SaveFlag } from "./SaveFlag";
import { QuickApplyDrawer } from "./QuickApplyDrawer";
import { useAppData } from "@/components/providers/AppDataProvider";

interface JobDetailPanelProps {
  job: JobWithEmployer;
  similar?: JobWithEmployer[];
  variant?: "panel" | "page";
}

export function JobDetailPanel({ job, similar = [], variant = "panel" }: JobDetailPanelProps) {
  const { isApplied } = useAppData();
  const [applyOpen, setApplyOpen] = React.useState(false);
  const applied = isApplied(job.id);

  return (
    <article className="text-ink">
      {/* Classification breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-xs text-ink-muted" aria-label="Breadcrumb">
        <Link href="/jobs" className="hover:text-seek-pink">
          Jobs
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/jobs?classification=${encodeURIComponent(job.classification)}`}
          className="hover:text-seek-pink"
        >
          {job.classification}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary">{job.subClassification}</span>
      </nav>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <EmployerLogo src={job.employer.logo} name={job.employer.name} size={64} />
          <div>
            <h1 className="text-xl font-bold text-seek-navy sm:text-2xl">{job.title}</h1>
            <Link
              href={`/companies/${job.employer.slug}`}
              className="text-sm font-medium text-seek-pink hover:underline"
            >
              {job.employer.name}
            </Link>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-ink-muted" />
          <span>{formatLocation(job.location)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="h-4 w-4 text-ink-muted" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-ink-muted" />
          <span>{job.workType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-ink-muted" />
          <span>{formatPostedAt(job.postedAt)}</span>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => setApplyOpen(true)} disabled={applied} size="lg">
          {applied ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Applied
            </>
          ) : (
            "Quick apply"
          )}
        </Button>
        <SaveFlag jobId={job.id} jobTitle={job.title} variant="button" />
      </div>

      {job.aiInsight ? (
        <div className="mt-5 rounded-lg border border-seek-pink/20 bg-seek-pink-light/50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-seek-pink-dark">
            <Sparkles className="h-4 w-4" /> AI insight
          </p>
          <p className="mt-1 text-sm text-ink-secondary">{job.aiInsight}</p>
        </div>
      ) : null}

      <Separator className="my-6" />

      <Markdown>{job.description}</Markdown>

      {similar.length > 0 ? (
        <>
          <Separator className="my-6" />
          <section>
            <h2 className="text-lg font-bold text-seek-navy">Similar jobs</h2>
            <div className="mt-3 space-y-3">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={`/jobs/${s.id}`}
                  className="flex items-center gap-3 rounded-lg border border-line bg-white p-3 transition-colors hover:border-seek-pink"
                >
                  <EmployerLogo src={s.employer.logo} name={s.employer.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-seek-navy">{s.title}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {s.employer.name} &middot; {formatLocation(s.location)}
                    </p>
                  </div>
                  <Badge tone="neutral" className="hidden shrink-0 sm:inline-flex">
                    {formatSalary(s.salary)}
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {variant === "page" ? (
        <p className="mt-8 text-xs text-ink-muted">
          Report this job ad &middot; This is a fictional listing for demonstration purposes.
        </p>
      ) : null}

      <QuickApplyDrawer job={job} open={applyOpen} onOpenChange={setApplyOpen} />
    </article>
  );
}
