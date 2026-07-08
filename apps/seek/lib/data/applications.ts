import type { Application } from "@/lib/types";
import { createId, readData, writeData } from "./store";

export async function getApplications(): Promise<Application[]> {
  return readData<Application[]>("applications");
}

export interface CreateApplicationInput {
  jobId: string;
  resumeName?: string;
  coverNote?: string;
}

export async function addApplication(input: CreateApplicationInput): Promise<Application> {
  const applications = await getApplications();
  const existing = applications.find((a) => a.jobId === input.jobId);
  if (existing) return existing;

  const application: Application = {
    id: createId("app"),
    jobId: input.jobId,
    appliedAt: new Date().toISOString(),
    status: "Submitted",
    resumeName: input.resumeName ?? "My_SEEK_Profile.pdf",
    coverNote: input.coverNote ?? "",
  };
  await writeData("applications", [application, ...applications]);
  return application;
}

export async function hasApplied(jobId: string): Promise<boolean> {
  const applications = await getApplications();
  return applications.some((a) => a.jobId === jobId);
}
