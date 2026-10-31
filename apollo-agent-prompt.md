# Prompt for the Apollo agent

Paste the block below into the thread where the Apollo agent is set up. It carries
everything learned by building these searches by hand in the Apollo UI on
28 Oct 2026, so the agent does not have to rediscover it.

---

```
You are working on Apollo prospecting for a staff-augmentation campaign:
we place vetted contract software engineers with US companies, billed as
contract capacity, no placement fee. Buyers are companies with engineering
roles they have posted and not filled.

THREE SAVED SEARCHES ALREADY EXIST IN THE ACCOUNT — do not rebuild them:
  1. "US Staff Aug - Tech Roles Posted 60d"      3,254 companies
  2. "US Staff Aug - P1 Engineering Leaders"    12,822 contacts
  3. "US Staff Aug - P2 Talent Acquisition"      2,934 contacts

THE COMPANY FILTER SET (search 1), as URL parameters:
  qOrganizationJobTitles[]   = Software Engineer, Full Stack Developer,
      Software Developer, Backend Engineer, Frontend Engineer, .NET Developer,
      Java Developer, Python Developer, React Developer, DevOps Engineer,
      QA Engineer, QA Automation Engineer, Data Engineer, Cloud Engineer,
      iOS Developer, Android Developer, Salesforce Developer
  organizationJobLocations[]      = United States
  organizationJobPostedAtRange[min] = 60_days_ago
  organizationNumEmployeesRanges[] = 51,100 / 101,200 / 201,500 / 501,1000
  organizationLocations[]          = United States
  organizationNotIndustryTagIds[]  = 5567e09973696410db020800  (staffing & recruiting)
                                     5567d04173696457ee520000  (outsourcing/offshoring)

PERSONA FILTERS, layered on the same company set:
  P1  personSeniorities[] = c_suite, vp, head, director
      personDepartmentOrSubdepartments[] = master_engineering_technical
  P2  personSeniorities[] = c_suite, vp, head, director, manager
      personDepartmentOrSubdepartments[] = recruiting_talent_acquisition

SEVEN THINGS VERIFIED BY TESTING — treat these as settled, not assumptions:

1. The "Currently hiring for" filter matches a TITLE FAMILY, not a literal
   string. "Software Engineer" returned 20,747 companies; adding "Senior
   Software Engineer" returned the same 20,747, zero new. (A "Registered
   Nurse" control moved it to 28,200, proving the counter was live.) Never
   waste entries on seniority prefixes.

2. BECAUSE of (1), a matched company may have NO posting literally named your
   keyword. Duolingo matched while its recent postings were "Staff AI Research
   Engineer" and "Staff Product Designer, Monetization". So never write outreach
   copy from the filter keyword — read the real title from the company's
   "Job postings" tab, or via the organization job postings endpoint.

3. Use the "Job Posted At" TIMEFRAME tab, never the Date tab. Date writes a
   fixed calendar date that silently goes stale inside a saved search;
   Timeframe writes "60 Days Ago" and re-evaluates on every run.

4. Switching Companies -> People SILENTLY WIDENS the headcount filter. Four
   selected bands came back as seven, re-adding 1-10, 11-20 and 21-50. Always
   re-check the # Employees chips right after switching.

5. Staffing agencies are the dominant noise source. Unfiltered, page one was
   Jobot, CyberCoders, BayOne Solutions, Cypress HCM, Optomi, Hunter Bond,
   IDR Inc — all posting on behalf of clients. The two excluded industry IDs
   above remove them.

6. Do NOT add the Information Technology department to P1. It pulls in CISOs,
   security executives and internal-IT leaders who do not buy development
   capacity. Engineering & Technical alone is correct.

7. For P2, use the "Recruiting & Talent Acquisition" SUB-department, not the
   Human Resources parent. HR parent at Director+ gives 5,072 and is full of
   generalists ("Director - HR and Finance", "Head of People"). The sub-
   department gives 2,934 and every result is a recruiter.

CONSTRAINTS:
  - Do not reveal emails or spend credits without being asked.
  - Email Status: Verified only, to protect domain reputation.
  - Suppress the 120 existing lead records in Salesforce.
  - 15,756 contacts across both personas is far more than needed; at one to two
    per company the target is 3,000-6,500. Reveal in ranked batches.
  - NO FABRICATED EVIDENCE in any copy: no invented client logos, testimonials,
    ratings, pricing, dollar figures or scarcity claims. Every number used must
    have a real source.
```

---

## On running the Apollo agent from this session instead

I cannot reach another thread — conversations are isolated, so there is no way
for me to call an agent you set up elsewhere.

What *is* possible: Apollo publishes an official MCP connector
(`https://mcp.apollo.io/mcp`) whose tools include `apollo_search_organizations`,
`apollo_search_people` and `apollo_get_job_postings` — the API equivalents of
everything we have been clicking through in the browser. It is not connected to
this session. Connecting it would let the work happen through the API here
rather than through Chrome, which is faster and does not depend on a logged-in
browser tab.

Worth knowing before switching: the browser route found things the API would not
have surfaced on its own — the silent headcount widening, the recruiter noise,
the HR sub-department. The filter set above is the distilled result. The API is
the better tool now that the shape of the query is known.

---

## Added 28 Oct 2026 — stack searches

Five more saved searches exist, each the company filter set above with only
`qOrganizationJobTitles[]` changed:

```
Stack - Data Engineering (US, 60d)     Data Engineer                        813
Stack - DevOps & Cloud (US, 60d)       DevOps Engineer, Cloud Engineer      591
Stack - Backend (US, 60d)              Backend Engineer                     194
Stack - QA & Automation (US, 60d)      QA Engineer, QA Automation Engineer  124
Stack - Frontend & React (US, 60d)     React Developer, Frontend Engineer   103
```

Measured and rejected as too small to run as campaigns: Java Developer 55,
.NET Developer 47, iOS + Android Developer 13.

Tell anyone who asks for a language-specific campaign (.NET, Java, Python) that
it cannot be built from posting titles: US companies title roles by function and
name the language in the description body, which this filter does not search.
