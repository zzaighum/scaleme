"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MAIN_IT_SERVICE_OPTIONS, validateEnquiry, type EnquiryInput } from "@/lib/validation";
import { siteConfig } from "@/config/site";
import { Button } from "./Button";
import { Notice } from "./Notice";

type Status = "idle" | "submitting" | "failure" | "rate-limited";

const EMPTY: EnquiryInput = {
  fullName: "",
  workEmail: "",
  companyWebsite: "",
  mainItService: "",
  goal: "",
  phone: "",
};

function simpleHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}

export function EnquiryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryInput, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<keyof EnquiryInput, HTMLElement | null>>>({});

  function setField<K extends keyof EnquiryInput>(key: K, value: EnquiryInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function getIdempotencyKey(payloadHash: string): string {
    const storedHash = sessionStorage.getItem("enquiry_payload_hash");
    const storedKey = sessionStorage.getItem("enquiry_idempotency_key");
    if (storedHash === payloadHash && storedKey) return storedKey;
    const newKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem("enquiry_payload_hash", payloadHash);
    sessionStorage.setItem("enquiry_idempotency_key", newKey);
    return newKey;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const result = validateEnquiry(values);
    if (!result.valid) {
      setErrors(result.errors);
      setStatus("idle");
      setStatusMessage(null);
      const firstKey = Object.keys(result.errors)[0] as keyof EnquiryInput | undefined;
      if (firstKey) fieldRefs.current[firstKey]?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    setStatusMessage(null);

    const payloadHash = simpleHash(JSON.stringify(result.data));
    const idempotencyKey = getIdempotencyKey(payloadHash);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          idempotencyKey,
          landingPage: typeof window !== "undefined" ? window.location.pathname : null,
          source: {
            utm_source: searchParams.get("utm_source"),
            utm_medium: searchParams.get("utm_medium"),
            utm_campaign: searchParams.get("utm_campaign"),
            source: searchParams.get("source"),
          },
        }),
      });

      const body = await res.json().catch(() => null);

      if (res.status === 429) {
        setStatus("rate-limited");
        setStatusMessage("Too many attempts. Please wait a moment and try again.");
        return;
      }

      if (res.status === 400 && body?.errors) {
        setErrors(body.errors);
        setStatus("idle");
        const firstKey = Object.keys(body.errors)[0] as keyof EnquiryInput | undefined;
        if (firstKey) fieldRefs.current[firstKey]?.focus();
        return;
      }

      if (!res.ok || !body?.ok) {
        setStatus("failure");
        setStatusMessage(
          "We could not send your brief. Your details are still here—please try again."
        );
        return;
      }

      router.push(body.redirect as string);
    } catch {
      setStatus("failure");
      setStatusMessage(
        "We could not send your brief. Your details are still here—please try again."
      );
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {siteConfig.siteMode === "preview" ? (
        <Notice tone="info" title="Demo only — no enquiry will be sent.">
          Try the demo flow: submitting this form runs an illustrative preview and does not
          contact anyone.
        </Notice>
      ) : null}

      <div aria-live="polite" className="sr-only">
        {isSubmitting ? "Sending…" : statusMessage}
      </div>

      {(status === "failure" || status === "rate-limited") && statusMessage ? (
        <Notice tone="warning">{statusMessage}</Notice>
      ) : null}

      <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          ref={(el) => {
            fieldRefs.current.fullName = el;
          }}
          aria-invalid={Boolean(errors.fullName)}
          className={inputClass(Boolean(errors.fullName))}
        />
      </Field>

      <Field label="Work email" htmlFor="workEmail" error={errors.workEmail}>
        <input
          id="workEmail"
          name="workEmail"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={values.workEmail}
          onChange={(e) => setField("workEmail", e.target.value)}
          ref={(el) => {
            fieldRefs.current.workEmail = el;
          }}
          aria-invalid={Boolean(errors.workEmail)}
          className={inputClass(Boolean(errors.workEmail))}
        />
      </Field>

      <Field label="Company website" htmlFor="companyWebsite" error={errors.companyWebsite}>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          placeholder="yourcompany.com"
          value={values.companyWebsite}
          onChange={(e) => setField("companyWebsite", e.target.value)}
          ref={(el) => {
            fieldRefs.current.companyWebsite = el;
          }}
          aria-invalid={Boolean(errors.companyWebsite)}
          className={inputClass(Boolean(errors.companyWebsite))}
        />
      </Field>

      <Field label="Main IT service" htmlFor="mainItService" error={errors.mainItService}>
        <select
          id="mainItService"
          name="mainItService"
          required
          value={values.mainItService}
          onChange={(e) => setField("mainItService", e.target.value)}
          ref={(el) => {
            fieldRefs.current.mainItService = el;
          }}
          aria-invalid={Boolean(errors.mainItService)}
          className={inputClass(Boolean(errors.mainItService))}
        >
          <option value="" disabled>
            Select an option
          </option>
          {MAIN_IT_SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Goal / target market"
        htmlFor="goal"
        error={errors.goal}
        hint="What do you sell, and whom do you want to reach?"
      >
        <textarea
          id="goal"
          name="goal"
          required
          minLength={20}
          maxLength={1500}
          rows={5}
          value={values.goal}
          onChange={(e) => setField("goal", e.target.value)}
          ref={(el) => {
            fieldRefs.current.goal = el;
          }}
          aria-invalid={Boolean(errors.goal)}
          className={inputClass(Boolean(errors.goal))}
        />
      </Field>

      <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          aria-invalid={Boolean(errors.phone)}
          className={inputClass(Boolean(errors.phone))}
        />
      </Field>

      <p className="text-sm leading-6 text-muted-ink">
        We use these details to respond to your enquiry. Read our{" "}
        <a href="/privacy" className="text-primary underline underline-offset-4">
          Privacy Notice
        </a>
        .
      </p>

      <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Sending…" : siteConfig.formSubmitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-ink">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p role="alert" className="text-sm font-medium text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `min-h-[44px] w-full rounded-lg border bg-surface px-4 py-2.5 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 ${
    hasError ? "border-accent" : "border-border"
  }`;
}
