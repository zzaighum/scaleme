import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { ChannelCard } from "@/components/ChannelCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ProcessIllustration } from "@/components/ProcessIllustration";
import { channels } from "@/data/services";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Lead Generation for IT Companies",
  description:
    "Reach relevant buyers through cold email, LinkedIn outreach, cold calling, and marketplace prospecting. Explore a managed programme for your IT company.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-5 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[55%_45%]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              {siteConfig.descriptor}
            </p>
            <h1 className="mt-4 text-[38px] leading-[1.08] sm:text-[52px] md:text-[64px]">
              Connect your IT expertise with the right buyers.
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-8 text-muted-ink">
              Reach businesses that fit your services through focused email, LinkedIn outreach,
              cold calling, and marketplace prospecting. We manage research, outreach, and
              qualification so your team can take the right conversations forward.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/book-a-call">{siteConfig.primaryCta}</ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary">
                {siteConfig.secondaryCta}
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm text-muted-ink">
              A {siteConfig.callDurationMinutes}-minute conversation about your services, target
              market, and next stage of growth.
            </p>
          </div>
          <ProcessIllustration />
        </div>
      </section>

      {/* Relevance strip */}
      <section className="border-y border-border bg-surface py-8">
        <p className="mx-auto max-w-[900px] px-5 text-center text-lg font-semibold text-ink sm:px-6">
          For software-development firms, IT consultancies, and outsourcing companies.
        </p>
      </section>

      {/* Problem and value */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[30px] sm:text-[40px]">
            Strong delivery deserves a consistent way to reach new clients.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-ink">
            Referrals can open doors, but they are difficult to plan around. Generic outreach
            creates its own problems: poor-fit prospects, weak conversations, and time lost on
            follow-up. A focused programme connects what you sell with the people most likely to
            need it.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-[720px] text-center">
          <h2 className="text-[30px] sm:text-[40px]">Four channels. One clear sales handoff.</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.slug}
              title={channel.cardTitle}
              body={channel.cardBody}
              href={`/services/${channel.slug}`}
            />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[640px] text-center text-base leading-7 text-muted-ink">
          Research, campaign preparation, response handling, and reporting support the programme
          from end to end.
        </p>
      </section>

      {/* Process and qualification */}
      <section className="bg-dark py-14 text-dark-fg sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <h2 className="mx-auto max-w-[720px] text-center text-dark-fg text-[30px] sm:text-[40px]">
            Know what happens before a meeting reaches your calendar.
          </h2>
          <div className="mt-12">
            <ProcessSteps
              steps={[
                { title: "Align", body: "Align on your offer and target market." },
                { title: "Prepare", body: "Prepare the account research and messages." },
                { title: "Launch", body: "Launch the agreed channels when ready." },
                {
                  title: "Qualify",
                  body: "Qualify interest and share the context behind each handoff.",
                },
              ]}
            />
          </div>

          <div className="mx-auto mt-16 max-w-[720px] text-center">
            <h2 className="text-dark-fg text-[28px] sm:text-[36px]">
              Relevant to your business. Ready for a conversation.
            </h2>
            <p className="mt-5 text-base leading-7 text-dark-fg/80">
              Before outreach begins, we agree what a suitable account, contact, and expression of
              interest look like. A verified address is not enough. Your team receives the
              information needed to assess the opportunity and prepare for the conversation.
            </p>
            <Link
              href="/our-approach"
              className="mt-5 inline-flex items-center gap-1 font-semibold text-dark-fg underline underline-offset-4"
            >
              Explore Our Approach →
            </Link>
          </div>
        </div>
      </section>

      {/* Fit and FAQs */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[30px] sm:text-[40px]">
            Built around your services and sales capacity.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-ink">
            We work best with IT businesses that have a clear offer, credible delivery experience,
            and a team ready to follow up. Campaigns focus on agreed countries, buyer roles, and
            business needs within your wider growth ambitions.
          </p>
          <Link
            href="/who-we-help"
            className="mt-5 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4"
          >
            See Who We Help →
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-[760px]">
          <h2 className="text-center text-[26px] sm:text-[32px]">Frequently asked questions</h2>
          <div className="mt-8">
            <FAQAccordion items={faqs.slice(0, 4)} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-6">
        <ClosingCTA
          title="Let's find your next route to relevant buyers."
          body="Tell us what your IT company delivers and where you want to grow. We will discuss whether a managed lead-generation programme fits your goals."
        />
      </div>
    </>
  );
}
