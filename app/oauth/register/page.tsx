import type { Metadata } from "next";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  return (
    <Card className="shadow-panel">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your free profile</CardTitle>
        <p className="text-sm text-ink-secondary">
          Join SEEK and take the next step in your career.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-2 rounded-md bg-tone-info-bg px-3 py-2 text-sm text-tone-info">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Demo mode:</strong> your details are stored locally only. Don&apos;t use a real
            password.
          </span>
        </div>

        <RegisterForm redirectTo={redirectTo} />
      </CardContent>
    </Card>
  );
}
