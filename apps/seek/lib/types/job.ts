import type { JobLocation, Salary, WorkType } from "./common";

export interface Job {
  id: string;
  title: string;
  employerId: string;
  location: JobLocation;
  workType: WorkType;
  classification: string;
  subClassification: string;
  salary: Salary;
  /** Short one-line teaser shown on the result card. */
  teaser: string;
  /** Three short "what's on offer" bullet points. */
  bullets: string[];
  /** Full job ad body in Markdown. */
  description: string;
  /** ISO date string of when the ad was posted. */
  postedAt: string;
  featured: boolean;
  /** Simulated "AI insight" snippet (SEEK markets AI features; this is dummy text). */
  aiInsight?: string;
}

/** Job enriched with its resolved employer record for rendering. */
export interface JobWithEmployer extends Job {
  employer: import("./employer").Employer;
}
