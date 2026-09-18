import { channels } from "./services";

export type NavLink = { label: string; href: string };

// Header nav labels follow the Figma hero frame: "Industries" is the label
// used there for the Who We Help route, and Pricing is surfaced top level in
// addition to sitting inside the Services dropdown.
export const primaryNav: NavLink[] = [
  { label: "Industries", href: "/who-we-help" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Our approach", href: "/our-approach" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const servicesDropdown: NavLink[] = [
  { label: "Overview", href: "/services" },
  ...channels.map((c) => ({ label: c.navLabel, href: `/services/${c.slug}` })),
  { label: "Pricing & Engagement", href: "/pricing" },
];

export const footerServicesLinks: NavLink[] = [
  { label: "Overview", href: "/services" },
  ...channels.map((c) => ({ label: c.navLabel, href: `/services/${c.slug}` })),
  { label: "Pricing & Engagement", href: "/pricing" },
];

export const footerMethodologyLinks: NavLink[] = [
  { label: "Who We Help", href: "/who-we-help" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Our Approach", href: "/our-approach" },
];

export const footerCompanyLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Book a Strategy Call", href: "/book-a-call" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
