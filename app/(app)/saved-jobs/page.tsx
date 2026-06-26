import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { getSavedJobs } from "@/lib/data/saved";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { SavedJobsList, type SavedJobView } from "@/components/saved/SavedJobsList";

export const metadata: Metadata = { title: "Saved jobs" };

export default async function SavedJobsPage() {
  const [saved, jobs] = await Promise.all([getSavedJobs(), getJobsWithEmployers()]);
  const byId = new Map(jobs.map((j) => [j.id, j]));

  const items: SavedJobView[] = saved
    .map((s) => {
      const job = byId.get(s.jobId);
      return job ? { job, savedAt: s.savedAt, note: s.note } : null;
    })
    .filter((i): i is SavedJobView => i !== null);

  return (
    <div className="container-page py-8">
      <PageHeader
        title="Saved jobs"
        description="Keep track of roles you're interested in and add private notes."
      />

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved jobs yet"
            description="Tap the save flag on any job to keep it here for later."
          >
            <Button asChild>
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </EmptyState>
        ) : (
          <SavedJobsList initial={items} />
        )}
      </div>
    </div>
  );
}
