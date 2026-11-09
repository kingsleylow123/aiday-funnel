import { NextRequest, NextResponse } from "next/server";
import { EVENTOPS_URL } from "@/lib/aiday/server";
import { AIDAY_DASH_COOKIE, verifyDashToken } from "@/lib/aiday/session";

// Partner dashboard data. Signed in partners only (it carries the call list).
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(req: NextRequest) {
  if (!verifyDashToken(req.cookies.get(AIDAY_DASH_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }
  const key = process.env.AIDAY_STATS_KEY;
  if (!key) return NextResponse.json({ error: "stats not configured" }, { status: 500, headers: NO_STORE });
  try {
    const res = await fetch(`${EVENTOPS_URL}/api/aiday/stats`, {
      headers: { "x-aiday-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream error" }, { status: 502, headers: NO_STORE });
    const data = await res.json();
    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502, headers: NO_STORE });
  }
}
