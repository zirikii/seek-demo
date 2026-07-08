# AGENTS.md

## Cursor Cloud specific instructions

This is a static website (plain HTML/CSS/JS) — there is no build step and no compiled output.

- Run it by serving the repo root with any static file server, e.g. `python3 -m http.server 8080` or `npx serve .` (see `README.md`). Open `http://localhost:8080/`.
- `npm install` only fetches `@adobe/adobe-client-data-layer` (already vendored at `js/vendor/`) and `playwright` (dev). The site itself does not require `node_modules` at runtime.
- There are no automated tests or lint config. `npm test` is a placeholder that intentionally exits non-zero; do not treat it as a real test suite.
- Core behavior to verify: the Adobe Client Data Layer (`window.adobeDataLayer`). `js/datalayer.js` fires a `cmp:show` event on page load and `cmp:click` events on UI interactions; watch the browser console (`[adobeDataLayer] ...`) to confirm event parity.
