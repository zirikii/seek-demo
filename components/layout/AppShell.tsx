import type { SessionUser } from "@/lib/types";
import { AppDataProvider } from "@/components/providers/AppDataProvider";
import { AppTopNav } from "./AppTopNav";
import { Footer } from "./Footer";

/**
 * Authenticated candidate shell: sticky top nav + main content + footer.
 * Seeds the client-side AppDataProvider with initial saved/applied ids so
 * save flags and nav badges are correct on first paint.
 */
export function AppShell({
  user,
  initialSavedIds,
  initialAppliedIds,
  children,
}: {
  user: SessionUser;
  initialSavedIds: string[];
  initialAppliedIds: string[];
  children: React.ReactNode;
}) {
  return (
    <AppDataProvider initialSavedIds={initialSavedIds} initialAppliedIds={initialAppliedIds}>
      <div className="flex min-h-screen flex-col bg-surface-subtle">
        <AppTopNav user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AppDataProvider>
  );
}
