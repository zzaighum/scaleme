import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PAGE_ROUTES, EXTRA_ROUTES, ASSET_ROUTES } from "./routes";

// See the other specs: artifact order is not guaranteed, so the directory is
// created once at module load rather than by whichever test happens to run first.
fs.mkdirSync(path.join("qa-artifacts", "data"), { recursive: true });

// Integrity pass. Runs on the `desktop` project only — these assertions are
// viewport-independent and running them four times just quadruples the noise.
test.describe("crawl and integrity", () => {
  type PageLog = {
    route: string;
    consoleErrors: string[];
    consoleWarnings: string[];
    failedRequests: string[];
    abortedPrefetches: string[];
    httpErrors: string[];
  };

  const logs: PageLog[] = [];
  const meta: { route: string; title: string; description: string; canonical: string; h1s: string[] }[] = [];
  const linkGraph: { route: string; href: string }[] = [];

  function attach(page: Page, log: PageLog) {
    page.on("console", (msg) => {
      const text = `${msg.text()}`;
      if (msg.type() === "error") log.consoleErrors.push(text);
      if (msg.type() === "warning") log.consoleWarnings.push(text);
    });
    page.on("requestfailed", (req) => {
      // Next's <Link> prefetch is cancelled whenever a link scrolls out of the
      // root margin, which Chromium reports as ERR_ABORTED. It is harness noise,
      // not a user-visible failure, so it is recorded separately.
      const err = req.failure()?.errorText ?? "unknown";
      const entry = `${req.url()} :: ${err} (${req.resourceType()})`;
      if (err === "net::ERR_ABORTED") log.abortedPrefetches.push(entry);
      else log.failedRequests.push(entry);
    });
    page.on("response", (res) => {
      if (res.status() >= 400) log.httpErrors.push(`${res.status()} ${res.url()}`);
    });
  }

  for (const route of [...PAGE_ROUTES, ...EXTRA_ROUTES]) {
    test(`page integrity ${route}`, async ({ page, baseURL }) => {
      const log: PageLog = { route, consoleErrors: [], consoleWarnings: [], failedRequests: [], abortedPrefetches: [], httpErrors: [] };
      attach(page, log);

      const response = await page.goto(route, { waitUntil: "load" });
      const expected404 = route === "/no-such-page/";
      expect(response, `no response for ${route}`).not.toBeNull();
      expect(response!.status(), `status for ${route}`).toBe(expected404 ? 404 : 200);

      // Redirect chain: the final URL must equal the requested one.
      const requested = new URL(route, baseURL).toString();
      expect(page.url(), `redirected away from ${route}`).toBe(requested);

      const h1s = await page.locator("h1").allTextContents();
      const title = await page.title();
      const description =
        (await page.locator('meta[name="description"]').first().getAttribute("content")) ?? "";
      // Read straight from the DOM: a locator getAttribute auto-waits for a node
      // that is legitimately absent on the noindex pages.
      const canonical = await page.evaluate(
        () => document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""
      );

      meta.push({ route, title, description, canonical, h1s });

      // Images: meaningful alt, actually painted.
      const images = await page.locator("img").evaluateAll((nodes) =>
        nodes.map((n) => {
          const img = n as HTMLImageElement;
          return {
            src: img.getAttribute("src") ?? "",
            alt: img.getAttribute("alt"),
            decorative:
              img.getAttribute("aria-hidden") === "true" || img.getAttribute("role") === "presentation",
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            renderedWidth: Math.round(img.getBoundingClientRect().width),
            renderedHeight: Math.round(img.getBoundingClientRect().height),
            attrWidth: img.getAttribute("width"),
            attrHeight: img.getAttribute("height"),
          };
        })
      );

      const linkHrefs = await page
        .locator("a[href]")
        .evaluateAll((nodes) => nodes.map((n) => (n as HTMLAnchorElement).getAttribute("href") ?? ""));
      for (const href of linkHrefs) linkGraph.push({ route, href });

      // Record rather than hard-fail, so one bad page does not hide the rest.
      fs.mkdirSync(path.join("qa-artifacts", "data"), { recursive: true });
      fs.writeFileSync(
        path.join("qa-artifacts", "data", `integrity-${route.replace(/[^a-z0-9]+/gi, "-") || "home"}.json`),
        JSON.stringify({ route, title, description, canonical, h1s, images, links: linkHrefs, log }, null, 2)
      );

      expect(h1s.length, `h1 count on ${route}`).toBe(1);
      expect(title.length, `empty title on ${route}`).toBeGreaterThan(0);
      expect(description.length, `empty meta description on ${route}`).toBeGreaterThan(0);
      const consoleErrors = expected404
        ? log.consoleErrors.filter((m) => !/status of 404/.test(m))
        : log.consoleErrors;
      expect(consoleErrors, `console errors on ${route}`).toEqual([]);
      expect(log.failedRequests, `failed requests on ${route}`).toEqual([]);

      const brokenImages = images.filter((i) => i.naturalWidth === 0);
      expect(brokenImages, `broken images on ${route}`).toEqual([]);
      // A missing alt is a defect: assistive tech may fall back to the filename.
      // alt="" is the opposite — the deliberate way to mark an image decorative,
      // correct when adjacent text already carries the meaning (the logo mark
      // sits beside the wordmark). So only flag a genuinely absent alt, and an
      // empty one that is not also marked decorative.
      const badAlt = images.filter(
        (i) => i.alt === null || (i.alt.trim() === "" && !i.decorative)
      );
      expect(badAlt, `images with a missing or unmarked-empty alt on ${route}`).toEqual([]);
    });
  }

  test("metadata is unique and sensibly sized", async ({ request, baseURL }) => {
    const dir = path.join("qa-artifacts", "data");
    fs.mkdirSync(dir, { recursive: true });
    const rows = [];
    for (const route of PAGE_ROUTES) {
      const html = await (await request.get(new URL(route, baseURL).toString())).text();
      rows.push({
        route,
        title: (html.match(/<title>([^<]*)<\/title>/) ?? ["", ""])[1],
        description: (html.match(/<meta name="description" content="([^"]*)"/) ?? ["", ""])[1],
        canonical: (html.match(/<link rel="canonical" href="([^"]*)"/) ?? ["", ""])[1],
      });
    }

    const problems: string[] = [];
    const titles = new Map<string, string[]>();
    const descs = new Map<string, string[]>();
    for (const r of rows) {
      titles.set(r.title, [...(titles.get(r.title) ?? []), r.route]);
      descs.set(r.description, [...(descs.get(r.description) ?? []), r.route]);
      if (!r.description) problems.push(`no meta description on ${r.route}`);
      if (r.title.length > 60) problems.push(`title ${r.title.length} chars on ${r.route}: ${r.title}`);
      if (r.description.length > 160)
        problems.push(`description ${r.description.length} chars on ${r.route}`);
      const noindex = ["/thank-you/", "/booking-confirmed/"].includes(r.route);
      if (!r.canonical) {
        if (!noindex) problems.push(`no canonical on ${r.route}`);
      } else if (!r.canonical.endsWith("/")) {
        problems.push(`canonical without trailing slash on ${r.route}: ${r.canonical}`);
      } else if (r.canonical.includes("localhost")) {
        problems.push(`canonical points at localhost on ${r.route}: ${r.canonical}`);
      }
    }
    for (const [t, routes] of titles) if (routes.length > 1) problems.push(`duplicate title "${t}" on ${routes.join(", ")}`);
    for (const [d, routes] of descs)
      if (routes.length > 1) problems.push(`duplicate description on ${routes.join(", ")}`);

    fs.writeFileSync(path.join(dir, "metadata-problems.json"), JSON.stringify(problems, null, 2));
    expect(problems, "metadata problems").toEqual([]);
  });

  test("every internal link resolves without redirect", async ({ request, baseURL }) => {
    const dir = path.join("qa-artifacts", "data");
    fs.mkdirSync(dir, { recursive: true });
    const hrefs = new Set<string>();
    for (const route of [...PAGE_ROUTES, "/no-such-page/"]) {
      const html = await (await request.get(new URL(route, baseURL).toString())).text();
      for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
        const href = m[1].split("#")[0];
        if (!href.startsWith("/_next/")) hrefs.add(href);
      }
    }

    const problems: string[] = [];
    for (const href of [...hrefs].sort()) {
      const res = await request.get(new URL(href, baseURL).toString(), { maxRedirects: 0 });
      if (res.status() !== 200) problems.push(`${href} -> ${res.status()} ${res.headers()["location"] ?? ""}`);
      const isPageLike = !/\.[a-z0-9]{2,5}($|\?)/i.test(href) && href !== "/opengraph-image";
      if (isPageLike && !href.endsWith("/")) problems.push(`${href} has no trailing slash`);
    }
    fs.writeFileSync(path.join(dir, "link-problems.json"), JSON.stringify({ checked: hrefs.size, problems }, null, 2));
    expect(problems, "internal link problems").toEqual([]);
  });

  test("nav data is fully represented in the rendered header and footer", async ({ page }, testInfo) => {
    test.skip(!["desktop", "wide"].includes(testInfo.project.name), "needs the lg nav");
    const { primaryNav, servicesDropdown, footerServicesLinks, footerMethodologyLinks, footerCompanyLinks, footerLegalLinks } =
      await import("../../src/data/nav");
    await page.goto("/");
    const missing: string[] = [];

    for (const item of primaryNav) {
      const count = await page.locator(`header a[href="${item.href}/"]`).count();
      if (count === 0) missing.push(`header missing ${item.href}`);
    }
    await page.locator("header button", { hasText: "Services" }).click();
    for (const item of servicesDropdown) {
      const href = item.href === "/" ? "/" : `${item.href}/`;
      if ((await page.locator(`header a[href="${href}"]`).count()) === 0)
        missing.push(`services dropdown missing ${item.href}`);
    }
    for (const item of [...footerServicesLinks, ...footerMethodologyLinks, ...footerCompanyLinks, ...footerLegalLinks]) {
      if ((await page.locator(`footer a[href="${item.href}/"]`).count()) === 0)
        missing.push(`footer missing ${item.href}`);
    }
    expect(missing, "nav coverage").toEqual([]);
  });

  test("robots, sitemap and og image", async ({ request, baseURL }) => {
    const notes: Record<string, unknown> = {};

    const robots = await request.get(new URL("/robots.txt", baseURL).toString());
    notes.robotsStatus = robots.status();
    notes.robotsBody = await robots.text();

    const sitemap = await request.get(new URL("/sitemap.xml", baseURL).toString());
    notes.sitemapStatus = sitemap.status();
    const xml = await sitemap.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    notes.locs = locs;
    notes.locsWithoutTrailingSlash = locs.filter((l) => !new URL(l).pathname.endsWith("/"));
    notes.locsOnLocalhost = locs.filter((l) => l.includes("localhost"));

    const og = await request.get(new URL("/opengraph-image", baseURL).toString());
    notes.ogStatus = og.status();
    notes.ogContentType = og.headers()["content-type"] ?? "(none)";
    const ogBody = await og.body();
    notes.ogBytes = ogBody.byteLength;
    notes.ogIsPng = ogBody.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    notes.ogContentTypeNote =
      "Served by `serve`, which ignores .htaccess. ForceType image/png is set there; verify on the host.";

    fs.mkdirSync(path.join("qa-artifacts", "data"), { recursive: true });
    fs.writeFileSync(path.join("qa-artifacts", "data", "seo-assets.json"), JSON.stringify(notes, null, 2));

    expect(notes.robotsStatus).toBe(200);
    expect(notes.sitemapStatus).toBe(200);
    expect(notes.ogStatus).toBe(200);
    expect(notes.locsWithoutTrailingSlash, "sitemap locs missing trailing slash").toEqual([]);
    expect(notes.locsOnLocalhost, "sitemap locs pointing at localhost").toEqual([]);
    // The exported file is `out/opengraph-image` with no extension. Its
    // Content-Type comes from the ForceType rule in public/.htaccess, which the
    // static dev server does not read — so assert the bytes are a real PNG here
    // and confirm the header on the host after deploy.
    expect(notes.ogIsPng, "og image is a valid PNG").toBe(true);
  });

  test("asset routes respond", async ({ request, baseURL }) => {
    for (const route of ASSET_ROUTES) {
      const res = await request.get(new URL(route, baseURL).toString());
      expect(res.status(), `${route} status`).toBe(200);
    }
  });
});
