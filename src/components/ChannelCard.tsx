import Link from "next/link";

export function ChannelCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-primary"
    >
      <h3 className="text-xl">{title}</h3>
      <p className="mt-3 flex-1 text-base leading-7 text-muted-ink">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Learn more
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
