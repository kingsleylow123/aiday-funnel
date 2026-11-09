import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/aiday/server";

// Temporary check: the visitor IP this app sees behind the claudemalaysia.com
// rewrite (EventOps rate limits sign ups per visitor IP). Remove after launch.
export const dynamic = "force-dynamic";
export function GET(req: NextRequest) {
  return NextResponse.json({ ip: clientIp(req) }, { headers: { "Cache-Control": "no-store" } });
}
