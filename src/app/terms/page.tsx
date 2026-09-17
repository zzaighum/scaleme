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
  { label: "Business identity", value: "To be confirmed — real legal entity pending." },
  {
    label: "Governing law and jurisdiction",
    value: "To be confirmed by the business owner before launch.",
  },
  { label: "Acceptable use of this website", value: "To be confirmed before launch." },
  { label: "Intellectual property", value: "To be confirmed before launch." },
  { label: "Contact for terms queries", value: "To be confirmed before launch." },
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
