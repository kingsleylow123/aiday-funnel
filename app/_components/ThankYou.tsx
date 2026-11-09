"use client";

import { useEffect, useRef, useState } from "react";
import { AIDAY_EVENT, AIDAY_START_MS } from "@/lib/aiday/config";
import { anonId, captureAttribution, getAttribution, track, type AidayEvent } from "@/lib/aiday/client";

export function TyView({ token }: { token: string }) {
  useEffect(() => {
    captureAttribution();
    track("page_view", { token, props: { page: "thank_you" } });
  }, [token]);
  return null;
}

/** Confetti, once, respects reduced motion. Same particles and timing as the pack. */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = c.getContext("2d");
    if (!x) return;
    const dpr = devicePixelRatio || 1;
    const W = (c.width = c.offsetWidth * dpr);
    const H = (c.height = c.offsetHeight * dpr);
    const col = ["#2D5BFF", "#FFE14D", "#0E0F12", "#8FA6FF"];
    const P = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random() * W,
      y: -Math.random() * H * 0.6,
      r: (4 + Math.random() * 6) * dpr,
      v: (1.5 + Math.random() * 2.5) * dpr,
      a: Math.random() * 6,
      s: (Math.random() - 0.5) * 0.2,
      c: col[i % 4],
    }));
    const t0 = performance.now();
    let raf = 0;
    const f = (now: number) => {
      x.clearRect(0, 0, W, H);
      const live = now - t0 < 4200;
      P.forEach((p) => {
        p.y += p.v;
        p.a += p.s;
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.a);
        x.fillStyle = p.c;
        x.globalAlpha = live ? 1 : Math.max(0, 1 - (now - t0 - 4200) / 800);
        x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        x.restore();
      });
      if (now - t0 < 5000) raf = requestAnimationFrame(f);
      else x.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas id="cf" ref={ref} aria-hidden="true" />;
}

export function StartsIn() {
  const [txt, setTxt] = useState("-- days");
  useEffect(() => {
    const d = Math.max(0, AIDAY_START_MS - Date.now());
    setTxt(Math.floor(d / 864e5) + " days, " + Math.floor((d % 864e5) / 36e5) + " hours");
  }, []);
  return <b id="cdt">{txt}</b>;
}

export function TrackedLink({
  event,
  token,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: AidayEvent; token: string }) {
  return (
    <a {...rest} onClick={() => track(event, { token })}>
      {children}
    </a>
  );
}

/** WhatsApp group button. EventOps 302s to the current group (or back here if none is live yet). */
export function WhatsAppLink({ base, token }: { base: string; token: string }) {
  const [href, setHref] = useState(base);
  useEffect(() => {
    const a = getAttribution();
    const q = new URLSearchParams();
    if (token) q.set("t", token);
    q.set("a", anonId());
    if (a.utm_source) q.set("utm_source", a.utm_source);
    if (a.utm_medium) q.set("utm_medium", a.utm_medium);
    if (a.utm_campaign) q.set("utm_campaign", a.utm_campaign);
    setHref(`${base}?${q.toString()}`);
  }, [base, token]);
  return (
    <a className="btn wa" href={href} target="_blank" rel="noopener" onClick={() => track("whatsapp_click", { token })}>
      Join on WhatsApp
    </a>
  );
}

export function CopyLink({ url }: { url: string }) {
  const codeRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState("Copy link");
  const sel = () => {
    const el = codeRef.current;
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
  };
  return (
    <div className="share">
      <code id="url" ref={codeRef}>{url}</code>
      <button
        type="button"
        className="btn line"
        id="copy"
        onClick={() => {
          try {
            navigator.clipboard.writeText(url).then(() => setLabel("Copied"), sel);
          } catch {
            sel();
          }
        }}
      >
        {label}
      </button>
    </div>
  );
}

/* One quiz: 3 level questions (scored), then 3 business questions; the level is shown at the end. */
const NAMES = ["", "Watcher", "Asker", "Amplifier", "Builder", "Power CEO"];
const HOUR: Record<number, string> = {
  1: "You start at zero, and that is fine. Hour 1 with Kingsley gets your first AI helper working by 11:10.",
  2: "You ask AI questions, then do the work yourself. Hour 1 with Kingsley turns that into an AI helper that does the work.",
  3: "AI already makes you faster. Hour 2 with Alaric makes it sell for you: offer, ad and follow ups.",
  4: "You build with AI. Hour 3 with Rafay shows the last step: the whole business running from your phone.",
  5: "You run on AI already. Come for hour 3 and the live Q&A, and compare notes with all three of us.",
};
type Q = { k: "use" | "leads" | "week" | "stage" | "revenue" | "help"; lv?: boolean; q: string; o: string[] };
const QUESTIONS: Q[] = [
  { k: "use", lv: true, q: "How do you use AI today?", o: ["I don't really use it yet", "I ask it questions, then do the work myself", "It does parts of my daily work", "I have built pages, tools or systems with it", "Parts of my business run on it without me"] },
  { k: "leads", lv: true, q: "Who answers a new lead or customer message?", o: ["I do, by hand, when I can", "I do, sometimes with AI helping me write", "AI drafts it, I check and send", "A system I built answers and follows up", "It is handled automatically. I see the summary"] },
  { k: "week", lv: true, q: "If you stopped working for a week, what happens?", o: ["Everything stops", "Most things stop", "Some things keep going", "Most things keep going", "It keeps running. I decide from my phone"] },
  { k: "stage", q: "Which sounds most like you?", o: ["I have a job and I'm planning a business", "I run it mostly on my own", "I run a small team (2 to 10 people)", "I run a bigger team (11 or more)"] },
  { k: "revenue", q: "Roughly, what did the business make in the last 12 months?", o: ["Nothing yet", "Under RM 100k", "RM 100k to 500k", "RM 500k to 2M", "Over RM 2M", "I'd rather not say"] },
  { k: "help", q: "After the day, would you want us to build it with you?", o: ["Yes, I'd want help", "Maybe, depends on time and cost", "No, the day is enough for me"] },
];

export function Quiz({ token }: { token: string }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [level, setLevel] = useState(0);
  const c = QUESTIONS[i];

  function pick(t: string, j: number) {
    const A = { ...answers, [c.k]: t };
    const S = c.lv ? { ...scores, [c.k]: j + 1 } : scores;
    setAnswers(A);
    setScores(S);
    if (i < QUESTIONS.length - 1) {
      setI(i + 1);
      return;
    }
    const sc = (S.use || 0) + (S.leads || 0) + (S.week || 0);
    const L = Math.max(1, Math.min(5, Math.round(sc / 3)));
    setLevel(L);
    track("quiz_complete", { token, props: { level: L } });
    fetch("/aiday/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, answers: { ...A, level: L }, event: AIDAY_EVENT, source: location.href }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div className="box" aria-live="polite">
      <div id="qz" hidden={level > 0}>
        <div className="bar" aria-hidden="true"><i id="qbar" style={{ width: `${(i / QUESTIONS.length) * 100}%` }} /></div>
        <p className="qn" id="qzn" style={{ marginTop: "14px" }}>Question {i + 1} of {QUESTIONS.length}</p>
        <h3 id="qzq" style={{ marginBlock: "8px 16px" }}>{c.q}</h3>
        <div className="opts" id="qzo">
          {c.o.map((t, j) => (
            <button key={`${i}-${j}`} type="button" className="opt" id={`qz${i}o${j}`} aria-pressed={answers[c.k] === t} onClick={() => pick(t, j)}>
              <i>{j + 1}</i>
              <span>{t}</span>
            </button>
          ))}
        </div>
        <div className="nav" style={{ marginTop: "16px" }}>
          <button type="button" className="link" id="back" style={{ visibility: i ? "visible" : "hidden" }} onClick={() => i > 0 && setI(i - 1)}>← Back</button>
          <span />
        </div>
      </div>
      <div id="qzr" hidden={level === 0} style={{ display: "grid", gap: "16px" }}>
        <p className="qn">Your level</p>
        <p className="big" id="qzN">{level ? `Level ${level} · ${NAMES[level]}` : ""}</p>
        <div className="ladder" id="lad">
          {[1, 2, 3, 4, 5].map((k) => (
            <div key={k} className={k === level ? "me" : undefined}><small>{k}</small><b>{NAMES[k]}</b></div>
          ))}
        </div>
        <p id="qzT" style={{ color: "var(--muted)", fontSize: "17px" }}>{level ? HOUR[level] : ""}</p>
        <p style={{ fontSize: "15px", color: "var(--muted)" }}>Thank you. Your answers help us choose what we build live on Sunday.</p>
        <div className="nav">
          <span />
          <button type="button" className="link" id="again" onClick={() => { setI(0); setScores({}); setLevel(0); }}>Take it again</button>
        </div>
      </div>
    </div>
  );
}
