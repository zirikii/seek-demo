import type { Employer } from "@/lib/types";
import { readData } from "./store";

export async function getEmployers(): Promise<Employer[]> {
  return readData<Employer[]>("employers");
}

export async function getEmployerById(id: string): Promise<Employer | undefined> {
  const employers = await getEmployers();
  return employers.find((e) => e.id === id);
}

export async function getEmployerBySlug(slug: string): Promise<Employer | undefined> {
  const employers = await getEmployers();
  return employers.find((e) => e.slug === slug);
}
