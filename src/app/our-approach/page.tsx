import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata: Metadata = {
  title: "Our Approach",
  description:
    "See how the work is structured: targeting, account briefs, the sales handoff, and how progress is measured in stages.",
  alternates: { canonical: "/our-approach" },
};

const illustrativeLabel =
  "Illustrative example — not a client result";

export default function OurApproachPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="See how the work is structured.">
        Clear targeting, relevant messages, and useful qualification make a programme easier to
        assess. These examples show the thinking and information behind the work.
      </PageIntro>

      <div className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-[28px] sm:text-[36px]">A campaign starts with a reason to reach out.</h2>
        <div className="mt-6 rounded-2xl border border-border bg-surface p-8">
          <p className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-text">
            {illustrativeLabel}
          </p>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-muted-ink">Sample provider</dt>
              <dd className="mt-1 text-base text-ink">
                A software-development company offering internal workflow applications.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted-ink">Sample prospect</dt>
              <dd className="mt-1 text-base text-ink">
                An operations team replacing disconnected manual processes.
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-semibold text-muted-ink">Sample angle</dt>
              <dd className="mt-1 text-base text-ink">
                Discuss where a focused application could reduce repetitive administration.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-[28px] sm:text-[36px]">What an account brief contains.</h2>
        <div className="mt-6 rounded-2xl border border-border bg-surface p-8">
          <p className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-text">
            {illustrativeLabel}
          </p>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Target segment", "IT outsourcing, 50–200 staff"],
              ["Country", "United Kingdom"],
              ["Relevant role", "Head of Delivery"],
              ["Business problem hypothesis", "Manual handoffs slow project starts"],
              ["Proposed IT offer", "Delivery-capacity augmentation"],
              ["Qualification questions", "Current bench capacity, typical project size"],
              ["Exclusions", "Existing outsourcing partner already in place"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm font-semibold text-muted-ink">Example field: {label}</dt>
                <dd className="mt-1 text-base text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[820px]">
        <h2 className="text-[28px] sm:text-[36px]">What your sales team receives.</h2>
        <div className="mt-6 rounded-2xl border border-border bg-surface p-8">
          <p className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-text">
            {illustrativeLabel}
          </p>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Account fit", "Meets agreed criteria"],
              ["Contact role", "Head of Delivery"],
              ["Expressed interest", "Open to a 30-minute call"],
              ["Questions answered", "Bench capacity: yes"],
              ["Unknowns", "Budget not yet discussed"],
              ["Correspondence summary", "Three-message email exchange"],
              ["Agreed next step", "Strategy call scheduled"],
              ["Assigned salesperson", "Example field"],
              ["Outcome status", "Booked"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm font-semibold text-muted-ink">Example field: {label}</dt>
                <dd className="mt-1 text-base text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[820px] text-center">
        <h2 className="text-[28px] sm:text-[36px]">Measure progress in stages.</h2>
        <p className="mt-5 text-lg leading-8 text-muted-ink">
          Activity, conversations, qualified interest, held meetings, and sales opportunities
          answer different questions. Reporting should make those stages visible and identify what
          needs to improve.
        </p>
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
