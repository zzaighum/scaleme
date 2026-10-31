import Link from "next/link";
import { ChannelIcon } from "./Icon";

// See ProcessSteps: these cards follow a section h2 on the home page but the
// page h1 on /services/, so the level has to come from the caller.
export function ChannelCard({
  slug,
  title,
  body,
  href,
  headingLevel = 3,
}: {
  slug: string;
  title: string;
  body: string;
  href: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-7 transition-colors duration-200 hover:border-primary"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ChannelIcon slug={slug} />
      </span>
      <Heading className="mt-5 text-xl">{title}</Heading>
      <p className="mt-3 flex-1 text-base leading-7 text-muted-ink">{body}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Explore {title}
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
