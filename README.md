# YourLeadspartner — lead-generation agency website

Marketing website for an agency that sells lead-generation services to IT companies
(cold email, LinkedIn outreach, cold calling, marketplace prospecting). Built from an
internal website build brief (not included in this repo), with the homepage styled
to match the team's Figma design. The brand name is set centrally — see
[Branding](#branding-and-content-you-can-edit-centrally) below. No domain or
trademark clearance has been run on it yet (see `LAUNCH_CHECKLIST.md`).

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, with Supabase Postgres
as the durable enquiry store in live mode.

> **Status:** preview build. It runs out of the box with no accounts, but it is not
> ready for public launch — see [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md).

## Getting started

Requires Node.js 20+ and npm.

```bash
git clone https://github.com/zzaighum/scaleme.git
cd scaleme
npm install
cp .env.example .env.local   # optional in preview mode; required for live mode
npm run dev
```

Open http://localhost:3000. The site runs in **preview mode** by default — see
[Preview vs live mode](#preview-vs-live-mode) — so it works immediately with no
external accounts.

Other commands:

```bash
npm run build   # production build (also type-checks)
npm run lint    # ESLint
npm start       # run a production build
npx tsc --noEmit  # type-check only
```

## Project structure

```
src/
  app/                 # routes (App Router): one folder per page, plus api/
    api/enquiry/       # enquiry form handler (validation, rate limit, storage)
    api/booking-click/ # outbound scheduler click tracking
  components/          # shared UI: Header, Footer, EnquiryForm, hero funnel, icons…
  config/site.ts       # brand, mode, CTA labels, booking + identity settings
  data/                # nav, service/channel copy, FAQs
  lib/                 # validation, signed receipts, Supabase client, lead storage
supabase/migrations/   # database schema (enquiries, rate limiting)
```

## Homepage design (Figma)

The homepage hero and section styling follow the team's Figma file. Two things
worth knowing:

- The hero funnel graphic in Figma is a placed raster image, so it couldn't be
  extracted; [`src/components/ProcessIllustration.tsx`](src/components/ProcessIllustration.tsx)
  is an original SVG rebuilt to match its composition.
- **The funnel percentages and metric cards (1,250 leads, 375 meetings, etc.) are
  mockup placeholders copied from Figma, not real results.** They only render in
  preview mode — setting `NEXT_PUBLIC_SITE_MODE=live` removes them automatically.
  Replace them with real figures or leave them off before launch.

Client logos, review badges and testimonials from the Figma file were deliberately
not included, since no approved material exists for this brand yet.

## Preview vs live mode

Controlled by `NEXT_PUBLIC_SITE_MODE` (`preview` by default, or `live`):

- **Preview** — the site-wide banner and the "Demo only" notice on the enquiry form
  are shown; submitting the form runs an illustrative flow (a signed receipt is
  issued and `/thank-you` renders a success state clearly marked "Illustrative
  demo — no enquiry was actually sent"), but **nothing is written to a database and
  no notification is sent**, even if Supabase/webhook credentials are present in the
  environment. `robots.txt` disallows all indexing in this mode.
- **Live** — enquiries are validated, rate-limited, and persisted to Supabase; a
  notification webhook fires; `/thank-you` only renders success for a real,
  server-issued receipt. If `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` aren't
  configured, submissions fail loudly with "We could not send your brief..." rather
  than faking success.

Copy `.env.example` to `.env.local` and fill in real values before switching to
live mode. See that file for what each variable does.

## Branding and content you can edit centrally

Almost everything content/brand-related lives in a few files, not scattered across
components:

- [`src/config/site.ts`](src/config/site.ts) — brand name, descriptor, CTA labels,
  call duration, site mode, booking mode/URL, legal-content status, business
  identity (legal name, contact email). Most of these read from env vars so you can
  change them without touching code — see `.env.example`.
- [`src/data/services.ts`](src/data/services.ts) — the four channel pages' copy
  (included work, deliverables, boundary) and the shared channel-page template at
  [`src/components/ChannelPageTemplate.tsx`](src/components/ChannelPageTemplate.tsx).
- [`src/data/faqs.ts`](src/data/faqs.ts) — the shared FAQ list (Home shows the first
  four; Pricing shows all nine).
- [`src/data/nav.ts`](src/data/nav.ts) — header/footer navigation.
- Everything else (Home, Who We Help, How It Works, Our Approach, About, Pricing,
  Privacy, Terms) is plain copy directly in its `src/app/<route>/page.tsx`.

`testimonialsEnabled`, `caseStudiesEnabled`, and `teamEnabled` in `site.ts` are all
`false` by default because no approved evidence or team material was supplied — see
`LAUNCH_CHECKLIST.md`. Turning them on requires adding real, approved content; there
are no hidden modules waiting to be revealed.

## Enquiry storage (Supabase)

Schema and setup: [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

1. Create a Supabase project.
2. Run the migration SQL (SQL Editor, or `supabase db push` with the CLI).
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only — the service
   role key bypasses Row Level Security and must never be exposed to the browser;
   see [`src/lib/supabaseAdmin.ts`](src/lib/supabaseAdmin.ts)).
4. Set `NEXT_PUBLIC_SITE_MODE=live`.

The `enquiries` table has RLS enabled with **no policies**, so the service role key
(server-only) is the only access path — there is no public/anon read or write access.

Notifications: set `NOTIFICATION_WEBHOOK_URL` to any HTTPS endpoint that accepts a
JSON POST (Slack incoming webhook, Zapier/Make catch hook, your own mailer). If it's
unset, enquiries are still captured durably, but the row's `notification_error`
column records that no owner notification was sent, so it's not a silent miss.

Idempotency: the client generates a key per distinct form payload (see
`src/components/EnquiryForm.tsx`); the server rejects a retried key whose payload
has changed, and returns the same receipt for a genuine retry. Rate limiting is a
Postgres-backed fixed window (`check_rate_limit()` in the migration) — atomic and
correct across multiple deployed instances, unlike an in-memory counter.

Receipts: `/thank-you` and `/booking-confirmed` only show success for a
server-signed, short-lived token (HMAC-SHA256, `src/lib/receipt.ts`) — direct visits
without one show the neutral "no confirmation to display" state. Set
`RECEIPT_SIGNING_SECRET` in any environment that must keep validating receipts
across a restart; without it, a per-process random secret is generated (fine for
local preview only).

## Booking

Default mode is **external**: after a successful enquiry, `/thank-you` shows a link
to your hosted scheduler (`NEXT_PUBLIC_BOOKING_URL`) via `/api/booking-click`, which
only counts the outbound click and then redirects — it never claims a confirmed
booking, since the provider's return URL isn't verified. `/booking-confirmed`
therefore always shows the neutral "check your confirmation email" state. Leave
`NEXT_PUBLIC_BOOKING_URL` blank to hide the scheduling area entirely (falls back to
the configured contact email, if any).

A **connected** mode (authenticated provider webhook, verified booking confirmation)
is deliberately **not implemented** — no booking provider was confirmed in the
brief, and the brief is explicit that unsupported event verification means external
mode, not a simulated connected one. See `LAUNCH_CHECKLIST.md`.

## Deployment

Any host that runs a Next.js server works (Vercel, Netlify, a Node container) — the
enquiry and booking-click API routes need server execution, so a pure static export
won't do. Set the environment variables from `.env.example` in the host's settings,
keeping the `SUPABASE_*`, `NOTIFICATION_WEBHOOK_URL` and `RECEIPT_SIGNING_SECRET`
values server-only. Leave `NEXT_PUBLIC_SITE_MODE=preview` until everything in
`LAUNCH_CHECKLIST.md` is resolved.

## What was verified

- `npx tsc --noEmit` — passes with no errors.
- `npm run lint` — passes with no errors.
- `npm run build` — production build succeeds; all 21 marketing/legal/API routes
  compile and prerender where static.
- Manual pass in a real browser (desktop + 375px mobile): homepage, a channel page,
  Book a Strategy Call, the enquiry form's invalid/valid/demo-success states,
  `/thank-you` (both confirmed-receipt and neutral no-receipt states),
  `/booking-confirmed`, `/privacy`, `/terms`, an unmatched route (confirmed real
  HTTP 404), `robots.txt`, `sitemap.xml`.
- Mobile menu: opens/closes by click and Escape, Escape returns focus to the
  trigger button, active route is marked.
- FAQ accordion: multiple entries can be open at once, each is a real
  `aria-expanded`/`aria-controls` disclosure.
- API route tested directly with `curl`: invalid payload returns per-field errors;
  valid payload in preview mode returns a demo receipt with no persistence; a
  matching build with `NEXT_PUBLIC_SITE_MODE=live` and no Supabase credentials
  fails with the exact required copy instead of a fake success.
- Keyboard focus: an invalid form submission moves focus to the first invalid
  field.

## What was not verified (needs live credentials)

- A real Supabase project: insert, the idempotency/rate-limit RPC, and RLS lockdown
  under real concurrent load.
- A real `NOTIFICATION_WEBHOOK_URL` endpoint receiving and formatting the payload.
- A real hosted booking URL end to end.
- Automated accessibility scanning (e.g. axe) and Lighthouse performance scoring —
  the manual accessibility pass above (landmarks, skip link, focus states, labelled
  fields, keyboard menus, `prefers-reduced-motion`) was done by hand, not tooled.

See `LAUNCH_CHECKLIST.md` for the full list of what the business owner needs to
supply or confirm before this goes live.
