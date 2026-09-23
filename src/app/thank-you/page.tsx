import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouContent } from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Enquiry receipt confirmation.",
  robots: { index: false, follow: false },
};

// The body reads the query string, which is a client-only concern on a static
// export — `useSearchParams` needs a Suspense boundary to prerender.
export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[640px] px-5 py-24 sm:px-6" />}>
      <ThankYouContent />
    </Suspense>
  );
}
