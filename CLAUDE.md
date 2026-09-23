@AGENTS.md

# Project context

Marketing site for **YourLeadspartner**, a lead-generation agency selling to IT
companies. Next.js 16 (App Router) + TypeScript + Tailwind v4, Supabase Postgres
for enquiry storage in live mode. Repo: https://github.com/zzaighum/scaleme
(repo name still says `scaleme`, the previous brand name).

Read `README.md` for setup/architecture and `LAUNCH_CHECKLIST.md` for open
launch blockers. Brand, site mode and CTA labels all live in `src/config/site.ts`.

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

The hero funnel figures (100/60/30/10 percentages, 1,250 leads, 375 meetings,
89 deals, +72% pipeline) are Figma mockup placeholders reproduced for design
review. They are gated on `siteMode === "preview"` in
`src/components/ProcessIllustration.tsx` and disappear in live mode. Keep that
gate intact; if real figures ever replace them, they need a real source.
