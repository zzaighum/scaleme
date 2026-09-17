import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Booking confirmation status.",
  robots: { index: false, follow: false },
};

// Default booking mode is "external": we open the provider's own scheduler
// and never verify its return URL, so this page always shows the neutral
// state. A "connected" mode with an authenticated provider webhook is
// documented as a future integration in LAUNCH_CHECKLIST.md, not built here.
export default function BookingConfirmedPage() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center sm:px-6">
      <h1 className="text-[32px]">Check your booking confirmation email</h1>
      <p className="mt-4 text-lg leading-8 text-muted-ink">
        Your scheduler sends its own confirmation and calendar invitation directly to your inbox.
        This page does not verify bookings.
      </p>
    </div>
  );
}
