import type { JobWithEmployer, WorkType } from "@/lib/types";
import { annualisedMin } from "./format";

export interface JobQuery {
  keywords?: string;
  location?: string;
  classification?: string;
  workType?: WorkType;
  salaryMin?: number;
  /** "any" | "today" | "3" | "7" | "14" | "30" */
  dateListed?: string;
  sort?: "relevance" | "date";
}

function matchesKeywords(job: JobWithEmployer, keywords?: string): boolean {
  if (!keywords) return true;
  const q = keywords.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    job.title,
    job.employer.name,
    job.classification,
    job.subClassification,
    job.teaser,
  ]
    .join(" ")
    .toLowerCase();
  // All whitespace-separated terms must appear somewhere.
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

function matchesLocation(job: JobWithEmployer, location?: string): boolean {
  if (!location) return true;
  const loc = location.trim().toLowerCase();
  if (!loc || loc === "all australia") return true;
  const haystack = `${job.location.area ?? ""} ${job.location.city} ${job.location.state}`.toLowerCase();
  // Match on city or state token so "Sydney" or "NSW" both work.
  return loc
    .split(/[\s,]+/)
    .filter(Boolean)
    .some((term) => haystack.includes(term));
}

function matchesDateListed(job: JobWithEmployer, dateListed?: string, nowMs = Date.now()): boolean {
  if (!dateListed || dateListed === "any") return true;
  const posted = new Date(job.postedAt).getTime();
  const days = (nowMs - posted) / (24 * 60 * 60 * 1000);
  if (dateListed === "today") return days < 1;
  const limit = Number(dateListed);
  if (Number.isNaN(limit)) return true;
  return days <= limit;
}

/** Apply the full query (filter + sort) to a list of jobs. */
export function filterJobs(
  jobs: JobWithEmployer[],
  query: JobQuery,
  nowMs: number = Date.now(),
): JobWithEmployer[] {
  const filtered = jobs.filter(
    (job) =>
      matchesKeywords(job, query.keywords) &&
      matchesLocation(job, query.location) &&
      (!query.classification || job.classification === query.classification) &&
      (!query.workType || job.workType === query.workType) &&
      (!query.salaryMin || annualisedMin(job.salary) >= query.salaryMin) &&
      matchesDateListed(job, query.dateListed, nowMs),
  );

  const sorted = [...filtered];
  if (query.sort === "date") {
    sorted.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  } else {
    // "relevance": featured first, then most recent.
    sorted.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }
  return sorted;
}

/** Count active (non-default) filters for UI badges. */
export function countActiveFilters(query: JobQuery): number {
  let n = 0;
  if (query.classification) n++;
  if (query.workType) n++;
  if (query.salaryMin && query.salaryMin > 0) n++;
  if (query.dateListed && query.dateListed !== "any") n++;
  return n;
}

/** Simple "similar jobs": same classification, excluding the current job. */
export function similarJobs(
  jobs: JobWithEmployer[],
  job: JobWithEmployer,
  limit = 4,
): JobWithEmployer[] {
  return jobs
    .filter((j) => j.id !== job.id && j.classification === job.classification)
    .slice(0, limit);
}
