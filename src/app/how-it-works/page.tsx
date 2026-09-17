import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProcessSteps } from "@/components/ProcessSteps";
import { QualificationList } from "@/components/QualificationList";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "A clear process from target market to sales handoff: align, prepare, launch, then qualify and improve.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="A clear process from target market to sales handoff.">
        We agree the plan, prepare the campaign, launch when the foundations are ready, and use
        the results to improve the next round of work.
      </PageIntro>

      <div className="mt-16">
        <ProcessSteps
          steps={[
            {
              title: "Align",
              body: "Define your offer, ideal accounts, exclusions, and qualification criteria. Your team supplies customer insights and sales priorities.",
            },
            {
              title: "Prepare",
              body: "Research a sample audience, develop messaging, check setup, and test the handoff. Your team approves the campaign and provides agreed access.",
            },
            {
              title: "Launch",
              body: "Activate the agreed channels after readiness checks. Monitor responses and operational signals rather than treating a calendar date as proof of readiness.",
            },
            {
              title: "Qualify and improve",
              body: "Record interest, coordinate next steps, and review outcomes. Your team reports whether meetings were useful and what happened next.",
            },
          ]}
        />
      </div>

      <div className="mx-auto mt-20 max-w-[820px]">
        <h2 className="text-center text-[28px] sm:text-[36px]">What qualifies as a meeting?</h2>
        <div className="mt-8">
          <QualificationList
            items={[
              "An account fits agreed criteria.",
              "The contact has a relevant role or influence.",
              "They express interest in a relevant conversation and agree to meet.",
              "The handoff includes context. Budget and timing are recorded as known or unknown, not guessed from a title.",
            ]}
          />
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
          <p className="text-base leading-7 text-ink">
            <strong>Booked</strong> means scheduled. <strong>Held</strong> means the conversation
            occurred. <strong>Sales-accepted</strong> means the client confirmed it met the agreed
            standard. An opportunity is a separately recorded client sales stage. Your engagement
            defines no-show handling and any replacement policy.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <ClosingCTA
          title="Choose a programme that matches your next stage."
          body="Your launch plan depends on scope, access, approvals, and readiness. We agree timing during onboarding."
        />
      </div>
    </div>
  );
}
