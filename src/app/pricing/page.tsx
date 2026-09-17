import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ClosingCTA } from "@/components/ClosingCTA";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Pricing & Engagement",
  description:
    "Engagement scope and quote drivers for a lead-generation programme: audience, channel mix, delivery scope, and commercial terms.",
  alternates: { canonical: "/pricing" },
};

const scopeRows = [
  "Target-market complexity",
  "Depth of account research",
  "Channels selected",
  "Languages and coverage",
  "Tools, platform activity, and reporting requirements",
];

const proposalItems = [
  "Setup and recurring work",
  "Included tools and third-party costs",
  "Client and agency responsibilities",
  "Qualification standard",
  "Reporting",
  "Account/data ownership",
  "Agreement duration",
  "Cancellation",
  "Any no-show handling policy",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="Understand the programme before you commit.">
        Your proposal sets out the audience, channel mix, delivery scope, and commercial terms. We
        discuss your needs first, then explain the work and costs clearly.
      </PageIntro>

      <div className="mx-auto mt-16 max-w-[760px]">
        <h2 className="text-[26px] sm:text-[32px]">What shapes the scope.</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {scopeRows.map((row) => (
            <li key={row} className="rounded-xl border border-border bg-surface p-5 text-base text-ink">
              {row}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-base leading-7 text-muted-ink">
          The final combination is agreed with your team, not automatically identical for every
          client.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-[760px]">
        <h2 className="text-[26px] sm:text-[32px]">What your proposal should make clear.</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {proposalItems.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-border bg-surface p-5">
              <span aria-hidden="true" className="mt-1 text-primary">
                ✓
              </span>
              <span className="text-base leading-7 text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-16 max-w-[720px] text-center">
        <h2 className="text-[26px] sm:text-[32px]">Choose a practical next step.</h2>
        <p className="mt-4 text-lg leading-8 text-muted-ink">
          Tell us what your company sells, who you want to reach, and what you have tried so far.
          We will discuss whether the service is a fit and what a scoped programme would involve.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-[760px]">
        <h2 className="text-center text-[26px] sm:text-[32px]">Frequently asked questions</h2>
        <div className="mt-8">
          <FAQAccordion items={faqs} />
        </div>
      </div>

      <div className="mt-20">
        <ClosingCTA
          title="Choose a programme that matches your next stage."
          body="We will discuss your current approach and identify the work needed to support it."
        />
      </div>
    </div>
  );
}
