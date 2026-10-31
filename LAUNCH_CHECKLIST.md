# Launch checklist

Everything below is a real gap, not a routine build decision — each needs a fact or
an action from the business owner (or a paid provider account) that this build
could not supply on its own. Nothing here blocks continuing local development or
using the preview.

## Brand and legal identity

- [ ] Run domain, trademark and company-register checks on "Your Leads Partner"
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
- [x] `NEXT_PUBLIC_SITE_URL=https://yourleadspartner.com` — domain confirmed by
      the owner on 26 Oct 2026 and set in `.env.local`.

      **On this branch there is no "set env vars in Hostinger" step.** The build
      runs locally and only `out/` is uploaded, so the `.env.local` on whichever
      machine builds *is* the configuration. (The hPanel environment-variable
      screen applies to `main`, where Hostinger runs the build itself.) The
      consequence: whoever builds needs the right `.env.local`, and any change
      means a rebuild and re-upload, because `NEXT_PUBLIC_*` is inlined at build
      time. Until it is set, every
      `<link rel="canonical">`, every `og:image`/`twitter:image` and all 14
      `<loc>` entries in `sitemap.xml` read `http://localhost:3000`. Everything
      else about those URLs is already correct — they carry the right trailing
      slash — so this is the one value standing between them and being right.
- [ ] Confirm the `.com` in the logo wordmark. `public/logo.svg` reads
      "Your Leads Partner.com" while the brand name everywhere else, and the image
      `alt`, read "Your Leads Partner" with no TLD. If the domain is not secured,
      either register it or drop `.com` from the artwork, so the site does not
      assert a domain nobody owns.
- [ ] After deploying, confirm the host returns `Content-Type: image/png` for
      `/opengraph-image`. Next exports it without a file extension, so
      `public/.htaccess` sets the type with `ForceType`; a plain static file
      server ignores `.htaccess`, so this can only be checked on the real host.
      Without it, LinkedIn, Slack and X will not render a preview card.

## Deploying to Hostinger — what the UI actually does

Learned by doing it on 27 Oct 2026. Three things are not obvious:

1. **The hosting is not on the owner's own hPanel login.** `yourleadspartner.com`
   sits under "Shared with you" / Single Web Hosting, owner
   `abdullahsheikh18@gmail.com`, reached by collaborator access. A login that has
   no share shows the *buy hosting* empty state, not an error — if hPanel offers
   to sell you a plan, you are in the wrong account.

2. **File Manager's Extract demands a folder name**, so it always writes to
   `<destination>/<name>`. To land files directly in `public_html`, navigate the
   destination picker up to the parent (`..`, double-click — one click only
   selects) and type `public_html` as the name. Tick **Overwrite existing
   files**, or the old build survives untouched.

3. **Hostinger's CDN "Flush cache" does not purge the Cloudflare edge.** It
   reports "Cache is successfully purged" and the stale object keeps serving,
   with `cf-cache-status: HIT` and a steadily rising `age`. Static files carry
   `max-age=14400`, so a changed `robots.txt` can serve the old copy for four
   hours. HTML is not edge-cached, so pages go live immediately; `.txt`, and
   anything else already fetched once, may not.

   **Always read origin truth with a cache-buster** — `curl .../robots.txt?v=1`
   bypasses the cached object. A plain `curl` can report a file you deleted
   minutes ago, or miss one you just uploaded. To force the edge to drop
   everything now, turn on CDN **Development mode** (Performance → CDN), which
   bypasses the cache for three hours; otherwise wait out the TTL.

Also: anything left in `public_html` is served publicly. An upload archive is a
live download at `https://yourleadspartner.com/<name>.zip` until it is deleted.

## Deploying to Hostinger — the exact sequence

The build runs **on your machine**; Hostinger only serves files. So `.env.local`
here is the production configuration, and every change to it needs a rebuild and
re-upload. There is no environment-variable screen to set on this plan.

1. **Confirm `.env.local` is the production configuration.** It must read:

   ```
   NEXT_PUBLIC_SITE_MODE=live
   NEXT_PUBLIC_SITE_URL=https://yourleadspartner.com
   NEXT_PUBLIC_LEGAL_BUSINESS_NAME=Your Leads Partner
   NEXT_PUBLIC_CONTACT_EMAIL=abdullah@avicennaenterprise.com
   NEXT_PUBLIC_BOOKING_URL=https://calendly.com/yourleadspartner/30min
   NEXT_PUBLIC_FORM_ENDPOINT=https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8
   NEXT_PUBLIC_SALESFORCE_ORG_ID=00Dd500000D1Unn
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lea8wEuAAAAAHC6S4qedq8B46WZr3JY_uSmpWUw
   NEXT_PUBLIC_RECAPTCHA_KEY_NAME=LeadsPartnerWeb
   ```

   `NEXT_PUBLIC_WEB_TO_LEAD_DEBUG_EMAIL` must be **absent or blank**, or
   Salesforce emails the submission instead of creating a Lead.

2. **Check nothing points at localhost.** A local-test build leaves `retURL` and
   the canonical URLs pointing at `http://localhost:4173`:

   ```
   npm run build && grep -rl "localhost" --include="*.html" --include="*.txt" --include="*.xml" out/ | head
   ```

   That must print nothing. If it prints files, a stale env override is in play —
   rebuild in a fresh shell.

3. **Run the checks.** `npx playwright test --reporter=list` — expect 286 passed.
   If a stale server is holding port 4321 the run hangs; `pkill -f "serve out"`
   clears it.

4. **Enable SSL in hPanel first.** `public/.htaccess` force-redirects HTTP to
   HTTPS. Upload before the certificate exists and the site redirects in a loop.

5. **Upload the *contents* of `out/` to `public_html`** — not the `out` folder
   itself. `public_html/index.html` must exist, not `public_html/out/index.html`.
   Include the dotfile: **`.htaccess` is hidden**, and hPanel's File Manager
   needs "show hidden files" on or it will be silently skipped, costing you the
   404 page, the HTTPS redirect, the caching rules and the OG image MIME type.

6. **Verify on the live domain**, in this order:
   - `https://yourleadspartner.com/` loads over HTTPS with no mixed-content warnings
   - `https://yourleadspartner.com/pricing/` loads directly (tests `.htaccess`
     directory serving, not just client-side navigation)
   - `https://yourleadspartner.com/no-such-page/` shows the styled 404
   - `curl -sI https://yourleadspartner.com/opengraph-image | grep -i content-type`
     returns `image/png` — only verifiable on the real host
   - `https://yourleadspartner.com/robots.txt` reads `Allow: /`

7. **One real enquiry.** Submit the form on the live site, tick the challenge,
   confirm you land on `/thank-you/?sent=1`, then confirm the Lead appears in
   Salesforce owned by Muhammad Abdullah. Delete the test Lead afterwards.

   If you land on the thank-you page but no Lead appears, it is almost always
   reCAPTCHA: Salesforce discards silently and the visitor still sees success.

## Enquiry capture via Salesforce Web-to-Lead (static branch)

The site side is built and verified; these are the steps that need doing in
Salesforce and in the host, in order.

- [x] **reCAPTCHA key pair created** in Salesforce under the name
      `LeadsPartnerWeb`, with server fallback enabled.
- [ ] Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` to the key pair's **site** key and
      `NEXT_PUBLIC_RECAPTCHA_KEY_NAME` to `LeadsPartnerWeb`. The secret key
      belongs only in Salesforce — a `NEXT_PUBLIC_` variable is compiled into
      the browser bundle and readable by anyone.
- [x] reCAPTCHA key domains confirmed by the owner, 26 Oct 2026: the
      `LeadsPartnerWeb` key is registered for `yourleadspartner.com` only.
      Google covers all subdomains of a registered domain automatically, so
      `www.yourleadspartner.com` works too.
- [ ] **Do not soft-launch on a Hostinger temporary domain.** A
      `*.hostingersite.com` address is a different domain, not a subdomain, so
      the reCAPTCHA token fails there and Salesforce discards every enquiry —
      silently, while the visitor still sees the confirmation page. Point the
      real domain at the site before accepting live traffic, or add the
      temporary host to the key first.
- [ ] Uncomment the Salesforce block in `.env.local` (`FORM_ENDPOINT`,
      `SALESFORCE_ORG_ID`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_KEY_NAME`), then
      rebuild and re-upload `out/`. Left commented, the form stays an
      illustrative demo and the QA suite keeps testing that default.
- [x] `NEXT_PUBLIC_SITE_URL` also builds the `retURL` Salesforce redirects to
      after a submission — now `https://yourleadspartner.com/thank-you/?sent=1`.
- [ ] Optional: create a custom field on Lead for the main IT service and set
      `NEXT_PUBLIC_SALESFORCE_SERVICE_FIELD_ID`. Lead has no stock field for it,
      so until then the service the visitor picked is not sent.
- [ ] **End-to-end test.** The reCAPTCHA key now lists `localhost` as well as
      `yourleadspartner.com` (owner, 27 Oct 2026), so the widget renders locally
      and the pipeline can be rehearsed on a local build before deploying. The
      submission itself still has to be a real one — Salesforce rejects a stale
      or absent `captcha_settings.ts`, so there is no way to fake the step. In
      order:

      1. Uncomment the Salesforce block in `.env.local`.
      2. Add `NEXT_PUBLIC_WEB_TO_LEAD_DEBUG_EMAIL=abdullah@avicennaenterprise.com`.
         In debug mode Salesforce emails the raw POST and creates **no** Lead.
      3. `npm run build`, upload the contents of `out/` to `public_html`.
      4. Submit the form at `https://yourleadspartner.com/book-a-call/`.
      5. Check the email. Confirm `last_name`, `email`, `company`, `URL`,
         `phone`, `description`, `lead_source` and a non-empty `ts` inside
         `captcha_settings`. An empty `ts` means the reCAPTCHA wiring is wrong.
      6. Remove the debug variable, rebuild, re-upload.
      7. Submit once more and confirm a real Lead appears in Salesforce, owned
         by Muhammad Abdullah. Delete the test Lead afterwards.

      If step 4 redirects to `/thank-you/?sent=1` but step 7 produces no Lead,
      the cause is almost always reCAPTCHA: Salesforce discards silently and the
      visitor still sees the confirmation.
- [ ] Set a Default Response Template under Web-to-Lead Settings, or enquirers
      get no acknowledgement from Salesforce at all. Draft copy below — create it
      as an email template in Salesforce (Setup > Email Templates), then select
      it as the Default Response Template.

      **Subject:** We have your brief — Your Leads Partner

      ```
      Hi {!Lead.LastName},

      Thanks for sending your brief. This is an automatic note so you know it
      arrived.

      We will read what you have told us about {!Lead.Company} and come back to
      you. If you would rather go straight to a conversation, you can book a
      30-minute strategy call here:

      https://calendly.com/yourleadspartner/30min

      On that call we go through your offer and current pipeline, the accounts
      and markets you want to reach, and whether a programme fits your next
      step. It is not a technical audit.

      If anything has changed since you wrote in, just reply to this email.

      Your Leads Partner
      abdullah@avicennaenterprise.com
      ```

      Two things to know about that copy:

      - It uses `{!Lead.LastName}`, not `{!Lead.FirstName}`. The site has one
        "Full name" field that posts as `last_name`, so LastName holds the whole
        name and FirstName is empty — `{!Lead.FirstName}` would render "Hi ,".
      - It deliberately promises **no response time**. The site never commits to
        one, so the acknowledgement should not either. Add one only if you are
        confident you can meet it.
- [ ] Note the known gap: a Lead is created, and the Calendly booking is a
      separate record with nothing joining the two. The native Calendly
      integration would join them but needs Salesforce Enterprise edition; this
      org is Starter.

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

- [x] Calendly link set: `https://calendly.com/yourleadspartner/30min` (30
      Minute Meeting, Google Meet). Verified rendering in live mode; in preview
      the illustrative notice shows instead, by design.
- [x] Booking availability reviewed and **deliberately left narrow** (owner's
      decision, 26 Oct 2026): one 30-minute slot per weekday at 17:00 Pakistan
      time, five a week. Suits a low volume of high-intent calls while the site
      is in preview. Revisit if the site starts sending real traffic — two
      prospects wanting the same day currently cannot both book.
- [ ] "Connected" booking mode (authenticated provider webhook, verified booking
      confirmation on `/booking-confirmed`) is **not implemented** — no provider
      was confirmed in the brief. If wanted later, it needs: a chosen provider with
      a webhook or server API, a documented adapter, event-authenticity
      verification, dedup by event ID, and lead matching. Until built,
      `/booking-confirmed` always shows the neutral state, which is correct and
      truthful for external mode.

## Evidence and content

- [x] **Hero funnel figures replaced with real ones** (26 Oct 2026): 113
      contacted, 10 meetings booked, 5 closed, March–October 2026, with the
      basis stated in the figure caption. The mockup's volumes, the "vs last
      month" deltas and the "+72% pipeline value" card were deleted outright —
      no prior period exists to support them — and the "Qualified" band was
      removed because nothing records that stage.

- [x] **Hero channel chips re-labelled** (26 Oct 2026) to the four real
      channels: Email, LinkedIn, Calling, Marketplaces. The mockup's Website,
      Paid Ads and Referrals are gone.

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
