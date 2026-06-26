import type { Metadata } from "next";
import { CheckCircle2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const reasons = [
  "Save jobs and pick up where you left off",
  "Set up job alerts for new roles",
  "Apply faster with your saved profile",
  "Track every application in one place",
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  return (
    <Card className="shadow-panel">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign in to SEEK</CardTitle>
        <p className="text-sm text-ink-secondary">Welcome back — let&apos;s find your next role.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-2 rounded-md bg-tone-info-bg px-3 py-2 text-sm text-tone-info">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Demo mode:</strong> any email and password will work. We&apos;ve pre-filled the
            demo credentials for you.
          </span>
        </div>

        <LoginForm redirectTo={redirectTo} />

        <div className="rounded-lg bg-surface-muted p-4">
          <p className="text-sm font-semibold text-seek-navy">Why sign in?</p>
          <ul className="mt-2 space-y-1.5">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-ink-secondary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tone-positive" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
