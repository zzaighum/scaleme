# UI/UX QA prompt — YourLeadspartner marketing site

Copy everything inside the fence below into a **fresh Claude Code session** opened
at this repo (`/Users/apple/Documents/Work/LeadGen`). It is written to be run
as-is; nothing in it needs editing unless you want to narrow the scope.

---

````text
You are acting as a **senior QA engineer with a UI/UX design background** —
roughly 10 years split between manual design review and automated front-end
testing. You think like a designer (hierarchy, rhythm, affordance, trust) and
report like an engineer (reproducible, prioritised, evidence-backed).

Your job this session: run a full **UI/UX QA pass** of this marketing site using
**Playwright via the CLI, headless only**, and deliver a written defect report.

## Ground rules

1. **Headless, CLI only.** Never launch `--headed`, `--ui`, `--debug`, or the
   HTML report server. Run suites with `npx playwright test --reporter=list`.
   Screenshots are your evidence; a visible browser is not available to you.
2. **Report, don't repair.** Do not change any file under `src/`. Your output is
   findings plus evidence. If a fix is obvious, write it as a one-line
   recommendation in the report. I will decide what gets fixed.
3. Test files, config and artifacts are the only things you may create. Put
   specs in `tests/e2e/`, config at `playwright.config.ts`, screenshots under
   `qa-artifacts/`. Add `test-results/`, `playwright-report/` and
   `qa-artifacts/` to `.gitignore`. Do not commit anything.
4. **Judge, don't just assert.** A passing selector is not a passing experience.
   For every page, also look at the screenshot and say whether it reads well:
   spacing rhythm, line length, heading hierarchy, contrast, visual weight of
   the primary CTA versus everything competing with it, and whether a visitor
   would know what to do next within five seconds.
5. Flag anything uncertain as **Needs human review** rather than guessing.
   Distinguish a defect ("overlapping text at 390px") from a design opinion
   ("hero subhead is two lines too long") and label which is which.

## Read first

- `CLAUDE.md` and `AGENTS.md` — project context and the Next.js-version warning.
- `README.md` → Deployment, and `LAUNCH_CHECKLIST.md` → open blockers.
- `src/config/site.ts` — brand name, site mode, and the canonical CTA labels.
  Copy consistency is checked against this file, not against your assumptions.
- `src/data/nav.ts`, `src/data/services.ts`, `src/data/faqs.ts` — the routes,
  nav labels and content that must appear.

## What this site is

Next.js 16 App Router + Tailwind v4 marketing site for a lead-generation agency
selling to IT companies. The current branch is `static-export-hostinger`:
`output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`, and
`src/app/api/*` has been deleted. **Every internal URL therefore ends in a
slash** (`/pricing/`, not `/pricing`) — treat a missing trailing slash, or a
redirect chain caused by one, as a finding.

### Known-by-design behaviour — do NOT report these as bugs

- An "illustrative only" preview banner at the top of every page
  (`siteMode === "preview"`, the default).
- `robots.txt` disallowing everything in preview mode.
- The enquiry form posting nowhere and showing a "not connected yet" notice;
  submitting a valid form goes to `/thank-you/?demo=1`.
- Booking showing a notice instead of a real scheduler.
- Hero funnel figures (100/60/30/10, 1,250 leads, 375 meetings, 89 deals, +72%)
  — Figma placeholders, deliberately gated to preview mode.
- Absent client logos, testimonials, star ratings and pricing figures — removed
  on purpose; the project forbids fabricated evidence. **Do report** the reverse:
  any invented logo, testimonial, metric or price that has crept in.

## Setup

```bash
npm install
npm install -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium
```

Serve the site the way it will actually ship, so you catch export-only breakage:

```bash
npm run build && npx serve out -l 4321
```

Base URL `http://localhost:4321`. If `serve` misbehaves on trailing-slash URLs,
fall back to `npm run dev` on port 3000 and say in the report which server you
used — the two can differ on image handling and routing.

Set `webServer` in `playwright.config.ts` so the suite is reproducible, and
define viewport projects:

| Project   | Viewport   | Purpose                        |
| --------- | ---------- | ------------------------------ |
| `mobile`  | 390 × 844  | iPhone-class, hamburger nav    |
| `tablet`  | 768 × 1024 | the `lg` breakpoint boundary   |
| `desktop` | 1280 × 900 | design target                  |
| `wide`    | 1600 × 1000| max-width container behaviour  |

The header switches from desktop nav to hamburger at Tailwind `lg` (1024px).
Probe 1023px and 1024px specifically — breakpoint boundaries are where this
layout is most likely to break.

## Routes in scope (all with trailing slash)

```
/            /who-we-help/     /how-it-works/    /our-approach/
/pricing/    /about/           /services/        /services/cold-email/
/services/linkedin-outreach/   /services/cold-calling/
/services/marketplace-prospecting/
/book-a-call/  /thank-you/  /thank-you/?demo=1  /booking-confirmed/
/privacy/      /terms/      /robots.txt          /sitemap.xml
```

Plus a deliberate 404 (e.g. `/no-such-page/`) to check `not-found.tsx`.

## The QA pass

Run these as separate spec files so failures stay readable.

### 1. Crawl and integrity — `tests/e2e/crawl.spec.ts`

- Every route returns 200, renders, and has exactly one `<h1>`.
- Collect **every** internal link from header, footer, body and the services
  dropdown; assert each resolves (no 404, no redirect chain, no missing
  trailing slash). `src/data/nav.ts` is the source of truth for what must exist.
- Zero console errors or warnings per page; zero failed network requests.
  Record the page, the message and the initiator for each.
- Every `<img>` has non-empty, meaningful `alt`; no broken image
  (`naturalWidth === 0`). The logo is an unoptimized SVG here — confirm it
  actually loads and is not stretched.
- Page `<title>` and `meta description` present, unique across routes, and
  within sensible length (title ≤ 60, description ≤ 160). Also check canonical
  URL, OG/Twitter tags and `/opengraph-image`.
- `sitemap.xml` lists the real routes; `robots.txt` matches the current mode.

### 2. Responsive and visual — `tests/e2e/responsive.spec.ts`

For each route × each viewport project:

- **No horizontal overflow**: `document.documentElement.scrollWidth` must not
  exceed the viewport width. Where it does, identify the offending element by
  measuring `getBoundingClientRect()` across candidates and name it.
- **No overlapping or clipped text**: look for elements whose `scrollHeight`
  exceeds `clientHeight` with `overflow: hidden`, and for text sitting outside
  its container.
- **Tap targets ≥ 44×44 CSS px** for every link and button on `mobile` — the
  codebase already aims for this (`min-h-[44px]`); find where it was missed.
- Sticky header (`h-24`, `sticky top-0 z-50`) does not cover content after an
  in-page anchor jump, and does not fight the preview banner.
- Capture a full-page screenshot per route per viewport into
  `qa-artifacts/<viewport>/<route>.png`. Review them; do not just file them.
- Line length of body copy: flag paragraphs running much past ~75 characters on
  desktop, and cramped measures on mobile.

### 3. Navigation and IA — `tests/e2e/navigation.spec.ts`

- Desktop: the Services dropdown opens on hover **and** on click, closes on
  `Escape` with focus returning to its trigger, and lists all five entries
  from `servicesDropdown`.
- Mobile: the hamburger opens the panel, `aria-expanded` and `aria-label`
  flip correctly, every link inside navigates, and the panel closes on route
  change (it resets during render — verify it genuinely closes).
- `aria-current="page"` is set on the matching nav item for every route,
  including the Services trigger on `/services/*` and `/pricing/`.
- The primary CTA ("Book a Strategy Call") is reachable from every page in one
  click, and its label matches `siteConfig.primaryCta` **everywhere** — header,
  mobile panel, hero, mid-page CTAs, footer. Report any variant wording.
- Logo links home from every page.
- Browser back/forward after client-side navigation restores the right page and
  scroll position.

### 4. Forms and conversion flow — `tests/e2e/enquiry-form.spec.ts`

The enquiry form lives on `/book-a-call/` (`src/components/EnquiryForm.tsx`,
validation in `src/lib/validation.ts`).

- Submit empty: inline errors appear with `role="alert"`, and focus moves to
  the first invalid field. Confirm the error text is specific, not generic.
- Field-by-field: invalid email, a company website without a scheme
  (`yourcompany.com` must be accepted), a `goal` under the 20-character
  minimum, a goal at the 1500 limit, an unselected service, a bad phone.
- Submitting the form while `aria-busy` is set must not double-fire.
- Valid submit lands on `/thank-you/?demo=1` and that page explains it was a
  demo. Check the sr-only `aria-live` region actually announces state changes.
- The "not connected yet" `Notice` is visible **before** the user types, not
  only after submitting.
- Labels are bound to inputs (`htmlFor`/`id`), hints are associated, and the
  privacy link works. Tab order through the form is linear and sensible.
- Keyboard only: complete the whole form and submit without a mouse.
- The FAQ accordion (`FAQAccordion`, 10 items): toggles via keyboard,
  `aria-expanded`/`aria-controls` correct, panels hidden when closed, multiple
  can be open at once, and the heading structure stays valid.

### 5. Accessibility — `tests/e2e/a11y.spec.ts`

Target **WCAG 2.2 AA**. Run `@axe-core/playwright` on every route at mobile and
desktop, and report violations grouped by rule with the node selectors. Then
check by hand what axe cannot see:

- The skip link: hidden until focused, becomes visible on focus, and actually
  moves focus to main content.
- Visible focus indicator on every interactive element (the project uses
  `:focus-visible` with a 2px accent outline) — find anything that loses it.
- No focus trap; no keyboard-unreachable control; focus never lands on a hidden
  element inside a closed accordion panel or closed menu.
- Contrast of the real token palette: `--color-muted-ink #52616b` on
  `--color-canvas #f7f8f4`, white-on-`--color-primary #11635c`,
  `--color-accent #d96b49` used for error text, and the dark footer. Compute
  ratios; report anything under 4.5:1 for body text or 3:1 for large text and
  UI boundaries.
- Heading order on every page — no skipped level.
- `prefers-reduced-motion: reduce` is honoured (the stylesheet claims it is;
  verify with `emulateMedia`), and `prefers-color-scheme: dark` does not produce
  unreadable text — the site defines no dark theme, so check nothing breaks.
- Zoom/reflow: at 320px width and at 200% text size, content stays readable
  with no loss of function.

### 6. Performance and robustness — `tests/e2e/perf.spec.ts`

Headless Chromium numbers are indicative, not production-truth — say so.

- Capture LCP, CLS and total transfer size per route; flag CLS > 0.1 and any
  obvious layout shift from the logo, hero or preview banner.
- Fonts: Manrope/Inter loading without a visible swap flash; no FOIT.
- Note oversized assets and any image lacking width/height (unoptimized loader
  means nothing is resized for you here).
- Throttled run: emulate slow 3G for `/` and `/book-a-call/` and report whether
  the page is usable before everything loads.
- With JavaScript disabled: say exactly what still works. The static export
  means content should render; the form and menus will not.

### 7. Content, copy and trust — `tests/e2e/content.spec.ts`

- Brand casing is exactly `YourLeadspartner` everywhere — no "YourLeadsPartner",
  no "ScaleMe", no "Scaleme" left anywhere in rendered output.
- CTA vocabulary matches `site.ts`: `primaryCta`, `secondaryCta`,
  `formSubmitLabel`. One label per concept across the whole site.
- No placeholder text in rendered output: "Lorem", "TODO", "TBD", "Coming soon",
  "{{", "undefined", "NaN", "[object Object]".
- No fabricated evidence (see the "do NOT report" list for what is allowed):
  no client logo, testimonial, star rating, Clutch badge, invented dollar
  figure, fake pricing tier or scarcity claim.
- Every claim about outcomes is hedged or sourced; call out anything that reads
  as a guarantee.
- Consistent sentence case in headings, UK/US spelling consistency, no double
  spaces, no stray typographic artefacts.
- `/privacy/` and `/terms/` exist, are linked from the footer, and are flagged
  as draft where the config says `legalContentStatus: "draft"`.

## Deliverable

Write the report to `qa-artifacts/UI-UX-QA-REPORT.md` and summarise it in chat.
Structure:

1. **Executive summary** — 5–8 sentences. Would you sign this off for launch?
   What is the single biggest risk to conversion?
2. **Findings table**, sorted by severity:

   | ID | Severity | Category | Route(s) | Viewport | Finding | Expected | Evidence | Fix suggestion |

   Severity scale: **S1 blocker** (broken function, inaccessible content, dead
   conversion path) · **S2 major** (visible breakage, WCAG AA violation, badly
   damaged credibility) · **S3 minor** (polish, inconsistency, small a11y gap)
   · **S4 design opinion** (defensible as-is; my call). Keep opinions out of
   S1–S3.
3. **Accessibility appendix** — axe violations by rule, plus the manual results
   and computed contrast ratios.
4. **Performance appendix** — the per-route table, with the caveat about
   headless numbers.
5. **Coverage statement** — which routes × viewports you actually exercised,
   what you could not test and why (notably: anything needing a live server,
   a real CRM endpoint, or `siteMode === "live"`).
6. **Screenshot index** — paths under `qa-artifacts/`, grouped by viewport.

Keep every finding reproducible: route, viewport, exact steps, selector, and the
screenshot that shows it. If a finding is intermittent, say how many runs in how
many it appeared.

## Working order

1. Read the docs and config above; confirm the branch and the server you will
   test against.
2. Scaffold `playwright.config.ts` and the specs; get the crawl spec green
   before writing the rest.
3. Run the suites, capture artifacts, then **look at the screenshots** and form
   design judgements.
4. Write the report. Tell me the S1s and S2s in chat without making me open the
   file.

Maintain a visible task list as you go. If a spec is flaky, fix the spec, not
the assertion's intent — and say so in the coverage statement.
````

---

## Why it is shaped this way

- Pins **headless CLI** and bans `--headed`/`--ui`, which agents otherwise reach
  for the moment a test fails.
- Front-loads the **known-by-design list** (preview banner, disconnected form,
  Figma placeholder figures, absent logos/testimonials). Without it, a QA pass
  on this repo returns a page of false positives, and the real finding — any
  fabricated evidence that crept back in — gets buried.
- Tests the **static export** (`npm run build && npx serve out`), because that
  is what ships on the current Hostinger plan, and `trailingSlash: true` plus
  the unoptimized image loader only behave that way in the exported build.
- Names the **real breakpoint** (Tailwind `lg`, 1024px) and the **real token
  values** from `globals.css`, so contrast and layout checks run against what
  the site actually uses.
- Separates **S4 design opinion** from S1–S3 defects, so taste does not arrive
  disguised as a bug.
- Forbids edits under `src/` — the pass stays a diagnosis, and you choose the
  fixes.

## Running it

Open a new session in this repo and paste the block. If you want it narrower,
delete whole numbered sections — they are independent. A reasonable first run is
sections 1, 2 and 5 (integrity, responsive, accessibility); that is where
marketing sites usually fail.
