// Shared client + server validation for the enquiry form.
// Keep this free of Node-only APIs so it can run in the browser and in the route handler.

export const MAIN_IT_SERVICE_OPTIONS = [
  "Software development",
  "IT consulting",
  "IT outsourcing",
  "Other IT services",
] as const;

export type MainItService = (typeof MAIN_IT_SERVICE_OPTIONS)[number];

export type EnquiryInput = {
  fullName: string;
  workEmail: string;
  companyName: string;
  companyWebsite: string;
  mainItService: string;
  goal: string;
  phone?: string;
};

export type EnquiryData = {
  fullName: string;
  workEmail: string;
  companyName: string;
  companyWebsite: string;
  mainItService: MainItService;
  goal: string;
  phone: string | null;
};

export type ValidationResult =
  | { valid: true; data: EnquiryData }
  | { valid: false; errors: Partial<Record<keyof EnquiryInput, string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose international phone check: digits, spaces, +, (), - only, 6-20 significant chars.
const PHONE_RE = /^[0-9+()\-.\s]{6,20}$/;

export function normaliseWebsite(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateEnquiry(input: Partial<EnquiryInput>): ValidationResult {
  const errors: Partial<Record<keyof EnquiryInput, string>> = {};

  // 80 is Salesforce's Lead.LastName column, which this maps to. Rejecting
  // here beats Salesforce truncating or dropping the record server-side.
  const fullName = (input.fullName ?? "").trim();
  if (fullName.length < 2 || fullName.length > 80) {
    errors.fullName = "Enter your full name (2–80 characters).";
  }

  // Salesforce's Lead.Email is 80 characters, shorter than the RFC maximum.
  const workEmail = (input.workEmail ?? "").trim();
  if (!workEmail || workEmail.length > 80 || !EMAIL_RE.test(workEmail)) {
    errors.workEmail = "Enter a valid work email address.";
  }

  // Salesforce's Lead object requires Company, and a website is not a company
  // name. Collecting it is also better qualification data than deriving
  // "acme-it.com" from the domain.
  const companyName = (input.companyName ?? "").trim();
  if (companyName.length < 2 || companyName.length > 255) {
    errors.companyName = "Enter your company name (2–255 characters).";
  }

  const normalisedWebsite = normaliseWebsite(input.companyWebsite ?? "");
  if (!normalisedWebsite) {
    errors.companyWebsite = "Enter your company website (e.g. yourcompany.com).";
  }

  const mainItService = (input.mainItService ?? "") as MainItService;
  if (!MAIN_IT_SERVICE_OPTIONS.includes(mainItService)) {
    errors.mainItService = "Select your main IT service.";
  }

  const goal = (input.goal ?? "").trim();
  if (goal.length < 20 || goal.length > 1500) {
    errors.goal = "Tell us what you sell and whom you want to reach (20–1500 characters).";
  }

  const phoneRaw = (input.phone ?? "").trim();
  let phone: string | null = null;
  if (phoneRaw) {
    if (!PHONE_RE.test(phoneRaw)) {
      errors.phone = "Enter a valid phone number, or leave this blank.";
    } else {
      phone = phoneRaw;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      fullName,
      workEmail,
      companyName,
      companyWebsite: normalisedWebsite as string,
      mainItService,
      goal,
      phone,
    },
  };
}
