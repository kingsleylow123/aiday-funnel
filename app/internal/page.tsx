import type { Metadata } from "next";
import { cookies } from "next/headers";
import "../_styles/dashboard.css";
import { Dashboard } from "./Dashboard";
import { AIDAY_DASH_COOKIE, AIDAY_PARTNERS, verifyDashToken } from "@/lib/aiday/session";

export const metadata: Metadata = {
  title: { absolute: "AI Day Dashboard" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ e?: string | string[] }> };

const ERRORS: Record<string, string> = {
  bad: "That username and password didn't match.",
  rate: "Too many tries. Wait 15 minutes, then try again.",
  config: "Sign in isn't set up on the server yet.",
};

// claudemalaysia.com/aiday/internal: private partner dashboard. Without the
// signed session cookie only the login form renders (and /aiday/api/stats
// answers 401), so the call list never reaches a signed out browser.
export default async function AidayInternalPage({ searchParams }: Props) {
  const store = await cookies();
  const partner = verifyDashToken(store.get(AIDAY_DASH_COOKIE)?.value);

  if (partner) {
    return (
      <div className="aid-dash">
        <Dashboard who={AIDAY_PARTNERS[partner]} />
      </div>
    );
  }

  const e = (await searchParams).e;
  const err = typeof e === "string" ? ERRORS[e] : undefined;
  return (
    <div className="aid-dash">
      <section className="login" id="login">
        <form id="lf" method="post" action="/aiday/api/login">
          <p className="kicker">Internal · partners only</p>
          <h1>Run It From Your Phone</h1>
          <label className="sr" htmlFor="lu">Username</label>
          <input id="lu" name="username" type="text" placeholder="Username (alaric, kingsley or rafay)" autoComplete="username" required />
          <label className="sr" htmlFor="lp">Password</label>
          <input id="lp" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
          <button className="btn blue" type="submit">Sign in <span className="ar">→</span></button>
          {err ? <p className="lerr" role="alert">{err}</p> : null}
          <small>Your own partner login. Don&apos;t share it.</small>
        </form>
      </section>
    </div>
  );
}
