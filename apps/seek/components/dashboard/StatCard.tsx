import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href: string;
}

export function StatCard({ icon: Icon, label, value, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-card-hover">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-seek-pink-light text-seek-pink">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-seek-navy">{value}</p>
          <p className="text-sm text-ink-secondary">{label}</p>
        </div>
      </Card>
    </Link>
  );
}
