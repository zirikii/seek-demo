import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { getApplications } from "@/lib/data/applications";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ApplicationsTable, type ApplicationRow } from "@/components/applied/ApplicationsTable";

export const metadata: Metadata = { title: "Applied jobs" };

export default async function AppliedPage() {
  const [applications, jobs] = await Promise.all([getApplications(), getJobsWithEmployers()]);
  const byId = new Map(jobs.map((j) => [j.id, j]));

  const rows: ApplicationRow[] = applications
    .map((a) => {
      const job = byId.get(a.jobId);
      return job ? { id: a.id, job, appliedAt: a.appliedAt, status: a.status } : null;
    })
    .filter((r): r is ApplicationRow => r !== null);

  return (
    <div className="container-page py-8">
      <PageHeader
        title="Applied jobs"
        description="Track the status of every role you've applied for."
      />

      <p className="mt-2 text-sm text-ink-muted">
        Applications are kept for 90 days. Statuses update as hirers review your application.
      </p>

      <div className="mt-6">
        {rows.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            description="When you apply for a job, it'll appear here so you can track its progress."
          >
            <Button asChild>
              <Link href="/jobs">Find jobs to apply for</Link>
            </Button>
          </EmptyState>
        ) : (
          <ApplicationsTable rows={rows} />
        )}
      </div>
    </div>
  );
}
