import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ChannelCard } from "@/components/ChannelCard";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ButtonLink } from "@/components/Button";
import { channels } from "@/data/services";

export const metadata: Metadata = {
  title: "Lead Generation Services",
  description:
    "Prospect research, campaign preparation, outreach, and qualification across cold email, LinkedIn outreach, cold calling, and marketplace prospecting.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="A lead-generation programme built around your IT services.">
        We connect prospect research, campaign preparation, outreach, and qualification in one
        coordinated process. Your proposal defines the channels, scope, and responsibilities
        before work starts.
      </PageIntro>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ButtonLink href="/book-a-call">Book a Strategy Call</ButtonLink>
        <Link href="/how-it-works" className="font-semibold text-primary underline underline-offset-4">
          How It Works
        </Link>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.slug}
            slug={channel.slug}
            title={channel.cardTitle}
            body={channel.cardBody}
            href={`/services/${channel.slug}`}
          />
        ))}
      </div>

      {/* Shared delivery foundations */}
      <div className="mt-24 flex flex-col gap-16">
        <div id="research" className="scroll-mt-28">
          <h2 className="text-[28px] sm:text-[36px]">Start with a market you can serve.</h2>
          <p className="mt-5 max-w-[70ch] text-lg leading-8 text-muted-ink">
            We define the ideal customer profile, relevant buying roles, and exclusions with your
            team. Research and available contact checks help create a focused account list. The
            goal is a reason to contact each prospect, not a larger database.
          </p>
        </div>

        <div id="infrastructure" className="scroll-mt-28">
          <h2 className="text-[28px] sm:text-[36px]">Prepare the campaign before increasing activity.</h2>
          <p className="mt-5 max-w-[70ch] text-lg leading-8 text-muted-ink">
            We agree the sending setup, access, messaging, response handling, and booking process.
            Email authentication and sending-health checks support delivery. No configuration can
            guarantee that every message reaches the inbox.
          </p>
        </div>

        <div id="handoff" className="scroll-mt-28">
          <h2 className="text-[28px] sm:text-[36px]">Give sales the context behind the conversation.</h2>
          <p className="mt-5 max-w-[70ch] text-lg leading-8 text-muted-ink">
            A useful handoff explains the account, the contact, expressed interest, qualification
            answers, and the next agreed step. Booked, held, and sales-accepted meetings are
            reported separately.
          </p>
        </div>
      </div>

      {/* Scope and responsibilities */}
      <div className="mt-24">
        <h2 className="text-center text-[28px] sm:text-[36px]">Clear scope from the beginning.</h2>
        <p className="mx-auto mt-5 max-w-[70ch] text-center text-lg leading-8 text-muted-ink">
          Your proposal states the channel mix, research depth, campaign coverage, reporting,
          tools, account access, and any platform costs. Your team approves the offer and
          messaging, attends sales conversations, and owns proposals, negotiations, and closing.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h3 className="text-xl">Agency responsibilities</h3>
            <ul className="mt-4 flex flex-col gap-3 text-base leading-7 text-muted-ink">
              <li>Channel mix, research depth, and campaign coverage</li>
              <li>Reporting, tools, and account access as agreed</li>
              <li>Platform costs identified in the proposal</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h3 className="text-xl">Your team&apos;s responsibilities</h3>
            <ul className="mt-4 flex flex-col gap-3 text-base leading-7 text-muted-ink">
              <li>Approve the offer and messaging</li>
              <li>Attend sales conversations</li>
              <li>Own proposals, negotiations, and closing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <ClosingCTA
          title="Choose a programme that matches your next stage."
          body="We will discuss your current approach and identify the work needed to support it."
        />
        <p className="mt-6 text-center">
          <Link href="/pricing" className="font-semibold text-primary underline underline-offset-4">
            Pricing & Engagement →
          </Link>
        </p>
      </div>
    </div>
  );
}
