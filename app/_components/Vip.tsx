"use client";

import { MouseEvent, useEffect, useState } from "react";
import { captureAttribution, track } from "@/lib/aiday/client";
import { pixelOnce } from "@/lib/aiday/pixel";

/** vip_view once per page load. */
export function VipView({ token }: { token: string }) {
  useEffect(() => {
    captureAttribution();
    track("vip_view", { token });
    // /vip with a token is only reached after a successful sign up.
    if (token) pixelOnce(token, "CompleteRegistration", { content_name: "AI Day" });
  }, [token]);
  return null;
}

const ERR = "That didn't go through. Check your connection and try again.";

/** "Yes, add VIP to my seat": EventOps makes the checkout, we go there. */
export function VipYes({ id, token, position }: { id: string; token: string; position: "top" | "buy" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function go(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (busy) return;
    track("vip_click", { token, props: { position } });
    if (!token) {
      // No registration token (page opened directly): save a free seat first.
      location.href = "/aiday#register";
      return;
    }
    setBusy(true);
    setErr(false);
    try {
      const r = await fetch("/aiday/api/vip-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await r.json().catch(() => ({}))) as { url?: string };
      if (!r.ok || typeof data.url !== "string" || !/^(https:\/\/|\/(?!\/))/.test(data.url)) throw new Error("no checkout url");
      location.href = data.url;
    } catch {
      setBusy(false);
      setErr(true);
    }
  }

  return (
    <>
      <a className="btn blue" href="#" id={id} role="button" aria-disabled={busy || undefined} onClick={go}>
        Yes, add VIP to my seat <span className="ar">→</span>
      </a>
      {err && (
        <p role="alert" style={{ color: position === "top" ? "#FF8A8A" : "#C00000", fontSize: "14px", textAlign: "center", fontWeight: 600 }}>
          {ERR}
        </p>
      )}
    </>
  );
}
