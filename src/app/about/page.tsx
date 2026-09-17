import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ClosingCTA } from "@/components/ClosingCTA";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `A focused approach to growth for IT companies. ${siteConfig.brandName} coordinates targeting, messaging, outreach, and qualification.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="A focused approach to growth for IT companies.">
        {siteConfig.brandName} brings targeting, messaging, outreach, and qualification into a
        coordinated programme. Our focus is helping IT businesses explain their value to relevant
        buyers and move useful conversations forward.
      </PageIntro>

      <div className="mx-auto mt-16 grid max-w-[900px] gap-12">
        <div>
          <h2 className="text-[26px] sm:text-[32px]">Technical offers need business context.</h2>
          <p className="mt-4 text-lg leading-8 text-muted-ink">
            Buyers do not choose an IT partner because of a service list alone. They need to
            understand the problem you can help solve, why your experience is relevant, and what a
            first conversation will achieve.
          </p>
        </div>
        <div>
          <h2 className="text-[26px] sm:text-[32px]">Make the process visible.</h2>
          <p className="mt-4 text-lg leading-8 text-muted-ink">
            We agree the audience and messaging before launch, document qualification, and use
            feedback from your sales team to guide the next round of work.
          </p>
        </div>
        <div>
          <h2 className="text-[26px] sm:text-[32px]">Build on clear responsibilities.</h2>
          <p className="mt-4 text-lg leading-8 text-muted-ink">
            The programme supports prospecting and handoff. Your team brings the delivery
            expertise, approves the offer, and owns the sales relationship after the introduction.
          </p>
        </div>
      </div>

      {siteConfig.teamEnabled ? null : (
        <p className="mx-auto mt-16 max-w-[640px] text-center text-sm text-muted-ink">
          Team profiles will appear here once names, roles, photos, and biographies are supplied
          and approved.
        </p>
      )}

      <div className="mt-20">
        <ClosingCTA
          title="Let's find your next route to relevant buyers."
          body="Tell us what your IT company delivers and where you want to grow."
        />
      </div>
    </div>
  );
}
