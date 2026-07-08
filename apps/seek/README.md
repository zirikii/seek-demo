# SEEK Marketplace Demo

An **unofficial, UI/UX-fidelity demo** of a SEEK-style jobs marketplace, built with Next.js. It
recreates the look and feel of [au.seek.com](https://au.seek.com/) — the signature dual search bar,
split-view job results with a sticky Job Details View, candidate dashboard, saved jobs, alerts,
applied-jobs tracker, profile builder and settings — using **mock auth** and **local JSON
persistence**. No real backends, databases or external services.

> ⚠️ **Not affiliated with SEEK Limited.** This project is for demonstration and educational
> purposes only. All brand assets (the pink "SEEK" wordmark and favicon) are **recreated
> approximations** used solely for visual fidelity. All employers, jobs, salaries and people are
> **fictional**.

---

## ✨ Features

- **Marketing landing** with a SEEK-style hero, the prominent **dual search bar** (keyword +
  location), quick-search chips, classification grid, employer grid and career-advice teasers.
- **Mock authentication** — sign in with any credentials (demo mode), signed HTTP-only cookie via
  [`jose`](https://github.com/panva/jose), routes protected by `middleware.ts`.
- **Candidate dashboard** — recommended jobs, activity stats, a live **profile-strength** meter and
  saved-search quick links.
- **Job search** — the signature **split view**: paginated result cards on the left, a sticky
  **Job Details View (JDV)** on the right. Filters for classification, work type, salary and date
  listed (URL-synced). Deep links to `/jobs/[jobId]` work directly.
- **Save flags** that toggle and persist, with a nav badge and a **Quick Apply** drawer that records
  applications.
- **Saved jobs** with private per-job notes, **saved searches & alerts** (Off/Daily/Weekly), an
  **applied-jobs tracker** (`@tanstack/react-table` with sorting + pagination), a **profile/resume
  builder**, and **settings** (notifications + privacy toggles).
- **Accessible & responsive** — semantic HTML, keyboard-navigable dialogs/menus/save flags, mobile
  nav drawers, SEEK Pink `#E60278` / Navy `#2E3849` theming.

## 🧱 Tech stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v3 with Braid-inspired design tokens |
| Components | shadcn/ui-style primitives (Radix UI) restyled to SEEK |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| Auth | Mock signed HTTP-only cookie (`jose` HS256) + middleware |
| Data | Local JSON files (`data/*.json`) via `fs/promises`, atomic writes |
| Content | Markdown (`content/**`) with frontmatter via `gray-matter` + `react-markdown` |
| Tests | Vitest + React Testing Library |
| E2E / demo video | Playwright (records the walkthrough) |

## 🚀 Getting started

Prerequisites: **Node.js 20+** and npm.

```bash
cp .env.example .env.local   # then set DEMO_AUTH_SECRET to any value
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

Demo mode accepts **any** email/password. The login form is pre-filled with:

- **Email:** `candidate@example.com`
- **Password:** `demo`

## 📜 Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm run test` | Run the Vitest suite |
| `npm run format` | Prettier write |
| `npm run video` | Record the Playwright walkthrough video (requires a running server) |

### Regenerating assets & seed data

```bash
bash scripts/fetch-brand-assets.sh      # brand wordmarks + favicon
node scripts/generate-employer-logos.mjs # employer letter-marks
node scripts/generate-seed-data.mjs      # data/*.json seed
```

## 🗂️ Project structure

```
app/
  (marketing)/        # landing, career-advice, companies, legal
  oauth/              # login + register (mock auth)
  (app)/              # authenticated candidate area (protected by middleware)
    dashboard/  jobs/  jobs/[jobId]/  saved-jobs/
    saved-searches/  applied/  profile/  settings/
  api/                # route handlers reading/writing data/*.json
components/
  ui/                 # shadcn-style primitives (button, dialog, table, …)
  layout/  jobs/  search/  dashboard/  profile/  settings/  saved/  searches/  applied/  marketing/  common/
  providers/          # AppDataProvider (client saved/applied state)
lib/
  auth/  data/  types/  utils/  constants/  content/  validation.ts
content/              # markdown: landing, career-advice, legal
data/                 # JSON seed + live persistence
public/brand/         # recreated SEEK wordmark + favicon (+ brand-assets.json)
public/employers/     # generated employer letter-marks
scripts/              # asset + seed generators, walkthrough recorder
middleware.ts         # protects (app) routes
```

## 💾 How persistence works

API route handlers in `app/api/**` read and write JSON files under `data/` using `fs/promises`.
Writes are **atomic**: data is written to a temp file then `rename`d over the target, so an
interrupted write can't corrupt the store. Saving a job, applying, editing your profile and toggling
settings all persist to disk. To reset the demo, regenerate the seed with
`node scripts/generate-seed-data.mjs`.

## 🔐 Authentication (mock)

`middleware.ts` guards the `(app)` routes. Unauthenticated visits redirect to
`/oauth/login?redirect=…`. The session is a signed HS256 JWT stored in an HTTP-only cookie
(`DEMO_AUTH_SECRET`). This is **not** real authentication — any credentials are accepted in demo
mode.

## ⚠️ Known limitations

- Demo-only mock auth (no real password checks); don't enter real passwords.
- JSON file persistence is single-user and not concurrency-safe at scale.
- AI features ("AI insight") are simulated with static copy.
- Employer profiles, salaries and reviews are fictional.
