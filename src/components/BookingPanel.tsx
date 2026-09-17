import { isSchedulingConfigured, siteConfig } from "@/config/site";
import { Notice } from "./Notice";

export function AgendaPanel() {
  return (
    <aside className="rounded-2xl border border-border bg-surface p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {siteConfig.callDurationMinutes}-minute strategy call
      </p>
      <h2 className="mt-3 text-2xl">What we&apos;ll cover</h2>
      <ul className="mt-5 flex flex-col gap-4">
        {[
          "Understand your offer and current pipeline.",
          "Identify target accounts and market constraints.",
          "Discuss scope and a practical next step.",
        ].map((item) => (
          <li key={item} className="flex gap-3 text-base leading-7 text-ink">
            <span aria-hidden="true" className="mt-1 text-primary">
              →
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted-ink">
        This call does not include a full technical audit.
      </p>
    </aside>
  );
}

export function SchedulerPanel({ leadReceipt }: { leadReceipt?: string }) {
  if (siteConfig.siteMode === "preview") {
    return (
      <Notice tone="info" title={`Choose a ${siteConfig.callDurationMinutes}-minute strategy call`}>
        This is an illustrative confirmation. In live mode, a real scheduler or contact channel
        appears here once configured.
      </Notice>
    );
  }

  if (!isSchedulingConfigured) {
    if (siteConfig.businessIdentity.contactEmail) {
      return (
        <Notice tone="neutral" title="Get in touch">
          Scheduling is not yet connected. Reach us directly at{" "}
          <a
            href={`mailto:${siteConfig.businessIdentity.contactEmail}`}
            className="text-primary underline underline-offset-4"
          >
            {siteConfig.businessIdentity.contactEmail}
          </a>{" "}
          and we will arrange a time.
        </Notice>
      );
    }
    return null;
  }

  const href = leadReceipt
    ? `/api/booking-click?lead=${encodeURIComponent(leadReceipt)}`
    : "/api/booking-click";

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center">
      <p className="text-lg font-semibold text-ink">
        Choose a {siteConfig.callDurationMinutes}-minute strategy call
      </p>
      <a
        href={href}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover"
      >
        Open scheduler
      </a>
    </div>
  );
}
