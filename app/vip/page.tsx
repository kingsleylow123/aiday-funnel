import type { Metadata } from "next";
import "../_styles/vip.css";
import { VipView, VipYes } from "../_components/Vip";
import { AIDAY_VIP_PRICE_RM, aidayCompanyLine } from "@/lib/aiday/config";

export const metadata: Metadata = {
  title: { absolute: "AI Day VIP" },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ name?: string | string[]; t?: string | string[] }> };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

// claudemalaysia.com/aiday/vip: step 2, the VIP offer right after registering.
// Ported from AI-Day-Pack-Kingsley/vip-page.html. Order box sits on the first screen.
// Styled to the Claude Malaysia brand (BRAND_SYSTEM.md, app/_styles/vip.css).
export default async function AidayVipPage({ searchParams }: Props) {
  const sp = await searchParams;
  const name = one(sp.name).slice(0, 40);
  const token = one(sp.t).slice(0, 200);
  const q = new URLSearchParams();
  if (name) q.set("name", name);
  if (token) q.set("t", token);
  const noThanks = `/aiday/thank-you${q.size ? `?${q.toString()}` : ""}`;

  return (
    <div className="aid-vip">
      <VipView token={token} />
      <header className="brandbar"><div className="in"><img src="/aiday/brand/mark/mark.svg" alt="" width={32} height={32} /><span>Claude Malaysia</span></div></header>
      <nav className="flow" aria-label="Sign up steps, step 2 of 3"><div className="in"><ol><li className="done"><i>✓</i>Seat saved</li><li className="now" aria-current="step"><i>2</i>VIP upgrade</li><li><i>3</i>You're in</li></ol></div></nav>

      <section className="stage"><div className="in">
        <div>
          <p className="kicker">Your free seat is saved · one last step</p>
          <h1 className="d1">Keep the whole day. <span className="serif">Build it at your own pace.</span></h1>
          <p className="lede">Add VIP and the replay is yours for good, with every prompt we use, the Power CEO workbook, and the hot seat with all three of us after the live day.</p>
          <div className="order" aria-label="Add VIP to your order">
            <div className="op"><b>RM {AIDAY_VIP_PRICE_RM}</b><span>one payment · card or FPX</span></div>
            <VipYes id="yes-top" token={token} position="top" />
            <a className="no" href={noThanks}>No thanks, I&apos;ll keep the free seat</a>
          </div>
          <div className="faces"><div><img src="/aiday/assets/alaric-lg.jpg" alt="" /><img src="/aiday/assets/kingsley-lg.jpg" alt="" /><img src="/aiday/assets/rafay-close.jpg" alt="" /></div><span>Alaric, Kingsley and Rafay stay on for VIPs</span></div>
        </div>
        <div className="ticket" aria-label="VIP pass">
          <div className="main">
            <div className="top"><b>VIP pass</b><span>Run It From Your Phone</span></div>
            <h2>Free AI Day <span className="serif">15.11.26</span></h2>
            <div className="grid"><div><small>Starts</small><b>10am MYT</b></div><div><small>Where</small><b>Zoom</b></div><div><small>Replay</small><b>Yours to keep</b></div></div>
            <p className="was">Free seat: replay ends after 48 hours. VIP: <b>forever</b>, plus the hot seat.</p>
          </div>
          <div className="stub"><b>VIP</b><span>RM {AIDAY_VIP_PRICE_RM}</span></div>
        </div>
      </div></section>

      <section className="band unlock"><div className="in">
        <div>
          <p className="kicker">What the VIP pass unlocks</p>
          <h2 className="d2" style={{ marginTop: "14px" }}>Four things the free seat <span className="serif">doesn't get.</span></h2>
          <div className="ul">
            <div className="u"><span className="n">01</span><div><b>The full replay, yours to keep</b><p>All four hours. Go back to any hour whenever you're ready for your next level.</p><span className="vs">Free seat: gone after 48 hours</span></div></div>
            <div className="u"><span className="n">02</span><div><b>The VIP hot seat, one full hour live</b><p>When the day ends, all three of us stay on for a full hour, just for VIPs. Selected VIPs bring a real problem from their business and we work through it live, while every VIP watches. You leave knowing the first job in your business to hand to AI, the prompt or helper that does it, and your next step for Monday.</p><span className="vs">VIP only</span></div></div>
            <div className="u"><span className="n">03</span><div><b>The Power CEO workbook and level test</b><p>Check your level, follow the steps, and test again after you build.</p><span className="vs">VIP only</span></div></div>
            <div className="u"><span className="n">04</span><div><b>The prompt pack</b><p>Every prompt we use on the day, ready to paste into your own AI.</p><span className="vs">VIP only</span></div></div>
          </div>
        </div>
        <aside className="buy" aria-label="Get the VIP pass">
          <p className="kicker">One payment</p>
          <p className="price">RM {AIDAY_VIP_PRICE_RM}<small>once</small></p>
          <VipYes id="yes" token={token} position="buy" />
          <a className="no" id="no" href={noThanks}>No thanks, I&apos;ll keep the free seat</a>
          <p className="safe">Card or FPX. All sales final: it's a live event, so there are no refunds.</p>
          <div className="qa">
            <div><b>Do I need VIP to get value?</b><p>No. The free seat gets the full live day.</p></div>
            <div><b>Can I get a refund?</b><p>No. It's a live event, so every VIP pass is final.</p></div>
            <div><b>Can I add it later?</b><p>Yes, until the free replay comes down.</p></div>
            <div><b>Who gets the hot seat?</b><p>VIPs whose problem helps the most people. Every VIP can watch and ask.</p></div>
          </div>
        </aside>
      </div></section>

      <footer className="foot"><div className="in"><span>Run It From Your Phone · Alaric, Kingsley and Rafay</span><span>{aidayCompanyLine()}</span></div></footer>
    </div>
  );
}
