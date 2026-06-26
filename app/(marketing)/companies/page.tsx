import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { getEmployers } from "@/lib/data/employers";
import { Card, CardContent } from "@/components/ui/card";
import { EmployerLogo } from "@/components/common/EmployerLogo";

export const metadata: Metadata = { title: "Companies" };

export default async function CompaniesPage() {
  const employers = await getEmployers();

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-seek-navy">Explore companies</h1>
      <p className="mt-2 max-w-2xl text-ink-secondary">
        Research employers, read reviews and discover companies hiring now. (All companies shown are
        fictional and for demonstration only.)
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employers.map((emp) => (
          <Link key={emp.id} href={`/companies/${emp.slug}`}>
            <Card className="h-full transition-all hover:shadow-card-hover">
              <CardContent className="flex items-start gap-4 pt-6">
                <EmployerLogo src={emp.logo} name={emp.name} size={56} />
                <div className="min-w-0">
                  <h2 className="font-semibold text-seek-navy">{emp.name}</h2>
                  <p className="text-sm text-ink-secondary">{emp.industry}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-ink-muted">
                    <Star className="h-4 w-4 fill-tone-caution text-tone-caution" />
                    {emp.rating.toFixed(1)} ({emp.reviewCount.toLocaleString()} reviews)
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
