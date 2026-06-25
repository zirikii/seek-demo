import type { Metadata } from "next";
import { getProfile } from "@/lib/data/profile";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileBuilder } from "@/components/profile/ProfileBuilder";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="container-page py-8">
      <PageHeader
        title="My profile"
        description="Build your SEEK profile so hirers can find you and you can apply faster."
      />
      <div className="mt-6">
        <ProfileBuilder initial={profile} />
      </div>
    </div>
  );
}
