import type { SavedJob } from "@/lib/types";
import { readData, writeData } from "./store";

export async function getSavedJobs(): Promise<SavedJob[]> {
  return readData<SavedJob[]>("saved");
}

export async function addSavedJob(jobId: string): Promise<SavedJob[]> {
  const saved = await getSavedJobs();
  if (saved.some((s) => s.jobId === jobId)) return saved;
  const next: SavedJob[] = [{ jobId, savedAt: new Date().toISOString(), note: "" }, ...saved];
  await writeData("saved", next);
  return next;
}

export async function removeSavedJob(jobId: string): Promise<SavedJob[]> {
  const saved = await getSavedJobs();
  const next = saved.filter((s) => s.jobId !== jobId);
  await writeData("saved", next);
  return next;
}

export async function updateSavedNote(jobId: string, note: string): Promise<SavedJob[]> {
  const saved = await getSavedJobs();
  const next = saved.map((s) => (s.jobId === jobId ? { ...s, note } : s));
  await writeData("saved", next);
  return next;
}
