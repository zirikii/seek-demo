// Generates simple, original letter-mark SVG placeholders for the demo's fictional
// employers under public/employers/. These are NOT real company logos — they are
// generic initials-on-a-tile marks used purely so job cards have distinct avatars.
// Run: node scripts/generate-employer-logos.mjs
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../public/employers");

/** slug, display initials, tile colour, text colour */
const employers = [
  ["bupa", "B", "#0079C8", "#FFFFFF"],
  ["anz", "A", "#004165", "#FFFFFF"],
  ["optus", "O", "#006B54", "#FFFFFF"],
  ["commbank", "C", "#FDB913", "#1A1A1A"],
  ["mercy-health", "M", "#6B2C91", "#FFFFFF"],
  ["skyline-air", "S", "#C8102E", "#FFFFFF"],
  ["fresh-grocer", "F", "#178C43", "#FFFFFF"],
  ["ironbark-resources", "I", "#8C4A1F", "#FFFFFF"],
  ["stackforge", "S", "#2D5BFF", "#FFFFFF"],
  ["designhive", "D", "#00B5B0", "#FFFFFF"],
  ["telecorp", "T", "#1565C0", "#FFFFFF"],
  ["pinnacle-advisory", "P", "#2E3849", "#FFFFFF"],
  ["nsw-health", "N", "#00857C", "#FFFFFF"],
  ["talentbridge", "T", "#E8590C", "#FFFFFF"],
  ["brightpath-education", "B", "#5C2D91", "#FFFFFF"],
  ["coastline-care", "C", "#0E7C86", "#FFFFFF"],
];

function svg(initials, bg, fg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${initials}">
  <rect width="100" height="100" rx="18" fill="${bg}" />
  <text x="50" y="50" dy="0.35em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="${fg}">${initials}</text>
</svg>
`;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await Promise.all(
    employers.map(([slug, initials, bg, fg]) =>
      writeFile(resolve(outDir, `${slug}.svg`), svg(initials, bg, fg)),
    ),
  );
  console.log(`Wrote ${employers.length} employer logo placeholders to public/employers/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
