import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES, EXTRA_ROUTES, slugFor } from "./routes";

const ALL = [...PAGE_ROUTES, ...EXTRA_ROUTES];

// Hydration matters here: /thank-you/ ships an empty <main> and only fills in
// after JS runs, so waiting for the h1 avoids screenshotting a blank page.
async function settle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("load");
  await page.locator("h1").first().waitFor({ state: "attached", timeout: 15_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}

test.describe("responsive and visual", () => {
  for (const route of ALL) {
    test(`layout ${route}`, async ({ page }, testInfo) => {
      const viewport = testInfo.project.name;
      const width = page.viewportSize()!.width;
      await page.goto(route);
      await settle(page);

      const dir = path.join("qa-artifacts", viewport);
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${slugFor(route)}.png`), fullPage: true });

      // 1. Horizontal overflow, with the widest offending element named.
      const overflow = await page.evaluate((vw) => {
        const doc = document.documentElement;
        const scrollWidth = doc.scrollWidth;
        if (scrollWidth <= vw + 1) return { scrollWidth, offenders: [] as string[] };
        const offenders: string[] = [];
        for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right > vw + 1 || r.left < -1) {
            const id = el.id ? `#${el.id}` : "";
            const cls = el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).slice(0, 4).join(".")}` : "";
            offenders.push(`${el.tagName.toLowerCase()}${id}${cls} left=${Math.round(r.left)} right=${Math.round(r.right)}`);
          }
        }
        return { scrollWidth, offenders: offenders.slice(0, 10) };
      }, width);

      // 2. Clipped text: overflow:hidden boxes whose content is taller than the box.
      // Decorative absolutely-positioned gradient blobs are *meant* to be clipped
      // by their rounded container, and .sr-only is clipped by definition, so
      // neither counts. What matters is clipped text.
      const clipped = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((el) => {
            const cs = getComputedStyle(el);
            if (cs.overflowY !== "hidden" && cs.overflow !== "hidden") return false;
            if (el.classList.contains("sr-only")) return false;
            const text = el.textContent?.trim();
            if (!text) return false;
            const verticallyClipped = el.scrollHeight > el.clientHeight + 2;
            const horizontallyClipped = Array.from(el.querySelectorAll<HTMLElement>("*")).some((c) => {
              if (getComputedStyle(c).position === "absolute" && !c.textContent?.trim()) return false;
              const cr = c.getBoundingClientRect();
              const er = el.getBoundingClientRect();
              // An SVG <title> carries text but has no box; it reports 0,0 and
              // would look like it had escaped any container not at the origin.
              if (cr.width === 0 && cr.height === 0) return false;
              return c.textContent?.trim() && (cr.right > er.right + 2 || cr.left < er.left - 2);
            });
            return verticallyClipped || horizontallyClipped;
          })
          .slice(0, 10)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).slice(0, 3).join(".")} scrollH=${el.scrollHeight} clientH=${el.clientHeight}`)
      );

      // 3. Tap targets, mobile only.
      let smallTargets: string[] = [];
      if (viewport === "mobile") {
        smallTargets = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea"))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) return false; // hidden
              if (getComputedStyle(el).visibility === "hidden") return false;
              // Honeypots and other deliberately unreachable controls are not
              // tap targets: nobody can reach them to tap.
              if (el.getAttribute("aria-hidden") === "true" || el.tabIndex === -1) return false;
              // Height is the project's `min-h-[44px]` target. Width follows the
              // label, so a short word like "Terms" is legitimately narrower and
              // still clears WCAG 2.5.8 on spacing; only icon-only controls are
              // held to 44 in both directions.
              const iconOnly = !(el.textContent ?? "").trim();
              // A link inside a running sentence cannot be a 44px-tall box
              // without breaking the line it sits in. WCAG 2.5.8 covers these
              // through its spacing exception, so only standalone controls are
              // held to the project's 44px aim.
              const parent = el.parentElement;
              const inlineInProse =
                el.tagName === "A" &&
                !!parent &&
                (parent.textContent ?? "").trim().length >
                  (el.textContent ?? "").trim().length + 10;
              if (inlineInProse) return false;
              return iconOnly ? r.width < 44 || r.height < 44 : r.height < 44;
            })
            .map((el) => {
              const r = el.getBoundingClientRect();
              const label = (el.textContent ?? "").trim().slice(0, 40) || el.getAttribute("aria-label") || el.getAttribute("href") || el.tagName;
              return `${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`;
            })
        );
      }

      // 4. Body copy measure.
      const measures = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("p, li"))
          .map((el) => {
            const text = (el.textContent ?? "").trim();
            if (text.length < 60) return null;
            const r = el.getBoundingClientRect();
            const fontSize = parseFloat(getComputedStyle(el).fontSize);
            // ~0.5em average glyph advance for these faces.
            const chars = Math.round(r.width / (fontSize * 0.5));
            return { chars, width: Math.round(r.width), fontSize, snippet: text.slice(0, 50) };
          })
          .filter(Boolean)
      );
      const longMeasure = (measures as { chars: number; snippet: string }[]).filter((m) => m.chars > 85);

      const report = { route, viewport, width, overflow, clipped, smallTargets, longMeasureCount: longMeasure.length, longMeasure: longMeasure.slice(0, 5) };
      fs.mkdirSync(path.join("qa-artifacts", "data"), { recursive: true });
      fs.writeFileSync(path.join("qa-artifacts", "data", `layout-${viewport}-${slugFor(route)}.json`), JSON.stringify(report, null, 2));

      expect(overflow.offenders, `horizontal overflow on ${route} @${viewport} (scrollWidth ${overflow.scrollWidth} > ${width})`).toEqual([]);
      expect(clipped, `clipped text on ${route} @${viewport}`).toEqual([]);
      expect(smallTargets, `tap targets under 44px on ${route} @${viewport}`).toEqual([]);
    });
  }

  test("breakpoint boundary at 1023 and 1024", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    const results: Record<string, unknown> = {};
    for (const w of [1023, 1024, 1025]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("/pricing/");
      await page.waitForLoadState("load");
      results[`w${w}`] = {
        desktopNavVisible: await page.locator('header nav[aria-label="Primary"]').isVisible(),
        hamburgerVisible: await page.locator('header button[aria-controls="mobile-menu"]').isVisible(),
        headerCtaVisible: await page.locator("header a", { hasText: "Book a Strategy Call" }).first().isVisible(),
        scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
        headerHeight: await page.locator("header > div").first().evaluate((el) => Math.round(el.getBoundingClientRect().height)),
      };
    }
    fs.writeFileSync(path.join("qa-artifacts", "data", "breakpoint-boundary.json"), JSON.stringify(results, null, 2));

    // Exactly one navigation affordance at each probed width.
    for (const [w, r] of Object.entries(results) as [string, Record<string, boolean | number>][]) {
      expect(Number(r.desktopNavVisible) + Number(r.hamburgerVisible), `nav affordances at ${w}`).toBe(1);
      expect(r.scrollWidth, `overflow at ${w}`).toBeLessThanOrEqual(Number(w.slice(1)) + 1);
    }
  });

  test("sticky header does not cover an anchored target", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "run once");
    await page.goto("/book-a-call/#main-content");
    await page.waitForLoadState("load");
    const geom = await page.evaluate(() => {
      const header = document.querySelector("header")!.getBoundingClientRect();
      const main = document.getElementById("main-content")!.getBoundingClientRect();
      const h1 = document.querySelector("h1")!.getBoundingClientRect();
      return { headerBottom: Math.round(header.bottom), mainTop: Math.round(main.top), h1Top: Math.round(h1.top), h1Bottom: Math.round(h1.bottom) };
    });
    fs.writeFileSync(path.join("qa-artifacts", "data", "sticky-anchor.json"), JSON.stringify(geom, null, 2));
    expect(geom.h1Top, "h1 hidden behind the sticky header after an anchor jump").toBeGreaterThanOrEqual(geom.headerBottom);
  });

  test("reflow at 320px and 200% text", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "run once");
    const findings: Record<string, unknown> = {};
    await page.setViewportSize({ width: 320, height: 800 });
    for (const route of ["/", "/book-a-call/", "/pricing/", "/services/marketplace-prospecting/"]) {
      await page.goto(route);
      await page.waitForLoadState("load");
      findings[`320-${route}`] = await page.evaluate(() => document.documentElement.scrollWidth);
      await page.screenshot({ path: path.join("qa-artifacts", "reflow", `w320${slugFor(route)}.png`), fullPage: true });
    }
    // 200% text: emulate by doubling the root font size, which is what a
    // text-only zoom does; page zoom is covered by the 320px pass.
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const route of ["/", "/book-a-call/"]) {
      await page.goto(route);
      await page.addStyleTag({ content: "html{font-size:200%} body{font-size:36px}" });
      await page.waitForTimeout(200);
      findings[`text200-${route}`] = await page.evaluate(() => {
        const vw = 1280;
        const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((el) => el.getBoundingClientRect().right > vw + 1)
          .slice(0, 8)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right=${Math.round(el.getBoundingClientRect().right)}`);
        return { scrollWidth: document.documentElement.scrollWidth, offenders };
      });
      await page.screenshot({ path: path.join("qa-artifacts", "reflow", `text200${slugFor(route)}.png`), fullPage: true });
    }
    fs.writeFileSync(path.join("qa-artifacts", "data", "reflow.json"), JSON.stringify(findings, null, 2));
    for (const [k, v] of Object.entries(findings)) {
      const limit = k.startsWith("320") ? 321 : 1281;
      const width = typeof v === "number" ? v : (v as { scrollWidth: number }).scrollWidth;
      expect(width, `horizontal scroll in ${k}: ${JSON.stringify(v)}`).toBeLessThanOrEqual(limit);
    }
  });
});
