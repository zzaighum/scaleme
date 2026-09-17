import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { siteConfig } from "@/config/site";
import { validateEnquiry } from "@/lib/validation";
import { signReceipt } from "@/lib/receipt";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  bucketKeyForIp,
  clientIp,
  findExistingByIdempotencyKey,
  hashPayload,
  insertLead,
  isRateLimited,
  notifyOwner,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

const GENERIC_FAILURE_MESSAGE =
  "We could not send your brief. Your details are still here—please try again.";
const RATE_LIMIT_MESSAGE = "Too many attempts. Please wait a moment and try again.";
const ALLOWED_SOURCE_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "source"] as const;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: GENERIC_FAILURE_MESSAGE }, { status: 400 });
  }

  const result = validateEnquiry({
    fullName: String(body.fullName ?? ""),
    workEmail: String(body.workEmail ?? ""),
    companyWebsite: String(body.companyWebsite ?? ""),
    mainItService: String(body.mainItService ?? ""),
    goal: String(body.goal ?? ""),
    phone: body.phone ? String(body.phone) : undefined,
  });

  if (!result.valid) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const idempotencyKey =
    typeof body.idempotencyKey === "string" && body.idempotencyKey.length > 0
      ? body.idempotencyKey
      : randomUUID();

  const landingPage = typeof body.landingPage === "string" ? body.landingPage.slice(0, 500) : null;
  const source = (body.source ?? {}) as Record<string, unknown>;
  const utmSource = typeof source.utm_source === "string" ? source.utm_source.slice(0, 200) : null;
  const utmMedium = typeof source.utm_medium === "string" ? source.utm_medium.slice(0, 200) : null;
  const utmCampaign = typeof source.utm_campaign === "string" ? source.utm_campaign.slice(0, 200) : null;
  const sourceIdentifier = typeof source.source === "string" ? source.source.slice(0, 200) : null;
  void ALLOWED_SOURCE_PARAMS;

  // ---- Preview mode: illustrative demo flow, no persistence, no real network calls ----
  if (siteConfig.siteMode === "preview") {
    const receipt = signReceipt({ kind: "enquiry", id: randomUUID(), demo: true }, 30 * 60);
    return NextResponse.json({ ok: true, demo: true, redirect: `/thank-you?r=${receipt}` });
  }

  // ---- Live mode ----
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured in live mode.");
    return NextResponse.json({ ok: false, message: GENERIC_FAILURE_MESSAGE }, { status: 503 });
  }

  const ip = clientIp(req.headers);
  const rateLimited = await isRateLimited(supabase, bucketKeyForIp(ip));
  if (rateLimited) {
    return NextResponse.json({ ok: false, message: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const payloadHash = hashPayload(result.data);
  const existing = await findExistingByIdempotencyKey(supabase, idempotencyKey);
  if (existing) {
    if (existing.payload_hash !== payloadHash) {
      return NextResponse.json(
        { ok: false, message: "This request could not be processed. Please refresh and try again." },
        { status: 409 }
      );
    }
    const receipt = signReceipt({ kind: "enquiry", id: existing.id }, 30 * 60);
    return NextResponse.json({ ok: true, redirect: `/thank-you?r=${receipt}` });
  }

  const inserted = await insertLead(supabase, {
    ...result.data,
    idempotencyKey,
    payloadHash,
    landingPage,
    sourceIdentifier,
    utmSource,
    utmMedium,
    utmCampaign,
  });

  if ("error" in inserted) {
    console.error("Enquiry insert failed:", inserted.error);
    return NextResponse.json({ ok: false, message: GENERIC_FAILURE_MESSAGE }, { status: 502 });
  }

  // Fire-and-forget: a notification failure must not erase the durably captured lead.
  void notifyOwner(supabase, inserted.id, result.data);

  const receipt = signReceipt({ kind: "enquiry", id: inserted.id }, 30 * 60);
  return NextResponse.json({ ok: true, redirect: `/thank-you?r=${receipt}` });
}
