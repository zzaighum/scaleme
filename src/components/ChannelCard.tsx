import Link from "next/link";
import { ChannelIcon } from "./Icon";

export function ChannelCard({
  slug,
  title,
  body,
  href,
}: {
  slug: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-7 transition-colors duration-200 hover:border-primary"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ChannelIcon slug={slug} />
      </span>
      <h3 className="mt-5 text-xl">{title}</h3>
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
