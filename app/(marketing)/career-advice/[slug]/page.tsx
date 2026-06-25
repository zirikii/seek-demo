import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getContent, listContent } from "@/lib/content/markdown";
import { Markdown } from "@/components/common/Markdown";

interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
}

export async function generateStaticParams() {
  const articles = await listContent("career-advice");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getContent<ArticleFrontmatter>("career-advice", slug);
  return { title: doc?.frontmatter.title ?? "Career advice" };
}

export default async function CareerArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getContent<ArticleFrontmatter>("career-advice", slug);
  if (!doc) notFound();

  return (
    <article className="container-page max-w-3xl py-12">
      <Link
        href="/career-advice"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-seek-pink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> All career advice
      </Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-seek-pink">
        {doc.frontmatter.category}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-seek-navy">{doc.frontmatter.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{doc.frontmatter.readingTime}</p>
      <div className="mt-8">
        <Markdown>{doc.body}</Markdown>
      </div>
    </article>
  );
}
