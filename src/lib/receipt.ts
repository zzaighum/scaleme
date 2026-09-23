import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Signs a short-lived receipt token so /thank-you can prove a submission was
// server-validated, without needing a database round trip to render the page.
// Set RECEIPT_SIGNING_SECRET in any environment that must survive a restart
// (i.e. live mode). In preview/dev an ephemeral secret is generated so the
// demo flow works without extra setup — receipts just won't survive a restart.

// Route handlers and pages can end up in separate bundles/module instances
// (e.g. Turbopack's per-route compilation in dev), so a plain module-level
// variable is not guaranteed to be shared between them. globalThis is the
// one thing every module instance in the same process actually shares.
const GLOBAL_KEY = Symbol.for("yourleadspartner.receiptEphemeralSecret");
type GlobalWithSecret = typeof globalThis & { [GLOBAL_KEY]?: string };

function getSecret(): string {
  const configured = process.env.RECEIPT_SIGNING_SECRET;
  if (configured && configured.length >= 16) return configured;

  const g = globalThis as GlobalWithSecret;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = randomBytes(32).toString("hex");
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "RECEIPT_SIGNING_SECRET is not set. Using an ephemeral secret for this process only — receipts will stop validating after a restart. Set RECEIPT_SIGNING_SECRET before going live."
      );
    }
  }
  return g[GLOBAL_KEY];
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

export type ReceiptPayload = {
  kind: "enquiry" | "booking";
  id: string;
  demo?: boolean;
  exp: number;
};

export function signReceipt(payload: Omit<ReceiptPayload, "exp">, ttlSeconds: number): string {
  const full: ReceiptPayload = { ...payload, exp: Date.now() + ttlSeconds * 1000 };
  const body = base64url(Buffer.from(JSON.stringify(full)));
  const sig = base64url(createHmac("sha256", getSecret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyReceipt(token: string | undefined | null): ReceiptPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expectedSig = base64url(createHmac("sha256", getSecret()).update(body).digest());
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ReceiptPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
