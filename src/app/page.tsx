import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { ChannelCard } from "@/components/ChannelCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ProcessIllustration } from "@/components/ProcessIllustration";
import {
  RefreshIcon,
  GearIcon,
  TargetIcon,
  UserBadgeIcon,
  GlobeIcon,
  LayersIcon,
  TagIcon,
  StorefrontIcon,
  BriefcaseIcon,
  CodeIcon,
  ArrowRightIcon,
} from "@/components/Icon";
import { channels } from "@/data/services";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Lead Generation for IT Companies",
  description:
    "Reach relevant buyers through cold email, LinkedIn outreach, cold calling, and marketplace prospecting. Explore a managed programme for your IT company.",
  alternates: { canonical: "/" },
};

const problemCards = [
  {
    Icon: RefreshIcon,
    title: "Referrals are hard to plan around",
    body: "Word of mouth can open doors, but it fluctuates without notice, making growth difficult to plan.",
  },
  {
    Icon: GearIcon,
    title: "Generic outreach falls flat",
    body: "Mass, unfocused messaging creates poor-fit prospects, weak conversations, and time lost on follow-up.",
  },
  {
    Icon: TargetIcon,
    title: "Built around your target accounts",
    body: "A focused programme connects what you sell with the people most likely to need it.",
  },
  {
    Icon: UserBadgeIcon,
    title: "Ready for a real conversation",
    body: "Every contact is qualified before it reaches your calendar, with the context behind each handoff.",
  },
];

const whyFacts = [
  { Icon: LayersIcon, stat: "4", label: "Coordinated channels" },
  { Icon: GlobeIcon, stat: "Worldwide", label: "Prospecting reach" },
  { Icon: TagIcon, stat: "Quote-based", label: "Transparent engagement" },
];

const campaignDirections = [
  {
    Icon: StorefrontIcon,
    title: "Retail & e-commerce",
    body: "Commerce and integration needs.",
  },
  {
    Icon: LayersIcon,
    title: "Logistics & manufacturing",
    body: "Workflows and operational systems.",
  },
  {
    Icon: BriefcaseIcon,
    title: "Professional services",
    body: "Portals and internal processes.",
  },
  {
    Icon: CodeIcon,
    title: "Technology businesses",
    body: "Products and development capacity.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-[15px] font-medium text-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              {siteConfig.descriptor}
            </span>
            <h1 className="mt-6 text-[36px] font-extrabold leading-[1.12] tracking-tight sm:text-[46px] md:text-[54px] lg:text-[40px] xl:text-[50px]">
              Stop{" "}
              <span className="relative inline-block">
                <span className="text-primary">Chasing</span> Leads.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-[7px] w-full text-primary"
                >
                  <path
                    d="M2 7C42 3 84 2.5 198 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              Start Booking Meetings.
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-8 text-muted-ink">
              Reach businesses that fit your services through focused email, LinkedIn outreach,
              cold calling, and marketplace prospecting. We manage research, outreach, and
              qualification so your team can take the right conversations forward.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/book-a-call">{siteConfig.primaryCta}</ButtonLink>
              <ButtonLink href="/how-it-works" variant="secondary" className="gap-8">
                {siteConfig.secondaryCta}
                <ArrowRightIcon className="h-4 w-4 text-muted-ink" />
              </ButtonLink>
            </div>
            <p className="mt-6 max-w-[42ch] text-base leading-7 text-muted-ink">
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
      <section className="bg-primary py-14 text-white sm:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
              A focused alternative
            </p>
            <h2 className="mt-4 text-white text-[30px] sm:text-[40px]">
              Strong delivery deserves a consistent way to reach new clients.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Referrals can open doors, but they are difficult to plan around. Generic outreach
              creates its own problems: poor-fit prospects, weak conversations, and time lost on
              follow-up. A focused programme connects what you sell with the people most likely to
              need it.
            </p>
            <Link
              href="/our-approach"
              className="mt-5 inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4"
            >
              Read about our approach →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {problemCards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <card.Icon />
                </span>
                <h3 className="mt-4 text-base text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-ink">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four channels */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            The channels
          </p>
          <h2 className="mt-4 text-[30px] sm:text-[40px]">Four channels. One clear sales handoff.</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GearIcon className="h-4 w-4" />
            </span>
            <p className="text-base leading-6 text-muted-ink">
              Research, campaign preparation, response handling, and reporting support the
              programme from end to end.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary underline underline-offset-4"
          >
            View all services →
          </Link>
        </div>
      </section>

      {/* Why ScaleMe */}
      <section className="bg-gradient-to-br from-primary to-dark py-14 text-white sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white/80" />
                Coordinated, not generic
              </span>
              <h2 className="mt-5 text-white text-[32px] leading-[1.1] sm:text-[44px]">
                Not the generic outreach agency you&apos;ve tried before.
              </h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-white/85">
                {siteConfig.brandName} runs a coordinated lead-generation programme across cold
                email, LinkedIn outreach, cold calling, and marketplace prospecting — built around
                your offer, not a generic script. We handle the research, the outreach, and the
                qualification, so your team only sees conversations worth having.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3">
            {whyFacts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <fact.Icon />
                </span>
                <div>
                  <p className="text-xl font-bold text-white">{fact.stat}</p>
                  <p className="text-sm text-white/70">{fact.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example campaign directions */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Example campaign directions
            </p>
            <h2 className="mt-4 text-[30px] sm:text-[40px]">
              Your buyers can span industries. Your message should stay specific.
            </h2>
          </div>
          <p className="text-base leading-7 text-muted-ink lg:pb-1 lg:text-right">
            Each programme is briefed on your target market, not run from a generic script.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {campaignDirections.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.Icon />
              </span>
              <h3 className="mt-4 text-base text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-ink">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-ink">
          Illustrative targeting examples, not proven sector specialisms.{" "}
          <Link href="/who-we-help" className="font-semibold text-primary underline underline-offset-4">
            See Who We Help →
          </Link>
        </p>
      </section>

      {/* Pricing */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TagIcon className="h-4 w-4" />
            </span>
            <p className="text-base leading-6 text-muted-ink">
              Quote-based engagement. Your proposal sets out the audience, channel mix, delivery
              scope, and commercial terms — agreed with your team, not assumed from a template.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary underline underline-offset-4"
          >
            See Pricing & Engagement →
          </Link>
        </div>
      </div>

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
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[30px] sm:text-[40px]">
              Built around your services and sales capacity.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-ink">
              We work best with IT businesses that have a clear offer, credible delivery
              experience, and a team ready to follow up. Campaigns focus on agreed countries,
              buyer roles, and business needs within your wider growth ambitions.
            </p>
            <Link
              href="/who-we-help"
              className="mt-5 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4"
            >
              See Who We Help →
            </Link>
          </div>

          <div>
            <h2 className="text-[22px] sm:text-[26px]">Frequently asked questions</h2>
            <div className="mt-6">
              <FAQAccordion items={faqs.slice(0, 4)} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-6">
        <ClosingCTA
          title="Let's find your next route to relevant buyers."
          body="Tell us what your IT company delivers and where you want to grow. We will discuss whether a managed lead-generation programme fits your goals."
          checklist={[
            `${siteConfig.callDurationMinutes}-minute call`,
            "No technical audit required",
            "Quote-based, no obligation",
          ]}
        />
      </div>
    </>
  );
}
