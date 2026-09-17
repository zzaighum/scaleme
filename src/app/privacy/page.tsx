import type { Metadata } from "next";
import { Notice } from "@/components/Notice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How enquiry and website data is collected, used, and retained.",
  alternates: { canonical: "/privacy" },
};

const fields: { label: string; value: string }[] = [
  { label: "Data controller", value: "To be confirmed — real business name pending." },
  {
    label: "Data collected",
    value: "Name, work email, company website, main IT service, goal/target market, and optional phone number submitted through the enquiry form.",
  },
  {
    label: "Purpose",
    value: "To respond to enquiries about the lead-generation programme and, where agreed, to arrange a strategy call.",
  },
  {
    label: "Service providers",
    value: "To be confirmed — will name the durable storage and notification providers actually connected (e.g. Supabase) once live.",
  },
  { label: "Retention", value: "To be confirmed by the business owner before launch." },
  {
    label: "Contact process",
    value: "To be confirmed — a monitored contact channel will be published here before launch.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 sm:py-24">
      {siteConfig.legalContentStatus === "draft" ? (
        <Notice tone="warning" title="Draft — not for publication" className="mb-10">
          This page holds placeholder structure only. It must be completed and approved with real
          business details before the site goes live.
        </Notice>
      ) : null}

      <h1 className="text-[32px] sm:text-[40px]">Privacy Notice</h1>
      <p className="mt-4 text-lg leading-8 text-muted-ink">
        This notice explains what {siteConfig.brandName} collects through this website and why.
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
