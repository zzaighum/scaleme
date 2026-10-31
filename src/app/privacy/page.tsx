import type { Metadata } from "next";
import { Notice } from "@/components/Notice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How enquiry and website data is collected, used, and retained.",
  alternates: { canonical: "/privacy" },
};

const fields: { label: string; value: string }[] = [
  {
    label: "Data controller",
    value: `${siteConfig.businessIdentity.legalName ?? siteConfig.brandName}. Contact details below.`,
  },
  {
    label: "Data collected",
    value: "Name, work email, company website, main IT service, goal/target market, and optional phone number submitted through the enquiry form.",
  },
  {
    label: "Purpose",
    value: "To respond to enquiries about the lead-generation programme and, where agreed, to arrange a strategy call.",
  },
  {
    // Kept in step with what the site actually sends data to. Adding another
    // destination means adding it here.
    label: "Service providers",
    value:
      "Salesforce (receives enquiry form submissions and stores them as leads), Calendly (handles call bookings you choose to make), Google reCAPTCHA (checks the enquiry form for automated submissions), and Hostinger (hosts this website).",
  },
  {
    label: "Retention",
    value:
      "Enquiry details are kept for 24 months from your last contact with us, then deleted. You can ask for them to be deleted sooner.",
  },
  {
    label: "Contact process",
    value: siteConfig.businessIdentity.contactEmail
      ? `Email ${siteConfig.businessIdentity.contactEmail} to ask what is held about you, to request a correction, or to ask for it to be deleted.`
      : "To be confirmed — a monitored contact channel will be published here before launch.",
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
