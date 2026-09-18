import { ButtonLink } from "./Button";
import { CheckIcon } from "./Icon";
import { siteConfig } from "@/config/site";

export function ClosingCTA({
  title,
  body,
  ctaHref = "/book-a-call",
  ctaLabel = siteConfig.primaryCta,
  checklist,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
  checklist?: string[];
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <h2 className="mx-auto max-w-[640px] text-[28px] sm:text-[36px]">{title}</h2>
        <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-muted-ink">{body}</p>
        <div className="mt-8">
          <ButtonLink href={ctaHref} variant="primary">
            {ctaLabel}
          </ButtonLink>
        </div>
        {checklist && checklist.length > 0 ? (
          <ul className="mx-auto mt-6 flex max-w-[560px] flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {checklist.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 text-sm text-muted-ink">
                <CheckIcon className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
