import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Static export prerenders metadata routes at build time; Next requires the
// intent to be explicit (see the static-exports guide).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.canonicalSiteUrl.replace(/\/$/, "");

  if (siteConfig.siteMode === "preview") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/thank-you", "/booking-confirmed"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
