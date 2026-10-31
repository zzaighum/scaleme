import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouContent } from "./ThankYouContent";
import { SchedulerPanel } from "@/components/BookingPanel";
import { Notice } from "@/components/Notice";
import { isFormEndpointConfigured, isSchedulingConfigured, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Enquiry receipt confirmation.",
  robots: { index: false, follow: false },
};

/*
 * The body reads the query string to tell a demo submission from a real one,
 * so `useSearchParams` makes it client-rendered. That is unavoidable on a
 * static export — one HTML file has to serve every query string — but the
 * *fallback* is what gets prerendered, and an empty <div> meant the exported
 * page shipped with no <h1> and an empty <main>: blank without JavaScript, and
 * 0.18 CLS with it.
 *
 * This fallback renders the real confirmation layout instead. Whether an
 * enquiry destination exists is a build-time constant, so the wording can be
 * accurate without knowing the query string: with no endpoint nothing is ever
 * transmitted, so the illustrative copy is simply true; with one configured we
 * say the conditional thing rather than asserting receipt. It matches the
 * hydrated output closely enough that there is nothing to shift.
 */
function ThankYouFallback() {
  const illustrative = !isFormEndpointConfigured;

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-6">
      {illustrative ? (
        <p className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent-text">
          Illustrative demo — no enquiry was actually sent
        </p>
      ) : null}
      <h1 className="text-[32px] sm:text-[40px]">
        {illustrative ? "This is what the confirmation looks like." : "Thank you."}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-ink">
        {illustrative
          ? "In live mode, your details would reach us here and we would contact you using them."
          : "If you have just sent your brief, it has reached us and we will contact you using the details provided."}
      </p>

      <div className="mt-12 text-left">
        {isSchedulingConfigured || siteConfig.siteMode === "preview" ? (
          <SchedulerPanel />
        ) : siteConfig.businessIdentity.contactEmail ? (
          <Notice tone="neutral" title="Get in touch">
            Reach us directly at{" "}
            <a
              href={`mailto:${siteConfig.businessIdentity.contactEmail}`}
              className="text-primary underline underline-offset-4"
            >
              {siteConfig.businessIdentity.contactEmail}
            </a>
            .
          </Notice>
        ) : null}
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
