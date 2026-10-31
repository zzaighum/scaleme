import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES, EXTRA_ROUTES, slugFor } from "./routes";

const DATA = path.join("qa-artifacts", "data");
// Created once here: several tests write artifacts, and which of them runs first
// depends on the shard and the -g filter, so none of them can assume it exists.
fs.mkdirSync(DATA, { recursive: true });
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

test.describe("accessibility", () => {
  

  for (const route of [...PAGE_ROUTES, ...EXTRA_ROUTES]) {
    test(`axe ${route}`, async ({ page }, testInfo) => {
      test.skip(!["mobile", "desktop"].includes(testInfo.project.name), "axe runs at mobile and desktop");
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        tags: v.tags.filter((t) => t.startsWith("wcag")),
        nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target.join(" "), summary: (n.failureSummary ?? "").split("\n").slice(0, 3).join(" | ") })),
      }));
      fs.mkdirSync(DATA, { recursive: true });
      fs.writeFileSync(path.join(DATA, `axe-${testInfo.project.name}-${slugFor(route)}.json`), JSON.stringify(summary, null, 2));
      expect(summary, `axe violations on ${route} @${testInfo.project.name}`).toEqual([]);
    });
  }

  test("skip link is hidden, reveals on focus, and moves focus to main", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.goto("/");
    await page.waitForLoadState("load");
    const link = page.locator("a.skip-link");
    const before = await link.boundingBox();
    await page.keyboard.press("Tab");
    await page.waitForTimeout(300);
    const after = await link.boundingBox();
    const focusedIsSkip = await page.evaluate(() => document.activeElement?.classList.contains("skip-link"));
    expect(focusedIsSkip, "first Tab should land on the skip link").toBe(true);
    // Its *bottom* edge, not its top: asserting only `y < 0` passed while ~5px
    // of a 53px link sat visible in the corner of every page, which is how that
    // bug survived the first pass. Clearance rather than <= 0, because a bottom
    // edge at exactly zero still paints a hairline.
    expect(
      before!.y + before!.height,
      `skip link must be wholly off-screen when unfocused (bottom edge at ${before!.y + before!.height})`
    ).toBeLessThanOrEqual(-8);
    expect(after!.y, "skip link should be on-screen once focused").toBeGreaterThanOrEqual(0);

    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    const landed = await page.evaluate(() => ({
      hash: location.hash,
      active: document.activeElement?.id || document.activeElement?.tagName,
      scrollY: Math.round(window.scrollY),
    }));
    fs.writeFileSync(path.join(DATA, "skip-link.json"), JSON.stringify({ before, after, landed }, null, 2));
    expect(landed.hash).toBe("#main-content");
    // A plain #id target is not focusable, so focus stays on <body> unless the
    // target carries tabindex="-1".
    expect(landed.active, "focus should move into main, not back to body").toBe("main-content");
  });

  test("every interactive element keeps a visible focus indicator", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const problems: string[] = [];
    for (const route of ["/", "/book-a-call/", "/pricing/", "/services/"]) {
      await page.goto(route);
      await page.waitForLoadState("load");
      const found = await page.evaluate(() => {
        const out: string[] = [];
        const els = Array.from(document.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea"));
        for (const el of els) {
          if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
          el.focus();
          const cs = getComputedStyle(el);
          const hasOutline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
          const hasRing = cs.boxShadow !== "none";
          if (!hasOutline && !hasRing) {
            out.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}" outline=${cs.outline} shadow=${cs.boxShadow}`);
          }
        }
        return out;
      });
      if (found.length) problems.push(`${route}: ${found.slice(0, 5).join(" ;; ")}`);
    }
    fs.writeFileSync(path.join(DATA, "focus-visible.json"), JSON.stringify(problems, null, 2));
    expect(problems, "elements with no visible focus indicator").toEqual([]);
  });

  test("tab traversal reaches every control and never lands in a hidden one", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const report: Record<string, unknown> = {};
    for (const route of ["/", "/pricing/", "/book-a-call/"]) {
      await page.goto(route);
      await page.waitForLoadState("load");
      const seen: string[] = [];
      let hiddenHits = 0;
      await page.locator("body").press("Tab");
      for (let i = 0; i < 90; i++) {
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const hidden = (r.width === 0 && r.height === 0) || cs.visibility === "hidden" || cs.display === "none" || !!el.closest("[hidden]") || (!!el.closest("details:not([open])") && !el.closest("summary"));
          return { key: `${el.tagName}:${(el.textContent ?? "").trim().slice(0, 24) || el.id}`, hidden };
        });
        if (!info) break;
        if (info.hidden) hiddenHits++;
        if (seen.includes(info.key) && seen.length > 3) break;
        seen.push(info.key);
        await page.keyboard.press("Tab");
      }
      report[route] = { stops: seen.length, hiddenHits, firstFew: seen.slice(0, 6) };
      expect(hiddenHits, `focus landed on a hidden element on ${route}`).toBe(0);
    }
    fs.writeFileSync(path.join(DATA, "tab-traversal.json"), JSON.stringify(report, null, 2));
  });

  test("heading order on every route", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const report: Record<string, unknown> = {};
    const problems: string[] = [];
    for (const route of PAGE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.locator("h1").first().waitFor({ state: "attached", timeout: 10_000 }).catch(() => {});
      const levels = await page.evaluate(() =>
        Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => ({ level: Number(h.tagName[1]), text: (h.textContent ?? "").trim().slice(0, 40) }))
      );
      report[route] = levels;
      for (let i = 1; i < levels.length; i++) {
        if (levels[i].level - levels[i - 1].level > 1) {
          problems.push(`${route}: h${levels[i - 1].level} "${levels[i - 1].text}" -> h${levels[i].level} "${levels[i].text}"`);
        }
      }
      if (levels[0]?.level !== 1) problems.push(`${route}: first heading is h${levels[0]?.level}`);
    }
    fs.writeFileSync(path.join(DATA, "heading-order.json"), JSON.stringify({ problems, report }, null, 2));
    expect(problems, "heading level problems").toEqual([]);
  });

  test("prefers-reduced-motion is honoured", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pricing/");
    await page.waitForLoadState("load");
    const styles = await page.evaluate(() => {
      const html = getComputedStyle(document.documentElement);
      const chevron = document.querySelector("details summary span[aria-hidden]");
      return {
        scrollBehavior: html.scrollBehavior,
        chevronTransition: chevron ? getComputedStyle(chevron).transitionDuration : "n/a",
      };
    });
    fs.writeFileSync(path.join(DATA, "reduced-motion.json"), JSON.stringify(styles, null, 2));
    expect(styles.scrollBehavior).toBe("auto");
    expect(parseFloat(styles.chevronTransition)).toBeLessThan(0.05);
  });

  test("dark colour-scheme does not produce unreadable text", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("load");
    const sample = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const h1 = document.querySelector("h1")!;
      return { bodyBg: body.backgroundColor, bodyColor: body.color, h1Color: getComputedStyle(h1).color };
    });
    fs.writeFileSync(path.join(DATA, "dark-scheme.json"), JSON.stringify(sample, null, 2));
    await page.screenshot({ path: path.join("qa-artifacts", "fold", "desktop-home-dark.png") });
    expect(sample.bodyBg, "body must declare its own background, not inherit the UA dark default").not.toBe("rgba(0, 0, 0, 0)");
  });

  test("computed contrast of the token palette", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.goto("/");
    await page.waitForLoadState("load");

    // Token values are read from globals.css directly: `@theme inline` aliases
    // each token to itself, so getComputedStyle returns the guaranteed-invalid
    // value for several of them and computing from the DOM silently lies.
    const pairs = await page.evaluate(() => {
      const T: Record<string, string> = {
        canvas: "#f7f8f4", surface: "#ffffff", ink: "#142b3b", muted: "#52616b",
        primary: "#11635c", primaryHover: "#0c4a45", accent: "#d96b49",
        accentText: "#a8431f", border: "#dce4df", fieldBorder: "#808e88",
        dark: "#142b3b", darkFg: "#f7f8f4", white: "#ffffff",
      };
      const srgb = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      const lum = (hex: string) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255); };
      const ratio = (a: string, b: string) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100; };
      const blend = (fg: string, alpha: number, bg: string) => {
        const f = parseInt(fg.slice(1), 16), b = parseInt(bg.slice(1), 16);
        let out = 0;
        for (const sh of [16, 8, 0]) out |= Math.round((((f >> sh) & 255) * alpha + ((b >> sh) & 255) * (1 - alpha))) << sh;
        return "#" + (out >>> 0).toString(16).padStart(6, "0");
      };
      const P = (name: string, fg: string, bg: string, need: number) => ({ name, fg, bg, ratio: ratio(fg, bg), need });
      return [
        P("ink on canvas (body text)", T.ink, T.canvas, 4.5),
        P("ink on surface (card text)", T.ink, T.surface, 4.5),
        P("muted-ink on canvas (secondary body)", T.muted, T.canvas, 4.5),
        P("muted-ink on surface", T.muted, T.surface, 4.5),
        P("white on primary (button label)", T.white, T.primary, 4.5),
        P("white on primary-hover", T.white, T.primaryHover, 4.5),
        P("primary on canvas (link)", T.primary, T.canvas, 4.5),
        P("primary on surface (link)", T.primary, T.surface, 4.5),
        // accent-text is what carries words; plain accent is fills and borders only.
        P("accent-text on surface (form error text)", T.accentText, T.surface, 4.5),
        P("accent-text on canvas (form error text)", T.accentText, T.canvas, 4.5),
        P("accent-text on accent/10 over surface (demo badge)", T.accentText, blend(T.accent, 0.1, T.surface), 4.5),
        P("accent-text on accent/10 over canvas (illustrative chip)", T.accentText, blend(T.accent, 0.1, T.canvas), 4.5),
        P("white/80 on primary (section eyebrow, 14px)", blend(T.white, 0.8, T.primary), T.primary, 4.5),
        P("white/70 on dark (footer band)", blend(T.white, 0.7, T.dark), T.dark, 4.5),
        P("dark-fg on dark (preview banner)", T.darkFg, T.dark, 4.5),
        P("accent focus ring on canvas (1.4.11, 3:1)", T.accent, T.canvas, 3),
        P("accent focus ring on surface (1.4.11, 3:1)", T.accent, T.surface, 3),
        P("field-border on surface (input outline, 1.4.11, 3:1)", T.fieldBorder, T.surface, 3),
        P("field-border on canvas (1.4.11, 3:1)", T.fieldBorder, T.canvas, 3),
        P("accent as the error-state field border (1.4.11, 3:1)", T.accent, T.surface, 3),
      ];
    });

    fs.writeFileSync(path.join(DATA, "contrast.json"), JSON.stringify(pairs, null, 2));
    const failures = pairs.filter((p) => p.ratio < p.need);
    expect(failures, "contrast pairs below their threshold").toEqual([]);
  });
});
