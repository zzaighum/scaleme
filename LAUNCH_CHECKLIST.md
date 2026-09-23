# Launch checklist

Everything below is a real gap, not a routine build decision — each needs a fact or
an action from the business owner (or a paid provider account) that this build
could not supply on its own. Nothing here blocks continuing local development or
using the preview.

## Brand and legal identity

- [ ] Run domain, trademark and company-register checks on "YourLeadspartner"
      before launch. The name is now set as the build default, but no clearance
      search has been done on it — the brief's earlier naming research was a
      limited web screen (16 Sept 2026) covering different candidates entirely.
      Override without a code change via `NEXT_PUBLIC_BRAND_NAME`.
- [ ] Register/confirm the real legal business name and set
      `NEXT_PUBLIC_LEGAL_BUSINESS_NAME` (shown in the footer copyright line).
- [ ] Supply a monitored public contact email and set `NEXT_PUBLIC_CONTACT_EMAIL`
      (used in the footer and as a fallback on `/thank-you` when no scheduler is
      configured).
- [ ] Complete and legally approve `/privacy` and `/terms` — both currently render
      a visible "Draft — not for publication" notice with placeholder fields
      (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`). Set
      `legalContentStatus` in `src/config/site.ts` away from `"draft"` only once
      real, approved text replaces the placeholder fields.
- [ ] Decide and record a real data-retention period, governing law/jurisdiction,
      and cookie/tracking claim before publishing the legal pages — none of these
      were invented, so none currently exist on the site.
- [ ] Register the final domain and set `NEXT_PUBLIC_SITE_URL` (used for canonical
      URLs, the sitemap, and the OG image).

## Enquiry storage (Supabase)

- [ ] Create a Supabase project and run
      [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
- [ ] Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-only secrets in
      the hosting platform (never `NEXT_PUBLIC_*`).
- [ ] Set `RECEIPT_SIGNING_SECRET` (`openssl rand -hex 32`) so `/thank-you` receipts
      keep validating across deploys/restarts.
- [ ] Load-test or at least manually verify the rate limiter and idempotency path
      against the real database — only verified against the validation logic and a
      local Postgres-shaped mock of the RPC contract, not a live Supabase instance.
- [ ] Decide a real data-retention period for the `enquiries` table and implement
      it (e.g. a scheduled deletion job) — none exists yet.

## Notifications

- [ ] Provide a real `NOTIFICATION_WEBHOOK_URL` (Slack/Zapier/Make/your own mailer)
      and confirm it actually reaches whoever owns follow-up. Until this is set,
      enquiries are still captured, but no one is notified automatically — the
      `notification_error` column on each row records the miss for manual review.
- [ ] This build sends one notification attempt per enquiry and records failure on
      the row; it does not implement a background retry queue. If guaranteed
      delivery matters, add one (e.g. a scheduled job that re-sends rows where
      `notification_error` is set and `notified_at` is null).

## Booking

- [ ] Decide on a scheduling provider, get a real hosted booking link, and set
      `NEXT_PUBLIC_BOOKING_URL`. Until then the scheduling area is hidden and
      `/thank-you` falls back to the configured contact email (or nothing, if that
      isn't set either).
- [ ] "Connected" booking mode (authenticated provider webhook, verified booking
      confirmation on `/booking-confirmed`) is **not implemented** — no provider
      was confirmed in the brief. If wanted later, it needs: a chosen provider with
      a webhook or server API, a documented adapter, event-authenticity
      verification, dedup by event ID, and lead matching. Until built,
      `/booking-confirmed` always shows the neutral state, which is correct and
      truthful for external mode.

## Evidence and content

- [ ] **Hero funnel figures are mockup placeholders.** The percentages on the
      funnel bands (100/60/30/10) and the floating cards (1,250 new leads, 375
      meetings booked, 89 deals closed, +72% pipeline) are reproduced from the
      Figma mockup so the build matches it one-to-one for review. They are not
      real YourLeadspartner results. They are gated on `siteMode === "preview"` in
      `src/components/ProcessIllustration.tsx`, so switching
      `NEXT_PUBLIC_SITE_MODE` to `live` drops them automatically — but before
      launch, decide whether to replace them with real reported figures or
      leave them off permanently.
- [ ] **Hero channel chips name channels we don't sell.** The funnel graphic
      labels five acquisition channels from the mockup (LinkedIn, Email,
      Website, Paid Ads, Referrals). Only email, LinkedIn and calling are
      actually in scope; "Website" and "Paid Ads" are not services YourLeadspartner
      offers. Re-label these to the real four channels before launch.
- [ ] Testimonials, case studies, and a team/founder module are all switched off
      (`testimonialsEnabled`, `caseStudiesEnabled`, `teamEnabled` in
      `src/config/site.ts`) because no approved material exists yet. Avicenna
      Enterprise's testimonials concern a different brand and a different service
      (software delivery, not lead generation) and must not be reused here without
      explicit permission and a truthful attribution.
- [ ] When real case evidence exists, each item needs: the original business/service,
      exact approved text or metric, reviewer/client attribution, timeframe,
      source, its relationship to this agency, and documented permission — per the
      brief's evidence-item contract.
- [ ] Confirm service-claim capacity matches what's described (worldwide reach,
      four channels, etc.) before launch — this build only implements the copy the
      brief supplied; it cannot verify real delivery capacity.

## Testing not possible without live credentials

- [ ] Full Supabase integration test: real insert, rate-limit RPC under concurrent
      requests, and confirmation that RLS actually blocks anon/public access.
- [ ] Real notification webhook delivery and formatting.
- [ ] Real booking link end to end (external mode) — the click-tracking redirect
      itself was tested; the destination scheduler was not, since none is
      configured yet.
- [ ] Tooled accessibility scan (e.g. axe-core/Lighthouse) and a performance/CWV
      pass on a real deployment. A manual accessibility pass was done (landmarks,
      skip link, focus-visible states, labelled fields with hints/errors,
      keyboard-operable menus and accordions, `prefers-reduced-motion` support) —
      see README "What was verified".
- [ ] Cross-browser/device pass beyond desktop Chromium and a 375px mobile
      emulation (this build was checked in one browser engine only).

## Explicitly out of scope for this launch (per brief)

Client portal, outreach automation product, chatbot, newsletter, blog, ROI
calculator, payment checkout, multi-language support, and a custom CMS/admin
application are all deliberately not built — the brief scopes this as a small,
maintainable marketing site, and content is edited by changing the files listed in
the README rather than through an admin UI.
