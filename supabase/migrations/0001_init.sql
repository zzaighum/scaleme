-- Relaystride enquiry storage.
-- Run this against your Supabase project (SQL editor, or `supabase db push`
-- with the CLI). Tables are locked down with RLS and no policies, so the
-- ONLY access path is the service role key from the server-side route
-- handler (src/app/api/enquiry/route.ts). No public/anon access is granted.

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  payload_hash text not null,
  full_name text not null,
  work_email text not null,
  company_website text not null,
  main_it_service text not null,
  goal text not null,
  phone text,
  landing_page text,
  source_identifier text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'received',
  owner text,
  notified_at timestamptz,
  notification_error text,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_work_email_idx on public.enquiries (work_email);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

alter table public.enquiries enable row level security;
-- No policies are defined: with RLS enabled and zero policies, every role
-- except the service role (which bypasses RLS) is denied by default.

create table if not exists public.booking_clicks (
  id uuid primary key default gen_random_uuid(),
  enquiry_receipt text,
  destination_url text not null,
  clicked_at timestamptz not null default now()
);

alter table public.booking_clicks enable row level security;

-- Fixed-window rate limiting, atomic across concurrent requests and
-- deployed instances (unlike an in-process Map). One row per bucket key
-- (a salted hash of the requester's IP — see src/lib/leads.ts).
create table if not exists public.enquiry_rate_limits (
  bucket_key text primary key,
  window_start timestamptz not null default now(),
  attempt_count integer not null default 0
);

alter table public.enquiry_rate_limits enable row level security;

create or replace function public.check_rate_limit(
  p_bucket_key text,
  p_window_seconds integer
) returns integer
language sql
security definer
set search_path = public
as $$
  insert into public.enquiry_rate_limits (bucket_key, window_start, attempt_count)
  values (p_bucket_key, now(), 1)
  on conflict (bucket_key) do update
  set
    attempt_count = case
      when public.enquiry_rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then 1
      else public.enquiry_rate_limits.attempt_count + 1
    end,
    window_start = case
      when public.enquiry_rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
        then now()
      else public.enquiry_rate_limits.window_start
    end
  returning attempt_count;
$$;
