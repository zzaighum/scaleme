import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-3 text-[32px] sm:text-[40px]">We couldn&apos;t find that page.</h1>
      <p className="mt-5 text-lg leading-8 text-muted-ink">
        The page you&apos;re looking for may have moved. Try one of these instead.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ButtonLink href="/">Go to homepage</ButtonLink>
        <ButtonLink href="/book-a-call" variant="secondary">
          Book a Strategy Call
        </ButtonLink>
      </div>
    </div>
  );
}
