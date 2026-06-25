import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/server";
import { getSettings } from "@/lib/data/settings";
import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [user, settings] = await Promise.all([requireSession("/settings"), getSettings()]);

  return (
    <div className="container-page max-w-3xl py-8">
      <PageHeader title="Settings" description="Manage your account, notifications and privacy." />
      <div className="mt-6">
        <SettingsPanel initial={settings} user={user} />
      </div>
    </div>
  );
}
