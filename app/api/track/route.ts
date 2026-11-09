import { NextRequest, NextResponse, after } from "next/server";
import { forwardToEventOps, readJsonObject, str } from "@/lib/aiday/server";

// Page events for the partner dashboard. Answers at once, forwards afterwards.
export const dynamic = "force-dynamic";

const NAMES = new Set([
  "page_view",
  "register_submit",
  "register_success",
  "vip_view",
  "vip_click",
  "quiz_complete",
  "calendar_click",
  "whatsapp_click",
]);

export async function POST(req: NextRequest) {
  const b = await readJsonObject(req, 4_000);
  const name = str(b?.name, 40);
  const anon_id = str(b?.anon_id, 80);
  if (!b || !NAMES.has(name) || !anon_id) return new NextResponse(null, { status: 204 });

  const props = b.props && typeof b.props === "object" && !Array.isArray(b.props) ? b.props : undefined;
  const payload = {
    name,
    anon_id,
    token: str(b.token, 200) || undefined,
    props,
    utm_source: str(b.utm_source, 120),
    utm_medium: str(b.utm_medium, 120),
    utm_campaign: str(b.utm_campaign, 200),
  };
  after(() => forwardToEventOps(req, "/api/public/aiday/track", payload, 5_000).then(() => undefined, () => undefined));
  return new NextResponse(null, { status: 204 });
}
