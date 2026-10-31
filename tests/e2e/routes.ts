// Shared route list. Every entry carries the trailing slash the export emits.
export const PAGE_ROUTES = [
  "/",
  "/who-we-help/",
  "/how-it-works/",
  "/our-approach/",
  "/pricing/",
  "/about/",
  "/services/",
  "/services/cold-email/",
  "/services/linkedin-outreach/",
  "/services/cold-calling/",
  "/services/marketplace-prospecting/",
  "/book-a-call/",
  "/thank-you/",
  "/booking-confirmed/",
  "/privacy/",
  "/terms/",
] as const;

export const EXTRA_ROUTES = ["/thank-you/?demo=1", "/no-such-page/"] as const;

export const ASSET_ROUTES = ["/robots.txt", "/sitemap.xml", "/opengraph-image"] as const;

export function slugFor(route: string): string {
  const cleaned = route.replace(/\?/g, "_q_").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "home";
}
