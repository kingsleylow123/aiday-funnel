import { NextRequest, NextResponse } from "next/server";
import { PROGRAM_TOKEN_RE, proxyJson, readJsonObject, str } from "@/lib/aiday/server";

// /aiday/join/balance plan buttons → EventOps makes the balance checkout → on-page form or {url} (409 if already set up).
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await readJsonObject(req);
  const b = str(body?.b, 200);
  const plan = body?.plan;
  if (!PROGRAM_TOKEN_RE.test(b) || (plan !== "full" && plan !== "split")) {
    return NextResponse.json({ ok: false, error: "missing or invalid fields" }, { status: 400 });
  }
  return proxyJson(req, "/api/public/aiday/program/balance-checkout", { b, plan, embedded: true });
}
