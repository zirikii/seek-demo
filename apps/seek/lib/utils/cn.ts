/**
 * Re-exported from the shared `@demo/ui` package so class-merging behaviour is
 * identical across every app in the monorepo. Keeping this local module means
 * the existing `@/lib/utils/cn` import sites don't need to change.
 */
export { cn, type ClassValue } from "@demo/ui/cn";
