"use client";

import { useSearchParams } from "next/navigation";
import { SchedulerPanel } from "@/components/BookingPanel";
import { Notice } from "@/components/Notice";
import { isFormEndpointConfigured, isSchedulingConfigured, siteConfig } from "@/config/site";

// On the static build there is no server to sign or verify a receipt, so this
// page trusts a plain query flag set by the form on the previous screen:
//   ?demo=1  — nothing was sent anywhere (no endpoint configured)
//   ?sent=1  — the form posted to the configured CRM/form endpoint
// The flag is a display hint, not proof of delivery. `demo` is therefore
// labelled on screen, and an unrecognised URL still shows the neutral state
// rather than implying an enquiry arrived.
export function ThankYouContent() {
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo") === "1";
  const sent = searchParams.get("sent") === "1";
  const confirmed = demo || sent;

  if (!confirmed) {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-24 text-center sm:px-6">
        <h1 className="text-[32px]">No enquiry confirmation to display</h1>
        <p className="mt-4 text-lg leading-8 text-muted-ink">
          We couldn&apos;t find a confirmed enquiry for this page. If you just submitted the form,
          please try again from{" "}
          <a href="/book-a-call/" className="text-primary underline underline-offset-4">
            Book a Strategy Call
          </a>
          .
        </p>
      </div>
    );
  }

  // Without a configured endpoint nothing was transmitted, whatever the URL
  // says — never show an unqualified "received" in that case.
  const isIllustrative = demo || !isFormEndpointConfigured;

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-6">
      {isIllustrative ? (
        <p className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
          Illustrative demo — no enquiry was actually sent
        </p>
      ) : null}
      <h1 className="text-[32px] sm:text-[40px]">
        {isIllustrative
          ? "This is what the confirmation looks like."
          : "Thanks—your brief has been received."}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-ink">
        {isIllustrative
          ? "In live mode, your details would reach us here and we would contact you using them."
          : "We will review your information and contact you using the details provided."}
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
