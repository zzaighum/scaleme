import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key. Never import this from a
// client component — the service role key must never reach the browser.
// Returns null when the store isn't configured so callers can fail loudly
// instead of pretending an enquiry was captured.

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  if (!cached) {
    cached = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
