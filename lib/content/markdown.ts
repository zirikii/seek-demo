import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ContentDoc<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  body: string;
}

export async function getContent<T = Record<string, unknown>>(
  category: string,
  slug: string,
): Promise<ContentDoc<T> | null> {
  try {
    const file = path.join(CONTENT_DIR, category, `${slug}.md`);
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);
    return { slug, frontmatter: data as T, body: content };
  } catch {
    return null;
  }
}

export async function listContent<T = Record<string, unknown>>(
  category: string,
): Promise<ContentDoc<T>[]> {
  const dir = path.join(CONTENT_DIR, category);
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const docs = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (f) => {
        const slug = f.replace(/\.md$/, "");
        return getContent<T>(category, slug);
      }),
  );
  return docs.filter((d): d is ContentDoc<T> => d !== null);
}
