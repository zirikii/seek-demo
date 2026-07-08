import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type { ClassValue };

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind
 * utilities. Shared by every Tailwind-based app in the monorepo so the
 * class-merging behaviour stays identical across projects.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
