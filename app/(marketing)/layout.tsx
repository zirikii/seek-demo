import { getSession } from "@/lib/auth/server";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
