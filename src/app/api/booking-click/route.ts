import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// Tracks that a visitor clicked through to the external scheduler. This is an
// outbound-click count only — it must never be treated as a confirmed booking
// (the provider's return URL is not verified, so /booking-confirmed stays neutral).
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const destination = siteConfig.bookingUrl;

  if (!destination) {
    return NextResponse.redirect(new URL("/book-a-call", url.origin));
  }

  if (siteConfig.siteMode === "live") {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const receiptId = url.searchParams.get("lead") || null;
      void supabase.from("booking_clicks").insert({
        enquiry_receipt: receiptId,
        destination_url: destination,
      });
    }
  }

  return NextResponse.redirect(destination);
}
