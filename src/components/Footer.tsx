import Link from "next/link";
import {
  footerServicesLinks,
  footerMethodologyLinks,
  footerCompanyLinks,
  footerLegalLinks,
} from "@/data/nav";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./Icon";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-ink">{title}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const businessName = siteConfig.businessIdentity.legalName;
  const contactEmail = siteConfig.businessIdentity.contactEmail;
  const legalTitle = siteConfig.legalContentStatus === "draft" ? "Legal (Draft Preview)" : "Legal";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold text-ink">
              <BrandMark className="h-7 w-7" />
              {siteConfig.brandName}
            </p>
            <p className="mt-3 max-w-[34ch] text-sm leading-6 text-muted-ink">
              We help IT companies reach relevant buyers through focused research, coordinated
              outreach, and clear qualification.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                IT lead generation
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-ink">
                Worldwide reach
              </span>
            </div>
            {!businessName ? (
              <p className="mt-4 text-xs leading-5 text-muted-ink">
                Provisional brand name. Legal business identity to be confirmed before launch.
              </p>
            ) : null}
          </div>

          <FooterColumn title="Services" links={footerServicesLinks} />
          <FooterColumn title="Methodology & Fit" links={footerMethodologyLinks} />

          <div>
            <FooterColumn title="Company" links={footerCompanyLinks} />
            <div className="mt-8">
              <FooterColumn title={legalTitle} links={footerLegalLinks} />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-ink">
            © {new Date().getFullYear()} {businessName ?? `${siteConfig.brandName} (provisional name)`}.
            All rights reserved.
            {siteConfig.siteMode === "preview" ? " Self-contained build preview." : ""}
          </p>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`} className="text-xs text-muted-ink hover:text-primary">
              {contactEmail}
            </a>
          ) : (
            <p className="text-xs text-muted-ink">Public contact channel to be confirmed before launch.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
