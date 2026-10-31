import type { Metadata } from "next";
import { Notice } from "@/components/Notice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for this website.",
  alternates: { canonical: "/terms" },
};

const fields: { label: string; value: string }[] = [
  {
    label: "Scope",
    value:
      "These are website terms of use, not a service or engagement agreement. Service terms are set out separately in each client's signed proposal.",
  },
  {
    label: "Business identity",
    value: `This website is operated by ${siteConfig.businessIdentity.legalName ?? siteConfig.brandName}.`,
  },
  {
    label: "Governing law and jurisdiction",
    value:
      "These terms are governed by the laws of Pakistan, and the courts of Pakistan have jurisdiction over any dispute arising from them.",
  },
  {
    label: "Acceptable use of this website",
    value:
      "Use this site to read about the services and to send a genuine enquiry. Please do not submit automated or deliberately false enquiries, attempt to disrupt the site or probe it for vulnerabilities, or reproduce its content for resale.",
  },
  {
    label: "Intellectual property",
    value: `The text, graphics and layout of this website belong to ${siteConfig.businessIdentity.legalName ?? siteConfig.brandName} unless stated otherwise. You are welcome to read, print and share pages for your own reference; reproducing substantial parts commercially needs written permission.`,
  },
  {
    label: "Contact for terms queries",
    value: siteConfig.businessIdentity.contactEmail
      ? `Email ${siteConfig.businessIdentity.contactEmail}.`
      : "To be confirmed before launch.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 sm:py-24">
      {siteConfig.legalContentStatus === "draft" ? (
        <Notice tone="warning" title="Draft — not for publication" className="mb-10">
          This page holds placeholder structure only. It must be completed and approved before
          the site goes live.
        </Notice>
      ) : null}

      <h1 className="text-[32px] sm:text-[40px]">Terms of Website Use</h1>
      <p className="mt-4 text-lg leading-8 text-muted-ink">
        These terms cover use of the {siteConfig.brandName} website only.
      </p>

      <dl className="mt-10 flex flex-col gap-8">
        {fields.map((field) => (
          <div key={field.label} className="border-b border-border pb-8 last:border-0">
            <dt className="text-sm font-semibold uppercase tracking-wide text-primary">
              {field.label}
            </dt>
            <dd className="mt-2 text-base leading-7 text-ink">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
