"use client";

import { FormEvent, useRef, useState } from "react";
import { Countdown } from "./Countdown";
import { getAttribution, track } from "@/lib/aiday/client";
import { AIDAY_EVENT } from "@/lib/aiday/config";

const CONSENT_TEXT =
  "Send me the Zoom link, reminders and future event news by email and WhatsApp. Unsubscribe any time.";
const ERR_FIELDS = "Please add your first name, WhatsApp number and a working email, and tick the box.";
const ERR_NETWORK = "That didn't go through. Check your connection and try again.";

type Field = "fn" | "ph" | "em";

/**
 * One of the two summit forms. Top: inside the hero, with the countdown.
 * Bottom: in the closing band (#join). Same fields, same validation, same copy.
 */
export function RegisterForm({ variant }: { variant: "top" | "bottom" }) {
  const x = variant === "bottom" ? "2" : "";
  const formRef = useRef<HTMLFormElement>(null);
  const [bad, setBad] = useState<Record<Field, boolean>>({ fn: false, ph: false, em: false });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = formRef.current;
    if (!f) return;
    const val = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value ?? "").trim();
    const fn = val("fn"), ph = val("ph"), em = val("em");
    const next = {
      fn: !fn,
      ph: !ph || ph.replace(/\D/g, "").length < 9,
      em: !em || !/^\S+@\S+\.\S+$/.test(em),
    };
    setBad(next);
    const ticked = (f.elements.namedItem("ok") as HTMLInputElement | null)?.checked ?? false;
    if (next.fn || next.ph || next.em || !ticked) {
      setErr(ERR_FIELDS);
      return;
    }
    setErr("");
    setBusy(true);
    track("register_submit", { props: { form: variant } });
    const a = getAttribution();
    try {
      const r = await fetch("/aiday/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: fn,
          whatsapp: ph,
          email: em,
          consent: true,
          consent_text: CONSENT_TEXT,
          event: AIDAY_EVENT,
          form: variant,
          source: location.href,
          utm_source: a.utm_source,
          utm_medium: a.utm_medium,
          utm_campaign: a.utm_campaign,
          referrer: a.referrer,
          affiliate: a.affiliate,
          hp: val("website"),
        }),
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; token?: string; error?: string };
      if (!r.ok || data.ok === false) {
        // EventOps error text (400/429) is written for visitors; anything else gets ours.
        setBusy(false);
        setErr(r.status === 400 || r.status === 429 ? data.error || ERR_FIELDS : ERR_NETWORK);
        return;
      }
      const token = typeof data.token === "string" ? data.token : "";
      track("register_success", { token, props: { form: variant } });
      const q = new URLSearchParams({ name: fn.slice(0, 40) });
      if (token) q.set("t", token);
      location.href = `/aiday/vip?${q.toString()}`;
    } catch {
      setBusy(false);
      setErr(ERR_NETWORK);
    }
  }

  const border = (k: Field) => (bad[k] ? { borderColor: "#E30000" } : undefined);

  return (
    <div
      className={variant === "bottom" ? "form form2" : "form"}
      id={variant === "bottom" ? "join" : "register"}
      style={variant === "bottom" ? { scrollMarginTop: "90px" } : undefined}
    >
      <form ref={formRef} id={`f${x}`} noValidate style={{ display: "grid", gap: "12px" }} onSubmit={onSubmit}>
        <p className="t">Save your free seat</p>
        {variant === "top" && <Countdown />}
        <label className="sr" htmlFor={`fn${x}`}>First name</label>
        <input type="text" id={`fn${x}`} name="fn" placeholder="First name" autoComplete="given-name" required style={border("fn")} />
        <label className="sr" htmlFor={`ph${x}`}>WhatsApp number</label>
        <input type="tel" id={`ph${x}`} name="ph" defaultValue="+60 " placeholder="WhatsApp number" autoComplete="tel" inputMode="tel" required aria-describedby={`phh${x}`} style={border("ph")} />
        <small className="hint" id={`phh${x}`}>For your Zoom link and reminders. No spam.</small>
        <label className="sr" htmlFor={`em${x}`}>Email</label>
        <input type="email" id={`em${x}`} name="em" placeholder="Email" autoComplete="email" required style={border("em")} />
        {/* Honeypot: hidden from people, bots fill it in. */}
        <div className="sr" aria-hidden="true">
          <label htmlFor={`website${x}`}>Website</label>
          <input type="text" id={`website${x}`} name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <div className="tick">
          <input type="checkbox" id={`ok${x}`} name="ok" required />
          <label htmlFor={`ok${x}`}>{CONSENT_TEXT}</label>
        </div>
        <button className="btn blue" type="submit" id={`go${x}`} disabled={busy}>
          {busy ? "Saving your seat…" : (<>Save my free seat <span className="ar">→</span></>)}
        </button>
        <p className="err" id={`err${x}`} role="alert" hidden={!err}>{err}</p>
        <small>Free. Live on Zoom. Replay for 48 hours.</small>
      </form>
    </div>
  );
}
