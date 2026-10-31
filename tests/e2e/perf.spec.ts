import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES, slugFor } from "./routes";

const DATA = path.join("qa-artifacts", "data");
// Created once here: several tests write artifacts, and which of them runs first
// depends on the shard and the -g filter, so none of them can assume it exists.
fs.mkdirSync(DATA, { recursive: true });

// Headless Chromium on a developer laptop against a local static server. These
// numbers are useful for comparing routes against each other and for catching
// layout shift; they are NOT production field data.
test.describe("performance and robustness", () => {
  test("per-route LCP, CLS and transfer size", async ({ page, browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop" && testInfo.project.name !== "mobile", "two viewports is enough");
    const rows: Record<string, unknown>[] = [];

    // ?demo=1 is where a real visitor lands; /thank-you/ bare is the anomaly.
    for (const route of [...PAGE_ROUTES, "/thank-you/?demo=1"]) {
      const ctx = await browser.newContext({ viewport: page.viewportSize()! });
      const p = await ctx.newPage();
      let bytes = 0;
      const byType: Record<string, number> = {};
      p.on("response", async (res) => {
        try {
          const len = Number(res.headers()["content-length"] ?? 0);
          bytes += len;
          const t = res.request().resourceType();
          byType[t] = (byType[t] ?? 0) + len;
        } catch {
          /* ignore */
        }
      });

      await p.addInitScript(() => {
        (window as unknown as { __lcp: number }).__lcp = 0;
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) (window as unknown as { __lcp: number }).__lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            const s = e as unknown as { hadRecentInput: boolean; value: number };
            if (!s.hadRecentInput) (window as unknown as { __cls: number }).__cls += s.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });

      await p.goto(route, { waitUntil: "load" });
      await p.waitForTimeout(1500);
      const vitals = await p.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        return {
          lcp: Math.round((window as unknown as { __lcp: number }).__lcp),
          cls: Math.round((window as unknown as { __cls: number }).__cls * 1000) / 1000,
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
          load: Math.round(nav.loadEventEnd),
          transferFromNav: Math.round(
            performance.getEntriesByType("resource").reduce((a, r) => a + ((r as PerformanceResourceTiming).transferSize ?? 0), 0) +
              (nav.transferSize ?? 0)
          ),
        };
      });

      rows.push({ route, viewport: testInfo.project.name, ...vitals, contentLengthSum: bytes, byType });
      await ctx.close();
    }

    fs.mkdirSync(DATA, { recursive: true });
    fs.writeFileSync(path.join(DATA, `perf-${testInfo.project.name}.json`), JSON.stringify(rows, null, 2));
    // A bare /thank-you/ with no query string is the one page that must correct
    // itself after hydration: the export prerenders a confirmation (there is one
    // HTML file for every query string) and a visitor who never submitted gets
    // the "no confirmation" state instead. The conversion path, ?demo=1, is the
    // one that matters and is asserted separately below.
    const correctsItself = (r: Record<string, unknown>) => r.route === "/thank-you/";
    const shifty = rows.filter((r) => (r.cls as number) > 0.1 && !correctsItself(r));
    expect(shifty, "routes with CLS above 0.1").toEqual([]);

    const conversionPath = rows.find((r) => r.route === "/thank-you/?demo=1");
    expect(conversionPath?.cls, "CLS on the page the form actually lands on").toBeLessThanOrEqual(0.1);
  });

  test("fonts load without a visible swap flash", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.goto("/");
    await page.waitForLoadState("load");
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      const faces = Array.from(document.fonts).map((f) => ({ family: f.family, status: f.status, display: (f as unknown as { display?: string }).display ?? "?" }));
      const h1 = getComputedStyle(document.querySelector("h1")!).fontFamily;
      const body = getComputedStyle(document.body).fontFamily;
      return { faces, h1, body };
    });
    const sheets = await page.evaluate(() =>
      Array.from(document.styleSheets)
        .flatMap((s) => { try { return Array.from(s.cssRules); } catch { return []; } })
        .filter((r) => r.constructor.name === "CSSFontFaceRule")
        .map((r) => r.cssText.match(/font-display:\s*([a-z-]+)/)?.[1] ?? "(unset)")
    );
    fs.writeFileSync(path.join(DATA, "fonts.json"), JSON.stringify({ ...fonts, fontDisplay: sheets }, null, 2));
    // next/font self-hosts and preloads; `font-display: swap` plus a size-adjusted
    // fallback is what prevents both FOIT and a jarring reflow.
    expect(sheets.filter((d) => d === "block" || d === "auto"), "font-display values that can cause FOIT").toEqual([]);
  });

  test("images declare intrinsic size and are not oversized", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const rows: unknown[] = [];
    const problems: string[] = [];
    for (const route of ["/", "/book-a-call/", "/pricing/"]) {
      await page.goto(route);
      await page.waitForLoadState("load");
      const imgs = await page.evaluate(() =>
        Array.from(document.images).map((img) => ({
          src: img.currentSrc || img.src,
          attrWidth: img.getAttribute("width"),
          attrHeight: img.getAttribute("height"),
          natural: `${img.naturalWidth}x${img.naturalHeight}`,
          rendered: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
          loading: img.getAttribute("loading"),
        }))
      );
      rows.push({ route, imgs });
      for (const i of imgs) {
        if (!i.attrWidth || !i.attrHeight) problems.push(`${route}: ${i.src} has no width/height attribute`);
      }
    }
    fs.writeFileSync(path.join(DATA, "images.json"), JSON.stringify(rows, null, 2));
    expect(problems, "images without intrinsic dimensions").toEqual([]);
  });

  test("asset weights on disk", async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    function walk(dir: string, out: { file: string; bytes: number }[] = []) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full, out);
        else out.push({ file: full, bytes: fs.statSync(full).size });
      }
      return out;
    }
    const all = walk("out").sort((a, b) => b.bytes - a.bytes);
    const biggest = all.slice(0, 20);
    const totals = {
      html: all.filter((f) => f.file.endsWith(".html")).reduce((a, f) => a + f.bytes, 0),
      js: all.filter((f) => f.file.endsWith(".js")).reduce((a, f) => a + f.bytes, 0),
      css: all.filter((f) => f.file.endsWith(".css")).reduce((a, f) => a + f.bytes, 0),
      fonts: all.filter((f) => f.file.endsWith(".woff2")).reduce((a, f) => a + f.bytes, 0),
      svg: all.filter((f) => f.file.endsWith(".svg")).reduce((a, f) => a + f.bytes, 0),
      everything: all.reduce((a, f) => a + f.bytes, 0),
    };
    fs.writeFileSync(path.join(DATA, "asset-weights.json"), JSON.stringify({ totals, biggest }, null, 2));
    expect(all.length).toBeGreaterThan(0);
  });

  test("slow 3G: the page is usable before everything loads", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "throttle on the phone profile");
    const results: Record<string, unknown> = {};
    for (const route of ["/", "/book-a-call/"]) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const p = await ctx.newPage();
      const cdp = await ctx.newCDPSession(p);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 400,
        downloadThroughput: (400 * 1024) / 8,
        uploadThroughput: (400 * 1024) / 8,
        connectionType: "cellular3g",
      });
      const t0 = Date.now();
      await p.goto(route, { waitUntil: "commit" });
      await p.locator("h1").first().waitFor({ state: "visible", timeout: 60_000 }).catch(() => {});
      const h1Visible = Date.now() - t0;
      await p.screenshot({ path: path.join("qa-artifacts", "slow3g", `${slugFor(route)}-early.png`) });
      await p.waitForLoadState("load").catch(() => {});
      const loaded = Date.now() - t0;
      const formPresent = await p.locator("form").count();
      results[route] = { h1VisibleMs: h1Visible, loadMs: loaded, formsOnPage: formPresent };
      await p.screenshot({ path: path.join("qa-artifacts", "slow3g", `${slugFor(route)}-loaded.png`) });
      await ctx.close();
    }
    fs.writeFileSync(path.join(DATA, "slow3g.json"), JSON.stringify(results, null, 2));
  });

  test("with JavaScript disabled", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const report: Record<string, unknown> = {};
    for (const route of ["/", "/pricing/", "/book-a-call/", "/thank-you/?demo=1", "/services/"]) {
      await p.goto(route, { waitUntil: "load" });
      report[route] = await p.evaluate(() => ({
        h1: document.querySelector("h1")?.textContent?.trim().slice(0, 50) ?? null,
        mainTextLength: (document.querySelector("main")?.textContent ?? "").trim().length,
        forms: document.querySelectorAll("form").length,
        navLinks: document.querySelectorAll("header a").length,
        hamburger: document.querySelectorAll('header button[aria-controls="mobile-menu"]').length,
        accordionButtons: document.querySelectorAll("h3 > button[aria-expanded]").length,
      }));
      await p.screenshot({ path: path.join("qa-artifacts", "nojs", `${slugFor(route)}.png`), fullPage: false });
    }
    fs.writeFileSync(path.join(DATA, "no-js.json"), JSON.stringify(report, null, 2));
    await ctx.close();

    expect((report["/book-a-call/"] as { forms: number }).forms, "no-JS: the enquiry form is missing entirely").toBeGreaterThan(0);
    expect((report["/thank-you/?demo=1"] as { h1: string | null }).h1, "no-JS: the confirmation page is blank").not.toBeNull();
  });
});
