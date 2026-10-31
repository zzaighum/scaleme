@AGENTS.md

# Project context

Marketing site for **Your Leads Partner**, a lead-generation agency selling to IT
companies. Next.js 16 (App Router) + TypeScript + Tailwind v4, Supabase Postgres
for enquiry storage in live mode. Repo: https://github.com/zzaighum/scaleme
(repo name still says `scaleme`, the previous brand name).

Read `README.md` for setup/architecture and `LAUNCH_CHECKLIST.md` for open
launch blockers. Brand, site mode and CTA labels all live in `src/config/site.ts`.

## Brand name

The brand is **Your Leads Partner** — three capitalised words, renamed from the
single-word "YourLeadspartner" on 26 Oct 2026. It lives in one place,
`siteConfig.brandName`, and the wordmark is set from it as HTML text in
`src/components/Logo.tsx`.

`public/logo.svg` is the **old** wordmark, kept only as a reference: its
letterforms are 13 vector paths spelling the previous name, so it cannot be
edited to say anything else and nothing renders it any more.
`public/logo-mark.svg` is the symbol, still in use. A designed wordmark for the
new name would replace the text in `Logo.tsx`.

## Current state

- Builds clean: `npm run build`, `npm run lint`, `npx tsc --noEmit` all pass.
- `main` is pushed and up to date with origin.
- Site runs in **preview mode** by default: "illustrative only" banner shown,
  `robots.txt` disallows all, enquiry form stores nothing.

## Deployment: two branches, two shapes

The Hostinger account (`abdullahsheikh18@gmail.com`, accessed via collaborator
login) is on the **Single** plan, which cannot run Node. So there are two shapes:

- `main` — Node server. Needs Business/Cloud/VPS. Hostinger builds with
  `npm run build` and applies `output: 'standalone'` itself — do not set that in
  `next.config.ts`.
- `static-export-hostinger` — `output: "export"` to `out/`, uploaded to
  `public_html`. Deployable on the current plan. `src/app/api/*` is deleted
  there, so the enquiry form captures nothing until
  `NEXT_PUBLIC_FORM_ENDPOINT` points at a CRM. The owner intends to wire a CRM
  in later; that variable is the single swap point.

Full comparison table and the environment-variable table are in
README → Deployment.

The Hostinger MCP connector is installed on the account and works in claude.ai
chat, but as of 24 Sept 2026 it only ever reached a Code session as status
`pending` — never `connected`, so its tools were never callable here. Check
`session_connectors_status` rather than assuming either way. The working route
was the **Claude in Chrome** extension driving hPanel directly.

`NEXT_PUBLIC_*` values are baked in at build time — they must be set in the host
before the first build, and changing one needs a redeploy.

## Standing constraint: no fabricated evidence

This site must not carry invented proof. Specifically excluded, deliberately:

- Client logos for real companies (Google, Revolut, Gartner, HCL and similar
  appear in the source Figma file as template placeholders — the agency has no
  relationship with them; using them would be false endorsement).
- Testimonials, star ratings and the Clutch badge — no approved material exists.
  Avicenna Enterprise's real testimonials are for a different brand and a
  different service (software delivery), so they don't transfer.
- Invented pricing tiers, dollar figures or scarcity claims — pricing is
  quote-based.

The hero funnel now carries **real figures** (26 Oct 2026), so the old
`siteMode === "preview"` gate is gone — these belong on the live site:

- **113 contacted** — the 120 lead records in Salesforce less eight named
  "Unknown" (four with no contact details at all), two test rows and the
  owner's own record.
- **10 meetings booked, 5 closed** — counted by hand from email and Telegram,
  which is where those conversations happened.
- Period March–October 2026, stated in the figure's caption.

The mockup's other numbers (1,250 leads, 375 meetings, 89 deals, the "vs last
month" deltas and "+72% pipeline value") are **deleted**, not gated: no prior
period was ever recorded, so nothing could support them. The "Qualified" band
went too — every Salesforce lead is still at status "New", so there was no
number to put in it.

Any change to these needs the same treatment: a real source, and the basis
shown on screen.
