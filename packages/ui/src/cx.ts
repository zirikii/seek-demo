/**
 * Tiny class-name joiner that filters out falsy values. Dependency-free
 * alternative to {@link cn} for apps that do not run Tailwind's class
 * merging (e.g. the Vite/Tailwind v4 dashboard).
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export default cx;
