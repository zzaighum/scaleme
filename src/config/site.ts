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
  // Three words, each capitalised. The wordmark is set from this value in
  // src/components/Logo.tsx, so this is the single place the name lives.
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || "Your Leads Partner",
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

  // Enquiry destination on the static build. There is no `/api/enquiry` here,
  // so the form posts straight to whatever CRM/form endpoint this names
  // (HubSpot, Formspree, Getform, …). Left blank, the form stays an
  // illustrative demo that captures nothing and says so on screen.
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "",

  // Salesforce Web-to-Lead. Setting an org id switches the form from a
  // background JSON fetch to a native form POST, because Salesforce's
  // Web-to-Lead endpoint sends no CORS headers — a background request to it is
  // blocked by the browser, while an ordinary form submission is not. The side
  // effect is that submission then works without JavaScript.
  salesforceOrgId: process.env.NEXT_PUBLIC_SALESFORCE_ORG_ID || "",

  // Google reCAPTCHA v2 site key. Required whenever the Salesforce org has
  // "Require reCAPTCHA Verification" switched on under Web-to-Lead Settings;
  // Salesforce rejects submissions without a token in that case.
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",

  // The nickname given to the key pair inside Salesforce (Setup > Web-to-Lead >
  // reCAPTCHA API Key Pair). Salesforce matches the submission against the key
  // pair by this name, so it is not cosmetic.
  recaptchaKeyName: process.env.NEXT_PUBLIC_RECAPTCHA_KEY_NAME || "",

  // Mirrors "Enable server fallback" in Web-to-Lead Settings: whether
  // Salesforce still accepts a lead when it cannot reach Google to verify.
  recaptchaServerFallback: process.env.NEXT_PUBLIC_RECAPTCHA_FALLBACK !== "false",

  // The 18-character id of a custom field on Lead holding the chosen service
  // (Setup → Object Manager → Lead → Fields). Lead has no stock field for it.
  salesforceServiceFieldId: process.env.NEXT_PUBLIC_SALESFORCE_SERVICE_FIELD_ID || "",

  // Salesforce echoes the submission back to this address instead of creating
  // a Lead. Use it once to confirm the field mapping, then clear it.
  webToLeadDebugEmail: process.env.NEXT_PUBLIC_WEB_TO_LEAD_DEBUG_EMAIL || "",
} as const;

export const isPreview = siteConfig.siteMode === "preview";
export const isSchedulingConfigured = siteConfig.bookingUrl.trim().length > 0;
export const isFormEndpointConfigured = siteConfig.formEndpoint.trim().length > 0;

// Web-to-Lead needs both halves: the endpoint to post to and the org that owns
// the lead. With only one of them set the form stays in its demo state rather
// than posting something Salesforce would silently discard.
export const isWebToLeadConfigured =
  isFormEndpointConfigured && siteConfig.salesforceOrgId.trim().length > 0;
export const isRecaptchaConfigured = siteConfig.recaptchaSiteKey.trim().length > 0;
