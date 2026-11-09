import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/aiday/server";
import {
  AIDAY_DASH_COOKIE,
  AIDAY_DASH_MAX_AGE,
  checkCredentials,
  clearLoginAttempts,
  dashConfigured,
  makeDashToken,
  takeLoginAttempt,
} from "@/lib/aiday/session";

// /aiday/internal sign in. Plain form POST, answered with a 303 back to the page.
export const dynamic = "force-dynamic";

// Relative Location: behind the claudemalaysia.com/aiday rewrite, req.url is
// this app's own host, so an absolute redirect would leave the main domain.
function back(_req: NextRequest, err?: string) {
  return new NextResponse(null, { status: 303, headers: { Location: `/aiday/internal${err ? `?e=${encodeURIComponent(err)}` : ""}` } });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!dashConfigured()) return back(req, "config");
  if (!takeLoginAttempt(ip)) return back(req, "rate");

  const form = await req.formData().catch(() => null);
  const user = String(form?.get("username") ?? "").slice(0, 200);
  const pass = String(form?.get("password") ?? "").slice(0, 200);
  const partner = checkCredentials(user, pass);
  if (!partner) return back(req, "bad");

  const token = makeDashToken(partner);
  if (!token) return back(req, "config");
  clearLoginAttempts(ip);
  const res = back(req);
  res.cookies.set(AIDAY_DASH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AIDAY_DASH_MAX_AGE,
    path: "/aiday",
  });
  return res;
}
