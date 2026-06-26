import type { AlertFrequency, WorkType } from "@/lib/types";

export const WORK_TYPES: WorkType[] = [
  "Full time",
  "Part time",
  "Contract/Temp",
  "Casual/Vacation",
];

/** SEEK-style top-level job classifications (AU market). */
export const CLASSIFICATIONS: string[] = [
  "Healthcare & Medical",
  "Information & Communication Technology",
  "Administration & Office Support",
  "Trades & Services",
  "Construction",
  "Education & Training",
  "Accounting",
  "Sales",
  "Hospitality & Tourism",
  "Banking & Financial Services",
  "Marketing & Communications",
  "Engineering",
  "Government & Defence",
  "Retail & Consumer Products",
];

export const AU_LOCATIONS: string[] = [
  "All Australia",
  "Sydney NSW",
  "Melbourne VIC",
  "Brisbane QLD",
  "Perth WA",
  "Adelaide SA",
  "Canberra ACT",
  "Hobart TAS",
  "Darwin NT",
  "Gold Coast QLD",
  "Newcastle NSW",
  "Wollongong NSW",
];

export interface SalaryRangeOption {
  label: string;
  /** Minimum annualised AUD value for filtering. */
  min: number;
}

export const SALARY_RANGES: SalaryRangeOption[] = [
  { label: "Any salary", min: 0 },
  { label: "$40,000+", min: 40000 },
  { label: "$60,000+", min: 60000 },
  { label: "$80,000+", min: 80000 },
  { label: "$100,000+", min: 100000 },
  { label: "$120,000+", min: 120000 },
  { label: "$150,000+", min: 150000 },
];

export interface DateListedOption {
  label: string;
  /** Value in days; "any" maps to no filter. */
  value: string;
}

export const DATE_LISTED_OPTIONS: DateListedOption[] = [
  { label: "Any time", value: "any" },
  { label: "Today", value: "today" },
  { label: "Last 3 days", value: "3" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 14 days", value: "14" },
  { label: "Last 30 days", value: "30" },
];

export const ALERT_FREQUENCIES: { label: string; value: AlertFrequency }[] = [
  { label: "Off", value: "off" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

/** Quick-search chips shown on the marketing landing hero. */
export const QUICK_SEARCH_CHIPS: string[] = [
  "Registered Nurse",
  "Software Engineer",
  "Administration Assistant",
  "Project Manager",
  "Customer Service",
  "Marketing Manager",
  "Electrician",
  "Accountant",
];
