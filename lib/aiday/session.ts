import crypto from "crypto";

/**
 * /aiday/internal partner login. Three personal logins: Alaric, Kingsley and
 * Rafay. Usernames are fixed; each password comes from env
 * (AIDAY_DASH_PASS_ALARIC / AIDAY_DASH_PASS_KINGSLEY / AIDAY_DASH_PASS_RAFAY),
 * never from code. The session cookie is
 * `${user}.${expiry}.${HMAC(AIDAY_DASH_SECRET, "aiday-dash:" + user + ":" + expiry)}`:
 * it cannot be forged without the secret, expires after 7 days, and stops
 * working as soon as that partner's password env is removed. Fails closed when
 * env values are missing.
 */
export const AIDAY_DASH_COOKIE = "aiday_dash";
export const AIDAY_DASH_MAX_AGE = 7 * 24 * 60 * 60; // seconds

function secret(): string | null {
  const s = process.env.AIDAY_DASH_SECRET;
  return s && s.length >= 16 ? s : null;
}

/** Partner username -> display name. */
export const AIDAY_PARTNERS = { alaric: "Alaric", kingsley: "Kingsley", rafay: "Rafay" } as const;
export type AidayPartner = keyof typeof AIDAY_PARTNERS;

const MIN_PASS = 12;

function partnerPass(user: AidayPartner): string | null {
  const env = { alaric: "AIDAY_DASH_PASS_ALARIC", kingsley: "AIDAY_DASH_PASS_KINGSLEY", rafay: "AIDAY_DASH_PASS_RAFAY" } as const;
  const p = process.env[env[user]];
  return p && p.length >= MIN_PASS ? p : null;
}

function asPartner(user: string): AidayPartner | null {
  const u = user.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(AIDAY_PARTNERS, u) ? (u as AidayPartner) : null;
}

export function dashConfigured(): boolean {
  return Boolean(secret() && (Object.keys(AIDAY_PARTNERS) as AidayPartner[]).some((u) => partnerPass(u)));
}

function sign(user: string, exp: number, key: string): string {
  return crypto.createHmac("sha256", key).update(`aiday-dash:${user}:${exp}`).digest("hex");
}

/** Constant time string compare (hash first so lengths never leak). */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Returns the partner on a match, else null. */
export function checkCredentials(user: string, pass: string): AidayPartner | null {
  const partner = asPartner(user);
  // Always run one compare so an unknown username takes the same time.
  const expected = partner ? partnerPass(partner) : null;
  const ok = safeEqual(pass, expected ?? "\u0000no-password");
  return partner && expected && ok ? partner : null;
}

export function makeDashToken(user: AidayPartner): string | null {
  const key = secret();
  if (!key) return null;
  const exp = Date.now() + AIDAY_DASH_MAX_AGE * 1000;
  return `${user}.${exp}.${sign(user, exp, key)}`;
}

/** Returns the signed in partner, or null. */
export function verifyDashToken(token: string | undefined | null): AidayPartner | null {
  const key = secret();
  if (!key || !token) return null;
  const [rawUser, rawExp, sig, extra] = token.split(".");
  if (extra !== undefined || !rawUser || !rawExp || !sig) return null;
  const user = asPartner(rawUser);
  if (!user || user !== rawUser || !partnerPass(user)) return null; // revoked when env removed
  const exp = Number(rawExp);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(user, exp, key));
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? user : null;
}

/* Login rate limit: 5 attempts per 15 minutes per IP. In memory, so it is per
   server instance (best effort on serverless); it still blocks a single
   instance being hammered, and the password should be long. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { n: number; reset: number }>();

export function takeLoginAttempt(ip: string): boolean {
  const now = Date.now();
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) if (v.reset < now) attempts.delete(k);
  }
  const key = ip || "unknown";
  const cur = attempts.get(key);
  if (!cur || cur.reset < now) {
    attempts.set(key, { n: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (cur.n >= MAX_ATTEMPTS) return false;
  cur.n += 1;
  return true;
}

export function clearLoginAttempts(ip: string): void {
  attempts.delete(ip || "unknown");
}
