import { NextRequest, NextResponse } from "next/server";
import { TEST_PARAM_RE, proxyJson, readJsonObject, str } from "@/lib/aiday/server";

// /aiday/join "Reserve your seat" → EventOps makes the $500 deposit checkout → {url}.
// Stripe collects name, email and phone, so nothing personal passes through here.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const b = await readJsonObject(req);
  if (!b) return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });

  const t = str(b.t, 200);
  const body: Record<string, string> = {
    utm_source: str(b.utm_source, 120),
    utm_medium: str(b.utm_medium, 120),
    utm_campaign: str(b.utm_campaign, 200),
    affiliate: str(b.affiliate, 80),
    anon_id: str(b.anon_id, 80),
  };
  if (t && TEST_PARAM_RE.test(t)) body.t = t;
  return proxyJson(req, "/api/public/aiday/program/deposit-checkout", body);
}
