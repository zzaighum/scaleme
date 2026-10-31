import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { channels } from "@/data/services";

const marketingRoutes = [
  "/",
  "/services",
  ...channels.map((c) => `/services/${c.slug}`),
  "/who-we-help",
  "/how-it-works",
  "/our-approach",
  "/pricing",
  "/about",
  "/book-a-call",
  "/privacy",
  "/terms",
];

// Static export prerenders metadata routes at build time; Next requires the
// intent to be explicit (see the static-exports guide).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Preview mode is excluded from indexing entirely (see robots.ts), but the
  // sitemap itself is harmless to generate either way.
  const base = siteConfig.canonicalSiteUrl.replace(/\/$/, "");
  // `trailingSlash: true` means every page is served at `/about/`, and each
  // page's own canonical carries the slash. Emitting `/about` here would
  // advertise a URL that redirects, and point the sitemap at a different
  // string from the canonical it resolves to.
  return marketingRoutes.map((route) => ({
    url: route === "/" ? `${base}/` : `${base}${route}/`,
    lastModified: new Date(),
  }));
}
