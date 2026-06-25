import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { ProfileStrength } from "@/lib/utils/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function ProfileStrengthCard({ strength }: { strength: ProfileStrength }) {
  const nextStep = strength.completed.find((c) => !c.done);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile strength</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-seek-navy">{strength.label}</span>
            <span className="text-sm font-semibold text-seek-pink">{strength.score}%</span>
          </div>
          <Progress value={strength.score} className="mt-2" />
        </div>

        <ul className="space-y-1.5">
          {strength.completed.map((c) => (
            <li key={c.key} className="flex items-center gap-2 text-sm">
              {c.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-tone-positive" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-ink-muted" />
              )}
              <span className={c.done ? "text-ink-secondary" : "text-ink"}>{c.label}</span>
            </li>
          ))}
        </ul>

        {nextStep ? (
          <Button asChild variant="secondary" className="w-full">
            <Link href="/profile">Complete: {nextStep.label}</Link>
          </Button>
        ) : (
          <p className="rounded-md bg-tone-positive-bg px-3 py-2 text-center text-sm font-medium text-tone-positive">
            Your profile is all-star! 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );
}
