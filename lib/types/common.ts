export type WorkType = "Full time" | "Part time" | "Contract/Temp" | "Casual/Vacation";

export type AlertFrequency = "off" | "daily" | "weekly";

export type ApplicationStatus = "Submitted" | "Viewed" | "Shortlisted" | "Unsuccessful";

export type SalaryPeriod = "year" | "month" | "day" | "hour";

export interface Salary {
  /** Lower bound in AUD. */
  min: number;
  /** Upper bound in AUD. */
  max: number;
  period: SalaryPeriod;
  /** Optional human-authored override, e.g. "$120,000 – $140,000 + super". */
  display?: string;
}

export interface JobLocation {
  /** Suburb / area within a city, e.g. "CBD & Inner Suburbs". */
  area?: string;
  city: string;
  /** AU state/territory code, e.g. "NSW". */
  state: string;
}
