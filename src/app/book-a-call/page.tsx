import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/PageIntro";
import { EnquiryForm } from "@/components/EnquiryForm";
import { AgendaPanel } from "@/components/BookingPanel";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description:
    "Share a short brief, then choose a 30-minute strategy call. We will discuss your services, ideal clients, and whether a lead-generation programme fits your next step.",
  alternates: { canonical: "/book-a-call" },
};

export default function BookACallPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-6 sm:py-24">
      <PageIntro title="Let's discuss growth for your IT company.">
        Share a short brief, then choose a {siteConfig.callDurationMinutes}-minute strategy call if
        you are ready. We will discuss your services, ideal clients, and whether a
        lead-generation programme fits your next step.
      </PageIntro>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="order-1 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <Suspense fallback={null}>
            <EnquiryForm />
          </Suspense>
        </div>
        <div className="order-2 lg:order-2">
          <AgendaPanel />
        </div>
      </div>
    </div>
  );
}
