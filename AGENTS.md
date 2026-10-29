<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# company-site, contributor spec

Read this before touching anything. Next.js 16 (app router, cache components,
React Compiler), React 19, Tailwind v4, shadcn (`base-nova`, Base UI flavor)
and the Fluid Functionalism design system. Bun is the package manager and
script runner.

## Commands

| Command | Does |
| --- | --- |
| `bun install` | install dependencies (never npm, pnpm or yarn) |
| `bun dev` | dev server on :3000 |
| `bun run build` | production build; fails on prerender errors |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint (next core-web-vitals + typescript) |
| `bun run test` | Vitest unit and component tests (happy-dom) |
| `bun run test:e2e` | Playwright against a production build on :3100 |
| `bun run check` | typecheck, lint and unit tests; run before every commit |

Add packages with `bun add` / `bun add -d`. Add shadcn or Fluid Functionalism
items with `bunx --bun shadcn@latest add …`.

## Invariants

- **One job per file.** A component, hook or helper per file, named after
  it in kebab-case. A new section is a new file plus one line in its
  feature's `index.ts`.
- **`index.ts` is the export list, nothing else.** Pages import from
  `@/features/<feature>`, never from a file inside it.
- **Copy lives in `src/content/`.** Components read words from there and
  never inline them, so a copy change is one diff and tests can check the
  data on its own.
- **Routes stay thin.** `src/app/**` composes features. Logic, markup and
  state belong in `src/features/`.
- **Server components by default.** Add `"use client"` only to the file
  that needs a hook or an event handler, as low in the tree as possible.
- **Installed design-system files are vendored.** Don't edit
  `src/components/ui/*`, `src/components/fluid-hover-highlight.tsx`,
  `src/hooks/*` or the Fluid Functionalism files in `src/lib/` (everything
  there except `utils.ts`). Wrap or compose them; edits are lost on the
  next `--overwrite` update.
- **Every change ships with tests.** See Testing.

## Comments

Write a comment only to explain something complex or out of the ordinary:
a non-obvious constraint, a browser quirk, or a reason the code can't be
simpler. Never narrate what the code does, restate a name, mark sections,
or leave TODOs and commented-out code. If a comment could be deleted
without a reader losing anything, delete it.

The vendored design-system files keep their own comments; they are the
library's rationale and are replaced on update.

## Architecture

| Path | Owns |
| --- | --- |
| `src/app/` | routes, `layout.tsx` (fonts, `<Providers>`), `providers.tsx` (client root: `FluidProvider`), `globals.css` (theme tokens, Fluid Functionalism CSS) |
| `src/features/<feature>/` | one feature's components, one per file, plus `index.ts` |
| `src/features/site/` | site chrome: header, footer |
| `src/features/home/` | home page sections |
| `src/content/` | every word the site shows |
| `src/components/ui/` | shadcn and Fluid Functionalism components (vendored) |
| `src/components/` | Fluid Functionalism shared components (vendored) |
| `src/hooks/` | Fluid Functionalism hooks (vendored) |
| `src/lib/` | `utils.ts` (`cn`) and the vendored system libs: `springs`, `size-context`, `type-scale`, `font-weight`, `elevated`, `surface-*`, `shape-context`, `icon-context`, `fluid-provider` |
| `tests/setup.ts` | jest-dom matchers, `matchMedia` / `ResizeObserver` / `IntersectionObserver` stand-ins for happy-dom |
| `tests/unit/` | Vitest tests, mirroring `src/` (`tests/unit/features/…`) |
| `tests/e2e/` | Playwright specs |

## Design system (Fluid Functionalism)

Installed: Motion (`springs`), Fluid Hover, Reveal, Scrollbars (Base UI
`scroll-area`), Sizes, Surfaces (`elevated`), Typography, plus
`fluid-provider` and `font-weight`. Load the `fluid-functionalism` skill
before writing UI, and run its stack script before installing anything.
The rules that matter most:

- **Motion uses spring tokens.** `spring.fast` / `.moderate` / `.slow` from
  `@/lib/springs`, with `spring.<tier>.exit` for dismissals. Never hand-write
  a duration or easing. Animate `transform` and `opacity` only.
- **One hover highlight per list.** Lists, menus and strips with hover use
  `useFluidHover` + `<FluidHoverHighlight />`, never a per-row `:hover`
  background. Rows touch (no `gap`); only click targets register.
- **Page reveals are a class.** `reveal-landing` on a marketing page's
  `<main>` (first child is the hero), `reveal-product` in app screens. Keep
  header, nav and footer outside the container; keep the LCP headline or
  image out of any reveal; never add per-element `whileInView` fades. Use
  `overflow: clip`, not `overflow: hidden`, on ancestors of revealed
  sections.
- **Type comes from six roles.** `typeClass(role)` from `@/lib/type-scale`
  in server components, `useSize().type.<role>` in client ones. Never a raw
  `text-[13px]`, never a bare `text-caption` inside `cn()`.
- **Weight comes from `fontWeights`.** `style={{ fontVariationSettings:
  fontWeights.semibold }}`, never Tailwind `font-*`. `normal` for text,
  `semibold` for headings and selected items, `bold` only for display. Text
  that changes weight on state uses the ghost-span pattern.
- **Two text colors.** `text-foreground` and `text-muted-foreground`, no
  opacity steps. No uppercase, no letter-spacing, no eyebrows.
- **Elevation from the surface ladder.** `<Elevated offset={…}>` or
  `surfaceClasses(level)`; nested corners via `nestedRadius()`.
- **Sizes from the ladder.** `SizeProvider` / `size` prop, default (36px)
  or compact (28px); controls read `useSize()`.
- **Theme is stock shadcn.** Use the tokens in `globals.css`; don't invent
  parallel ones. Icons are Lucide.
- **Inter loads with its `opsz` axis** (`layout.tsx`), so weight changes
  keep their width. `FluidProvider` wraps the app in
  `MotionConfig reducedMotion="user"`; keep it at the root.

Update the system with the skill's `upgrade.mjs`, never by re-installing
everything with `--overwrite`.

## Testing

- **Unit and component (Vitest + Testing Library, happy-dom).** One test
  file per source file, at the mirrored path under `tests/unit/`. Query by
  role and accessible name; assert behavior and semantics, not class
  soup. Content tests check the data in `src/content/` on its own.
- **End to end (Playwright, Chromium).** Anything that needs real layout
  or the real build: fluid hover (assert on `data-fluid-hover-active`),
  scroll areas, reveals, fonts, reduced motion (`test.use({ reducedMotion:
  "reduce" })`), phone-width overflow. Every route gets a spec that loads it
  with no console errors.
- happy-dom has no layout or Web Animations API. Don't fake measurements
  in unit tests; move the check to e2e.
- First run on a new machine: `bunx playwright install chromium`.
- `bun run check` must pass before committing; run `bun run test:e2e`
  when UI, routes or styling change.

## Adding a feature

1. Copy and data go in `src/content/<feature>.ts`.
2. Components go in `src/features/<feature>/<component>.tsx`, one per
   file, exported from `src/features/<feature>/index.ts`.
3. Compose them in a route under `src/app/`.
4. Tests go in `tests/unit/features/<component>.test.tsx`, plus an e2e
   spec for anything that moves or measures.
5. `bun run check`, then `bun run test:e2e`.
