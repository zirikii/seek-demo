import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content/markdown";
import { Markdown } from "@/components/common/Markdown";

interface LegalFrontmatter {
  title: string;
  updated: string;
}

export async function generateStaticParams() {
  return [{ slug: "privacy" }, { slug: "terms" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getContent<LegalFrontmatter>("legal", slug);
  return { title: doc?.frontmatter.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getContent<LegalFrontmatter>("legal", slug);
  if (!doc) notFound();

  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold text-seek-navy">{doc.frontmatter.title}</h1>
      <p className="mt-1 text-sm text-ink-muted">Last updated {doc.frontmatter.updated}</p>
      <div className="mt-8">
        <Markdown>{doc.body}</Markdown>
      </div>
    </div>
  );
}
