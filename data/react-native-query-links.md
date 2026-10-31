# React Native search — query links

Verified working 30 Oct 2026. Saved in Apollo as **`Stack - React Native (US, 60d)`**
(open it from the view selector at the top-left of Find Companies — that is the
easiest route, no URL needed).

---

## 1. The one to use — companies (13 today)

```
https://app.apollo.io/#/companies?organizationJobLocations[]=United%20States&organizationJobPostedAtRange[min]=60_days_ago&organizationNumEmployeesRanges[]=51%2C100&organizationNumEmployeesRanges[]=101%2C200&organizationNumEmployeesRanges[]=201%2C500&organizationNumEmployeesRanges[]=501%2C1000&organizationLocations[]=United%20States&organizationNotIndustryTagIds[]=5567e09973696410db020800&organizationNotIndustryTagIds[]=5567d04173696457ee520000&qOrganizationJobTitles[]=React%20Native%20Developer&qOrganizationJobTitles[]=React%20Native%20Engineer&qOrganizationJobTitles[]=React%20Native&qOrganizationJobTitles[]=Cross%20Platform%20Mobile%20Engineer&page=1
```

Filters: US job locations · posted within 60 days (relative) · 51–1000 employees ·
US HQ · excluding staffing & recruiting and outsourcing/offshoring · four React
Native title variants.

## 2. The same set as people (engineering leaders, ~28)

Append to the URL above, swapping `#/companies` for `#/people`:

```
&personSeniorities[]=c_suite&personSeniorities[]=vp&personSeniorities[]=head&personDepartmentOrSubdepartments[]=master_engineering_technical
```

---

## Do NOT use the "remote" variant

```
...&qOrganizationJobTitles[]=Remote%20React%20Native&qOrganizationJobTitles[]=Remote%20React%20Native%20Engineer&qOrganizationJobTitles[]=Remote%20React%20Native%20Developer
```

It returns **1 company** and misses both roles independently confirmed as remote
(Tapcart, Nectar). Apollo indexes the job TITLE; Greenhouse appends the location
to the title so the keyword works, but **Ashby keeps location in a separate
field**, so Ashby-based companies never match. The filter measures which ATS a
company uses, not whether the job is remote.

**Determine remote at verification instead** — open the role on the company's own
board and read the location field.

---

## The count moves on its own

`60_days_ago` is relative, so the result set changes daily. It returned **14 on
29 Oct and 13 on 30 Oct**: **Abby Care** aged out overnight as its posting passed
60 days. That is the filter working correctly, not an error — but it means a
count quoted on one day should not be repeated on another.
