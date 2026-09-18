// Central site configuration. Change branding/content behaviour here rather than in components.
// Public (NEXT_PUBLIC_*) values are readable in the browser — never put secrets here.

export type SiteMode = "preview" | "live";
export type BookingMode = "external" | "connected";

function asSiteMode(value: string | undefined): SiteMode {
  return value === "live" ? "live" : "preview";
}

function asBookingMode(value: string | undefined): BookingMode {
  return value === "connected" ? "connected" : "external";
}

export const siteConfig = {
  // Brand
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "ScaleMe",
  brandStatus: "provisional" as const,
  descriptor: "Lead generation for IT companies",
  supportingLine: "Better conversations for IT companies.",

  // Mode
  siteMode: asSiteMode(process.env.NEXT_PUBLIC_SITE_MODE),

  // Conversion vocabulary — keep consistent across every page
  primaryCta: "Book a Strategy Call",
  secondaryCta: "See How It Works",
  formSubmitLabel: "Send My Brief",
  callDurationMinutes: 30,

  // Locale / scope
  primaryLanguage: "en",
  marketplaceDisplay: "general" as const,

  // Evidence toggles — off until approved material exists
  testimonialsEnabled: false,
  caseStudiesEnabled: false,
  teamEnabled: false,

  // Commercial model
  pricingMode: "quote" as const,

  // Identity — fill in before public launch
  canonicalSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  businessIdentity: {
    legalName: process.env.NEXT_PUBLIC_LEGAL_BUSINESS_NAME || null,
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  },
  legalContentStatus: "draft" as const,

  // Booking
  bookingMode: asBookingMode(process.env.NEXT_PUBLIC_BOOKING_MODE),
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
} as const;

export const isPreview = siteConfig.siteMode === "preview";
export const isSchedulingConfigured = siteConfig.bookingUrl.trim().length > 0;
