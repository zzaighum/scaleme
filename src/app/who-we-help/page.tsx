import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata: Metadata = {
  title: "Who We Help",
  description:
    "Built for IT companies ready to grow beyond referrals — software-development firms, IT consultancies, and IT outsourcing companies.",
  alternates: { canonical: "/who-we-help" },
};

const audiences = [
  {
    title: "Software-development firms",
    body: "reach buyers considering custom applications, products, or integrations.",
  },
  {
    title: "IT consultancies",
    body: "connect a specific business problem with your technical expertise.",
  },
  {
    title: "IT outsourcing companies",
    body: "identify businesses that may need delivery capacity or specialist skills.",
  },
];

const targetingRows = [
  { industry: "Retail / e-commerce", need: "Commerce and integration needs" },
  { industry: "Logistics / manufacturing", need: "Workflows and operational systems" },
  { industry: "Professional services", need: "Portals and internal processes" },
  { industry: "Technology businesses", need: "Products and development capacity" },
];

export default function WhoWeHelpPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="Built for IT companies ready to grow beyond referrals.">
        A clear service, credible delivery experience, and a responsive sales team give lead
        generation a useful foundation. We shape campaigns around what your company can deliver
        and the buyers it can serve.
      </PageIntro>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {audiences.map((a) => (
          <div key={a.title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xl">{a.title}</h2>
            <p className="mt-3 text-base leading-7 text-muted-ink">{a.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-[28px] sm:text-[36px]">
          Your customers can span industries. Your message should stay specific.
        </h2>
        <p className="mx-auto mt-3 max-w-[640px] text-center text-sm font-semibold uppercase tracking-wide text-muted-ink">
          Example campaign directions
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-ink">
                  Industry
                </th>
                <th scope="col" className="px-6 py-4 text-sm font-semibold text-ink">
                  Typical need
                </th>
              </tr>
            </thead>
            <tbody>
              {targetingRows.map((row) => (
                <tr key={row.industry} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-base text-ink">{row.industry}</td>
                  <td className="px-6 py-4 text-base text-muted-ink">{row.need}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-[26px] sm:text-[32px]">A practical fit check.</h2>
          <p className="mt-4 text-base leading-7 text-muted-ink">
            Good fit: a defined offer, identifiable accounts, relevant proof of delivery,
            economics that support a programme, and capacity to follow up. If your offer is still
            untested or you need immediate guaranteed revenue, discuss those constraints before
            starting.
          </p>
        </div>
        <div>
          <h2 className="text-[26px] sm:text-[32px]">Worldwide ambition, focused campaigns.</h2>
          <p className="mt-4 text-base leading-7 text-muted-ink">
            We agree target countries, buyer roles, language requirements, and coverage for each
            programme. This keeps outreach relevant and follow-up manageable as you expand.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <ClosingCTA
          title="Let's find your next route to relevant buyers."
          body="Tell us what your IT company delivers and where you want to grow."
        />
      </div>
    </div>
  );
}
