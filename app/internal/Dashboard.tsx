"use client";

import { useEffect } from "react";

/*
 * Partner dashboard UI, ported from AI-Day-Pack-Kingsley/dashboard.html.
 * Data: GET /aiday/api/stats (cookie protected), refreshed every 5 minutes.
 * The render code keeps the pack's string templates; every value that comes
 * from data passes through esc() or a number formatter.
 */

const DATA_URL = "/aiday/api/stats";
const REFRESH_MS = 5 * 60 * 1000;

type Funnel = {
  visitors: number; registered: number; vip_viewed: number; vip_paid: number; quiz_done: number;
  calendar_added: number; whatsapp_joined: number; email_opened: number; attended: number | null; stayed_to_close: number | null;
};
type Stats = {
  updated_at: string; goal: number; launch: string; event_day: string; vip_price_rm: number;
  funnel: Funnel;
  daily: { date: string; registered: number }[];
  forms: { top: number; bottom: number };
  sources: { source: string; visitors: number; registered: number; vip: number }[];
  emails: { n: number; name: string; sent: number; opened: number; clicked: number }[];
  levels: number[];
  help: { yes: number; maybe: number; no: number };
  call_list: { first_name: string; whatsapp: string; level: number; revenue: string; help: string }[];
  affiliates?: { handle: string; registered: number; vip: number }[];
};

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const numOrNull = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Fill gaps so a partial payload never breaks the page. */
function normalize(raw: Record<string, unknown>): Stats {
  const F = (raw.funnel || {}) as Record<string, unknown>;
  const forms = (raw.forms || {}) as Record<string, unknown>;
  const help = (raw.help || {}) as Record<string, unknown>;
  const lv = arr<number>(raw.levels).map((n) => num(n));
  return {
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
    goal: num(raw.goal, 5000) || 5000,
    launch: typeof raw.launch === "string" ? raw.launch : "2026-11-08",
    event_day: typeof raw.event_day === "string" ? raw.event_day : "2026-11-15",
    vip_price_rm: num(raw.vip_price_rm, 47),
    funnel: {
      visitors: num(F.visitors), registered: num(F.registered), vip_viewed: num(F.vip_viewed), vip_paid: num(F.vip_paid),
      quiz_done: num(F.quiz_done), calendar_added: num(F.calendar_added), whatsapp_joined: num(F.whatsapp_joined),
      email_opened: num(F.email_opened), attended: numOrNull(F.attended), stayed_to_close: numOrNull(F.stayed_to_close),
    },
    daily: arr<{ date: string; registered: number }>(raw.daily),
    forms: { top: num(forms.top), bottom: num(forms.bottom) },
    sources: arr(raw.sources),
    emails: arr(raw.emails),
    levels: [0, 1, 2, 3, 4].map((i) => lv[i] ?? 0),
    help: { yes: num(help.yes), maybe: num(help.maybe), no: num(help.no) },
    call_list: arr(raw.call_list),
    affiliates: Array.isArray(raw.affiliates) ? (raw.affiliates as Stats["affiliates"]) : undefined,
  };
}

export function Dashboard({ who }: { who: string }) {
  useEffect(() => {
    const $ = (id: string) => document.getElementById(id)!;
    const f = (n: number | null | undefined) => (n == null ? "Not yet" : Number(n).toLocaleString("en-MY"));
    const pc = (a: number | null | undefined, b: number | null | undefined) =>
      a == null || !b ? "" : (a / b * 100).toFixed(a / b < 0.1 ? 1 : 0) + "%";
    const esc = (s: unknown) => {
      const d = document.createElement("div");
      d.textContent = s == null ? "" : String(s);
      return d.innerHTML;
    };

    let stopped = false;
    function load() {
      fetch(DATA_URL, { credentials: "include", cache: "no-store" })
        .then((r) => {
          if (r.status === 401) {
            location.reload();
            throw new Error("signed out");
          }
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then((raw) => {
          if (!stopped) render(normalize(raw));
        })
        .catch(() => {
          if (!stopped) $("upd").textContent = "Couldn't load the numbers. Refresh to try again.";
        });
    }

    function render(D: Stats) {
      const F = D.funnel;
      $("upd").textContent = "Updated " + new Date(D.updated_at).toLocaleString("en-MY", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
      const K: [string, string, string, number?][] = [
        ["Visitors", f(F.visitors), "unique people on the page"],
        ["Registered", f(F.registered), pc(F.registered, F.visitors) + " of visitors"],
        ["Goal", pc(F.registered, D.goal), f(F.registered) + " of " + f(D.goal), F.registered / D.goal],
        ["VIP sold", f(F.vip_paid), pc(F.vip_paid, F.registered) + " of registered"],
        ["VIP revenue", "RM " + f(F.vip_paid * D.vip_price_rm), "at RM " + D.vip_price_rm + " each"],
        ["Joined live", f(F.attended), F.attended == null ? "fills in on Sunday" : pc(F.attended, F.registered) + " of registered"],
      ];
      $("kpis").innerHTML = K.map((k) => '<div class="kpi"><small>' + k[0] + "</small><b>" + k[1] + "</b><span>" + k[2] + "</span>" + (k[3] != null ? '<div class="prog"><i style="width:' + Math.min(100, k[3] * 100) + '%"></i></div>' : "") + "</div>").join("");

      type Step = [string, string, string?, string?, number?];
      const steps: Step[] = [["g", "Getting them in"], ["Visited the page", "visitors"], ["Registered", "registered", "visitors", "of visitors"], ["Saw the VIP offer", "vip_viewed", "registered", "of registered"], ["Bought VIP", "vip_paid", "vip_viewed", "of those who saw it"],
        ["g", "After they sign up"], ["Joined WhatsApp", "whatsapp_joined", "registered", "of registered"], ["Added to calendar", "calendar_added", "registered", "of registered"], ["Opened an email", "email_opened", "registered", "of registered"], ["Took the quiz", "quiz_done", "registered", "of registered"],
        ["g", "Sunday (from the Zoom report)"], ["Joined live on Zoom", "attended", "registered", "of registered", 1], ["Stayed to the 1:10pm close", "stayed_to_close", "attended", "of those who joined", 1]];
      const FF = F as unknown as Record<string, number | null>;
      $("fun").innerHTML = steps.map((s) => {
        if (s[0] === "g") return '<p class="grp">' + s[1] + "</p>";
        const v = FF[s[1]], w = v == null ? 0 : (v / (F.visitors || 1)) * 100;
        const sub = v == null ? "fills in on Sunday" : s[2] ? pc(v, FF[s[2]]) + " " + s[3] : "100%";
        return '<div class="fr" title="' + s[0] + ": " + f(v) + '"><span class="lb">' + s[0] + '</span><span class="tr"><span class="br' + (s[4] ? " after" : "") + '" style="width:' + (v == null ? 100 : Math.max(0.4, w)) + '%"></span></span><span class="nm"><b>' + f(v) + "</b><span>" + sub + "</span></span></div>";
      }).join("");

      line(D);
      const lastDay = D.daily.length ? D.daily[D.daily.length - 1].registered : 0;
      const left = Math.max(0, (new Date(D.event_day + "T10:00:00+08:00").getTime() - new Date(D.updated_at).getTime()) / 864e5);
      const need = Math.max(0, D.goal - F.registered);
      $("pace").innerHTML = "<div><small>New today</small><b>" + f(lastDay) + "</b></div><div><small>Still to go</small><b>" + f(need) + "</b></div><div><small>Needed per day</small><b>" + f(left > 0 ? Math.ceil(need / Math.max(1, left)) : need) + "</b></div>";

      const S = D.sources.slice().sort((a, b) => b.registered - a.registered), mx = Math.max(1, ...S.map((s) => s.registered));
      $("src").innerHTML = '<tr><th>Source</th><th class="n">Visitors</th><th>Registered</th><th class="n">Rate</th><th class="n">VIP</th><th class="n">VIP rate</th></tr>' + S.map((s) => "<tr><td>" + esc(s.source) + '</td><td class="n">' + f(s.visitors) + '</td><td class="m"><span class="mini" style="width:' + Math.round((s.registered / mx) * 120) + 'px"></span>' + f(s.registered) + '</td><td class="n">' + pc(s.registered, s.visitors) + '</td><td class="n">' + f(s.vip) + '</td><td class="n">' + pc(s.vip, s.registered) + "</td></tr>").join("");

      $("em").innerHTML = '<tr><th>#</th><th>Email</th><th class="n">Sent</th><th class="n">Open</th><th class="n">Click</th></tr>' + D.emails.map((e) => '<tr><td class="m">' + esc(e.n) + "</td><td>" + esc(e.name) + '</td><td class="n">' + f(e.sent) + '</td><td class="n">' + pc(e.opened, e.sent) + '</td><td class="n">' + pc(e.clicked, e.sent) + "</td></tr>").join("");

      const N = ["Watcher", "Asker", "Amplifier", "Builder", "Power CEO"], lm = Math.max(1, ...D.levels);
      $("lv").innerHTML = D.levels.map((v, i) => '<div title="Level ' + (i + 1) + " " + N[i] + ": " + f(v) + '"><b>' + f(v) + '</b><i style="height:' + Math.max(2, (v / lm) * 100) + 'px"></i><small>' + (i + 1) + " " + N[i] + "</small></div>").join("");

      const H = D.help, ht = H.yes + H.maybe + H.no;
      $("help").innerHTML = ([["Yes, want help", H.yes], ["Maybe", H.maybe], ["No, the day is enough", H.no]] as [string, number][]).map((r) => "<div><span>" + r[0] + "</span><b>" + f(r[1]) + " · " + pc(r[1], ht) + "</b></div>").join("");
      const ft = D.forms.top + D.forms.bottom;
      $("forms").textContent = "Sign ups by form: top " + f(D.forms.top) + " (" + pc(D.forms.top, ft) + "), bottom " + f(D.forms.bottom) + " (" + pc(D.forms.bottom, ft) + ").";

      $("calls").innerHTML = "<tr><th>Name</th><th>WhatsApp</th><th class=\"n\">Level</th><th>Revenue</th><th>Answer</th></tr>" + D.call_list.map((c) => "<tr><td>" + esc(c.first_name) + '</td><td class="m">' + esc(c.whatsapp) + '</td><td class="n">' + esc(c.level) + "</td><td>" + esc(c.revenue) + "</td><td>" + esc(c.help) + "</td></tr>").join("");

      const aff = $("affCard");
      if (D.affiliates && D.affiliates.length) {
        aff.hidden = false;
        const A = D.affiliates.slice().sort((a, b) => num(b.registered) - num(a.registered));
        $("aff").innerHTML = '<tr><th>Handle</th><th class="n">Registered</th><th class="n">VIP</th></tr>' + A.map((a) => "<tr><td>" + esc(a.handle) + '</td><td class="n">' + f(num(a.registered)) + '</td><td class="n">' + f(num(a.vip)) + "</td></tr>").join("");
      } else {
        aff.hidden = true;
      }
    }

    /* total registered vs pace to the goal: one unit (people), one axis */
    function line(D: Stats) {
      const box = $("line"), W = 560, H = 240, P = { l: 44, r: 16, t: 14, b: 28 };
      const d0 = new Date(D.launch + "T00:00:00+08:00").getTime(), d1 = new Date(D.event_day + "T10:00:00+08:00").getTime();
      const days: number[] = [];
      for (let t = d0; t <= d1; t += 864e5) days.push(t);
      const x = (ms: number) => P.l + ((ms - d0) / (d1 - d0)) * (W - P.l - P.r), y = (v: number) => H - P.b - (v / D.goal) * (H - P.t - P.b);
      let cum = 0;
      const pts = D.daily.map((d) => { cum += num(d.registered); return { t: new Date(d.date + "T23:59:00+08:00").getTime(), v: cum, day: num(d.registered), date: d.date }; });
      let g = "";
      [0, 0.25, 0.5, 0.75, 1].map((q) => Math.round(q * D.goal)).forEach((v) => { g += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#E9E6E2" stroke-width="1"/><text x="' + (P.l - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="11" fill="#5F564B">' + (v ? v.toLocaleString() : "0") + "</text>"; });
      days.forEach((ms) => { const dt = new Date(ms); g += '<text x="' + x(ms) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#5F564B">' + dt.toLocaleDateString("en-MY", { day: "numeric", month: "short", timeZone: "Asia/Kuala_Lumpur" }) + "</text>"; });
      const pace = '<line x1="' + x(d0) + '" y1="' + y(0) + '" x2="' + x(d1) + '" y2="' + y(D.goal) + '" stroke="#978C7B" stroke-width="2" stroke-dasharray="5 5"/>';
      const path = "M" + x(d0) + " " + y(0) + pts.map((p) => " L" + x(p.t) + " " + y(p.v)).join("");
      const last = pts[pts.length - 1];
      const dots = pts.map((p) => '<circle cx="' + x(p.t) + '" cy="' + y(p.v) + '" r="4" fill="#D97757" stroke="#FFFDF9" stroke-width="2"/>').join("");
      const lbl = last ? '<text x="' + (x(last.t) + 8) + '" y="' + (y(last.v) - 8) + '" font-size="12" font-weight="500" fill="#211C16">' + last.v.toLocaleString() + "</text>" : "";
      const svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Total registered by day against the pace to ' + D.goal.toLocaleString() + '">' + g + pace + '<path d="' + path + '" fill="none" stroke="#D97757" stroke-width="2" stroke-linejoin="round"/>' + dots + lbl + '<line id="xh" y1="' + P.t + '" y2="' + (H - P.b) + '" stroke="#211C16" stroke-width="1" opacity="0"/><rect x="' + P.l + '" y="' + P.t + '" width="' + (W - P.l - P.r) + '" height="' + (H - P.t - P.b) + '" fill="transparent" id="hit"/></svg>';
      const tip = $("tip");
      box.innerHTML = svg;
      box.appendChild(tip);
      const svgEl = box.querySelector("svg")!, xh = box.querySelector("#xh")!;
      svgEl.addEventListener("pointermove", (ev) => {
        const r = svgEl.getBoundingClientRect(), mx = ((ev.clientX - r.left) / r.width) * W;
        let best: (typeof pts)[number] | null = null, bd = 1e9;
        pts.forEach((p) => { const dd = Math.abs(x(p.t) - mx); if (dd < bd) { bd = dd; best = p; } });
        if (!best) return;
        const b = best as (typeof pts)[number];
        const paceV = Math.round(((b.t - d0) / (d1 - d0)) * D.goal);
        xh.setAttribute("x1", String(x(b.t))); xh.setAttribute("x2", String(x(b.t))); xh.setAttribute("opacity", ".25");
        tip.innerHTML = "<b>" + new Date(b.t).toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short" }) + "</b><br>Total registered: " + b.v.toLocaleString() + "<br>New that day: " + b.day.toLocaleString() + "<br>Pace to " + D.goal.toLocaleString() + ": " + paceV.toLocaleString();
        tip.style.left = (x(b.t) / W) * r.width + "px"; tip.style.top = (y(b.v) / H) * r.height + "px"; tip.style.opacity = "1";
      });
      svgEl.addEventListener("pointerleave", () => { tip.style.opacity = "0"; xh.setAttribute("opacity", "0"); });
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => { stopped = true; clearInterval(id); };
  }, []);

  return (
    <div id="app">
      <header className="topbar"><div className="in">
        <div className="lockup">
          <span className="brand"><img src="/aiday/brand/mark/mark.svg" alt="" width={28} height={28} />Claude Malaysia</span>
          <span className="wordmark">Run It From Your Phone</span>
        </div>
        <span className="meta">Internal dashboard · signed in as {who}</span>
        <form method="post" action="/aiday/api/logout"><button className="btn line" type="submit" id="out">Sign out</button></form>
      </div></header>
      <div className="in">
        <div className="head"><div><p className="kicker">Free AI day · Sun 15 Nov · 10am MYT</p><h1 style={{ marginTop: "8px" }}>How&apos;s the launch going?</h1></div><p id="upd">Loading the numbers…</p></div>
        <div className="grid">
          <div className="kpis" id="kpis"></div>

          <div className="two">
            <div className="card"><h2>The funnel</h2><p className="sub">How far people get, from first visit to staying for the close. Each % is against the step it comes from.</p><div className="fun" id="fun"></div><p className="note">Bar length is people, against everyone who visited. Striped bars fill in on Sunday.</p></div>
            <div className="card"><h2>Registrations vs the 5,000 goal</h2><p className="sub">Total registered so far, against the pace needed to reach 5,000 by Sunday 10am.</p><div className="chart" id="line"><div className="tip" id="tip"></div></div><div className="legend"><span><i></i>Registered (total)</span><span><i className="d"></i>Pace to 5,000</span></div><div className="pace" id="pace"></div></div>
          </div>

          <div className="card"><h2>Where people come from</h2><p className="sub">By UTM source. Registration rate = registered ÷ visitors.</p><div className="tw"><table id="src"></table></div></div>

          <div className="three">
            <div className="card"><h2>Emails</h2><p className="sub">Opened and clicked, as % of sent.</p><div className="tw"><table id="em"></table></div></div>
            <div className="card"><h2>Quiz: levels</h2><p className="sub">From the thank you page quiz.</p><div className="lv" id="lv"></div></div>
            <div className="card"><h2>Want us to build it with them?</h2><p className="sub">The call list after the day. Call Yes first, then Maybe.</p><div className="help" id="help"></div><p className="note" id="forms"></p></div>
          </div>

          <div className="card" id="affCard" hidden><h2>Affiliates</h2><p className="sub">Registered and VIP by affiliate link.</p><div className="tw"><table id="aff"></table></div></div>

          <div className="card"><h2>Call list</h2><p className="sub">Latest people who answered Yes or Maybe.</p><div className="tw"><table id="calls"></table></div></div>
        </div>
      </div>
    </div>
  );
}
