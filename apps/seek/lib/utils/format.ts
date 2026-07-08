import type { Salary } from "@/lib/types";

const audWhole = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

/** Format a whole-dollar AUD amount, e.g. 120000 -> "$120,000". */
export function formatAud(amount: number): string {
  return audWhole.format(amount);
}

/**
 * Render a salary range as SEEK-style copy.
 * Prefers an author-provided `display` string when present.
 */
export function formatSalary(salary: Salary): string {
  if (salary.display) return salary.display;

  const suffix: Record<Salary["period"], string> = {
    year: "",
    month: " per month",
    day: " per day",
    hour: " per hour",
  };

  if (salary.period === "hour" || salary.period === "day") {
    const fmt = (n: number) => `$${n}`;
    return salary.min === salary.max
      ? `${fmt(salary.min)}${suffix[salary.period]}`
      : `${fmt(salary.min)} – ${fmt(salary.max)}${suffix[salary.period]}`;
  }

  return salary.min === salary.max
    ? `${formatAud(salary.min)}${suffix[salary.period]}`
    : `${formatAud(salary.min)} – ${formatAud(salary.max)}${suffix[salary.period]}`;
}

/** Annualise a salary's lower bound for filtering/sorting. */
export function annualisedMin(salary: Salary): number {
  switch (salary.period) {
    case "hour":
      return Math.round(salary.min * 38 * 52);
    case "day":
      return Math.round(salary.min * 5 * 52);
    case "month":
      return salary.min * 12;
    default:
      return salary.min;
  }
}

/**
 * Human "posted" label relative to now, SEEK-style.
 * e.g. "Posted today", "Posted 3d ago", "Posted 30+ days ago".
 */
export function formatPostedAt(iso: string, nowMs: number = Date.now()): string {
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, nowMs - then);
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1d ago";
  if (diffDays <= 30) return `Posted ${diffDays}d ago`;
  return "Posted 30+ days ago";
}

/** Short absolute date, e.g. "12 Jun 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Combine a job location into a single label, e.g. "CBD, Sydney NSW". */
export function formatLocation(location: {
  area?: string;
  city: string;
  state: string;
}): string {
  const base = `${location.city} ${location.state}`;
  return location.area && location.area !== location.city
    ? `${location.area}, ${base}`
    : base;
}

/** Pluralise a noun based on count, e.g. pluralise(1, "job") -> "1 job". */
export function pluralise(count: number, noun: string, plural?: string): string {
  const word = count === 1 ? noun : (plural ?? `${noun}s`);
  return `${count} ${word}`;
}
