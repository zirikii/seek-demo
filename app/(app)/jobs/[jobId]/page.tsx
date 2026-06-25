import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJobsWithEmployers, getJobWithEmployer } from "@/lib/data/jobs";
import { similarJobs } from "@/lib/utils/filters";
import { JobDetailPanel } from "@/components/jobs/JobDetailPanel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getJobWithEmployer(jobId);
  if (!job) return { title: "Job not found" };
  return { title: `${job.title} at ${job.employer.name}` };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const [job, allJobs] = await Promise.all([getJobWithEmployer(jobId), getJobsWithEmployers()]);
  if (!job) notFound();

  return (
    <div className="container-page py-6">
      <Link
        href="/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-seek-pink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to search results
      </Link>

      <div className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
        <JobDetailPanel job={job} similar={similarJobs(allJobs, job)} variant="page" />
      </div>
    </div>
  );
}
