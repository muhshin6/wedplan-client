# WedPlan Client

Next.js 16 App Router client for WedPlan — a wedding services marketplace connecting couples, vendors and administrators.

## Features

- **Public**: landing page, service browsing with search/category/location filters, service details, sign in/up (email + Google OAuth)
- **Customers**: dashboard, booking requests with status tracking and cancellation
- **Vendors**: dashboard, service management (create/update/delete/availability), booking request handling, subscriptions via Stripe Checkout, billing history, profile settings
- **Admins**: platform overview, user management (search/filter/block), service moderation (approve/reject/delete), read-only transactions

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui (base-nova / Base UI)
- Framer Motion animations
- Better Auth client (session cookies + JWT bearer tokens)
- Stripe Checkout (redirect flow, no card data handled client-side)

## Getting started

```bash
npm install
cp .env.example .env   # or create .env (see below)
npm run dev
```

### Environment variables

Create `.env` in the project root (never commit it):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The backend runs separately (`wedplan-server`) at `http://localhost:5000`. Authentication and data features require it to be running.

> Secrets (Stripe secret key, Google OAuth secret, MongoDB credentials, ImgBB key) live **only** on the server. Never put them in `NEXT_PUBLIC_*` variables.

## Authentication

- `authClient` (`lib/auth-client.ts`) uses Better Auth with session cookies and the JWT plugin.
- `lib/api.ts` attaches a short-lived `Authorization: Bearer <jwt>` token to protected API calls.
- Route guards: `components/auth/auth-redirect.tsx` (any authenticated user) and `components/auth/role-guard.tsx` (specific role).
- Unauthenticated users are redirected to `/sign-in`; wrong-role users get an access-denied state.

## Stripe flow

1. "Upgrade to Premium" → `POST /api/payment/create-checkout-session` (server creates the Checkout Session)
2. Browser redirects to Stripe-hosted checkout
3. Stripe redirects back to `/vendor/dashboard/subscription?session_id=...`
4. The page polls a read-only status endpoint; only the **verified server webhook** activates the plan
5. Transaction records are created server-side and shown in Billing History

## Error handling

- `app/not-found.tsx` — 404 page
- `app/error.tsx` / `app/global-error.tsx` — error boundaries with retry
- `app/api/[...all]/route.ts` — JSON 404 for unmatched API routes
- Forms and API calls show inline errors/toasts; loading skeletons and spinners cover async states

## Verification

```bash
npm run typecheck
npm run lint
npm run format
```

Lint has a small pre-existing baseline (unescaped apostrophe in the sign-in page and two generated shadcn hooks). No test runner is configured.

## Repositories

- Client: <https://github.com/muhshin6/wedplan-client>
- Server: <https://github.com/muhshin6/wedplan-server>
