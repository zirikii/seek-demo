# @demo/ui

Shared UI toolkit for the demo monorepo. Every app depends on this package so
class-merging behaviour, design tokens, and shared components stay consistent.

## Exports

| Import | What you get |
| --- | --- |
| `@demo/ui` | Everything below, re-exported |
| `@demo/ui/cn` | `cn(...)` — `clsx` + `tailwind-merge` class merger (used by the Tailwind apps) |
| `@demo/ui/cx` | `cx(...)` — dependency-free class-name joiner |
| `@demo/ui/tokens` | `tokens` object of colours, radii, and font stacks |
| `@demo/ui/tokens.css` | The same tokens as `--demo-*` CSS custom properties |
| `@demo/ui/components/demo-ribbon` | `<DemoRibbon>` pill component |

## Who consumes what

- **naukri** & **seek** (Next.js + Tailwind) re-export `cn` from here via their
  local `lib/utils/cn.ts`, and list `@demo/ui` in `transpilePackages`.
- **kddi** (Vite + React) re-exports `cx` from here via `src/lib/cx.js`.
- **nab** (static HTML) copies `tokens.css` into `css/tokens.css` during its
  build (`npm run sync-tokens`) and links it from every page.

Because it is a `workspace:*` dependency, edits here are picked up by every app
immediately — no publish step required.
