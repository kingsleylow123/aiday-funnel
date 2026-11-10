import { NextRequest, NextResponse } from "next/server";
import { PROGRAM_TOKEN_RE, STRIPE_SESSION_RE, proxyGetJson } from "@/lib/aiday/server";

// /aiday/join/balance reads the buyer's state: GET ?b=<token>[&s=<cs_id>] → EventOps.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const b = req.nextUrl.searchParams.get("b") || "";
  const s = req.nextUrl.searchParams.get("s") || "";
  if (!PROGRAM_TOKEN_RE.test(b)) return NextResponse.json({ ok: false, error: "missing or invalid token" }, { status: 400 });
  const q = new URLSearchParams({ b });
  if (s && STRIPE_SESSION_RE.test(s)) q.set("s", s);
  return proxyGetJson(req, `/api/public/aiday/program/buyer?${q.toString()}`);
}
