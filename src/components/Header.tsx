"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, servicesDropdown } from "@/data/nav";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "./Button";
import { BrandMark } from "./Icon";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesActive = isActive(pathname, "/services") || isActive(pathname, "/pricing");

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
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink">
          <BrandMark className="h-8 w-8" />
          {siteConfig.brandName}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
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
              onClick={() => setServicesOpen((v) => !v)}
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
              className={`text-base font-medium ${
                isActive(pathname, item.href) ? "text-primary" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/book-a-call">{siteConfig.primaryCta}</ButtonLink>
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
