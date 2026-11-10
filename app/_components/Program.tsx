"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { anonId, captureAttribution, getAttribution, track } from "@/lib/aiday/client";
import { PROGRAM, usd } from "@/lib/aiday/program";
import { pixelOnce } from "@/lib/aiday/pixel";

/*
 * AI Day Program checkout (client side). All payments live in EventOps:
 * these components call the /aiday/api/program/* proxies. EventOps answers
 * with a Stripe embedded checkout ({clientSecret, publishableKey}), which
 * opens in a sheet on this page, or a hosted Stripe url as the fallback.
 */

const ERR = "That didn't go through. Check your connection and try again.";

/** Meta Pixel InitiateCheckout. The pixel itself is loaded in app/layout.tsx; this only fires an event if it's there. */
function pixelCheckout(value: number) {
  try {
    window.fbq?.("track", "InitiateCheckout", { value, currency: PROGRAM.currency });
  } catch {
    /* tracking never breaks the page */
  }
}

type Embedded = { clientSecret: string; publishableKey: string };

/**
 * POST to a proxy. Embedded answer → returned for the on-page sheet.
 * Hosted answer → we go to the Stripe url (and return null).
 * Throws with the HTTP status on failure.
 */
async function startCheckout(path: string, body: unknown): Promise<Embedded | null> {
  const r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await r.json().catch(() => ({}))) as { url?: unknown; clientSecret?: unknown; publishableKey?: unknown };
  if (!r.ok) throw Object.assign(new Error("checkout failed"), { status: r.status });
  if (typeof data.clientSecret === "string" && typeof data.publishableKey === "string" && data.publishableKey.startsWith("pk_")) {
    return { clientSecret: data.clientSecret, publishableKey: data.publishableKey };
  }
  if (typeof data.url !== "string" || !data.url.startsWith("https://")) throw new Error("no checkout url");
  location.href = data.url;
  return null;
}

// Open sessions kept for this page view, so closing and reopening the sheet
// reuses the same Stripe session instead of starting a new one.
const openSessions = new Map<string, Embedded>();

const stripes = new Map<string, Promise<Stripe | null>>();
function stripeFor(pk: string): Promise<Stripe | null> {
  let p = stripes.get(pk);
  if (!p) { p = loadStripe(pk); stripes.set(pk, p); }
  return p;
}

// Stripe allows one embedded checkout at a time: mounts run one after another,
// and each waits for the previous one to be destroyed.
let mountQueue: Promise<void> = Promise.resolve();

/** The Stripe payment form, on this page, in a sheet over the content. */
function CheckoutSheet({ checkout, title, onClose }: { checkout: Embedded; title: string; onClose: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | null = null;
    mountQueue = mountQueue.then(async () => {
      if (cancelled) return;
      try {
        const stripe = await stripeFor(checkout.publishableKey);
        if (!stripe) throw new Error("stripe.js did not load");
        if (cancelled) return;
        const c = await stripe.createEmbeddedCheckoutPage({ clientSecret: checkout.clientSecret });
        destroy = () => { try { c.destroy(); } catch { /* already gone */ } };
        if (cancelled || !mountRef.current) { destroy(); destroy = null; return; }
        c.mount(mountRef.current);
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    });
    return () => {
      cancelled = true;
      mountQueue = mountQueue.then(() => { destroy?.(); });
    };
  }, [checkout]);

  // Esc closes; the page behind doesn't scroll while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="sheet-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-hd">
          <p className="kicker">{title}</p>
          <button type="button" className="sheet-x" onClick={onClose} aria-label="Close checkout">×</button>
        </div>
        {!ready && !failed && <div className="loading" role="status"><Spinner /> Loading secure checkout…</div>}
        {failed && <p className="err" role="alert">{ERR}</p>}
        <div ref={mountRef} className="sheet-body" />
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="spin" aria-hidden="true" />;
}

/** program_view once per page load (and first-landing attribution). */
export function ProgramView({ page }: { page: "join" | "balance" }) {
  useEffect(() => {
    captureAttribution();
    track("program_view", { props: { page } });
  }, [page]);
  return null;
}

/** "Reserve your seat": deposit checkout → Stripe. */
export function DepositButton({ testParam }: { testParam: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState<Embedded | null>(null);
  const close = useCallback(() => setOpen(null), []);

  async function go() {
    if (busy) return;
    const cached = openSessions.get("deposit");
    if (cached) { setOpen(cached); return; }
    setBusy(true);
    setErr(false);
    track("program_deposit_click");
    pixelCheckout(PROGRAM.depositUsd);
    try {
      const a = getAttribution();
      const c = await startCheckout("/aiday/api/program/deposit-checkout", {
        t: testParam || undefined,
        utm_source: a.utm_source,
        utm_medium: a.utm_medium,
        utm_campaign: a.utm_campaign,
        affiliate: a.affiliate,
        anon_id: anonId(),
      });
      if (c) {
        openSessions.set("deposit", c);
        setOpen(c);
        setBusy(false);
      }
    } catch {
      setBusy(false);
      setErr(true);
    }
  }

  return (
    <>
      <button type="button" className="btn" onClick={go} disabled={busy} aria-busy={busy || undefined}>
        {busy ? (<><Spinner /> Opening secure checkout…</>) : (<>Reserve my seat <span className="ar" aria-hidden="true">→</span></>)}
      </button>
      {err && <p className="err" role="alert">{ERR}</p>}
      {open && <CheckoutSheet checkout={open} title={`${usd(PROGRAM.depositUsd)} ${PROGRAM.currency} deposit`} onClose={close} />}
    </>
  );
}

type Buyer = {
  first_name?: string;
  deposit_paid?: boolean;
  balance_due_date?: string | null;
  plan?: "full" | "split" | null;
  plan_payments_made?: number;
  balance_paid?: boolean;
  test?: boolean;
};

type State =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "error" }
  | { kind: "ok"; buyer: Buyer };

const POLL_TRIES = 5;
const POLL_MS = 2000;

function fmtDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

/** True while a fresh payment may not have reached EventOps yet. */
function stillSettling(b: Buyer, justPaidDeposit: boolean, justPaidBalance: boolean): boolean {
  if (justPaidDeposit && !b.deposit_paid) return true;
  if (justPaidBalance && b.deposit_paid) {
    if (!b.plan) return true;
    if (b.plan === "full" && !b.balance_paid) return true;
    if (b.plan === "split" && !b.plan_payments_made) return true;
  }
  return false;
}

/** Meta Purchase, once per payment, only when Stripe has just sent the buyer back. */
function pixelPaid(token: string, b: Buyer, justPaidDeposit: boolean, justPaidBalance: boolean) {
  const c = PROGRAM.currency;
  if (justPaidDeposit && b.deposit_paid) pixelOnce(`${token}_deposit`, "Purchase", { value: PROGRAM.depositUsd, currency: c, content_name: "AI Day Program deposit" });
  if (justPaidBalance && b.plan === "full" && b.balance_paid) pixelOnce(`${token}_full`, "Purchase", { value: PROGRAM.balanceUsd, currency: c, content_name: "AI Day Program balance" });
  if (justPaidBalance && b.plan === "split" && (Number(b.plan_payments_made) || 0) >= 1) pixelOnce(`${token}_split1`, "Purchase", { value: PROGRAM.splitUsd, currency: c, content_name: "AI Day Program instalment 1" });
}

/** /aiday/join/balance: reads the buyer's state and shows the right step. */
export function BalanceFlow({ token, session, paid }: { token: string; session: string; paid: boolean }) {
  const [state, setState] = useState<State>(token ? { kind: "loading" } : { kind: "none" });
  const [settling, setSettling] = useState(false);
  const [busy, setBusy] = useState<"full" | "split" | null>(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<{ plan: "full" | "split"; checkout: Embedded } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const load = useCallback(async (signal: { stop: boolean }) => {
    if (!token) return;
    setState({ kind: "loading" });
    setSettling(false);
    const q = new URLSearchParams({ b: token });
    if (session) q.set("s", session);
    for (let i = 0; i < POLL_TRIES; i++) {
      try {
        const r = await fetch(`/aiday/api/program/buyer?${q.toString()}`, { cache: "no-store" });
        if (signal.stop) return;
        if (r.status === 404 || r.status === 400) {
          // A just-paid deposit can 404 for a moment before the webhook lands.
          if (session && i < POLL_TRIES - 1) { await new Promise((res) => setTimeout(res, POLL_MS)); continue; }
          setState({ kind: "none" });
          return;
        }
        if (!r.ok) throw new Error(String(r.status));
        const b = (await r.json()) as Buyer;
        if (signal.stop) return;
        const waiting = stillSettling(b, !!session, paid);
        if (waiting && i < POLL_TRIES - 1) {
          setSettling(true);
          await new Promise((res) => setTimeout(res, POLL_MS));
          if (signal.stop) return;
          continue;
        }
        setSettling(waiting);
        if (!waiting) pixelPaid(token, b, !!session, paid);
        setState(b.deposit_paid ? { kind: "ok", buyer: b } : { kind: "none" });
        return;
      } catch {
        if (signal.stop) return;
        setState({ kind: "error" });
        return;
      }
    }
  }, [token, session, paid]);

  useEffect(() => {
    const signal = { stop: false };
    load(signal);
    return () => { signal.stop = true; };
  }, [load]);

  async function choose(plan: "full" | "split") {
    if (busy) return;
    const cached = openSessions.get(plan);
    if (cached) { setOpen({ plan, checkout: cached }); return; }
    setBusy(plan);
    setErr("");
    track("program_balance_click", { props: { plan } });
    pixelCheckout(plan === "full" ? PROGRAM.balanceUsd : PROGRAM.splitUsd);
    try {
      const c = await startCheckout("/aiday/api/program/balance-checkout", { b: token, plan });
      if (c) {
        // EventOps closes the buyer's previous balance session when a new one
        // starts, so only the newest plan's session stays reusable.
        openSessions.delete("full");
        openSessions.delete("split");
        openSessions.set(plan, c);
        setOpen({ plan, checkout: c });
        setBusy(null);
      }
    } catch (e) {
      setBusy(null);
      if ((e as { status?: number }).status === 409) {
        setErr("Your payment plan is already set up. Refreshing your status…");
        load({ stop: false });
      } else {
        setErr(ERR);
      }
    }
  }

  if (state.kind === "loading") {
    return (
      <div className="loading" role="status" aria-live="polite">
        <Spinner /> {settling || session || paid ? "Confirming your payment…" : "Loading your seat…"}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div role="alert">
        <p className="kicker">Something went wrong</p>
        <h1>We couldn&apos;t load your seat.</h1>
        <p className="lede">Your payment details are safe. Check your connection and try again.</p>
        <div className="actions">
          <button type="button" className="btn" onClick={() => load({ stop: false })}>Try again</button>
        </div>
      </div>
    );
  }

  if (state.kind === "none") {
    return (
      <div>
        <p className="kicker">{PROGRAM.name}</p>
        <h1>We can&apos;t find a deposit for this link.</h1>
        <p className="lede">
          {session
            ? "If you just paid, it can take a minute to show up. Refresh this page shortly. Your receipt from Stripe is in your email."
            : "Use the link from your deposit email, or reserve your seat first."}
        </p>
        <div className="actions">
          {session && <button type="button" className="btn" onClick={() => load({ stop: false })}>Check again</button>}
          <a className={session ? "btn ink" : "btn"} href="/aiday/join">Back to {PROGRAM.name}</a>
        </div>
      </div>
    );
  }

  const b = state.buyer;
  const name = (b.first_name || "").trim();
  const testPill = b.test ? <span className="pill" style={{ marginLeft: 10 }}>Test mode</span> : null;

  // b) fully paid in one go, or c) the split plan has run its course.
  const made = Math.max(0, Math.min(PROGRAM.splitCount, Number(b.plan_payments_made) || 0));
  if ((b.plan === "full" && b.balance_paid) || (b.plan === "split" && (b.balance_paid || made >= PROGRAM.splitCount))) {
    return (
      <div>
        <p className="kicker">Payment complete {testPill}</p>
        <h1>You&apos;re fully paid{name ? `, ${name}` : ""}. <span className="acc">See you inside.</span></h1>
        <p className="lede">Your seat in the {PROGRAM.name} is confirmed. Look out for your welcome email with everything you need to start.</p>
      </div>
    );
  }

  // c) split plan in progress.
  if (b.plan === "split") {
    return (
      <div>
        <p className="kicker">Monthly plan {testPill}</p>
        <h1>Payment {made} of {PROGRAM.splitCount} done.</h1>
        <div className="steps" aria-hidden="true">
          {Array.from({ length: PROGRAM.splitCount }, (_, i) => <span key={i} className={i < made ? "on" : ""} />)}
        </div>
        <p className="lede" style={{ marginTop: 18 }}>
          Next charges are automatic: {usd(PROGRAM.splitUsd)} a month until all {PROGRAM.splitCount} are paid, then it stops. Your seat is confirmed.
        </p>
        {settling && <p className="note">Your latest payment is still being confirmed. Refresh in a minute if this hasn&apos;t updated.</p>}
      </div>
    );
  }

  // Full plan chosen, payment not confirmed yet.
  if (b.plan === "full") {
    return (
      <div>
        <p className="kicker">Payment in progress {testPill}</p>
        <h1>We&apos;re confirming your payment{name ? `, ${name}` : ""}.</h1>
        <p className="lede">This usually takes a minute. Your receipt from Stripe is in your email.</p>
        <div className="actions"><button type="button" className="btn" onClick={() => load({ stop: false })}>Check again</button></div>
      </div>
    );
  }

  // a) deposit paid, no plan yet.
  const due = fmtDate(b.balance_due_date);
  return (
    <div>
      <p className="kicker">Deposit received {testPill}</p>
      <h1>Deposit received{name ? `, ${name}` : ""}. <span className="acc">Your seat is held.</span></h1>
      <p className="lede">Now choose how you&apos;d like to pay the {usd(PROGRAM.balanceUsd)} balance.</p>
      {due && <p className="due">Balance due by <b>{due}</b></p>}
      {settling && paid && <p className="note">If you just paid your balance, it&apos;s still being confirmed. Refresh in a minute before paying again.</p>}

      <div className="plans">
        <section className="plan best" aria-labelledby="plan-full">
          <span className="tag">One payment</span>
          <h2 id="plan-full">Pay {usd(PROGRAM.balanceUsd)} now</h2>
          <p className="amt">{usd(PROGRAM.balanceUsd)}<small style={{ fontSize: 13, marginLeft: 6 }}>{PROGRAM.currency}</small></p>
          <p>Pay the balance in full today and you&apos;re done.</p>
          <button type="button" className="btn" onClick={() => choose("full")} disabled={busy !== null} aria-busy={busy === "full" || undefined}>
            {busy === "full" ? (<><Spinner /> Opening checkout…</>) : (<>Pay {usd(PROGRAM.balanceUsd)} now <span className="ar" aria-hidden="true">→</span></>)}
          </button>
        </section>
        <section className="plan" aria-labelledby="plan-split">
          <span className="tag">Monthly</span>
          <h2 id="plan-split">{PROGRAM.splitCount} x {usd(PROGRAM.splitUsd)} monthly</h2>
          <p className="amt">{usd(PROGRAM.splitUsd)}<small style={{ fontSize: 13, marginLeft: 6 }}>{PROGRAM.currency} / month</small></p>
          <p>Charged today, then monthly for {PROGRAM.splitCount - 1} more months, then it stops.</p>
          <button type="button" className="btn ink" onClick={() => choose("split")} disabled={busy !== null} aria-busy={busy === "split" || undefined}>
            {busy === "split" ? (<><Spinner /> Opening checkout…</>) : (<>Pay monthly <span className="ar" aria-hidden="true">→</span></>)}
          </button>
        </section>
      </div>
      {err && <p className="err" role="alert" style={{ marginTop: 14, textAlign: "left" }}>{err}</p>}
      {open && (
        <CheckoutSheet
          checkout={open.checkout}
          title={open.plan === "full" ? `Balance: ${usd(PROGRAM.balanceUsd)} ${PROGRAM.currency}` : `${PROGRAM.splitCount} x ${usd(PROGRAM.splitUsd)} ${PROGRAM.currency} monthly`}
          onClose={close}
        />
      )}
    </div>
  );
}
