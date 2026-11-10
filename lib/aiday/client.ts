/**
 * Browser helpers for the AI day pages: first landing attribution (UTMs,
 * referrer, affiliate) kept in sessionStorage, an anonymous id in
 * localStorage, and fire and forget event tracking. Storage can throw
 * (private mode, blocked site data), so every access is guarded.
 */

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  affiliate: string;
};

const ATTR_KEY = "aiday:attr";
const ANON_KEY = "aiday:anon";
const EMPTY: Attribution = { utm_source: "", utm_medium: "", utm_campaign: "", referrer: "", affiliate: "" };

function clean(v: string | null | undefined, max = 200): string {
  return (v || "").trim().slice(0, max);
}

/** Handle from a /a/{handle} visit earlier in this tab (ClickBeacon sets this key). */
function affiliateFromBeacon(): string {
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i) || "";
      if (k.startsWith("cm-aff-click:")) return clean(k.slice("cm-aff-click:".length), 80);
    }
  } catch {
    /* storage blocked */
  }
  return "";
}

/** Call on every AI day page load. The first landing wins; a later ?a= or UTM fills gaps only. */
export function captureAttribution(): Attribution {
  let stored: Attribution | null = null;
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (raw) stored = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    stored = null;
  }
  const q = new URLSearchParams(location.search);
  let ref = "";
  try {
    if (document.referrer && new URL(document.referrer).origin !== location.origin) ref = document.referrer;
  } catch {
    ref = "";
  }
  const affiliate = clean(q.get("a"), 80) || affiliateFromBeacon();
  // EventOps drops the affiliate field from its stats, but counts utm_source.
  // So an affiliate link with no UTMs also reports as source = handle,
  // medium = "affiliate", and shows in the dashboard's Sources table.
  const fresh: Attribution = {
    utm_source: clean(q.get("utm_source"), 120) || affiliate,
    utm_medium: clean(q.get("utm_medium"), 120) || (affiliate ? "affiliate" : ""),
    utm_campaign: clean(q.get("utm_campaign"), 200),
    referrer: clean(ref, 500),
    affiliate,
  };
  const out: Attribution = stored
    ? {
        utm_source: stored.utm_source || fresh.utm_source,
        utm_medium: stored.utm_medium || fresh.utm_medium,
        utm_campaign: stored.utm_campaign || fresh.utm_campaign,
        referrer: stored.referrer || fresh.referrer,
        affiliate: stored.affiliate || fresh.affiliate,
      }
    : fresh;
  try {
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(out));
  } catch {
    /* storage blocked: still return what we have for this page */
  }
  return out;
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* fall through */
  }
  return { ...EMPTY };
}

let memAnon = "";
export function anonId(): string {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "");
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    if (!memAnon) memAnon = Math.random().toString(36).slice(2) + Date.now().toString(36);
    return memAnon;
  }
}

export type AidayEvent =
  | "page_view"
  | "register_submit"
  | "register_success"
  | "vip_view"
  | "vip_click"
  | "quiz_complete"
  | "calendar_click"
  | "whatsapp_click"
  | "program_view"
  | "program_deposit_click"
  | "program_balance_click";

export function track(name: AidayEvent, opts: { token?: string; props?: Record<string, unknown> } = {}): void {
  try {
    const a = getAttribution();
    const body = JSON.stringify({
      name,
      anon_id: anonId(),
      token: opts.token || undefined,
      props: opts.props,
      utm_source: a.utm_source,
      utm_medium: a.utm_medium,
      utm_campaign: a.utm_campaign,
    });
    const sent = navigator.sendBeacon?.("/aiday/api/track", new Blob([body], { type: "application/json" })) ?? false;
    if (!sent) {
      fetch("/aiday/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* tracking never breaks the page */
  }
}
