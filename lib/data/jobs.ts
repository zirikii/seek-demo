import type { Employer, Job, JobWithEmployer } from "@/lib/types";
import { readData } from "./store";
import { getEmployers } from "./employers";

export async function getJobs(): Promise<Job[]> {
  return readData<Job[]>("jobs");
}

function attachEmployers(jobs: Job[], employers: Employer[]): JobWithEmployer[] {
  const byId = new Map(employers.map((e) => [e.id, e]));
  return jobs
    .map((job) => {
      const employer = byId.get(job.employerId);
      if (!employer) return null;
      return { ...job, employer };
    })
    .filter((j): j is JobWithEmployer => j !== null);
}

export async function getJobsWithEmployers(): Promise<JobWithEmployer[]> {
  const [jobs, employers] = await Promise.all([getJobs(), getEmployers()]);
  return attachEmployers(jobs, employers);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await getJobs();
  return jobs.find((j) => j.id === id);
}

export async function getJobWithEmployer(id: string): Promise<JobWithEmployer | undefined> {
  const [job, employers] = await Promise.all([getJobById(id), getEmployers()]);
  if (!job) return undefined;
  const employer = employers.find((e) => e.id === job.employerId);
  if (!employer) return undefined;
  return { ...job, employer };
}
