# Apollo query — US companies with open tech roles (staff augmentation)

**Built and saved in Apollo on 28 Oct 2026** as the saved search
**"US Staff Aug - Tech Roles Posted 60d"**. Every number below is an observed
record count from the Apollo UI, not an estimate.

Final universe: **3,254 US companies**.

---

## The thesis this query encodes

A US company with engineering roles posted and still open is a company that has
budget approved, a hiring manager under pressure, and no one in the seat. That is
the staff-augmentation buying moment. The filters narrow to that and strip out the
three groups who will never buy: companies too small to have budget, companies big
enough to have a locked vendor list, and recruiters who only look like buyers.

---

## Part 1 — The company search, as built

Filters live under **Search → Companies → View 30+ Filters**. The job filter is
**Company Info → Job Postings**, and it is available on this account.

| Step | Filter | Value | Records |
|---|---|---|---|
| 1 | Job Postings → Currently hiring for | 18 role keywords (below) | 45,584 |
| 2 | Job Postings → Job located at | United States | 13,595 |
| 3 | Job Postings → Job Posted At | **60 Days Ago** (Timeframe, relative) | 8,629 |
| 4 | # Employees | 51–100, 101–200, 201–500, 501–1000 | 3,738 |
| 5 | Account Location → Headquarters | United States | 3,452 |
| 6 | Industry → exclude | staffing & recruiting | 3,281 |
| 7 | Industry → exclude | outsourcing/offshoring | **3,254** |

### The 18 role keywords

```
Software Engineer          Python Developer        Cloud Engineer
Senior Software Engineer   React Developer         iOS Developer
Full Stack Developer       DevOps Engineer         Android Developer
Software Developer         QA Engineer             Salesforce Developer
Backend Engineer           QA Automation Engineer
Frontend Engineer          Data Engineer
.NET Developer
Java Developer
```

---

## What testing the filter actually showed

**Seniority variants are wasted entries.** "Software Engineer" alone returned
20,747. Adding "Senior Software Engineer" returned 20,747 — zero new companies. A
control test (adding "Registered Nurse") moved the count to 28,200, which proves
the counter updates live and the zero was real. Apollo is matching a title family,
not a literal string, so prefix variants add nothing. "Senior Software Engineer"
is still in the saved search and is harmless; it can be removed.

**But the consequence matters for the copy.** Because the match is by title
family, a company in this list may have no posting literally called "Software
Engineer". Duolingo matched, and its five most recent postings are "Staff AI
Research Engineer", "Staff Product Designer, Monetization", "Senior Director of
Performance Marketing", "Data Scientist, Intern" and "AI Research Engineer, New
PhD Graduate". So **never write the email from the filter keyword.** Open the
company's **Job postings** tab and read the real title.

**The data is fresher than expected.** Duolingo's record showed 74 live postings
dated 23 and 25 October against a check on 28 October — three to five days old.
This was the main risk going in and it looks smaller than feared. Still spot-check
ten companies against their real careers pages before a bulk send; one fresh
record is not a sample.

**Recruiters are the big noise source — bigger than anticipated.** Before the
industry exclusions, page one of the results was Jobot, CyberCoders, BayOne
Solutions, Cypress HCM, Optomi, Hunter Bond and IDR Inc. All staffing firms, all
posting roles on behalf of clients, none of them buyers. Excluding staffing &
recruiting and outsourcing/offshoring cleared them.

**The headcount cap does real work.** Without it the top results were Google,
Amazon, LinkedIn, Microsoft, Deloitte, IBM, TCS, Apple, Accenture and Meta — every
one either unreachable or a direct competitor. Capping at 1,000 removed them
without needing a named-company exclusion list.

**Use Timeframe, not Date.** The "Job Posted At" control has two tabs. The **Date**
tab writes a fixed calendar date that silently goes stale; the **Timeframe** tab
writes "60 Days Ago", which re-evaluates every time the search runs. The saved
search uses Timeframe.

---

## Part 2 — The contact search, as built

Switching **Companies → People** carries every company filter across. Verified
28 Oct 2026. Persona 1 is saved as **"US Staff Aug - P1 Engineering Leaders"**.

### Trap: the carry-over silently widens headcount

On the switch, Apollo re-admitted employee bands that were never selected. The
company search had four (51–100 … 501–1000); People search came back with
**seven**, adding 1–10, 11–20 and 21–50. The URL confirmed it. Check the
`# Employees` chips immediately after switching and remove the extras, or the
whole "they have budget" premise quietly collapses.

### Use structured filters, not typed titles

The Job Titles filter has a **Simple/Advanced** toggle (Advanced takes Boolean),
quotation marks force an exact match, and **"Include people with similar titles"
is checked by default** — that is the fuzzy expander. Rather than fight it,
persona 1 was built from **Management Level + Department**, which is more robust
than enumerating title strings:

| Step | Filter | Value | People |
|---|---|---|---|
| 0 | (company filters only) | everyone at the 3,254 companies | 771,969 |
| 1 | Management Level | C-Suite + VP | 40,260 |
| 2 | Departments | Engineering & Technical | 4,341 |
| 3 | Management Level | + Head + Director | **12,822** |

That is ~3.9 contacts per company.

**Do not add the Information Technology department.** It was tested and pulls in
CISOs, security executives and internal-IT leaders — "CISO & CSO", "Security
Executive", "CISO in Residence". None of them buy development capacity. Dropping
it took the C-suite+VP count from 7,625 to 4,341, and everything removed was
noise. Engineering & Technical alone returns CTOs, VPs of Engineering, Chief
Engineering Officers and Directors of Engineering.

### Persona 2 — talent acquisition

Saved as **"US Staff Aug - P2 Talent Acquisition"**, built 28 Oct 2026.
Same company base. **2,934 contacts.**

The department filter has a second level. Expanding **Human Resources** reveals
ten sub-departments, one of which is **Recruiting & Talent Acquisition**. Use
that, not the HR parent — it is the difference between a list of recruiters and
a list of HR staff.

| Definition | People | What you actually get |
|---|---|---|
| HR parent, Director and above | 5,072 | Mixed: "Director - HR and Finance", "Head of People", "Director-HR" — generalists who do not own reqs |
| HR parent, + Manager level | 11,189 | Adds real recruiters, but also "Senior Manager, Learning", comp & benefits, HR ops |
| **Recruiting & TA sub-dept, C-suite → Manager** | **2,934** | Every result a recruiter: Lead Recruiter, Lead Technical Recruiter, Head of Talent Acquisition, Talent Acquisition Manager, Director of Talent Acquisition |

The narrow definition is less than a third the size of the broad one and is the
one to send to. Breadth here is not reach, it is waste.

Seniority distribution inside the sub-department is worth knowing: C-Suite 17,
VP 197, Head 313, Director 624, Manager 1.8K, Senior 2.2K. There is essentially
no "chief talent officer" to aim at — the weight is at Manager and below.

**Senior level (+2.2K) is the one open call.** Senior recruiters are individual
contributors who own the req day to day, so they are closer to the pain but
further from signing. Left out of the saved search; add it as a test segment
rather than folding it in.

The pain is different from persona 1 — "this req has been open 70 days", not
"the roadmap is slipping" — so this needs its own sequence, not a shared one.

### Before pulling contacts

- **Email Status: Verified only** — protects domain reputation.
- **Suppress the 120 existing Salesforce leads.**
- **15,756 contacts across both personas is far more than you need.** At one to
  two per company the target is 3,000–6,500. Rank by company first and reveal in
  batches; revealing everything would spend credits on companies you will never
  reach in a first campaign.

## Part 3 — Levers not yet pulled

- **Active job postings (Min/Max).** Sits right under the date range and takes a
  count. Untested — it is unclear whether it counts *all* postings at the company
  or only ones matching your keywords. Worth one test: if it counts only matches,
  a Min of 3 is a strong sharpener; if it counts everything, it just re-sorts by
  company size, which headcount already handles.
- **21–50 employees** adds roughly 842 companies at the point that band was
  visible. Excluded on the assumption they lack budget, but VC-backed startups in
  this band do buy contract development. Worth a separate small test segment
  rather than folding into the main list.
- **Aged-req variant.** Setting a *To* date as well — say postings from 90 to 21
  days old — targets reqs the company has already failed to fill. That is a
  sharper staff-aug signal than "posted recently", and a natural second segment.
- **Splitting by stack.** Separate saved searches per stack (.NET / Java / React /
  QA / Data) let each sequence lead with the specific discipline.

---

## Part 4 — What the signal buys you

The only reason to pay for this filter is to earn the first sentence:

> Saw you're hiring a Senior .NET Developer in Austin — that req's been live a
> while. We place vetted .NET engineers in ~2 weeks at roughly half a US loaded
> cost, contract, no placement fee.

If the campaign does not name the specific role, the filter was wasted and a plain
industry list would have performed the same. And per the finding above, the role
name has to come from the company's Job postings tab, not from the keyword list.

**Constraint carried over from the site work:** no invented numbers in the copy.
Any figure used here needs a real source, same rule as `CLAUDE.md`.

---

## Part 5 — Stack campaigns (built 28 Oct 2026)

Five saved searches, each a cut of the same company filter set with only the
job-title keywords changed. All other filters identical.

| Saved search | Keywords | Companies |
|---|---|---|
| `Stack - Data Engineering (US, 60d)` | Data Engineer | **813** |
| `Stack - DevOps & Cloud (US, 60d)` | DevOps Engineer, Cloud Engineer | **591** |
| `Stack - Backend (US, 60d)` | Backend Engineer | **194** |
| `Stack - QA & Automation (US, 60d)` | QA Engineer, QA Automation Engineer | **124** |
| `Stack - Frontend & React (US, 60d)` | React Developer, Frontend Engineer | **103** |

### The finding that should change the plan

**Language-named roles barely exist in Apollo's posting titles.** Measured on the
same filter set:

| Keyword | Companies |
|---|---|
| Data Engineer | 813 |
| DevOps + Cloud Engineer | 591 |
| Backend Engineer | 194 |
| QA + QA Automation | 124 |
| React + Frontend | 103 |
| **Java Developer** | **55** |
| **.NET Developer** | **47** |
| **iOS + Android Developer** | **13** |

US companies title engineering roles by *function* — "Software Engineer",
"Backend Engineer", "Data Engineer" — and name the language in the job
description body, not the title. So ".NET Developer" as a posting title is rare,
and a .NET campaign built this way reaches 47 companies, not a market.

Two consequences:

1. **Segment by discipline, not language.** Data and DevOps/Cloud are the only
   two cuts with campaign-scale volume. Those are the ones to run first.
2. **A .NET or Java campaign cannot be built from posting titles alone.** It
   needs the job description body, which this filter does not search. The
   Technologies filter (company tech stack) is the nearer substitute, and is a
   different signal — it says what they run, not what they are hiring for.

The eight cuts sum to roughly 1,940 against the 3,254 total. The remainder are
companies matching only the generic titles — Software Engineer, Software
Developer, Full Stack Developer — which carry no stack signal at all and belong
in the general campaign, not a stack one.

### Where the small cuts are still worth having

47 companies is not a campaign, but it is a very good afternoon. A hand-written
line referencing the exact .NET req, sent to 47 companies, will out-convert 813
generic sends. Treat Backend, QA, Frontend and the language cuts as high-touch
micro-segments, not sequences.

---

## Part 6 — The Technologies filter does not rescue a language campaign

Tested 28 Oct 2026 against the same 3,253-company base, one technology at a time.

| Technology filter | Companies | Share of base |
|---|---|---|
| Java | 2,609 | **80%** |
| ASP.NET | 1,770 | **54%** |
| Ruby On Rails | 1,019 | **31%** |

Compare with the title route: .NET Developer 47, Java Developer 55.

**The volume is there and the precision is not.** Eighty per cent of these
companies are not Java shops, and thirty-one per cent are certainly not running
Rails — real Rails adoption is low single digits. The percentages also overlap
far beyond what a stack choice allows: a company does not run Java and ASP.NET
and Rails. Apollo is detecting any trace of a technology in a company's
web-facing footprint — a header, a dependency, a marketing-site framework — not
what its engineering organisation builds in.

So the two routes fail in opposite directions:

- **Posting titles**: precise but tiny. 47 companies genuinely advertising a
  .NET Developer role.
- **Technologies**: large but wrong. 1,770 companies where something somewhere
  touched ASP.NET.

Writing "saw you're a .NET shop" to the second list would be wrong most of the
time. That is a worse failure than a stale posting, because it is systematic
rather than occasional, and it is the kind of wrongness a technical buyer spots
instantly.

### What the filter is still good for

Not as a claim, but as a **tiebreaker**. Given two companies that both posted a
generic "Software Engineer" role, the one with ASP.NET detected is the better
bet for pitching .NET people — as long as the email never asserts the stack.
Use it to sort, never to personalise.

### The only honest route to a language campaign

Read the job description body, which is where the language actually lives. The
Apollo API's organization job postings endpoint may return descriptions, not
just the titles the UI shows. If it does, a real .NET segment is buildable by
pulling postings for a ranked subset of companies and matching on the body
text. That costs 1 credit per company, so it is viable for a few hundred
prioritised companies, not for all 3,254.

---

## Part 7 — Mobile, and a correction to Part 5

Part 5 reported mobile at **13 companies** using only "iOS Developer" and
"Android Developer". That number was an artefact of the keywords, not the
market. Measured 28 Oct 2026 on the same base:

| Keyword | Companies |
|---|---|
| Mobile Engineer | 57 |
| iOS Engineer | 30 |
| Android Engineer | 25 |
| Mobile Developer | 14 |
| iOS Developer + Android Developer | 13 |
| React Native Developer | 3 |
| **All eight combined (deduplicated)** | **122** |

Saved as **`Stack - Mobile (US, 60d)`**. The eight keywords are the six above
plus Flutter Developer.

**"Engineer" beats "Developer" in US posting titles, and by a lot.** iOS
Engineer 30 against iOS Developer's share of 13; Android Engineer 25 likewise.
The generic "Mobile Engineer" at 57 is the single biggest contributor. This is
the same convention that sank the language cuts — US companies title roles
"Engineer", and anything using "Developer" undercounts.

The result passes a sanity check the Technologies filter failed: the companies
are Duolingo, Bumble, Strava, Tinder, Skydio, Wealthfront, Keeper Security,
Thrive Market — all genuinely mobile-first. High precision, unlike the 31% of
the base that supposedly runs Rails.

### What this means for Part 5

The other stack counts are probably also understated, for the same reason.
Before treating any of them as settled, re-run with "Engineer" variants:

- `Backend Developer`, `Frontend Developer` alongside the Engineer forms
- `Data Developer` is not a convention, so Data (813) is likely sound
- `.NET Engineer` and `Java Engineer` are not conventions either, so the
  language cuts stay small — Part 6's conclusion is unaffected

Mobile at 122 is still a micro-segment rather than a campaign, but it is an
order of magnitude better than 13, and it is a coherent one: a hand-written
line to 122 mobile-first companies is a real afternoon's work with a real
hit rate.

---

## Part 8 — Credit cost of working the mobile segment

Measured 28 Oct 2026. Account balance at the time: **2,523 lead credits left**
of 2,525, cycle 9 Oct – 9 Nov 2026. `export_credit` limit is **0**.

### The segment

| | Count | Per company |
|---|---|---|
| Companies (`Stack - Mobile (US, 60d)`) | 122 | — |
| P1 engineering leaders | 622 | 5.1 |
| P2 recruiting & talent acquisition | 135 | 1.1 |
| Both personas | 757 | 6.2 |

### What each step costs

| Step | Tool | Cost |
|---|---|---|
| Get the 122 company IDs | `apollo_organizations_lookup` | **0** — documented as free |
| Job posting details, per company | `apollo_organizations_job_postings` | **1 credit each → 122** |
| Email reveal, per contact | "Access email" / people match | **1 credit each** |

### Three scenarios

| Plan | Postings | Emails | Total | % of 2,523 |
|---|---|---|---|---|
| One contact per company | 122 | 122 | **244** | 10% |
| One per persona per company | 122 | 244 | **366** | 15% |
| Reveal everything | 122 | 757 | **879** | 35% |

The middle row is the sensible one. Note P2 only averages 1.1 per company, so
roughly 100 of the 122 companies have a recruiting contact at all.

### Four things that change the arithmetic

1. **The 122 posting credits are avoidable.** Each company's Job postings tab is
   visible free in the browser. 122 manual lookups is tedious but costs nothing.
   Worth paying only if the time matters more than 5% of the month's credits.
2. **`export_credit` is 0.** Getting a CSV out of Apollo may not be available on
   this plan. Pushing contacts into an Apollo sequence should still work —
   `broadcast_credit` is 50,000 — but verify before planning around an export.
3. **Credits reset 9 Nov** and most plans do not roll over. Spending 366 of
   2,523 in the remaining window is comfortable; there is no reason to ration.
4. **Which bucket job postings draw from is unconfirmed.** If that endpoint bills
   against export credits rather than lead credits, it will fail at 0. Test with
   a single call before committing to 122.

---

## Part 9 — The free dataset (28 Oct 2026)

Working rule from here on: exhaust free sources, then propose a specific credit
spend and wait for approval. Nothing below cost a credit.

### What came back free

| File | Contents | Source |
|---|---|---|
| `data/mobile-companies.csv` | 136 companies: name, domain, Apollo org ID | `apollo_organizations_lookup` — documented 0 credits |
| `data/mobile-contacts.csv` | 289 contacts: name, title, company, domain, priority tier | Apollo web UI, read from the rendered list |

### Two gotchas found while gathering

**`apollo_organizations_lookup` has no industry-exclusion parameter.** The saved
search excludes staffing & recruiting and outsourcing/offshoring by tag ID; the
free lookup cannot. So it returned 136 rather than the UI's 122, with the
staffing firms back in — Optomi, Gravity IT Resources, Lorven, Astir, VLink and
others. 25 rows are flagged `services/staffing?` for review rather than deleted.

**URL pagination does not work on the People list.** Changing `page=` in the hash
re-renders page 1. Pagination has to be driven by clicking through.

### The triage, and why it matters

Sorting the 289 by title against what a staff-augmentation buyer actually looks
like:

| Tier | Contacts | Meaning |
|---|---|---|
| **A-prime** | **124**, across **79 distinct companies** | CTO, VP/Head of Engineering, Head of Mobile, VP Software |
| B-adjacent | 108 | AI/ML, data, research and platform leaders — sometimes right |
| C-skip | 57 | Not buyers: customer support, business development, SEO, projects, UX, supply chain, manufacturing |

**Twenty per cent of the "Engineering & Technical" department is not engineering
leadership at all.** The filter returned "VP, Supply Chain, Operations and
Customer Support", "VP of Global Consumer Support", "Head of Global Business
Development, Duolingo English Test", "Head of Projects" (four separate OUTFORM
rows) and "Head of SEO & AI Search". Revealing those is money burnt.

Two records also look wrong outright: a contact at **Amazon**, which cannot pass
a 51–1,000 headcount filter, and one at **Wealth.com**, which is not in the
company list at all. Both are flagged.

### What this saves

Revealing every contact across both personas would have been 757 credits. The
free triage reduces the target to **79 — one prime contact per company** — a
90% reduction, before a single credit is spent. That is the entire argument for
doing the free pass first.

---

## Part 10 — Should the mobile segment include HR/TA contacts? No.

Measured free, 28 Oct 2026, by pulling all 135 TA contacts and comparing
coverage against the A-prime engineering list.

| | Count |
|---|---|
| TA contacts | 135 |
| …but spread across only | **59 companies** |
| Companies with an A-prime engineering contact | 79 |
| Companies with **both** | **48** |
| Companies with **TA only** | **11** |
| …of which flagged services/staffing | 3 |
| **Clean incremental companies** | **8** |

Adding the HR persona buys **eight companies**, and four of those are not
plausible buyers of mobile engineering capacity: Bevara Building Services
(facilities maintenance), Notable Capital (a venture firm), EverDriven (school
transport), OUTFORM (retail display). The genuinely useful remainder is Kalshi,
Nectar, ReachMobi and Rythm — four companies.

### Three reasons to skip it here

1. **Almost no incremental reach.** 48 of the 59 TA companies already have an
   engineering contact. The HR list is concentrated, not broad — Resolve Tech
   Solutions alone has 7 recruiters, Cresta 6, Zoolatech 5. Those are the
   staffing firms, which is exactly where recruiters cluster and exactly who
   you are not selling to.
2. **Double-touching is dangerous at this size.** Emailing two people at the
   same company inside one wave is survivable across 3,000 accounts. Across 79
   it means your entire addressable universe sees two approaches from the same
   vendor in the same week.
3. **The offer does not solve the TA metric.** This refines what Part 2 assumed.
   A talent acquisition leader is measured on time-to-fill against an *approved
   permanent headcount*. A contractor does not close that req — it stays open,
   and the budget stays spent. So "your req has been open 70 days" is their pain
   but not their pain *to solve this way*; to some it reads as a threat to the
   mandate. The engineering leader, who is measured on shipping, has the
   opposite incentive.

### When HR does become the right persona

On the full 3,254-company list, where eight marginal companies becomes a few
hundred and double-touch risk is diluted. As a second wave to non-responders
three or four weeks later, with a different angle. Or if the offer is reframed
as contingent-workforce supply rather than engineering capacity — a different
pitch, and arguably a different business.

**Recommendation: engineering only for this segment. 79 contacts, 79 credits.**

---

## Part 11 — What 79 credits actually delivers

Checked free before approving any spend.

### You get

**Roughly 75 verified work email addresses**, one per company, each attached to a
named engineering decision-maker (CTO, VP/Head of Engineering, Head of Mobile)
whose name, title and company are already in `data/mobile-contacts.csv`. The
contacts land in Apollo, usable in a sequence, a list, or pushed to CRM.

Not 79, because **11% of contacts have no verified email**: applying
`Email Status: Verified` drops the A-prime pool from 289 to 256. Filtering to
verified *before* revealing means no credit is wasted on a blank — the company
count just lands nearer 72–75.

Apollo's selection dialog also has a built-in **"Max people per company"** control,
so the one-per-company rule can be enforced at selection time rather than by hand.

### You do not get

| Not included | Why it matters |
|---|---|
| **The job posting** | Still the missing piece. Free via the browser's Job postings tab, or 122 credits via API. Without it the email cannot name the role. |
| **Phone numbers** | "Access Mobile" is a separate reveal against `direct_dial_credit`. |
| **A confirmed CSV export** | The bulk bar does show an **Export** button, but `export_credit` limit is 0. Not clicked — it may consume credits or trigger reveals. Confirm before planning around a file. |

### The sequencing this implies

**Gather the postings first, then buy the emails.** The 79 credits are not the
bottleneck — the postings are. An inbox full of verified addresses with nothing
specific to say is a generic campaign, and Part 4 is explicit that a campaign
which does not name the role would have performed the same off a plain industry
list. Revealing first and discovering afterwards that the personalisation data
is missing is the wrong order.

---

## Part 12 — Correction: the free route does not work for postings

Part 8 said the 122 posting credits were "avoidable" because each company's Job
postings tab is free in the browser. That was wrong, and testing it showed why.

**The widget paginates at five.** Duolingo has 74 postings and the tab shows
`1 - 5 of 74` with fifteen pages. There is no rows-per-page control and no search
box inside the widget — a DOM check found only a "Current page" select. So
reading one company's postings in full is up to fifteen page-turns, and across
79 companies that is several hundred, which is not a workable manual pass.

**And the posting you need is not on page one.** Duolingo's five most recent
postings are "Staff AI Research Engineer", "Staff Product Designer, Monetization",
"Senior Director of Performance Marketing", "Data Scientist, Intern" and
"AI Research Engineer, New PhD Graduate". None is a mobile role — yet Duolingo
matched the mobile keyword filter, so its mobile posting is somewhere in the
other 69. Sorting by date and reading the top five would miss it entirely.

So the opening line this whole campaign depends on cannot be written from the
free data. `apollo_organizations_job_postings` returns up to 10,000 postings in
a single request, which is the only practical way to get it.

**Revised plan: postings via the API, 1 credit per company, 79 for the A-prime
set.** Combined with ~75 email reveals that is ~154 credits, about 6% of the
2,523 balance — and the postings are the half that makes the other half worth
sending.

---

## Part 13 — The 1-credit test: result

Called `apollo_organizations_job_postings` on Duolingo, 28 Oct 2026.

**Billing confirmed.** `lead_credit` consumed went 2 → 3, balance 2,522. Exactly
one credit, against lead credits, not the `export_credit` bucket that sits at 0.
The cost model holds.

**One call returns everything.** 62 postings, `total_pages: 1`, no pagination —
against the UI's fifteen pages of five. (The UI claimed 74 and the API returned
62; the discrepancy is unexplained and worth remembering before quoting either
number to anyone.)

**Fields returned:** `title`, `url` (a direct link to the live posting, on
LinkedIn or the company's own careers site), `city` / `state` / `country`,
`posted_at`, and `last_seen_at`.

**No description body.** This settles Part 6 for good: a .NET or Java campaign
cannot be built from Apollo at all, by any route. The language only ever appears
if it is in the title.

### Two findings that change the campaign

**1. `last_seen_at` gives the aged-req signal, per posting, at no extra cost.**
Duolingo's three US mobile roles:

| Role | Posted | Last seen | Days open |
|---|---|---|---|
| Senior Android Engineer, Client Platform | 9 Oct | 24 Oct | ~19 |
| Senior iOS Engineer | 9 Oct | 26 Oct | ~19 |
| **Software Engineer II, Android** | **21 Jul** | **26 Oct** | **~99** |

A role posted in July and still live on 26 October is a company that has failed
to fill it for over three months. That is the strongest opening line available,
and Part 3's "aged-req variant" turns out not to need a separate search — the
data comes free inside this call.

**2. The location filter does not mean what it appears to.** Duolingo also has
"Senior Software Engineer, iOS, Growth", "…iOS, Monetization" and "…Android,
Monetization" — all in **Beijing**. The company matched
`organizationJobLocations = United States` because it has *some* US postings,
not because its *mobile* postings are US. Company-level filters cannot express
"the mobile role specifically is in the US".

So every company's postings must be filtered per row on `country == United
States` before writing anything. Without that, some share of the 79 would get an
email about a job in China.

### Revised plan

78 more credits for the remaining A-prime companies. Each call returns the full
posting list, the live URL, and the age — enough to pick the right role, confirm
it is US, and write a line that names it.

---

## Part 14 — What the posting credits do and do not include

**Contact info: no.** The posting call returns nothing about people. Email
reveal is a separate spend, roughly 75 credits, and is still outstanding.

**Job description: not from Apollo — but free anyway.** The response carries no
description body. It does carry a `url` per posting, pointing at the live advert.
Fetching that page gives the whole description at no credit cost.

Tested on Duolingo's 99-day-old Android role (`careers.duolingo.com/jobs/8628658002`):

| Field | Value |
|---|---|
| Real title | Senior/Software Engineer II, Android |
| Locations | New York, NY & Pittsburgh, PA |
| Stack | **Kotlin**, native Android, reactive apps |
| Teams | Subscriber Conversion, In-App Purchases, Math Progress |
| Volume | "hiring for Android Engineers at **various levels**" — more than one seat |
| **Posted salary** | **$153,000–$207,000 USD**, plus equity |
| Constraint | four days per week in office |

### Why this is the most valuable thing found today

**The posted salary is a real, sourced, public number.** Base alone is
$153k–$207k before equity, benefits and employer taxes. That is the entire
staff-augmentation argument, in the company's own published words, and it
satisfies the standing no-fabricated-evidence rule in `CLAUDE.md` — the basis is
a public job advert, citable on screen.

**Four days a week in office narrows their candidate pool**, which supports the
"still open after 99 days" story rather than contradicting it.

**"Various levels" means more than one seat**, so the opportunity is larger than
a single contractor.

### Two caveats on fetching descriptions

- **Some URLs are LinkedIn**, which will not render without a login. Those
  postings will not yield a description. In Duolingo's 62 the majority pointed at
  `careers.duolingo.com`, with a handful on LinkedIn.
- **Careers pages are JavaScript-rendered.** A plain HTTP fetch returned only
  "Duolingo Careers"; the browser returned the full text. So this needs the
  browser, roughly one page load per company — unlike the fifteen-pages-per-company
  problem in Part 12, that is entirely workable.

### Where the spend now stands

| Step | Credits | Status |
|---|---|---|
| Company list | 0 | done |
| Contact names and titles | 0 | done |
| Posting test | 1 | done |
| Postings, remaining 78 companies | 78 | awaiting approval |
| Job descriptions from posting URLs | 0 | free, after postings |
| Email reveals | ~75 | later, and only for companies that survive |

---

## Part 15 — Remote-only shortlist, without spending credits

Tested 28 Oct 2026. Yes, partially — and the result is small but unusually clean.

### Apollo has no remote filter

Passing `Remote` to **Job located at** returns **0 results**. The field accepts
the text but matches nothing: it is geographic only and does not understand
remote as a work arrangement.

### "Remote" does work as a job-title keyword

Used in **Currently hiring for**, `Remote` alone matches 1.8K companies, so
posting titles genuinely carry the word. Combined with the mobile roles it
narrows the segment hard:

| Filter | Companies |
|---|---|
| Mobile roles, US, last 60 days | 122 |
| **Remote + mobile roles** | **7** |

Word order does not matter — `Remote iOS Engineer` and `iOS Engineer Remote`
both return the same 7, so the match is token-based and the result is stable.

### The seven, and their engineering leaders

Six of the seven already have a named A-prime contact from the free pass:

| Company | Contact |
|---|---|
| Life360 | Justin Moore (CTO); Sameer Bhatt (VP Engineering) |
| NinjaTrader | Aditya Nishandar (CTO); Yehong Wang, Brett Barrett (VP Engineering) |
| MyFitnessPal | Jason Peterson (CTO) |
| Mode Mobile | Nuno Veloso (VP of Engineering) |
| Hypori | Eric Wang (SVP Software Engineering) |
| Ondo Finance | William Westgarth (Head of Engineering, Ondo Perps) |
| Eleos Technologies | none captured |

### The honest limitation

**Seven is a floor, not the real number.** This only catches companies that put
"Remote" in the posting *title*. Most remote roles signal it in the location
field or in the description body — Duolingo's Android role said "four days per
week in office" in the description and nothing either way in the title. So the
true remote count inside the 122 is higher than 7, and unknowable for free.

The reliable test is the description, which is free via the posting URL but
needs the posting call first. So remote filtering properly belongs *after* the
posting spend, not before it.

### Why this matters more than the numbers suggest

A company advertising a remote mobile role has already accepted that the work
does not happen in their office. That is most of the objection to contract and
offshore capacity, pre-answered. Compare Duolingo, which demands four days a
week on site and is therefore a much harder sell whatever its 99-day-old req
suggests.

**These seven are the best test batch in the whole dataset** — named engineering
leaders, mobile roles, remote-friendly, and only 7 posting credits to get the
exact role titles and ages.

---

## Part 16 — The 7-company remote batch (7 credits spent)

Pulled 28 Oct 2026. **13 remote mobile postings across all 7 companies** — every
one of them had at least one. Saved to `data/remote-mobile-postings.csv`.

| Company | Mobile roles | Oldest open | Contact in hand |
|---|---|---|---|
| **Eleos Technologies** | 1 | **52 days** | none captured |
| **Mode Mobile** | **3** | 44 days | Nuno Veloso, VP Engineering |
| Life360 | 3 | 30 days | Justin Moore (CTO); Sameer Bhatt (VP Eng) |
| Ondo Finance | 1 | 21 days | William Westgarth, Head of Eng |
| NinjaTrader | 1 | 19 days | Aditya Nishandar (CTO) + 2 VPs |
| MyFitnessPal | 2 | 12 days | Jason Peterson, CTO |
| Hypori | 2 | 8 days | Eric Wang, SVP Software Eng |

### The three that stand out

**Eleos Technologies has exactly one job posting in the entire company, and it
is "Remote Senior iOS Engineer", open 52 days.** One open role, mobile, remote,
nearly two months unfilled. There is no cleaner signal in the dataset. The gap
is that no engineering leader was captured for them in the free pass — worth a
targeted look, because the opening line writes itself.

**Mode Mobile has three remote mobile roles open simultaneously** — "Sr. Native
Mobile Engineer (Android & iOS)", "Emerging Apps Portfolio" and "Upcoming Apps
Portfolio", all 42–44 days old. Three seats at one company is a team build-out,
not a backfill, and that is a bigger engagement than a single contractor.

**MyFitnessPal is hiring iOS *and* Android for the same product** ("Cal AI"),
twelve and nine days old. Both remote-US. A two-platform build with both seats
open is exactly the shape staff augmentation fits.

### Two caveats in the data

**Mode Mobile's postings were last seen 19 Oct, nine days before the others.**
Every other company's roles were confirmed live on 26–27 Oct. That gap may mean
the roles were filled or delisted. Worth checking the live URL before writing.

**Some "remote" postings are tagged Canada, not US.** Two of Life360's three are
`country: Canada` with titles reading "Remote, USA; Remote, Canada". The US one
posted 14 Oct is the safe one to reference. And Hypori's newest mobile role is
**Austin, on-site only** — only its 20 Oct posting carries the Remote option. The
Part 13 warning about per-posting location checking applies here directly.

### Where the spend stands

8 credits used in total (1 test + 7 batch), 2,515 remaining. The next step —
fetching descriptions from the 13 URLs for stack, salary and seat count — is
free.

---

## Part 17 — Descriptions fetched free, and two companies fall out

All 13 posting URLs opened in the browser, 0 credits. Result in
`data/remote-mobile-verified.csv`: **6 live roles across 5 companies**, and two
companies gone.

| Company | Role | Open | Posted salary | Stack |
|---|---|---|---|---|
| **Eleos Technologies** | Remote Senior iOS Engineer | **52d** | **$150,000–$180,000** | Swift, SwiftUI, Objective-C |
| Ondo Finance | Senior iOS Engineer | 21d | not posted | Swift, SwiftUI |
| NinjaTrader | Sr. Mobile Engineer II | 19d | **$140,000–$190,000** | Flutter, Dart, Swift, Kotlin |
| Life360 | Sr SWE II, Mobile (Android), Revenue Experimentation | 14d | **$118,500–$216,500** | Kotlin, Jetpack Compose |
| MyFitnessPal | SWE III, Android — Cal AI | 12d | **$135,000–$165,000** | Kotlin, Jetpack Compose |
| MyFitnessPal | SWE III, iOS — Cal AI | 9d | **$135,000–$165,000** | Swift, SwiftUI |

### `last_seen_at` predicted the dead ones exactly

**Mode Mobile — all three roles gone.** Both the company careers page and
Greenhouse return nothing. Apollo's `last_seen_at` was **19 Oct**, nine days
stale. **Hypori's remote mobile role — gone**, Greenhouse returns `?error=true`;
`last_seen_at` was 25 Oct. Only its Austin on-site version survives.

Every role whose `last_seen_at` was 26–27 Oct is live. Every one older is dead.
That gives a usable rule: **only use postings whose `last_seen_at` is within about
two days of the pull.** Part 3 asked for a spot-check against real careers pages
before bulk sending — this was it, and the attrition is 2 of 7 companies, 29%.

### Eleos Technologies is the single best prospect found

- Its **only open role in the entire company** is this one.
- Open **52 days**.
- **$150,000–$180,000** posted base, before benefits and taxes.
- The description says the engineering team has been **"100% distributed since
  day one"** — the remote objection is not merely absent, it is their stated
  culture.
- A 12-year-old company building communication software for trucking fleets, so
  not a startup that will vanish.

The one gap: no engineering leader captured for them in the free pass.

### What the salaries license you to say

Six roles, real published ranges: $118.5k–$216.5k, clustering around $135k–$180k
base. These are the companies' own public figures, so a cost comparison can be
made on the record without inventing anything — which is exactly what the
`CLAUDE.md` no-fabricated-evidence rule requires.

Credits: still 8 used, 2,515 left. This entire step was free.

---

## Part 18 — React Native segment (29 Oct 2026, 0 credits)

Same filter criteria as the mobile segment, job titles swapped for React Native
wording. Saved to `data/react-native-segment.csv`.

### Wording matters again

| Keyword | Companies |
|---|---|
| `React Native Developer` (the original) | 3 |
| `React Native Engineer` | 10 |
| `React Native` | 13 |
| **All four, incl. `Cross Platform Mobile Engineer`** | **14** |

The keyword used in the original eight found **3**. Proper wording finds **14** —
more than four times as many, from the same data, for nothing. This is the third
time the Engineer/Developer split has moved a number materially (Part 7, Part 12,
here), so it should now be treated as a standing rule rather than a surprise.

### What the 14 contain

- **10 were already in the mobile 136.** React Native is largely a relabelling
  of companies already on the list, not a new market.
- **4 are new**: CompanyCam, PrizePicks, Tapcart, Stable Kernel.
- **2 must be excluded**: Prophecy Technologies (already flagged staffing), and
  **Stable Kernel**, whose own site describes a digital-transformation and
  product-development consultancy in Atlanta. It is hiring React Native people
  to staff client work — a competitor, not a buyer. The industry tags did not
  catch it, so the staffing exclusions are leaky and name-level review is still
  needed.
- **12 usable prospects, 8 with a named engineering leader.**

### The one genuinely new prospect worth anything

**CompanyCam** — new to the list and it has two: Jeff McFadden (VP Engineering)
and Kevin Scully (SVP Engineering). PrizePicks and Tapcart are also new but
returned no contact at C-suite/VP/Head; widening to Director would be the way
to reach them.

28 engineering-leadership contacts across the segment, all captured free. The
Amazon record flagged in Part 9 appears here again, confirming it as a
persistent data error rather than a one-off.

### Honest assessment

This is a thin segment. Four new companies, one of which is a competitor and two
of which have no reachable contact. The real value was not the React Native
roles themselves but the reminder that the keyword list is still leaving volume
on the table — and that exclusion by industry tag does not catch consultancies
that describe themselves as product companies.

---

## Part 19 — CompanyCam: checked free, and it fails

Asked to add CompanyCam to the outreach batch. Before spending the 1 posting
credit, checked their live careers board — which cost nothing and settled it.

Their site embeds **Ashby** (`jobs.ashbyhq.com/companycam`). The live board shows
**10 open positions**, broken down by their own department filter:

| Department | Open roles |
|---|---|
| Sales | 6 |
| Product (Design + Management) | 2 |
| People Operations | 1 |
| Legal | 1 |
| Support & Success | 1 |
| **Engineering** | **0** |

**There is no engineering department on the board at all** — no React Native
role, no mobile role, no engineering role of any kind. The nearest things are a
"GTM Systems Developer" and a "Sr. Salesforce Administrator", both under Revenue
Operations.

So the React Native posting Apollo matched on has been filled or withdrawn, and
CompanyCam is **not** a prospect. Added to the exclusion list, leaving **11
usable prospects** in the React Native segment.

### Why this matters beyond one company

This is the failure Part 4 warned about — a confidently specific "saw you're
hiring a React Native engineer" sent to a company with no engineering vacancy at
all. It would have been the worst email in the batch, and it was aimed at the
one company singled out as the segment's best new find.

**The free check caught it before the credit was spent**, which is the strongest
argument yet for the order of operations the owner set: free verification first,
credits afterwards.

It also raises a question about the rest of the segment. CompanyCam's Apollo
record was stale enough to show a role their own board no longer lists. The
other React Native companies have not been checked the same way, and the mobile
batch in Part 17 lost 2 of 7 to exactly this. **Every prospect's own careers
board should be checked before it enters a send list** — it is free, it takes
one page load, and it has now caught three dead prospects out of eight checked.

---

## Part 20 — All 11 React Native prospects checked against their own boards

29 Oct 2026, 0 credits. Result in `data/react-native-verified.csv`.

| Verdict | Count |
|---|---|
| **Confirmed live** | **6** |
| Dead | 2 |
| Could not verify | 3 |

### Confirmed — the role is on the company's own board

| Company | Live role | Note |
|---|---|---|
| **Skydio** | Senior Software Engineer, React Native | also hiring Senior SWE, Android Platform |
| **Tapcart** | Sr. React Native Engineer | mobile commerce engine for Shopify brands, $15B+ processed |
| **Abby Care** | Senior Mobile Engineer (React Native) | San Francisco / Remote |
| **Angel** | Senior Mobile App Engineer (React Native) | |
| **Nectar** | Member of Technical Staff, Mobile (React Native) | |
| Hiya Inc. | Senior Mobile Engineer, Kotlin and Cross-Platform | **$170K–$228K + equity**, Seattle — **hybrid, not remote**, and Kotlin rather than React Native |

**Tapcart is the standout.** Their whole product is a mobile commerce engine for
Shopify brands, so mobile engineering is not a side project — it is the company.
No engineering contact captured yet, which is the gap to close.

### Dead — do not send

- **EverDriven**: 3 open jobs, two Customer Success and one Account Manager.
  Zero engineering roles of any kind.
- **Ziosk**: careers page invites you to "check out our open job listings below"
  and then lists none.

Both had Apollo records suggesting React Native hiring. Both would have been
wrong emails.

### Could not verify — check by hand

- **DMSi Software**: the "View Openings" control does not resolve to a job board.
- **PrizePicks** and **Fanfix**: both sites blocked in this browser, so no check
  was possible. Neither is confirmed either way.

### The running verification score

Across both batches, companies checked against their own careers board:

| Batch | Checked | Dead |
|---|---|---|
| Mobile (Part 17) | 7 | 2 |
| CompanyCam (Part 19) | 1 | 1 |
| React Native (here) | 8 verifiable | 2 |
| **Total** | **16** | **5 (31%)** |

**Roughly one in three prospects that Apollo says is hiring is not.** That is a
large enough error rate that the free careers-board check is not optional
diligence — it is the difference between a credible campaign and a third of
your sends opening with a false statement. It costs one page load per company.

---

## Part 21 — Remote status of the six: only two are

Asked whether the confirmed React Native roles are fully remote. Checked each on
its own listing, 0 credits. **They are not.** Result in
`data/react-native-remote-status.csv`.

**The React Native search never had a remote filter applied.** The "Remote"
keyword work in Part 15 was done against the mobile segment only and produced
the 7-company batch. Part 18's React Native search used different keywords with
no remote qualifier, so there was never a reason to expect these six to be
remote — the question simply had not been asked.

| Company | Remote? | Location | Salary |
|---|---|---|---|
| **Tapcart** | **Remote** | Santa Monica, CA — Location Type: Remote | **$175,000–$350,000** + equity + bonus |
| **Nectar** | **Remote** | a separate "Remote – USA" listing exists | $200,000–$300,000 + equity |
| Angel | Partial | Provo, UT — "Hybrid/Remote options available" | $160,000–$175,000 |
| Abby Care | No | San Francisco — **Hybrid** | $170,000–$240,000 |
| Skydio | No | San Mateo, CA — full-time, no remote flag | not posted |
| Hiya | No | Seattle — **Hybrid** | $170,000–$228,000 |

### Correction to Part 20

Part 20 recorded Abby Care as "San Francisco / Remote". That came from the text
on their marketing careers page; the actual Ashby listing says **Hybrid**. The
listing is authoritative and the earlier line was wrong.

### Two useful details

**Nectar posts the same role twice** — once as Palo Alto/NYC Hybrid and once as
Remote – USA, both $200K–$300K. Reference the remote listing, not the hybrid one.

**Tapcart's band is the widest seen anywhere in this work**: $175,000–$350,000
plus equity and bonus, fully remote, at a company whose entire product is mobile
commerce. On the combination of remote, salary and mobile-centrality it is the
strongest single prospect in either batch.

### What this means for the batch

Of six confirmed-live React Native roles, **two are genuinely remote**, one is
remote-optional, and three are not. Pitching offshore or distributed capacity
into the hybrid and on-site three would be arguing against their stated working
model in the first email.

---

## Part 22 — The remote-title filter is a bad proxy, and here is why

Re-ran the React Native search with the Remote keyword applied, same criteria.

**Result: 1 company. PrizePicks.**

Which is wrong in both directions:

- It **missed Tapcart and Nectar** — the two roles independently verified in
  Part 21 as genuinely remote.
- Its single hit, **PrizePicks**, is one of the three whose site is blocked in
  this browser, so it is unverified.

Recall against the known-remote roles is effectively zero.

### The mechanism

The filter searches Apollo's **title** field. Whether "Remote" appears there
depends entirely on which applicant tracking system the company uses:

| ATS | What Apollo's title looks like | Remote keyword works? |
|---|---|---|
| **Greenhouse** | appends location to the title — e.g. *"Senior Software Engineer II, Mobile — Revenue Experimentation (AI Native) New Remote, USA"* | **yes** |
| **Lever** | location sometimes written into the title — *"Remote Senior iOS Engineer"* | sometimes |
| **Ashby** | title and location are separate fields — *"Sr. React Native Engineer"*, with Remote held in Location Type | **no** |

Part 15's mobile batch returned 7 because Life360, MyFitnessPal, NinjaTrader and
Ondo all run **Greenhouse**, and Eleos runs Lever with Remote genuinely in the
title. The React Native batch fails because Tapcart, Nectar and Abby Care all
run **Ashby**, which never puts the location in the title.

So the filter is not measuring remote work. It is measuring *which ATS a company
uses* — and it silently discards every Ashby-based company, which in this
segment included the two best prospects.

### Correction to Part 15

Part 15 said the 7 was "a floor, not the real number" and that the true count was
higher. That was right, but the reason given was incomplete — it attributed the
gap to companies signalling remote in the description rather than the title. The
actual cause is structural: the ATS decides whether the word can ever appear in
the field Apollo indexes.

### The method that does work

What Part 21 did: take the confirmed roles, open each listing on the company's
own board, and read the location field. Free, one page load per company, and it
produced the correct answer where the filter produced the opposite of it.

**Recommendation: do not use a remote title keyword to build a segment.** Build
the segment on role and recency, then filter for remote at verification time
against the live listing — the step that is already needed anyway, because about
a third of these postings turn out to be dead.

---

## Part 23 — Re-checking the mobile 7: the filter missed at least two

Sampled five mobile-segment companies that the Remote keyword did **not** return,
chosen as well-known consumer apps rather than at random. Checked each board
directly, 0 credits. Result in `data/remote-filter-misses.csv`.

| Company | ATS | Mobile role | Remote? | Filter |
|---|---|---|---|---|
| **Acorns** | Ashby | Sr. Martech Engineer, Mobile | **Remote** — and 13 of their 14 open roles are remote | **missed** |
| **Nectar** | Ashby | MTS, Mobile (React Native) | **Remote – USA** | **missed** |
| Strava | Ashby | Senior Android Engineer, Trust & Safety | Hybrid (27 hybrid, 1 on-site) | correctly excluded |
| Citizen | Ashby | Senior iOS Engineer | On-site, New York City | correctly excluded |
| Turo | Workday | none found | — | — |

**Two of five had genuinely remote mobile roles the filter never surfaced.**
Every company in the sample runs Ashby or Workday — none runs Greenhouse — which
is exactly the pattern Part 22 predicted.

### What this does to the remote mobile segment

The filter returned 7 companies, of which verification left 5 live. Acorns and
Nectar bring that to **at least 7 live**, and the sample covered 5 of the ~115
mobile companies the filter skipped. The true remote set is materially larger
than 7 — the filter's recall is somewhere near half, not near complete.

**Acorns is the better of the two finds.** Thirteen of fourteen open roles are
remote, so remote is their default rather than an exception, and two engineering
leaders were already captured free: **Daniel Wood (CTO)** and **Pete Klein
(VP, Product Engineering)**. Nectar's remote role is real but no contact exists
for them yet.

### The corrected method, stated plainly

1. Build the segment on **role keywords and recency only** — no remote keyword.
2. Pull postings for the companies that have an engineering contact.
3. Open each company's own board and read **the location field on the listing**.
   This single step establishes, at once and for free, whether the role is live,
   whether it is remote, and what it pays.

Step 3 has now caught: 5 dead prospects out of 16, 4 non-remote roles out of 6,
and 2 remote roles the filter had discarded. It is the only step in this whole
pipeline that has never produced a wrong answer.

---

## Part 24 — Acorns and Nectar added (0 credits)

Both roles opened directly on their Ashby listings.

| | Acorns | Nectar |
|---|---|---|
| Role | Sr. Martech Engineer, Mobile | Member of Technical Staff, Mobile (React Native) |
| Location | **Remote** | **Remote – USA** |
| Salary | **$188,200–$221,400** | **$200,000–$300,000** + equity + bonus |
| Stack | Swift, Kotlin, Flutter, Segment | React Native, iOS, Android |
| Contact | **Daniel Wood (CTO)**, **Pete Klein (VP Product Engineering)** | Mujab Khan, Vaibhav Verma — Engineering Managers only |

**Acorns' role is genuinely mobile engineering**, not marketing dressed up — it
asks for native Swift and Kotlin alongside the lifecycle and analytics tooling.
The angle is that intersection, which is a much smaller pool than "senior mobile
engineer" on its own.

**Nectar offers two strong signals, both public.** They have posted the identical
role twice — once Palo Alto/NYC hybrid, once Remote-USA — and the listing says
**visa sponsorship available**. A company offering to handle immigration for a
remote role has already decided it will take the right person from anywhere.
That is the open door, stated in their own words.

**Nectar's contact ceiling is Engineering Manager.** Apollo holds 40 people for
them and not one is a CTO, VP or Head; the engineering titles are "Member of
Technical Staff" and "Engineering Manager", consistent with an early-stage
ex-Meta team. At that size the EM likely owns the requirement, but it is not a
VP conversation and should not be pitched as one.

### Where the remote batch now stands

**7 live remote companies**: Eleos, Ondo Finance, NinjaTrader, Life360,
MyFitnessPal, **Acorns**, **Nectar**. Openers drafted for all of them in
`data/openers-remote-mobile.md`.

Credits used across everything: **8**. Balance 2,515. Both of today's additions,
including salary and stack, cost nothing.

---

## Part 25 — Two corrections from the account profile

Checked `apollo_users_api_profile` before revealing any emails. It returned two
things that contradict earlier parts of this document.

### 1. The posting calls billed EXPORT credits, not lead credits

| Field | Value |
|---|---|
| `num_lead_credits_used` | **2** |
| `num_export_credits_used` | **8** |
| `total_unified_credits_used` | 10 |
| `num_credits_remaining` | 2,515 |

Eight export credits used is exactly the eight `apollo_organizations_job_postings`
calls. The two lead credits were already spent before this work began.

Part 13 concluded the opposite — that the postings billed lead credits — based on
`credit_usage_stats` showing lead consumed moving 2 → 3 right after the test
call. That reading was wrong, or the two endpoints account differently. **The
profile figures are the ones to trust**, since they reconcile exactly:
2,525 − 10 = 2,515.

This also softens Part 8's warning. `effective_num_export_credits` is 0, yet 8
export credits were spent, so the balance behaves as a unified pool rather than a
hard per-type cap. The "export may be blocked" concern was overstated.

### 2. Waterfall enrichment is ENABLED — so email reveal is not a flat 1 credit

```
waterfall_email_enabled: true
waterfall_phone_enabled: true
```

With waterfall on, it is the **default** path for email reveal. Its cost is
variable and plan-dependent — zero when Apollo's own data answers, otherwise
partner-provider credits that can exceed a standard match.

So the "5 credits for 5 contacts" figure quoted in Part 11 and since is **not
reliable on this account**. The spend was paused and put back to the owner
rather than run on an approval given against the wrong number.

---

## Part 26 — Five emails revealed (10 credits, not 5)

Waterfall enrichment on the five contacts, 29 Oct 2026. All five matched with
high confidence and all five returned a Verified work email.

**`credits_consumed: 10` — two credits per contact, not one.** That is the
waterfall premium, and it is why the capability check in Part 25 mattered:
the "5 credits" quoted earlier would have been half the real cost. Balance
2,515 → **2,505**.

| Company | Contact | Email | Status |
|---|---|---|---|
| Eleos Technologies | Erik Blom, Software Engineering Team Lead | erik.blom@eleostech.com | Verified |
| Life360 | Justin Moore, CTO | jmoore@life360.com | Verified |
| NinjaTrader | Aditya Nishandar, CTO | aditya.nishandar@ninjatrader.com | Verified |
| MyFitnessPal | Jason Peterson, CTO | jason.peterson@myfitnesspal.com | Verified |
| Ondo Finance | William Westgarth, Head of Eng, Ondo Perps | william.westgarth@ondo.finance | **disputed — see below** |

### One address carries a real bounce risk

**Ondo Finance disagrees across validators.** Apollo marks
`william.westgarth@ondo.finance` as verified; **ZeroBounce returns `invalid`**.
`ondo.finance` is also flagged `email_domain_catchall: true`, which explains the
conflict — a catch-all domain accepts any address, so verification is unreliable
by construction. Send it last, or on a warm-up address, not in the first batch.
`ninjatrader.com` is also catch-all, but ZeroBounce returned valid there.

### Context the enrichment added, which changes two drafts

- **William Westgarth is based in Peterborough, UK**, not the US, and heads
  engineering for the **Ondo Perps** product line specifically — he may not own
  the iOS hire at all. Worth a second look before sending.
- **MyFitnessPal's headcount is down 10.8% over twelve months** while they hold
  two mobile roles open. That is a stronger angle than the one drafted: a
  shrinking org holding two reqs open is exactly the case for contract capacity
  over permanent headcount.
- Life360 +35% and Ondo +85% headcount growth over twelve months; NinjaTrader
  +33%. Only MyFitnessPal and Eleos are shrinking.
- Justin Moore (Life360) was Director of Engineering at Instagram and VP
  Engineering at Lyft; Aditya Nishandar (NinjaTrader) was Sr. Director of
  Engineering at Carta and a VP at Goldman Sachs. Both became CTO in May 2024.
- Erik Blom has been at Eleos since 2018 and worked up from QA — he is not a
  recent hire being asked to fix a hiring problem he inherited.

**Total credits used across all of this work: 18.** Balance 2,505.

---

## Part 27 — Two drafts revised on the enrichment findings

### MyFitnessPal — reframed around the cost of two permanent hires

The original draft led on the pairing: both platforms open at once. The revision
leads on what that commitment actually is — two permanent hires at $135–165k
each is roughly $300k of committed base before equity, and a quarter of hiring
runway before either ships.

**The headcount decline is deliberately not mentioned in the email.** Apollo
shows MyFitnessPal down 10.8% over twelve months, and that is what makes the
contract-over-permanent framing right — but telling a CTO his company is
shrinking is tactless, and it rests on third-party data he may dispute. It
shapes the argument; it does not appear in the text.

### Ondo Finance — changed from a pitch to a referral ask

Two problems, neither fixable by switching contact:

1. **William Westgarth may not own this hire.** He is based in Peterborough, UK
   and heads engineering for the **Ondo Perps** product line specifically.
2. **His address is disputed** — Apollo verified, ZeroBounce invalid, on a
   catch-all domain.

Apollo holds only **three** engineering leaders for Ondo: Westgarth, a Head of AI
Transformation and a Head of DeFi. The other two are further from mobile, so
there is no better contact to move to.

So the email became three lines that ask who owns the search rather than
pitching into uncertainty. A referral ask risks less on a shaky address, and
gives a recipient who is not the buyer something easy to reply to. **Send this
one last, or from a warm-up address.**

### Where the batch stands

Five companies, verified emails, drafts matched to what is actually true of each:

| Company | Angle |
|---|---|
| Eleos | only open role company-wide, 53 days, remote-native culture |
| MyFitnessPal | cost and timing of two simultaneous permanent hires |
| Life360 | protect experiment throughput; alongside the hire, not instead |
| NinjaTrader | the Flutter + native intersection is scarce — only if true |
| Ondo | referral ask, not a pitch |

The only remaining gap is the rate, availability and engineer-location
placeholders, which need real figures from the owner.

---

## Part 28 — Placeholders filled, and three things the numbers raise

Owner's figures, 29 Oct 2026: engineers in **Pakistan and Europe**, **$45/hour**,
**first profile within a day**, **starts within a week**, **ten engineers across
Flutter and native**. All five drafts are now complete with no placeholders.

### The arithmetic, stated carefully

$45/hour is roughly **$7,200 a month** at 160 hours, or about **$93,600 a year**
at 2,080. Against the posted base salaries:

| Company | Posted base | Contract at $45/hr |
|---|---|---|
| Eleos | $150,000–$180,000 | ~$93,600 |
| MyFitnessPal (×2 roles) | $270,000–$330,000 | ~$187,200 |
| Life360 | $118,500–$216,500 | ~$93,600 |
| NinjaTrader | $140,000–$190,000 | ~$93,600 |

These compare **base to contract cost only**. No employer-tax or benefits
multiplier has been applied, because any such figure would be invented — the
posted bases are public and citable, a loading factor is not. The emails
therefore quote the hourly rate and let the buyer do their own comparison.

### Three risks in these numbers

**1. The gap may read as a quality signal, not a saving.** $45/hour against a
$216,500 band is a very large spread. Justin Moore was Director of Engineering
at Instagram and VP Engineering at Lyft; Aditya Nishandar was a Sr. Director at
Carta and a VP at Goldman Sachs. Buyers at that level sometimes read a deep
discount as a warning rather than an offer. It is not a reason to change the
rate — it is a reason to expect the first reply to be about calibre, and to have
an answer ready that is not price.

**2. Time zones are the first objection, and the drafts do not pre-empt them.**
Pakistan runs roughly 9–12 hours ahead of US business hours; Europe overlaps
well with the US East Coast and poorly with the West. Every one of these five is
a US company. This will come up on the first call, so it is better to have a
stated overlap policy than to be asked cold.

**3. The location is named, not softened.** Each draft says Pakistan and Europe
plainly. Vagueness here reads as evasive and is discovered on the call anyway;
at Eleos in particular, whose own advert boasts of being "100% distributed since
day one", naming it is a strength.

### The five, final

| Company | Contact | Email | Angle |
|---|---|---|---|
| Eleos | Erik Blom | erik.blom@eleostech.com | only vacancy, 53 days, remote-native |
| MyFitnessPal | Jason Peterson (CTO) | jason.peterson@myfitnesspal.com | ~$300k for two permanent hires |
| Life360 | Justin Moore (CTO) | jmoore@life360.com | protect throughput, alongside the hire |
| NinjaTrader | Aditya Nishandar (CTO) | aditya.nishandar@ninjatrader.com | ten Flutter + native engineers |
| Ondo | William Westgarth | william.westgarth@ondo.finance | referral ask — send last |

Total credits used: **18**. Balance 2,505.
