// Rasterises public/brand/icon.svg into a multi-size favicon.ico.
// Run via: node scripts/generate-favicon.mjs (also invoked by fetch-brand-assets.sh).
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = resolve(__dirname, "../public/brand");

async function main() {
  const svg = await readFile(resolve(brandDir, "icon.svg"));
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()),
  );
  const ico = await pngToIco(pngBuffers);
  await writeFile(resolve(brandDir, "favicon.ico"), ico);

  // Also emit a 512px PNG for richer PWA / social contexts.
  await sharp(svg, { density: 384 })
    .resize(512, 512)
    .png()
    .toFile(resolve(brandDir, "icon-512.png"));

  console.log("Wrote favicon.ico (16/32/48) and icon-512.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
