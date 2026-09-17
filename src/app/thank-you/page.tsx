import type { Metadata } from "next";
import { verifyReceipt } from "@/lib/receipt";
import { SchedulerPanel } from "@/components/BookingPanel";
import { Notice } from "@/components/Notice";
import { isSchedulingConfigured, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Enquiry receipt confirmation.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  const receipt = verifyReceipt(r);
  const confirmed = receipt?.kind === "enquiry";

  if (!confirmed) {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-24 text-center sm:px-6">
        <h1 className="text-[32px]">No enquiry confirmation to display</h1>
        <p className="mt-4 text-lg leading-8 text-muted-ink">
          We couldn&apos;t find a confirmed enquiry for this page. If you just submitted the form,
          please try again from{" "}
          <a href="/book-a-call" className="text-primary underline underline-offset-4">
            Book a Strategy Call
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-6">
      {receipt?.demo ? (
        <p className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
          Illustrative demo — no enquiry was actually sent
        </p>
      ) : null}
      <h1 className="text-[32px] sm:text-[40px]">Thanks—your brief has been received.</h1>
      <p className="mt-5 text-lg leading-8 text-muted-ink">
        We will review your information and contact you using the details provided.
      </p>

      <div className="mt-12 text-left">
        {isSchedulingConfigured || siteConfig.siteMode === "preview" ? (
          <SchedulerPanel leadReceipt={r} />
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
