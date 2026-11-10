import type { Metadata } from "next";
import "../_styles/thank-you.css";
import { Confetti, CopyLink, Quiz, StartsIn, TrackedLink, TyView, WhatsAppLink } from "../_components/ThankYou";
import { AIDAY_CALENDAR_URL, AIDAY_SHARE_URL, aidayCompanyLine } from "@/lib/aiday/config";
import { EVENTOPS_URL } from "@/lib/aiday/server";

export const metadata: Metadata = {
  title: { absolute: "AI Day Thank You" },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ name?: string | string[]; t?: string | string[]; vip?: string | string[] }> };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

// claudemalaysia.com/aiday/thank-you: step 3. Confetti once, three action
// cards, the three hours, one 6 question quiz. Ported from
// AI-Day-Pack-Kingsley/thank-you-page.html.
export default async function AidayThankYouPage({ searchParams }: Props) {
  const sp = await searchParams;
  const name = one(sp.name).trim().slice(0, 30);
  const token = one(sp.t).slice(0, 200);
  // EventOps redirects to the current (rotating) WhatsApp group link.
  const waUrl = `${EVENTOPS_URL}/api/public/aiday/wa`;

  return (
    <div className="aid-ty">
      <TyView token={token} vipPaid={one(sp.vip) === "1"} />
      <nav className="flow" aria-label="Sign up steps, step 3 of 3"><div className="in"><ol><li className="done"><i>✓</i>Seat saved</li><li className="done"><i>✓</i>VIP upgrade</li><li className="now" aria-current="step"><i>3</i>You're in</li></ol></div></nav>

      <section className="cele"><Confetti /><div className="in">
        <p className="kicker">Congratulations<span id="nm">{name ? `, ${name}` : ""}</span></p>
        <h1 className="d1">You're in. <span className="serif">Sunday changes everything.</span></h1>
        <p className="lede">In four hours you'll find your level, build your first AI helper, and watch a business run from a phone. Here's everything you need.</p>
        <div className="when"><span>Sun 15 November</span><span>10am to 2:10pm MYT</span><span>Live on Zoom</span></div>
        <p className="cdl">Starts in <StartsIn /></p>
        <div className="acts" aria-label="Do these three things now">
          <div className="act"><div><small>Step 1</small><b>Add it to your calendar</b><p>So Sunday morning stays free.</p></div><TrackedLink className="btn line" id="cal" href={AIDAY_CALENDAR_URL} target="_blank" rel="noopener" event="calendar_click" token={token}>Add to calendar</TrackedLink></div>
          <div className="act"><div><small>Step 2</small><b>Join the WhatsApp group</b><p>Your Zoom link and reminders land here first.</p></div><WhatsAppLink base={waUrl} token={token} /></div>
          <div className="act"><div><small>Step 3</small><b>Find your level</b><p>One quick quiz, 45 seconds. We start from your answer.</p></div><a className="btn blue" href="#quiz">Take the quiz <span className="ar">→</span></a></div>
        </div>
      </div></section>

      <section className="band walk"><div className="in">
        <p className="kicker">What you'll walk away with</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Three hours. <span className="serif">Three things you'll have.</span></h2>
        <div className="hrs">
          <div className="h"><div className="photo"><img src="/aiday/assets/kingsley-lg.jpg" alt="Kingsley Low" /></div><span className="tag">Hour 1 · 10:10 · Kingsley</span><b>Your first AI helper, working.</b><p>You build it along with Kingsley, step by step, for your own business.</p><p className="out"><span>You leave with</span> a helper that does a task you do every week.</p></div>
          <div className="h"><div className="photo"><img src="/aiday/assets/alaric-lg.jpg" alt="Alaric Ong" /></div><span className="tag">Hour 2 · 11:10 · Alaric</span><b>AI that sells for you.</b><p>Your offer, your ad and your follow ups, written with AI while you watch.</p><p className="out"><span>You leave with</span> words that sell, ready to post and send.</p></div>
          <div className="h"><div className="photo"><img src="/aiday/assets/rafay-talk.jpg" alt="Rafay Korai" /></div><span className="tag">Hour 3 · 12:10 · Rafay</span><b>The Power CEO, live.</b><p>A real business run from a phone, on screen: leads, posts, invoices and ads.</p><p className="out"><span>You leave with</span> the picture of where you're going, and the steps.</p></div>
        </div>
      </div></section>

      <section className="band" id="quiz"><div className="in">
        <p className="kicker">One quiz · 6 taps · 45 seconds</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Where are you <span className="serif">right now?</span></h2>
        <p className="lede" style={{ marginTop: "14px" }}>Answer six quick questions. You get your level on the 5 step ladder, and we pick the examples we build live from your answers.</p>
        <Quiz token={token} />
      </div></section>

      <section className="band bring"><div className="in">
        <div><p className="kicker">Bring these on Sunday</p><ul><li>A laptop and your phone</li><li>A free AI account (we show you which at the start)</li><li>One task you repeat every week</li><li>One product or service you want to sell more of</li></ul></div>
        <div><p className="kicker">Bring a friend who runs a business</p><p className="d3" style={{ marginTop: "14px" }}>Their seat is free too. <span className="serif">Send them this.</span></p><CopyLink url={AIDAY_SHARE_URL} /></div>
      </div></section>

      <footer className="foot"><div className="in"><span>Run It From Your Phone · Alaric, Kingsley and Rafay</span><span>{aidayCompanyLine()}</span></div></footer>
    </div>
  );
}
