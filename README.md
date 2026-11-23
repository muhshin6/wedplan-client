# WedPlan Client

Next.js 16 (App Router) client for **WedPlan** — a wedding services marketplace connecting couples, vendors and administrators.

## What's inside

| Audience | Pages |
|---|---|
| Public | `/` landing, `/services` browse (search + category + location filters), `/services/[id]` details, `/sign-in`, `/sign-up`, `/vendor-sign-up` |
| Customer | `/customer/dashboard`, `/customer/bookings` (track + cancel) |
| Vendor | `/vendor/dashboard` (overview), `my-services` (create/update/delete/availability), `booking-requests` (accept/reject), `subscription` (Stripe + billing history), `profile` |
| Admin | `/admin/dashboard` (stats), `users` (search/filter/block), `services` (approve/reject/delete), `transactions` (read-only) |
| Shared | `/dashboard` role redirect, `/profile-settings`, `/payment/success`, `/payment/cancel` |

## Tech stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4 (CSS-first, no `tailwind.config`)
- shadcn/ui — **base-nova** style built on `@base-ui/react` (add with `npx shadcn add <name>`)
- Framer Motion — section reveals, card hovers, 404 page animations
- `next-themes` — light/dark/system theme with a Navbar toggle and `D` hotkey
- Better Auth client — session cookies + JWT bearer tokens
- Stripe Checkout — redirect flow (no card data handled in the client)

## Getting started

```bash
npm install
```

Create `.env` in the project root (gitignored — never commit it):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then:

```bash
npm run dev       # http://localhost:3000
```

The backend (`wedplan-server`) must be running at `http://localhost:5000` for auth and data features to work. Without it, pages fail silently.

## Production deployment

Set in your hosting provider's (e.g. Vercel) environment variables:

```env
NEXT_PUBLIC_API_URL=https://wedplan-server-sepia.vercel.app
```

All client API calls go through `lib/api.ts` (`API_URL`), so this single variable points the whole app at the deployed backend. There are no hardcoded backend URLs in the source.

The deployed backend must also trust the client origin — set `CLIENT_URL=https://<client-domain>` and `BETTER_AUTH_URL=https://<server-domain>` there.

Google OAuth redirect URIs (register **both** on the same OAuth client):

```
http://localhost:5000/api/auth/callback/google
https://<deployed-server>/api/auth/callback/google
```

> Secrets (Stripe secret/webhook keys, Google OAuth secret, MongoDB credentials, ImgBB key) live **only** on the server. Never put them in `NEXT_PUBLIC_*` variables.

## Authentication & authorization

- `lib/auth-client.ts` — Better Auth client with `jwtClient()` + additional user fields (`role`, `plan`, `businessName`)
- `lib/api.ts` — obtains a short-lived JWT from `/api/auth/token` and sends `Authorization: Bearer <jwt>`
- `components/auth/auth-redirect.tsx` — requires any authenticated user, redirects guests to `/sign-in`
- `components/auth/role-guard.tsx` — role-specific guard (`customer` / `vendor` / `admin`)
- No middleware — route protection is client-side here; the backend independently verifies JWT + role on every protected API

## Payments

1. "Upgrade to Premium" → `POST /api/payment/create-checkout-session`
2. Redirect to Stripe-hosted Checkout
3. Stripe returns to `/vendor/dashboard/subscription?session_id=...`
4. The page polls a **read-only** status endpoint; only the verified server webhook activates the plan and records the transaction
5. Billing history is fetched read-only from the server

A frontend success redirect can never activate Premium.

## Error handling & loading

- `app/not-found.tsx` — animated 404
- `app/error.tsx`, `app/global-error.tsx` — error boundaries with retry
- `app/api/[...all]/route.ts` — JSON 404 for unknown API paths
- `app/loading.tsx` and per-route `loading.tsx` skeletons; spinners on form submits, booking actions and payments
- `lib/api.ts` `readApiError()` — consistent messages from failed requests

## Theme

`components/theme-provider.tsx` (`next-themes`, class attribute, system default) + `components/theme-toggle.tsx` in the Navbar. Dark styles are applied across public pages, dashboards and auth pages. The `D` key also toggles the theme.

## Verification

```bash
npm run lint        # 1 pre-existing error + 1 warning (see AGENTS.md)
npm run typecheck   # must pass
npm run format      # Prettier over *.ts/tsx
npm run build       # production build
```

There is no test runner configured in this repo.

## Repositories

- Client: <https://github.com/muhshin6/wedplan-client>
- Server: <https://github.com/muhshin6/wedplan-server>
