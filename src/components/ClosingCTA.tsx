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
    <section className="rounded-3xl bg-dark px-6 py-16 text-center text-dark-fg sm:px-12 sm:py-20">
      <h2 className="mx-auto max-w-[640px] text-dark-fg text-[28px] sm:text-[36px]">{title}</h2>
      <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-dark-fg/80">{body}</p>
      <div className="mt-8">
        <ButtonLink href={ctaHref} variant="primary">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
