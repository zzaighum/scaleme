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

export default function sitemap(): MetadataRoute.Sitemap {
  // Preview mode is excluded from indexing entirely (see robots.ts), but the
  // sitemap itself is harmless to generate either way.
  const base = siteConfig.canonicalSiteUrl.replace(/\/$/, "");
  return marketingRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
