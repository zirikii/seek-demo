import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Bookmark, Briefcase, Search } from "lucide-react";
import { requireSession } from "@/lib/auth/server";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { getSavedJobs } from "@/lib/data/saved";
import { getApplications } from "@/lib/data/applications";
import { getSavedSearches } from "@/lib/data/searches";
import { getProfile } from "@/lib/data/profile";
import { filterJobs } from "@/lib/utils/filters";
import { computeProfileStrength } from "@/lib/utils/profile";
import { JobCard } from "@/components/jobs/JobCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProfileStrengthCard } from "@/components/dashboard/ProfileStrengthCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [user, jobs, saved, applications, searches, profile] = await Promise.all([
    requireSession(),
    getJobsWithEmployers(),
    getSavedJobs(),
    getApplications(),
    getSavedSearches(),
    getProfile(),
  ]);

  const strength = computeProfileStrength(profile);
  const appliedIds = new Set(applications.map((a) => a.jobId));

  // Recommended: roles in the candidate's preferred classification, not yet applied.
  const recommended = filterJobs(jobs, {
    classification: profile.preferences.classification,
    sort: "date",
  })
    .filter((j) => !appliedIds.has(j.id))
    .slice(0, 6);

  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-seek-navy sm:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-ink-secondary">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Bookmark} label="Saved jobs" value={saved.length} href="/saved-jobs" />
        <StatCard icon={Briefcase} label="Applications" value={applications.length} href="/applied" />
        <StatCard icon={Bell} label="Saved searches" value={searches.length} href="/saved-searches" />
        <StatCard icon={Search} label="Browse jobs" value="34+" href="/jobs" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Recommended jobs */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-seek-navy">Recommended for you</h2>
              <p className="text-sm text-ink-secondary">
                Based on your preference for {profile.preferences.classification}.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-seek-pink hover:underline"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recommended.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ProfileStrengthCard strength={strength} />

          <Card>
            <CardHeader>
              <CardTitle>Your saved searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {searches.length === 0 ? (
                <p className="text-sm text-ink-secondary">
                  You haven&apos;t saved any searches yet.
                </p>
              ) : (
                searches.map((s) => (
                  <Link
                    key={s.id}
                    href={`/jobs?keywords=${encodeURIComponent(s.keywords)}&location=${encodeURIComponent(s.location)}`}
                    className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm transition-colors hover:border-seek-pink"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-seek-navy">
                        {s.keywords || "All jobs"}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">{s.location}</span>
                    </span>
                    {s.newResults > 0 ? (
                      <span className="ml-2 shrink-0 rounded-full bg-seek-pink-light px-2 py-0.5 text-xs font-semibold text-seek-pink-dark">
                        {s.newResults} new
                      </span>
                    ) : null}
                  </Link>
                ))
              )}
              <Link
                href="/saved-searches"
                className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-seek-pink hover:underline"
              >
                Manage searches <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
