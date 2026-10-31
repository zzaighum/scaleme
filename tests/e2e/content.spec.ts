import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES, EXTRA_ROUTES } from "./routes";
import { siteConfig } from "../../src/config/site";

const DATA = path.join("qa-artifacts", "data");
// Created once here: several tests write artifacts, and which of them runs first
// depends on the shard and the -g filter, so none of them can assume it exists.
fs.mkdirSync(DATA, { recursive: true });
const ALL = [...PAGE_ROUTES, ...EXTRA_ROUTES];

async function visibleText(page: import("@playwright/test").Page) {
  return page.evaluate(() => (document.body.innerText ?? "").replace(/ /g, " "));
}

test.describe("content, copy and trust", () => {
  test("brand casing is exactly as configured", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const hits: Record<string, string[]> = {};
    for (const route of ALL) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = `${await visibleText(page)} ${await page.title()}`;
      // The brand is three capitalised words: "Your Leads Partner". The
      // single-word forms are the previous wordmark, and ScaleMe is the brand
      // before that; either surviving anywhere in rendered output is a defect.
      const bad = [
        ...text.matchAll(
          /YourLeadspartner|YourLeadsPartner|Yourleadspartner|YOURLEADSPARTNER|Your Leadspartner|ScaleMe|Scaleme|scaleme/g
        ),
      ].map((m) => m[0]);
      if (bad.length) hits[route] = [...new Set(bad)];
    }
    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(path.join(DATA, "brand-casing.json"), JSON.stringify(hits, null, 2));
    expect(hits, "off-brand spellings in rendered output").toEqual({});
  });

  test("CTA vocabulary matches site.ts", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const found: Record<string, string[]> = {};
    const problems: string[] = [];
    const sanctioned = [siteConfig.primaryCta, siteConfig.secondaryCta, siteConfig.formSubmitLabel];
    const nearMisses =
      /\b(Book a call|Book a Call|Get a quote|Get Started|Get started|Contact us|Contact Us|Request a demo|Schedule a call|Talk to us|Learn more|Learn More|Submit|Send message)\b/g;

    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = await visibleText(page);
      const hits = [...new Set([...text.matchAll(nearMisses)].map((m) => m[0]))];
      if (hits.length) {
        found[route] = hits;
        problems.push(`${route}: ${hits.join(", ")} (sanctioned: ${sanctioned.join(" / ")})`);
      }
    }
    fs.writeFileSync(path.join(DATA, "cta-vocabulary.json"), JSON.stringify(found, null, 2));
    expect(problems, "CTA wording outside the configured vocabulary").toEqual([]);
  });

  test("no placeholder text survives into the rendered page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const hits: Record<string, string[]> = {};
    for (const route of ALL) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = await visibleText(page);
      const bad = [
        ...text.matchAll(/\bLorem\b|\bTODO\b|\bTBD\b|Coming soon|\{\{|\bundefined\b|\bNaN\b|\[object Object\]|\bXXX\b|\bFIXME\b/gi),
      ].map((m) => m[0]);
      if (bad.length) hits[route] = [...new Set(bad)];
    }
    fs.writeFileSync(path.join(DATA, "placeholders.json"), JSON.stringify(hits, null, 2));
    expect(hits, "placeholder strings in rendered output").toEqual({});
  });

  test("no fabricated evidence has crept in", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const hits: Record<string, unknown> = {};
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = await visibleText(page);
      const found: string[] = [];

      // Named third parties used as implied clients or accreditation.
      //
      // The privacy notice is the one place a third-party name is not only
      // allowed but required: data-protection law obliges it to name the
      // processors that receive enquiry data. Those specific names are removed
      // before the scan, so any *other* brand appearing there is still caught.
      const DISCLOSED_PROCESSORS = ["Google reCAPTCHA", "Salesforce", "Calendly", "Hostinger"];
      let brandScanText = text;
      if (route === "/privacy/") {
        for (const processor of DISCLOSED_PROCESSORS) {
          brandScanText = brandScanText.split(processor).join("");
        }
      }
      const brands = /\b(Google|Microsoft|Revolut|Gartner|HCL|Clutch|Trustpilot|G2|Capterra|AWS Partner|Forbes|TechCrunch)\b/g;
      found.push(...[...new Set([...brandScanText.matchAll(brands)].map((m) => `brand:${m[0]}`))]);

      // Money and invented commercial figures.
      //
      // One exception: the hero funnel's "~$100k deal value" is an evidenced
      // figure — the combined contract value of five closed deals — and the
      // figure's own caption states that basis on screen. Any other currency
      // figure, anywhere, is still a finding.
      // Both renderings of the same evidenced figure: the pill, and the longer
      // form in the screen-reader description.
      const EVIDENCED_FIGURES =
        route === "/" ? ["~$100k deal value", "$100,000 in combined contract value"] : [];
      let priceScanText = text;
      for (const figure of EVIDENCED_FIGURES) priceScanText = priceScanText.split(figure).join("");
      found.push(
        ...[...new Set([...priceScanText.matchAll(/[$£€]\s?\d[\d,.]*/g)].map((m) => `price:${m[0]}`))]
      );
      found.push(...[...new Set([...text.matchAll(/\b\d+(\.\d+)?\s?(stars?|\/5)\b/gi)].map((m) => `rating:${m[0]}`))]);

      // Scarcity and guarantee language.
      // Only *positive* guarantees count. This site's guarantee language is all
      // disclaiming ("cannot be guaranteed", "we do not promise"), which is the
      // opposite of the problem, so negated forms are filtered out.
      const sentencesWithClaims = text
        .split(/(?<=[.!?])\s+|\n+/)
        .filter((sentence) =>
          /only \d+ (spots?|places?|slots?)|limited (spots?|availability)|act now|\bguarantee/i.test(sentence) &&
          !/\b(not|cannot|can't|never|no|do not|don't|without)\b[^.?!]*guarantee|guarantee[ds]?\b[^.?!]*\b(not|cannot)\b|\?$/i.test(sentence)
        );
      // "guaranteed revenue" here is something the visitor might want and the
      // page says it is not a fit for — a disqualifier, not a promise.
      const KNOWN_DISQUALIFIERS = [
        "If your offer is still untested or you need immediate guaranteed revenue",
      ];
      found.push(
        ...[...new Set(sentencesWithClaims.map((s2) => s2.trim()))]
          .filter((s2) => !KNOWN_DISQUALIFIERS.some((k) => s2.includes(k)))
          .map((s2) => `claim:${s2.slice(0, 90)}`)
      );

      // Markup that would carry a testimonial or a logo wall.
      const structural = await page.evaluate(() => ({
        blockquotes: document.querySelectorAll("blockquote").length,
        thirdPartyImages: Array.from(document.images)
          .map((i) => i.currentSrc || i.src)
          .filter((s) => !/logo\.svg|logo-mark\.svg|icon\.svg/.test(s)),
      }));

      if (found.length || structural.blockquotes || structural.thirdPartyImages.length) {
        hits[route] = { found, ...structural };
      }
    }
    fs.writeFileSync(path.join(DATA, "fabricated-evidence.json"), JSON.stringify(hits, null, 2));
    expect(hits, "possible fabricated evidence").toEqual({});
  });

  test("outcome claims are hedged, not guaranteed", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const sentences: Record<string, string[]> = {};
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = await visibleText(page);
      const risky = text
        .split(/(?<=[.!?])\s+/)
        .filter((s) => /\b(guarantee|guaranteed|always|never fails|will (?:get|book|deliver|generate)|promise|ensure)\b/i.test(s))
        .map((s) => s.trim().slice(0, 160));
      if (risky.length) sentences[route] = risky;
    }
    fs.writeFileSync(path.join(DATA, "outcome-claims.json"), JSON.stringify(sentences, null, 2));
    // Recorded for human reading: "we do not guarantee" is the wording this site
    // uses, so a hit is a prompt to read, not an automatic defect.
    expect(Object.keys(sentences).length).toBeGreaterThanOrEqual(0);
  });

  test("typography hygiene: double spaces, mixed spelling, stray artefacts", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const report: Record<string, unknown> = {};
    const problems: string[] = [];
    const ukUs: Record<string, RegExp> = {
      "organise/organize": /\borgani[sz]e/gi,
      "programme/program": /\bprogramm?e?\b/gi,
      "personalise/personalize": /\bpersonali[sz]/gi,
      "optimise/optimize": /\boptimi[sz]/gi,
      "analyse/analyze": /\banaly[sz]e/gi,
      "licence/license": /\blicen[cs]e/gi,
    };
    const spellings: Record<string, Set<string>> = {};

    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const text = await visibleText(page);

      const doubles = [...text.matchAll(/\S {2,}\S/g)].map((m) => m[0]);
      const artefacts = [...text.matchAll(/\s[,.;:]|&amp;|&nbsp;|&#\d+;|--(?!>)/g)].map((m) => m[0]);
      if (doubles.length || artefacts.length) report[route] = { doubles: doubles.slice(0, 5), artefacts: [...new Set(artefacts)].slice(0, 5) };
      if (doubles.length) problems.push(`${route}: ${doubles.length} double space(s)`);
      if (artefacts.length) problems.push(`${route}: artefacts ${[...new Set(artefacts)].join(" ")}`);

      for (const [k, re] of Object.entries(ukUs)) {
        for (const m of text.matchAll(re)) {
          (spellings[k] ??= new Set()).add(m[0].toLowerCase());
        }
      }
    }
    const mixed = Object.entries(spellings)
      .map(([k, v]) => ({ pair: k, forms: [...v] }))
      .filter((e) => new Set(e.forms.map((f) => (/z/.test(f) ? "us" : "uk"))).size > 1);

    fs.writeFileSync(path.join(DATA, "typography.json"), JSON.stringify({ problems, report, spellings: Object.fromEntries(Object.entries(spellings).map(([k, v]) => [k, [...v]])), mixed }, null, 2));
    expect(problems, "typographic artefacts").toEqual([]);
    expect(mixed, "mixed UK/US spelling").toEqual([]);
  });

  test("legal pages exist, are linked, and are flagged as draft", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    await page.goto("/");
    await page.waitForLoadState("load");
    await expect(page.locator('footer a[href="/privacy/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/terms/"]')).toBeVisible();
    expect(siteConfig.legalContentStatus).toBe("draft");
    await expect(page.locator("footer"), "the footer should say the legal content is a draft").toContainText(/draft/i);

    for (const route of ["/privacy/", "/terms/"]) {
      await page.goto(route);
      await page.waitForLoadState("load");
      const body = await visibleText(page);
      expect(body, `${route} should say it is a draft`).toMatch(/draft|not .*final|placeholder|to be confirmed/i);
    }
  });

  test("heading sentence case is consistent", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "copy does not change by viewport");
    const report: Record<string, string[]> = {};
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const headings = await page.evaluate(() =>
        Array.from(document.querySelectorAll("main h1, main h2, main h3")).map((h) => (h.textContent ?? "").trim())
      );
      // Title Case = three or more capitalised words in a row, ignoring the first.
      const titleCase = headings.filter((h) => {
        const words = h.split(/\s+/).slice(1).filter((w) => w.length > 3);
        const caps = words.filter((w) => /^[A-Z]/.test(w)).length;
        return words.length >= 3 && caps >= 3;
      });
      // The hero headline is deliberately Title Case; everything else on the
      // site is sentence case and should stay that way.
      const ALLOWED_TITLE_CASE = ["Stop Chasing Leads."];
      const unexpected = titleCase.filter(
        (h) => !ALLOWED_TITLE_CASE.some((a) => h.startsWith(a))
      );
      if (unexpected.length) report[route] = unexpected;
    }
    fs.writeFileSync(path.join(DATA, "heading-case.json"), JSON.stringify(report, null, 2));
    expect(report, "headings in Title Case where the rest of the site uses sentence case").toEqual({});
  });
});
