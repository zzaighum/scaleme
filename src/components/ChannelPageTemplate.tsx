import { PageIntro } from "./PageIntro";
import { ChannelCard } from "./ChannelCard";
import { ClosingCTA } from "./ClosingCTA";
import { Notice } from "./Notice";
import { getChannel, relatedChannels } from "@/data/services";

export function ChannelPageTemplate({ slug }: { slug: string }) {
  const channel = getChannel(slug);
  if (!channel) return null;
  const related = relatedChannels(slug);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title={channel.h1}>{channel.intro}</PageIntro>

      <div className="mx-auto mt-16 max-w-[760px]">
        <h2 className="text-[26px] sm:text-[32px]">Included work</h2>
        <p className="mt-2 text-sm text-muted-ink">
          Proposed scope, confirmed in your engagement proposal.
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {channel.includedWork.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl border border-border bg-surface p-5">
              <span aria-hidden="true" className="mt-1 text-primary">
                ✓
              </span>
              <span className="text-base leading-7 text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-16 max-w-[760px]">
        <h2 className="text-[26px] sm:text-[32px]">Deliverables</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {channel.deliverables.map((item) => (
            <li key={item} className="rounded-xl border border-border bg-surface p-5 text-base text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-16 max-w-[760px]">
        <Notice tone="neutral" title="Practical boundary">
          {channel.boundary}
        </Notice>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-[26px] sm:text-[32px]">Related services</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {related.map((c) => (
            <ChannelCard key={c.slug} title={c.cardTitle} body={c.cardBody} href={`/services/${c.slug}`} />
          ))}
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
