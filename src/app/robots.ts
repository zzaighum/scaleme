import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

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
      disallow: ["/api/", "/thank-you", "/booking-confirmed"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
