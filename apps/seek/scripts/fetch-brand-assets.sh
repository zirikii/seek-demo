#!/usr/bin/env bash
#
# fetch-brand-assets.sh
# ---------------------
# Idempotently assembles the brand assets used by this unofficial SEEK-style demo.
#
# SEEK's real wordmark + favicon are license-restricted and not published on a public
# CDN, so this script:
#   1. ATTEMPTS to download the live favicon / logo (best effort, non-fatal on failure).
#   2. Always (re)generates clean, recreated SVG wordmarks committed under public/brand/.
#   3. Rasterises public/brand/icon.svg into a multi-size favicon.ico.
#
# All recreated assets are unaffiliated approximations for visual-fidelity demo purposes
# only. See public/brand/brand-assets.json for provenance.
#
# Usage:  bash scripts/fetch-brand-assets.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAND_DIR="$ROOT_DIR/public/brand"
TMP_DIR="$ROOT_DIR/.brand-fetch-tmp"
mkdir -p "$BRAND_DIR" "$TMP_DIR"

echo "==> Attempting best-effort download of live SEEK assets (non-fatal)…"
ATTEMPT_LOG="$TMP_DIR/fetch.log"
: > "$ATTEMPT_LOG"

try_download() {
  local url="$1" out="$2"
  if curl -fsSL --max-time 15 -A "Mozilla/5.0 (demo asset fetch)" -o "$out" "$url" 2>>"$ATTEMPT_LOG"; then
    echo "    fetched: $url"
    return 0
  fi
  echo "    unavailable (expected): $url" | tee -a "$ATTEMPT_LOG"
  return 1
}

# These typically fail / are gated; we keep the downloads only as references, never hotlinked.
try_download "https://www.seek.com.au/favicon.ico" "$TMP_DIR/live-favicon.ico" || true
try_download "https://au.seek.com/favicon.ico" "$TMP_DIR/live-favicon-au.ico" || true

echo "==> Recreated SVG wordmarks already committed under public/brand/ (logo, logo-white, logo-mark, icon)."

echo "==> Generating favicon.ico from public/brand/icon.svg…"
node "$ROOT_DIR/scripts/generate-favicon.mjs"

echo "==> Cleaning up temporary files…"
rm -rf "$TMP_DIR"

echo "==> Done. Brand assets are in $BRAND_DIR"
