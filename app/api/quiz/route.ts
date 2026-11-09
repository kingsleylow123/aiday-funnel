import { NextRequest, NextResponse } from "next/server";
import { proxyJson, readJsonObject, str } from "@/lib/aiday/server";
import { AIDAY_EVENT } from "@/lib/aiday/config";

// Thank you page quiz → EventOps POST /api/public/aiday/quiz.
export const dynamic = "force-dynamic";

const KEYS = ["use", "leads", "week", "stage", "revenue", "help"] as const;

export async function POST(req: NextRequest) {
  const b = await readJsonObject(req);
  const a = b?.answers;
  if (!b || !a || typeof a !== "object" || Array.isArray(a)) {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  const src = a as Record<string, unknown>;
  const answers: Record<string, string | number> = {};
  for (const k of KEYS) answers[k] = str(src[k], 200);
  const level = Number(src.level);
  answers.level = Number.isInteger(level) && level >= 1 && level <= 5 ? level : 0;

  return proxyJson(req, "/api/public/aiday/quiz", {
    token: str(b.token, 200),
    answers,
    event: AIDAY_EVENT,
    source: str(b.source, 500),
  });
}
