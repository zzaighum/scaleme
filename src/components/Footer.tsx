import Link from "next/link";
import { footerLinks, footerLegalLinks } from "@/data/nav";
import { siteConfig } from "@/config/site";

export function Footer() {
  const businessName = siteConfig.businessIdentity.legalName;
  const contactEmail = siteConfig.businessIdentity.contactEmail;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-ink">{siteConfig.brandName}</p>
            <p className="mt-2 text-sm leading-6 text-muted-ink">{siteConfig.descriptor}</p>
            {!businessName ? (
              <p className="mt-4 text-xs leading-5 text-muted-ink">
                Provisional brand name. Legal business identity to be confirmed before launch.
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-ink">Site map</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-ink hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Legal</p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-ink hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {contactEmail ? (
              <p className="mt-4 text-sm text-muted-ink">
                <a href={`mailto:${contactEmail}`} className="hover:text-primary">
                  {contactEmail}
                </a>
              </p>
            ) : (
              <p className="mt-4 text-xs leading-5 text-muted-ink">
                Public contact channel to be confirmed before launch.
              </p>
            )}
          </div>
        </div>

        <p className="mt-12 text-xs text-muted-ink">
          © {new Date().getFullYear()} {businessName ?? `${siteConfig.brandName} (provisional name)`}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
