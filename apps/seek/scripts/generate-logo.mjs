// Generates the brand logo assets (navy circle + white dotted right-arrow mark +
// black lowercase "seek" wordmark) to match the supplied brand mark.
// Recreated approximation for an unaffiliated demo. Run: node scripts/generate-logo.mjs
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = resolve(__dirname, "../public/brand");

const NAVY = "#1F3C88";
const WHITE = "#FFFFFF";
const BLACK = "#0A0A0A";

const CX = 50;
const CY = 50;
const R = 50;
const DY = 7.6;

/**
 * Dotted right-arrow: a 3-row shaft on the left, then a triangular head whose
 * base (left) is tallest and narrows to a single dot at the tip. Dots grow
 * slightly toward the tip for the halftone feel.
 * Each column: [x, rowsHalfSpan, radius] where rows are -n..n.
 */
const columns = [
  [21, 1, 2.5],
  [29, 1, 2.7],
  [37, 1, 2.9],
  [45, 3, 3.1], // head base (7 rows)
  [53, 2, 3.5],
  [61, 1, 3.9],
  [69, 0, 4.4], // tip
];

function arrowDots(dotColor) {
  const dots = [];
  for (const [x, span, r] of columns) {
    for (let row = -span; row <= span; row++) {
      const cy = CY + row * DY;
      dots.push(`<circle cx="${x}" cy="${cy.toFixed(1)}" r="${r}" fill="${dotColor}" />`);
    }
  }
  return dots.join("\n    ");
}

/** The circular mark (used for logo-mark.svg and icon.svg). */
function mark({ circleFill, dotFill }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="seek">
  <title>seek</title>
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="${circleFill}" />
  <g>
    ${arrowDots(dotFill)}
  </g>
</svg>
`;
}

/** Full horizontal lockup: mark + "seek" wordmark. */
function lockup({ circleFill, dotFill, textFill }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 100" role="img" aria-label="seek">
  <title>seek</title>
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="${circleFill}" />
  <g>
    ${arrowDots(dotFill)}
  </g>
  <text x="118" y="72" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" letter-spacing="-3" fill="${textFill}">seek</text>
</svg>
`;
}

async function main() {
  await writeFile(
    resolve(brandDir, "logo.svg"),
    lockup({ circleFill: NAVY, dotFill: WHITE, textFill: BLACK }),
  );
  // Reversed lockup for dark (navy) backgrounds: white circle, navy arrow, white text.
  await writeFile(
    resolve(brandDir, "logo-white.svg"),
    lockup({ circleFill: WHITE, dotFill: NAVY, textFill: WHITE }),
  );
  await writeFile(
    resolve(brandDir, "logo-mark.svg"),
    mark({ circleFill: NAVY, dotFill: WHITE }),
  );
  await writeFile(resolve(brandDir, "icon.svg"), mark({ circleFill: NAVY, dotFill: WHITE }));
  console.log("Wrote logo.svg, logo-white.svg, logo-mark.svg, icon.svg");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
