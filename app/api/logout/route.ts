import { NextRequest, NextResponse } from "next/server";
import { AIDAY_DASH_COOKIE } from "@/lib/aiday/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  void req;
  const res = new NextResponse(null, { status: 303, headers: { Location: "/aiday/internal" } });
  // Clear both the current (/aiday) cookie and any older one set on "/".
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  for (const path of ["/aiday", "/"]) {
    res.headers.append("Set-Cookie", `${AIDAY_DASH_COOKIE}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  }
  return res;
}
