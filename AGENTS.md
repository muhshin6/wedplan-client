<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wedplan-client

Next.js 16.4.6 (App Router) + React 19 + Tailwind v4 + shadcn/ui. npm only (`package-lock.json`) — not yarn/pnpm. The `@/*` path alias maps to the repo root.

## Commands

- `npm run dev` / `npm run build`
- Verify changes with `npm run lint` then `npm run typecheck` — **there is no test runner** in this repo (no test script, no test framework, no CI).
- `npm run format` — Prettier over `**/*.{ts,tsx}` only (not CSS/JSON/MD). Style: **no semicolons**, double quotes, LF; Tailwind class order comes from `prettier-plugin-tailwindcss`. Run it on files you touch; don't hand-sort classes.
- Lint baseline is **not green**: 3 pre-existing errors (unescaped `'` in `app/(auth)/sign-in/page.tsx`; `react-hooks/set-state-in-effect` in shadcn-generated `components/ui/carousel.tsx` and `hooks/use-mobile.ts`). Don't add new errors, and don't mass-fix unrelated ones.

## Architecture

- Single app, no monorepo, **no `app/api/`, no `middleware.ts`** — data fetching is client-side `fetch` from `"use client"` pages. There is no server data layer or shared API-client module to extend.
- Routes: `/` landing, `(auth)/` (sign-in, sign-up, vendor-sign-up), `/services`, `/services/[id]`, `/vendor/dashboard/*`, `/customer/dashboard|bookings`, `/admin/dashboard/*`.
- `components/ui/` is shadcn-generated; feature code lives in `components/{home,auth,admin,vendor,Navbar}`, `lib/`, `hooks/`. Add UI with `npx shadcn add <name>` (reads `components.json`: style **`base-nova`, built on `@base-ui/react` — not Radix**; don't write Radix-based shadcn components from memory).
- Tailwind v4 is CSS-first: theme/config in `app/globals.css` via `@tailwindcss/postcss`; there is no `tailwind.config` file.
- `next.config.ts` whitelists remote image hosts (`i.ibb.co` only) — new hosts go in `images.remotePatterns`.

## Backend & auth gotchas

- A separate backend runs at `http://localhost:5000` (better-auth + REST). `.env` is gitignored and must contain `NEXT_PUBLIC_API_URL=http://localhost:5000`; auth and data features fail silently without that server running.
- API base URL usage is inconsistent: some files read `process.env.NEXT_PUBLIC_API_URL` with a localhost fallback, others hardcode `http://localhost:5000`. **New code: always use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"`.**
- Auth is client-side only via `authClient.useSession()` (`lib/auth-client.ts`); roles are `customer | vendor | admin`. Protected areas use either `components/auth/role-guard.tsx` wrapping page content (see `app/vendor/dashboard/page.tsx`) or a session check + redirect in the route's `layout.tsx` (see `app/admin/dashboard/layout.tsx`). No middleware backstops these — follow the existing pattern for new protected routes.
