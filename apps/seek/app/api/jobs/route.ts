import { NextResponse } from "next/server";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { filterJobs, type JobQuery } from "@/lib/utils/filters";
import type { WorkType } from "@/lib/types";

/** GET /api/jobs — list jobs, optionally filtered via query params. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query: JobQuery = {
    keywords: searchParams.get("keywords") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    classification: searchParams.get("classification") ?? undefined,
    workType: (searchParams.get("workType") as WorkType | null) ?? undefined,
    salaryMin: searchParams.get("salaryMin")
      ? Number(searchParams.get("salaryMin"))
      : undefined,
    dateListed: searchParams.get("dateListed") ?? undefined,
    sort: (searchParams.get("sort") as JobQuery["sort"]) ?? "relevance",
  };

  const jobs = await getJobsWithEmployers();
  const results = filterJobs(jobs, query);
  return NextResponse.json({ count: results.length, jobs: results });
}
