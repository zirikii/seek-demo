"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import type { JobWithEmployer } from "@/lib/types";
import { similarJobs } from "@/lib/utils/filters";
import { pluralise } from "@/lib/utils/format";
import { useIsDesktop } from "@/hooks/use-media-query";
import { JobCard } from "./JobCard";
import { JobDetailPanel } from "./JobDetailPanel";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

interface JobSearchBrowserProps {
  jobs: JobWithEmployer[];
  /** The keywords the search was run with (for the empty-state copy). */
  keywords?: string;
}

const PAGE_SIZE = 12;

export function JobSearchBrowser({ jobs, keywords }: JobSearchBrowserProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [selectedId, setSelectedId] = React.useState<string | null>(jobs[0]?.id ?? null);
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  // Keep a valid selection whenever the result set changes (e.g. new filter).
  React.useEffect(() => {
    setVisible(PAGE_SIZE);
    setSelectedId((current) => {
      if (current && jobs.some((j) => j.id === current)) return current;
      return jobs[0]?.id ?? null;
    });
  }, [jobs]);

  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0] ?? null;

  function onSelect(id: string) {
    if (isDesktop) {
      setSelectedId(id);
      // Keep the detail panel scrolled to top on selection.
      document.getElementById("jdv-scroll")?.scrollTo({ top: 0 });
    } else {
      router.push(`/jobs/${id}`);
    }
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No jobs found"
        description={
          keywords
            ? `We couldn't find any jobs matching "${keywords}". Try broadening your search or removing some filters.`
            : "Try adjusting your filters to see more results."
        }
      >
        <Button onClick={() => router.push("/jobs")}>Clear search</Button>
      </EmptyState>
    );
  }

  const shown = jobs.slice(0, visible);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(360px,420px)_1fr]">
      {/* Results list */}
      <div className="space-y-3">
        {shown.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSelect={onSelect}
            selected={isDesktop && selected?.id === job.id}
            showBullets={false}
          />
        ))}

        {visible < jobs.length ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Show more jobs ({jobs.length - visible} remaining)
          </Button>
        ) : null}
      </div>

      {/* Sticky Job Details View (desktop only) */}
      {selected ? (
        <div className="hidden lg:block">
          <div
            id="jdv-scroll"
            className="scrollbar-thin sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-line bg-white p-6 shadow-card"
          >
            <JobDetailPanel
              key={selected.id}
              job={selected}
              similar={similarJobs(jobs, selected)}
              variant="panel"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ResultCount({ count }: { count: number }) {
  return (
    <p className="text-sm text-ink-secondary">
      <span className="font-semibold text-seek-navy">{pluralise(count, "job")}</span> found
    </p>
  );
}
