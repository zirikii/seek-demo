import type { AlertFrequency, ApplicationStatus, WorkType } from "./common";

export interface SavedJob {
  jobId: string;
  savedAt: string;
  /** Private candidate note attached to a saved job. */
  note: string;
}

export interface SearchFilters {
  classification?: string;
  workType?: WorkType;
  /** Minimum annualised salary in AUD. */
  salaryMin?: number;
  /** "any" | "today" | "3" | "7" | "14" | "30" (days listed). */
  dateListed?: string;
}

export interface SavedSearch {
  id: string;
  keywords: string;
  location: string;
  filters: SearchFilters;
  frequency: AlertFrequency;
  createdAt: string;
  /** ISO date the most recent alert email would have been "sent" (demo). */
  lastNotifiedAt?: string;
  /** Number of new results since creation (demo metric). */
  newResults: number;
}

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
  /** Resume file name used for the application (demo). */
  resumeName: string;
  coverNote: string;
}
