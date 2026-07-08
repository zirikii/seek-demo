/**
 * Shared design tokens for the demo monorepo.
 *
 * These are intentionally framework-agnostic plain values so they can be
 * consumed from React apps (import the object), Tailwind configs (spread the
 * palette), or static HTML (via the companion `tokens.css` custom properties).
 */
export const tokens = {
  color: {
    accent: "#f54e00",
    accentInk: "#ffffff",
    ink: "#26251e",
    inkSoft: "#4a4a4a",
    bg: "#f7f7f4",
    card: "#f2f1ed",
    line: "#e0ddd8",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  font: {
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} as const;

export type Tokens = typeof tokens;
