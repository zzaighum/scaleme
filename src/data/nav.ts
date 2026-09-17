import { channels } from "./services";

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Who We Help", href: "/who-we-help" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "About", href: "/about" },
];

export const servicesDropdown: NavLink[] = [
  { label: "Overview", href: "/services" },
  ...channels.map((c) => ({ label: c.navLabel, href: `/services/${c.slug}` })),
  { label: "Pricing & Engagement", href: "/pricing" },
];

export const footerLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  ...channels.map((c) => ({ label: c.navLabel, href: `/services/${c.slug}` })),
  { label: "Who We Help", href: "/who-we-help" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "Pricing & Engagement", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Book a Strategy Call", href: "/book-a-call" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
