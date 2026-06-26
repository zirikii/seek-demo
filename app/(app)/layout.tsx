import { requireSession } from "@/lib/auth/server";
import { getSavedJobs } from "@/lib/data/saved";
import { getApplications } from "@/lib/data/applications";
import { AppShell } from "@/components/layout/AppShell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, saved, applications] = await Promise.all([
    requireSession(),
    getSavedJobs(),
    getApplications(),
  ]);

  return (
    <AppShell
      user={user}
      initialSavedIds={saved.map((s) => s.jobId)}
      initialAppliedIds={applications.map((a) => a.jobId)}
    >
      {children}
    </AppShell>
  );
}
