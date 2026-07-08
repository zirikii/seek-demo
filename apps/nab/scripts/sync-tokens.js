"use strict";

/**
 * Copies the shared design tokens from the @demo/ui workspace package into this
 * static site's css/ folder so every generated page can link the same tokens.
 * Runs automatically before `build` (see the "prebuild" script).
 */

const fs = require("fs");
const path = require("path");

const dest = path.join(__dirname, "..", "css", "tokens.css");

function resolveTokensCss() {
  try {
    return require.resolve("@demo/ui/tokens.css");
  } catch {
    // Fallback for running before install / outside the workspace.
    return path.join(__dirname, "..", "..", "..", "packages", "ui", "tokens.css");
  }
}

const src = resolveTokensCss();

if (!fs.existsSync(src)) {
  console.error(`[sync-tokens] shared tokens not found at ${src}`);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log(`[sync-tokens] copied ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`);
