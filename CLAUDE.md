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

## Next task: deploy to Hostinger

Not started. Needs **Business Web Hosting** or a **Cloud** plan (basic/shared
can't run Node). Hostinger builds with `npm run build` and applies
`output: 'standalone'` itself — do not set that in `next.config.ts`.
Full steps and the environment-variable table are in README → Deployment.

A Hostinger MCP connector was expected but has never been visible to a session
here. Check with `session_connectors_status` before assuming it exists; if it's
absent, deployment is done by the user in hPanel (GitHub deploy is wired up and
the repo is pushed).

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
