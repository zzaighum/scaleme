import { ButtonLink } from "./Button";
import { siteConfig } from "@/config/site";

export function ClosingCTA({
  title,
  body,
  ctaHref = "/book-a-call",
  ctaLabel = siteConfig.primaryCta,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
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
      </div>
    </section>
  );
}
