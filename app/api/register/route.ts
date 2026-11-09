import { NextRequest, NextResponse } from "next/server";
import { proxyJson, readJsonObject, str } from "@/lib/aiday/server";
import { AIDAY_EVENT } from "@/lib/aiday/config";

// /aiday registration (both forms) → EventOps POST /api/public/aiday/register → {ok, token}.
export const dynamic = "force-dynamic";

const EMAIL = /^\S+@\S+\.\S+$/;

export async function POST(req: NextRequest) {
  const b = await readJsonObject(req);
  if (!b) return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });

  const first_name = str(b.first_name, 80);
  const whatsapp = str(b.whatsapp, 40);
  const email = str(b.email, 200).toLowerCase();
  const form = b.form === "bottom" ? "bottom" : "top";
  if (!first_name || whatsapp.replace(/\D/g, "").length < 9 || !EMAIL.test(email) || b.consent !== true) {
    return NextResponse.json({ ok: false, error: "missing or invalid fields" }, { status: 400 });
  }

  return proxyJson(req, "/api/public/aiday/register", {
    first_name,
    whatsapp,
    email,
    consent: true,
    consent_text: str(b.consent_text, 500),
    event: AIDAY_EVENT,
    form,
    source: str(b.source, 500),
    utm_source: str(b.utm_source, 120),
    utm_medium: str(b.utm_medium, 120),
    utm_campaign: str(b.utm_campaign, 200),
    referrer: str(b.referrer, 500),
    affiliate: str(b.affiliate, 80),
    hp: str(b.hp, 200),
  });
}
