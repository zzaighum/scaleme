import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES } from "./routes";
import { primaryNav, servicesDropdown } from "../../src/data/nav";
import { siteConfig } from "../../src/config/site";

const DATA = path.join("qa-artifacts", "data");
// Created once here: several tests write artifacts, and which of them runs first
// depends on the shard and the -g filter, so none of them can assume it exists.
fs.mkdirSync(DATA, { recursive: true });

test.describe("navigation and IA", () => {
  test.describe("desktop", () => {
    test("services dropdown: hover, click, Escape, contents", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop" && testInfo.project.name !== "wide", "needs the lg nav");
      await page.goto("/");
      const trigger = page.locator('header button:has-text("Services")');
      const firstItem = page.locator('header nav[aria-label="Primary"] a[href="/services/"]');

      // Click with no pointer hover first (what a touch or programmatic click does).
      await trigger.dispatchEvent("click");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(firstItem).toBeVisible();

      const labels = await page.locator('header nav[aria-label="Primary"] div.absolute a').allTextContents();
      expect(labels, "dropdown entries").toEqual(servicesDropdown.map((i) => i.label));

      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(await page.evaluate(() => document.activeElement?.tagName.toLowerCase())).toBe("button");

      // Hover opens it.
      await trigger.hover();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      // …and then a real click on the trigger. A mouse user always hovers first,
      // so the click toggles the already-open menu shut.
      await trigger.click();
      const afterRealClick = await trigger.getAttribute("aria-expanded");
      fs.writeFileSync(path.join(DATA, "dropdown-hover-click.json"), JSON.stringify({ afterRealClick }, null, 2));
      expect(afterRealClick, "clicking Services after hovering should leave the menu open").toBe("true");
    });

    test("keyboard reaches and opens the dropdown", async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop" && testInfo.project.name !== "wide", "needs the lg nav");
      await page.goto("/");
      await page.keyboard.press("Tab"); // skip link
      await page.keyboard.press("Tab"); // logo
      await page.keyboard.press("Tab"); // Services trigger
      const focused = await page.evaluate(() => document.activeElement?.textContent ?? "");
      expect(focused).toContain("Services");
      await page.keyboard.press("Enter");
      await expect(page.locator('header button:has-text("Services")')).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => document.activeElement?.textContent ?? "")).toBe("Overview");
    });
  });

  test("mobile menu opens, labels flip, links work, closes on navigation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile only");
    await page.goto("/");
    const toggle = page.locator('header button[aria-controls="mobile-menu"]');
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAttribute("aria-label", "Open menu");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("aria-label", "Close menu");
    await expect(page.locator("#mobile-menu")).toBeVisible();

    const expected = [...servicesDropdown, ...primaryNav].map((i) => `${i.href}/`);
    const hrefs = await page.locator("#mobile-menu a").evaluateAll((n) => n.map((a) => a.getAttribute("href")));
    expect(hrefs.slice(0, expected.length)).toEqual(expected);

    // Duplicate destinations inside one panel are an IA smell, so they are recorded.
    const dupes = hrefs.filter((h, i) => hrefs.indexOf(h) !== i);
    fs.writeFileSync(path.join(DATA, "mobile-menu-duplicates.json"), JSON.stringify({ hrefs, dupes }, null, 2));

    // /pricing/ appears twice in this panel — "Pricing & Engagement" under
    // Services and "Pricing" in the primary list. Pick the primary-list one.
    await page.locator("#mobile-menu a", { hasText: /^Pricing$/ }).click();
    await page.waitForURL("**/pricing/");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("aria-current marks the matching nav item on every route", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once on the desktop nav");
    const rows: Record<string, string[]> = {};
    const problems: string[] = [];
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      const current = await page
        .locator('header [aria-current="page"]')
        .evaluateAll((n) => n.map((el) => (el.textContent ?? "").replace(/▾/g, "").trim()));
      rows[route] = current;

      // /pricing/ has its own top-level item, so it marks "Pricing" and not
      // "Services": two current-page markers in one nav told the visitor nothing.
      const expectCurrent =
        route === "/"
          ? []
          : route.startsWith("/services/") || route === "/services/"
            ? ["Services"]
            : primaryNav.filter((i) => route.startsWith(`${i.href}/`)).map((i) => i.label);

      if (expectCurrent.length > 0 && current.length !== 1) {
        problems.push(`${route}: ${current.length} aria-current markers ${JSON.stringify(current)}, expected exactly 1`);
      }
      for (const label of expectCurrent) {
        if (!current.includes(label)) problems.push(`${route}: expected aria-current on "${label}", got ${JSON.stringify(current)}`);
      }
      if (route === "/" && current.length) problems.push(`${route}: home marks ${JSON.stringify(current)} as current but the logo is the only home link`);
    }
    fs.writeFileSync(path.join(DATA, "aria-current.json"), JSON.stringify(rows, null, 2));
    expect(problems, "aria-current coverage").toEqual([]);
  });

  test("primary CTA is one click away and uses one label", async ({ page }, testInfo) => {
    const variants: Record<string, string[]> = {};
    const problems: string[] = [];
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});

      const ctaLabels = await page
        .locator('a[href="/book-a-call/"]')
        .evaluateAll((n) => n.map((a) => (a.textContent ?? "").trim()));
      variants[route] = ctaLabels;
      if (ctaLabels.length === 0) problems.push(`${route}: no link to /book-a-call/`);

      const offLabel = ctaLabels.filter(
        (l) => l !== siteConfig.primaryCta && l !== "Book a Strategy Call"
      );
      if (offLabel.length) problems.push(`${route}: CTA label variants ${JSON.stringify(offLabel)}`);

      // Logo links home from every page.
      await expect(page.locator('header a[href="/"]').first()).toBeVisible();
    }
    fs.writeFileSync(path.join(DATA, `cta-labels-${testInfo.project.name}.json`), JSON.stringify(variants, null, 2));
    expect(problems, "primary CTA reachability and wording").toEqual([]);
  });

  test("back and forward restore page and scroll position", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.goto("/");
    await page.waitForLoadState("load");
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(250);
    const scrolledTo = await page.evaluate(() => Math.round(window.scrollY));

    await page.locator('header a[href="/pricing/"]').click();
    await page.waitForURL("**/pricing/");
    // `html { scroll-behavior: smooth }` turns the router's scroll-to-top into an
    // animation, so sample until it settles rather than reading it immediately.
    const samples: { t: number; y: number }[] = [];
    for (const t of [0, 300, 800, 1500, 2500]) {
      if (t) await page.waitForTimeout(t - (samples.at(-1)?.t ?? 0));
      samples.push({ t, y: await page.evaluate(() => Math.round(window.scrollY)) });
    }
    const settled = samples.at(-1)!.y;
    fs.writeFileSync(path.join(DATA, "scroll-after-nav.json"), JSON.stringify({ samples, settled }, null, 2));
    expect(settled, `new page settled at y=${settled}, not the top`).toBeLessThan(50);

    await page.goBack();
    await page.waitForURL((u) => u.pathname === "/");
    await page.waitForTimeout(600);
    const restored = await page.evaluate(() => Math.round(window.scrollY));
    fs.writeFileSync(path.join(DATA, "scroll-restoration.json"), JSON.stringify({ scrolledTo, restored }, null, 2));

    await page.goForward();
    await page.waitForURL("**/pricing/");
    expect(Math.abs(restored - scrolledTo), `back did not restore scroll (${restored} vs ${scrolledTo})`).toBeLessThan(200);
  });
});
