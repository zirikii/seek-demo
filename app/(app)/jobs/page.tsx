import type { Metadata } from "next";
import { Suspense } from "react";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { filterJobs, type JobQuery } from "@/lib/utils/filters";
import type { WorkType } from "@/lib/types";
import { SearchBar } from "@/components/search/SearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobSearchBrowser, ResultCount } from "@/components/jobs/JobSearchBrowser";

export const metadata: Metadata = { title: "Job search" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query: JobQuery = {
    keywords: str(sp.keywords),
    location: str(sp.location),
    classification: str(sp.classification),
    workType: str(sp.workType) as WorkType | undefined,
    salaryMin: str(sp.salaryMin) ? Number(str(sp.salaryMin)) : undefined,
    dateListed: str(sp.dateListed),
    sort: (str(sp.sort) as JobQuery["sort"]) ?? "relevance",
  };

  const allJobs = await getJobsWithEmployers();
  const results = filterJobs(allJobs, query);

  return (
    <div className="container-page py-6">
      <SearchBar
        variant="compact"
        defaultKeywords={query.keywords}
        defaultLocation={query.location}
        className="mb-4"
      />

      <Suspense fallback={<div className="h-10" />}>
        <div className="mb-4 flex flex-col gap-3">
          <JobFilters />
        </div>
      </Suspense>

      <div className="mb-4 flex items-center justify-between">
        <ResultCount count={results.length} />
        {query.keywords ? (
          <p className="text-sm text-ink-muted">
            Results for <span className="font-medium text-seek-navy">{query.keywords}</span>
          </p>
        ) : null}
      </div>

      <JobSearchBrowser jobs={results} keywords={query.keywords} />
    </div>
  );
}
