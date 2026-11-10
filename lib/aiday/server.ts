import { NextRequest, NextResponse } from "next/server";

/** EventOps owns the AI day data (registrations, VIP checkout, quiz, tracking, stats). */
export const EVENTOPS_URL = (process.env.EVENTOPS_URL || "https://event-ops-six.vercel.app").replace(/\/+$/, "");

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "";
}

/** Read a small JSON object body. Returns null for anything else. */
export async function readJsonObject(req: NextRequest, maxBytes = 8_000): Promise<Record<string, unknown> | null> {
  const text = await req.text().catch(() => "");
  if (!text || text.length > maxBytes) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Forward a JSON POST to EventOps. With the shared key EventOps trusts
 * x-cm-client-ip and rate limits per visitor; without it every visitor would
 * share this server's IP bucket. x-forwarded-for is passed along as well.
 */
function eventOpsHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = process.env.AIDAY_STATS_KEY;
  if (key) headers["x-aiday-key"] = key;
  const ip = clientIp(req);
  if (ip) headers["x-cm-client-ip"] = ip;
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (xff) headers["x-forwarded-for"] = xff;
  const ua = req.headers.get("user-agent");
  if (ua) headers["user-agent"] = ua.slice(0, 300);
  return headers;
}

export async function forwardToEventOps(req: NextRequest, path: string, body: unknown, timeoutMs = 10_000): Promise<Response> {
  return fetch(`${EVENTOPS_URL}${path}`, {
    method: "POST",
    headers: eventOpsHeaders(req),
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
}

/** Proxy a POST and hand the upstream JSON (and status) straight back. */
export async function proxyJson(req: NextRequest, path: string, body: unknown): Promise<NextResponse> {
  try {
    const res = await forwardToEventOps(req, path, body);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream unavailable, try again shortly" }, { status: 502 });
  }
}

/** Proxy a GET (path may carry a query string) and hand the upstream JSON (and status) straight back. */
export async function proxyGetJson(req: NextRequest, path: string, timeoutMs = 10_000): Promise<NextResponse> {
  try {
    const res = await fetch(`${EVENTOPS_URL}${path}`, {
      method: "GET",
      headers: eventOpsHeaders(req),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "upstream unavailable, try again shortly" }, { status: 502 });
  }
}

export function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Program buyer token (?b=) from EventOps: URL safe, no spaces. */
export const PROGRAM_TOKEN_RE = /^[A-Za-z0-9._~-]{8,200}$/;
/** Stripe Checkout session id (?s=) on the return from Stripe. */
export const STRIPE_SESSION_RE = /^cs_[A-Za-z0-9_]{8,250}$/;
/** Test switch (?t=) passed through to EventOps for a $1 test run. */
export const TEST_PARAM_RE = /^[A-Za-z0-9._~-]{1,200}$/;
