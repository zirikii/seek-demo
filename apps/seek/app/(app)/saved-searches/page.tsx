import type { Metadata } from "next";
import { getSavedSearches } from "@/lib/data/searches";
import { PageHeader } from "@/components/layout/PageHeader";
import { SavedSearchesManager } from "@/components/searches/SavedSearchesManager";

export const metadata: Metadata = { title: "Saved searches" };

export default async function SavedSearchesPage() {
  const searches = await getSavedSearches();

  return (
    <div className="container-page py-8">
      <PageHeader
        title="Saved searches & alerts"
        description="Manage your job alerts and get notified when new roles match your criteria."
      />
      <div className="mt-6">
        <SavedSearchesManager initial={searches} />
      </div>
    </div>
  );
}
