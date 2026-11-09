import { NextRequest, NextResponse } from "next/server";
import { proxyJson, readJsonObject, str } from "@/lib/aiday/server";

// VIP "Yes" buttons → EventOps creates the checkout session → {url}.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const b = await readJsonObject(req);
  const token = str(b?.token, 200);
  if (!token) return NextResponse.json({ ok: false, error: "missing token" }, { status: 400 });
  return proxyJson(req, "/api/public/aiday/vip-checkout", { token });
}
