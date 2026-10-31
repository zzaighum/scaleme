"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MAIN_IT_SERVICE_OPTIONS,
  validateEnquiry,
  type EnquiryData,
  type EnquiryInput,
} from "@/lib/validation";
import {
  isFormEndpointConfigured,
  isRecaptchaConfigured,
  isWebToLeadConfigured,
  siteConfig,
} from "@/config/site";
import { Button } from "./Button";
import { Notice } from "./Notice";

type Status = "idle" | "submitting" | "failure" | "rate-limited";

declare global {
  interface Window {
    grecaptcha?: { getResponse: (widgetId?: number) => string };
  }
}

const EMPTY: EnquiryInput = {
  fullName: "",
  workEmail: "",
  companyName: "",
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
  const [values, setValues] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryInput, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<keyof EnquiryInput, HTMLElement | null>>>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const captchaSettingsRef = useRef<HTMLInputElement>(null);

  // Google's widget script, loaded only when a site key is configured. The
  // Salesforce org's "Require reCAPTCHA Verification" setting is what makes
  // this necessary: without a token Salesforce discards the submission.
  useEffect(() => {
    if (!isRecaptchaConfigured) return;
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  /*
   * Salesforce's own generated snippet ships a `captcha_settings` field whose
   * `ts` is rewritten twice a second until the challenge is solved, so the
   * value that arrives is roughly when the visitor solved it. Salesforce
   * verifies against that, so a form carrying the widget but not this field
   * has its submissions rejected. Reproduced here rather than inlining their
   * script, with the same 500ms cadence.
   *
   * The input is uncontrolled on purpose: React would overwrite each tick.
   */
  useEffect(() => {
    if (!isRecaptchaConfigured) return;
    const id = window.setInterval(() => {
      const token = document.getElementById("g-recaptcha-response") as HTMLTextAreaElement | null;
      if (token && token.value.trim() !== "") return;
      const input = captchaSettingsRef.current;
      if (!input) return;
      try {
        const settings = JSON.parse(input.value) as Record<string, string>;
        settings.ts = JSON.stringify(Date.now());
        input.value = JSON.stringify(settings);
      } catch {
        // A malformed value would only make things worse to "repair" blindly.
      }
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  // In Web-to-Lead mode the `name` attributes have to be Salesforce's, not ours.
  const name = (salesforce: string, own: string) => (isWebToLeadConfigured ? salesforce : own);
  const returnUrl = `${siteConfig.canonicalSiteUrl.replace(/\/$/, "")}/thank-you/?sent=1`;

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

  /**
   * Deliberately synchronous up to the point where the Web-to-Lead path hands
   * over to the browser. `preventDefault` only counts during the event's own
   * dispatch, so the decision to let a native submit through cannot sit behind
   * an await.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (status === "submitting") {
      e.preventDefault();
      return;
    }

    const result = validateEnquiry(values);
    if (!result.valid) {
      e.preventDefault();
      setErrors(result.errors);
      setStatus("idle");
      setStatusMessage(null);
      const firstKey = Object.keys(result.errors)[0] as keyof EnquiryInput | undefined;
      if (firstKey) fieldRefs.current[firstKey]?.focus();
      return;
    }

    // Honeypot: a field no human sees, so anything in it came from a bot.
    // Fail silently rather than explaining the trap.
    if (honeypotRef.current?.value) {
      e.preventDefault();
      router.push("/thank-you/?sent=1");
      return;
    }

    if (isWebToLeadConfigured) {
      if (isRecaptchaConfigured && !window.grecaptcha?.getResponse()) {
        e.preventDefault();
        setErrors({});
        setStatus("failure");
        setStatusMessage("Please complete the verification below, then send your brief again.");
        return;
      }

      /*
       * Nothing may call setState from here on. `captcha_settings` is an
       * uncontrolled input that a timer keeps stamped; a re-render restores it
       * to its defaultValue, and the browser would serialise an empty `ts`
       * that Salesforce rejects. That also rules out a "Sending…" label on
       * this path — the page navigates away within a frame regardless.
       */
      e.currentTarget.dataset.submitting = "true";
      // No preventDefault: the browser performs an ordinary form POST to
      // Salesforce, which then redirects to `retURL`. A background fetch would
      // be blocked, because Web-to-Lead sends no CORS headers.
      return;
    }

    e.preventDefault();
    setErrors({});
    setStatusMessage(null);
    void submitJson(result.data);
  }

  async function submitJson(data: EnquiryData) {
    setStatus("submitting");

    const payloadHash = simpleHash(JSON.stringify(data));
    const idempotencyKey = getIdempotencyKey(payloadHash);

    // No endpoint configured: this build is static, so there is nothing to post
    // to. Show the illustrative confirmation rather than a failure — /thank-you
    // labels it as a demo and no data leaves the browser.
    if (!isFormEndpointConfigured) {
      router.push("/thank-you/?demo=1");
      return;
    }

    // Read the campaign params here rather than with `useSearchParams`. That
    // hook forces the whole subtree to client-side render, which on the static
    // export means `out/book-a-call/index.html` ships without the form at all.
    // This runs on submit, in the browser, so the query string is available.
    const params = new URLSearchParams(window.location.search);

    try {
      const res = await fetch(siteConfig.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          idempotencyKey,
          landingPage: window.location.pathname,
          source: {
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            utm_campaign: params.get("utm_campaign"),
            source: params.get("source"),
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

      if (!res.ok) {
        setStatus("failure");
        setStatusMessage(
          "We could not send your brief. Your details are still here—please try again."
        );
        return;
      }

      // A third-party endpoint decides its own response shape, so success is
      // judged on the HTTP status alone — it will not return our `redirect`.
      router.push("/thank-you/?sent=1");
    } catch {
      setStatus("failure");
      setStatusMessage(
        "We could not send your brief. Your details are still here—please try again."
      );
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      action={isWebToLeadConfigured ? siteConfig.formEndpoint : undefined}
      method={isWebToLeadConfigured ? "post" : undefined}
      acceptCharset="UTF-8"
      className="flex flex-col gap-5"
    >
      {isWebToLeadConfigured ? (
        <>
          {isRecaptchaConfigured ? (
            <input
              ref={captchaSettingsRef}
              type="hidden"
              name="captcha_settings"
              defaultValue={JSON.stringify({
                keyname: siteConfig.recaptchaKeyName,
                fallback: String(siteConfig.recaptchaServerFallback),
                orgId: siteConfig.salesforceOrgId,
                ts: "",
              })}
            />
          ) : null}
          <input type="hidden" name="oid" value={siteConfig.salesforceOrgId} readOnly />
          <input type="hidden" name="retURL" value={returnUrl} readOnly />
          <input type="hidden" name="lead_source" value="Web" readOnly />
          {/* Lead.Industry is a picklist of Salesforce's values, not ours, so
              the chosen service only reaches Salesforce once a custom field
              exists to hold it. Set NEXT_PUBLIC_SALESFORCE_SERVICE_FIELD_ID to
              that field's id and it is posted; until then it is not sent. */}
          {siteConfig.salesforceServiceFieldId ? (
            <input
              type="hidden"
              name={siteConfig.salesforceServiceFieldId}
              value={values.mainItService}
              readOnly
            />
          ) : null}
          {siteConfig.webToLeadDebugEmail ? (
            <>
              <input type="hidden" name="debug" value="1" readOnly />
              <input
                type="hidden"
                name="debugEmail"
                value={siteConfig.webToLeadDebugEmail}
                readOnly
              />
            </>
          ) : null}
        </>
      ) : null}

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <input
        ref={honeypotRef}
        type="text"
        name="website_confirm"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />
      {/* The warning tracks whether there is anywhere to send to, not the site
          mode. On the static build a live site with no endpoint still captures
          nothing, and a visitor should know that before typing, not after. */}
      {!isFormEndpointConfigured ? (
        <Notice tone="info" title="This form is not connected yet — nothing will be sent.">
          {siteConfig.siteMode === "preview"
            ? "Try the demo flow: submitting this form runs an illustrative preview and does not contact anyone."
            : "Submitting shows an illustrative confirmation only. Your details stay in your browser and do not reach us."}
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
          name={name("last_name", "fullName")}
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          ref={(el) => {
            fieldRefs.current.fullName = el;
          }}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={describedBy("fullName", Boolean(errors.fullName))}
          className={inputClass(Boolean(errors.fullName))}
        />
      </Field>

      <Field label="Work email" htmlFor="workEmail" error={errors.workEmail}>
        <input
          id="workEmail"
          name={name("email", "workEmail")}
          type="email"
          autoComplete="email"
          required
          maxLength={80}
          value={values.workEmail}
          onChange={(e) => setField("workEmail", e.target.value)}
          ref={(el) => {
            fieldRefs.current.workEmail = el;
          }}
          aria-invalid={Boolean(errors.workEmail)}
          aria-describedby={describedBy("workEmail", Boolean(errors.workEmail))}
          className={inputClass(Boolean(errors.workEmail))}
        />
      </Field>

      <Field label="Company name" htmlFor="companyName" error={errors.companyName}>
        <input
          id="companyName"
          name={name("company", "companyName")}
          type="text"
          autoComplete="organization"
          required
          maxLength={255}
          value={values.companyName}
          onChange={(e) => setField("companyName", e.target.value)}
          ref={(el) => {
            fieldRefs.current.companyName = el;
          }}
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={describedBy("companyName", Boolean(errors.companyName))}
          className={inputClass(Boolean(errors.companyName))}
        />
      </Field>

      <Field label="Company website" htmlFor="companyWebsite" error={errors.companyWebsite}>
        <input
          id="companyWebsite"
          name={name("URL", "companyWebsite")}
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
          aria-describedby={describedBy("companyWebsite", Boolean(errors.companyWebsite))}
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
          aria-describedby={describedBy("mainItService", Boolean(errors.mainItService))}
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
          name={name("description", "goal")}
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
          aria-describedby={describedBy("goal", Boolean(errors.goal), true)}
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
          aria-describedby={describedBy("phone", Boolean(errors.phone))}
          className={inputClass(Boolean(errors.phone))}
        />
      </Field>

      <p className="text-sm leading-6 text-muted-ink">
        We use these details to respond to your enquiry. Read our{" "}
        <a href="/privacy/" className="text-primary underline underline-offset-4">
          Privacy Notice
        </a>
        .
      </p>

      {isRecaptchaConfigured ? (
        <div className="g-recaptcha" data-sitekey={siteConfig.recaptchaSiteKey} />
      ) : null}

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
        <p id={`${htmlFor}-error`} role="alert" className="text-sm font-medium text-accent-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `min-h-[44px] w-full rounded-lg border bg-surface px-4 py-2.5 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 ${
    hasError ? "border-accent" : "border-field-border"
  }`;
}

// `aria-invalid` tells a screen reader the field is wrong; without this it
// never hears why, because the message is only a sibling paragraph.
function describedBy(id: string, hasError: boolean, hasHint = false): string | undefined {
  const ids = [hasHint ? `${id}-hint` : null, hasError ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}
