"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, servicesDropdown } from "@/data/nav";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Only the Services routes light up the Services trigger. /pricing/ has its own
// top-level item, and marking both left two `aria-current="page"` elements in
// one nav, so neither the eye nor a screen reader could tell which section the
// visitor was in.
function isServicesSection(pathname: string) {
  return isActive(pathname, "/services");
}

export function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesActive = isServicesSection(pathname);

  // Close any open overlay when navigating, without an effect: this follows
  // React's "adjust state during render" pattern for resetting on prop change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setServicesOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        servicesTriggerRef.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [servicesOpen, mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      {/* Between roughly 1024px and 1085px this row wraps to two lines and the
          header grows to ~117px: the wordmark, nav and CTA need about 1056px
          and there isn't room. Reviewed and deliberately left alone (owner,
          26 Oct 2026) — nothing overflows or becomes unreachable, and the band
          is ~60px wide. Don't "fix" it without asking.

          `min-h-24` rather than a fixed `h-24`, and the row is allowed to wrap:
          the nav and CTA are sized in rem, so at 200% text they needed 2265px
          of a 1280px viewport and pushed the CTA off screen. Wrapping trades a
          taller header for keeping every control reachable (WCAG 1.4.4). */}
      <div className="mx-auto flex min-h-24 max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-2 sm:px-6 xl:gap-x-8">
        <Link
          href="/"
          className="flex min-h-[44px] shrink-0 items-center"
          aria-label={`${siteConfig.brandName} home`}
        >
          <Logo
            markClassName="h-5 w-auto sm:h-6 xl:h-7"
            textClassName="text-lg sm:text-xl xl:text-[22px]"
          />
        </Link>

        <nav aria-label="Primary" className="hidden flex-wrap items-center gap-x-5 gap-y-1 lg:flex xl:gap-x-8">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              ref={servicesTriggerRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen(true)}
              onKeyDown={(e) => {
                // Keyboard users get a real toggle; they never hovered first.
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setServicesOpen((v) => !v);
                }
              }}
              className={`flex min-h-[44px] items-center gap-1 text-base font-medium ${
                servicesActive ? "text-primary" : "text-ink"
              }`}
              aria-current={servicesActive ? "page" : undefined}
            >
              Services
              <span aria-hidden="true">▾</span>
            </button>
            {servicesOpen ? (
              <div className="absolute left-0 top-full w-64 rounded-xl border border-border bg-surface py-2 shadow-lg">
                {servicesDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-ink hover:bg-canvas"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`flex min-h-[44px] items-center text-base font-medium ${
                isActive(pathname, item.href) ? "text-primary" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/book-a-call" className="px-5 text-center">
            {siteConfig.primaryCta}
          </ButtonLink>
        </div>

        <button
          ref={mobileTriggerRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {mobileOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-border bg-surface px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-ink">
                Services
              </p>
            </li>
            {servicesDropdown.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-2 py-2.5 text-base text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-2 py-2.5 text-base text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <ButtonLink href="/book-a-call" className="w-full">
              {siteConfig.primaryCta}
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
