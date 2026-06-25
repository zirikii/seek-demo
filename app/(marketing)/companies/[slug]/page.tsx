import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star, Users } from "lucide-react";
import { getEmployerBySlug, getEmployers } from "@/lib/data/employers";
import { getJobsWithEmployers } from "@/lib/data/jobs";
import { EmployerLogo } from "@/components/common/EmployerLogo";
import { Card, CardContent } from "@/components/ui/card";
import { formatLocation, formatSalary } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const employers = await getEmployers();
  return employers.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const employer = await getEmployerBySlug(slug);
  return { title: employer ? `${employer.name} careers` : "Company" };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [employer, jobs] = await Promise.all([getEmployerBySlug(slug), getJobsWithEmployers()]);
  if (!employer) notFound();

  const employerJobs = jobs.filter((j) => j.employer.id === employer.id);

  return (
    <div className="container-page py-12">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-seek-pink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All companies
      </Link>

      <div className="mt-6 flex flex-col gap-5 rounded-lg border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <EmployerLogo src={employer.logo} name={employer.name} size={80} />
        <div>
          <h1 className="text-3xl font-bold text-seek-navy">{employer.name}</h1>
          <p className="text-ink-secondary">{employer.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-tone-caution text-tone-caution" />
              {employer.rating.toFixed(1)} ({employer.reviewCount.toLocaleString()} reviews)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ink-muted" />
              {employer.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ink-muted" />
              {employer.size}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="text-xl font-bold text-seek-navy">
            Jobs at {employer.name} ({employerJobs.length})
          </h2>
          <div className="mt-4 space-y-3">
            {employerJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-lg border border-line bg-white p-4 shadow-card transition-all hover:border-seek-pink hover:shadow-card-hover"
              >
                <p className="font-semibold text-seek-navy">{job.title}</p>
                <p className="text-sm text-ink-secondary">{formatLocation(job.location)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{job.workType}</Badge>
                  <Badge tone="neutral">{formatSalary(job.salary)}</Badge>
                </div>
              </Link>
            ))}
            {employerJobs.length === 0 ? (
              <p className="text-sm text-ink-muted">No open roles right now.</p>
            ) : null}
          </div>
        </section>

        <aside>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-seek-navy">About {employer.name}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{employer.about}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
