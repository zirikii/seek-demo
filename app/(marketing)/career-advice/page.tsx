import type { Metadata } from "next";
import Link from "next/link";
import { listContent } from "@/lib/content/markdown";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Career advice" };

interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
}

export default async function CareerAdvicePage() {
  const articles = await listContent<ArticleFrontmatter>("career-advice");

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-seek-navy">Career advice</h1>
      <p className="mt-2 max-w-2xl text-ink-secondary">
        Practical, expert advice to help you find the right role, ace the interview and grow your
        career.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.slug} href={`/career-advice/${a.slug}`}>
            <Card className="h-full transition-all hover:shadow-card-hover">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-seek-pink">
                  {a.frontmatter.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-seek-navy">{a.frontmatter.title}</h2>
                <p className="mt-2 text-sm text-ink-secondary">{a.frontmatter.excerpt}</p>
                <p className="mt-4 text-xs text-ink-muted">{a.frontmatter.readingTime}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
