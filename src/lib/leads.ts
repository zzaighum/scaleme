import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EnquiryData } from "./validation";

export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes

export function hashPayload(data: EnquiryData): string {
  return createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export function bucketKeyForIp(ip: string): string {
  const salt = process.env.RECEIPT_SIGNING_SECRET || "yourleadspartner-rate-limit";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}

/**
 * Atomic, Postgres-backed fixed-window rate limit so the check is correct
 * across multiple deployed instances (see supabase/migrations for the
 * check_rate_limit() function this calls).
 */
export async function isRateLimited(
  supabase: SupabaseClient,
  bucketKey: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: bucketKey,
    p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
  });
  if (error) {
    // Fail open on infrastructure errors rather than blocking every enquiry,
    // but this is exactly the kind of gap LAUNCH_CHECKLIST.md should track.
    console.error("Rate limit check failed:", error.message);
    return false;
  }
  return typeof data === "number" && data > RATE_LIMIT_MAX_ATTEMPTS;
}

export type StoredLead = {
  id: string;
  payload_hash: string;
};

export async function findExistingByIdempotencyKey(
  supabase: SupabaseClient,
  idempotencyKey: string
): Promise<StoredLead | null> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("id, payload_hash")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (error) {
    console.error("Idempotency lookup failed:", error.message);
    return null;
  }
  return data as StoredLead | null;
}

export type InsertLeadInput = EnquiryData & {
  idempotencyKey: string;
  payloadHash: string;
  landingPage: string | null;
  sourceIdentifier: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export async function insertLead(
  supabase: SupabaseClient,
  input: InsertLeadInput
): Promise<{ id: string } | { error: string }> {
  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      idempotency_key: input.idempotencyKey,
      payload_hash: input.payloadHash,
      full_name: input.fullName,
      work_email: input.workEmail,
      company_website: input.companyWebsite,
      main_it_service: input.mainItService,
      goal: input.goal,
      phone: input.phone,
      landing_page: input.landingPage,
      source_identifier: input.sourceIdentifier,
      utm_source: input.utmSource,
      utm_medium: input.utmMedium,
      utm_campaign: input.utmCampaign,
      status: "received",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: (data as { id: string }).id };
}

export async function notifyOwner(
  supabase: SupabaseClient,
  leadId: string,
  data: EnquiryData
): Promise<void> {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) {
    // No destination configured — this is a launch blocker, not a silent success.
    await supabase
      .from("enquiries")
      .update({ notification_error: "NOTIFICATION_WEBHOOK_URL is not configured." })
      .eq("id", leadId);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        fullName: data.fullName,
        workEmail: data.workEmail,
        companyWebsite: data.companyWebsite,
        mainItService: data.mainItService,
        goal: data.goal,
        phone: data.phone,
      }),
    });
    if (!res.ok) throw new Error(`Notification endpoint responded ${res.status}`);
    await supabase.from("enquiries").update({ notified_at: new Date().toISOString() }).eq("id", leadId);
  } catch (err) {
    await supabase
      .from("enquiries")
      .update({ notification_error: err instanceof Error ? err.message : String(err) })
      .eq("id", leadId);
  }
}
