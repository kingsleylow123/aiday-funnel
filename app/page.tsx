import type { Metadata } from "next";
import "./_styles/summit.css";
import { Countdown } from "./_components/Countdown";
import { Levels } from "./_components/Levels";
import { RegisterForm } from "./_components/RegisterForm";
import { SummitBehaviors } from "./_components/SummitBehaviors";
import { aidayCompanyLine } from "@/lib/aiday/config";

const TITLE = "Free AI Day, 15 Nov | Run your whole business from your phone";
const DESCRIPTION =
  "A free live AI day on Zoom, Sunday 15 November, 10am Malaysia time. Alaric, Kingsley and Rafay teach one hour each, so you can run your whole business from your phone.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/aiday" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.claudemalaysia.com/aiday",
    siteName: "Claude Malaysia",
    locale: "en_MY",
    type: "website",
    images: [{ url: "/aiday/og.jpg", width: 1200, height: 630, alt: "Run your whole business from your phone. Free live AI day, Sunday 15 November, 10am MYT." }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/aiday/og.jpg"],
  },
};

// claudemalaysia.com/aiday: step 1, the registration page. Ported from
// AI-Day-Pack-Kingsley/summit-page.html (same sections, order and copy).
// Styled to the Claude Malaysia brand: see _styles/summit.css and BRAND_SYSTEM.md.
export default function AidaySummitPage() {
  return (
    <div className="aid-summit">
      <SummitBehaviors />
      <header className="topbar"><div className="in">
        <span className="cm"><img src="/aiday/brand/mark/mark.svg" alt="" width={32} height={32} /><b>Claude Malaysia</b></span>
        <a className="wordmark" href="#register"><i></i>Run It From Your Phone</a>
        <span className="meta">Free live AI day · Sun 15 Nov · 10am MYT</span>
        <a className="btn" href="#register">Save my seat</a>
      </div></header>

      <section className="hero"><div className="in">
        <div>
          <p className="kicker">Free live AI day · <span className="lg">Sunday 15 November</span><span className="sm">Sun 15 Nov</span> · 10am MYT · Zoom</p>
          <h1 className="d1">Run your whole business <span className="serif">from your phone.</span></h1>
          <p className="lede">Give us four hours on Sunday. Get <span className="mark">one day back every single week</span>, with AI doing real work in your business.</p>
          <div className="trio" aria-label="Your three teachers">
            <figure><div className="photo"><img src="/aiday/assets/alaric-lg.jpg" alt="Alaric Ong on stage" /></div><figcaption><span className="hr">Hour 2</span><b>Alaric Ong</b><span>Founder and CEO, Alaric.AI</span></figcaption></figure>
            <figure><div className="photo"><img src="/aiday/assets/kingsley-lg.jpg" alt="Kingsley Low" /></div><figcaption><span className="hr">Hour 1</span><b>Kingsley Low</b><span>Founder and CEO, Claude Malaysia</span></figcaption></figure>
            <figure><div className="photo"><img src="/aiday/assets/rafay-talk.jpg" alt="Rafay Korai speaking on stage" /></div><figcaption><span className="hr">Hour 3</span><b>Rafay Korai</b><span>Managing Director, Mindvalley</span></figcaption></figure>
          </div>
        </div>

        <RegisterForm variant="top" />
      </div></section>

      <section className="logos" aria-label="Brands our teachers have worked with or been featured on"><div className="in">
        <p>Our teachers have worked with, spoken at and been featured on</p>
        <div className="marq"><div className="track">
          <img src="/aiday/assets/logos/mindvalley.svg" alt="Mindvalley" /><img src="/aiday/assets/logos/stripe.svg" alt="Stripe" /><img src="/aiday/assets/logos/netcore.png" alt="Netcore" /><img src="/aiday/assets/logos/marketwatch.png" alt="MarketWatch" /><img src="/aiday/assets/logos/marketing-interactive.svg" alt="Marketing-Interactive" /><img src="/aiday/assets/logos/yahoo-finance.png" alt="Yahoo Finance" /><img src="/aiday/assets/logos/dma.png" alt="Digital Marketing Asia" /><img src="/aiday/assets/logos/impact-com.png" alt="impact.com" /><img src="/aiday/assets/logos/benzinga.png" alt="Benzinga" /><img src="/aiday/assets/logos/claude-my-logo.svg" alt="Claude Malaysia" /><img src="/aiday/assets/logos/maxim.png" alt="MAXIM" /><img src="/aiday/assets/logos/daily-herald.png" alt="Daily Herald" /><img src="/aiday/assets/logos/buffalo-news.png" alt="The Buffalo News" />
          <img src="/aiday/assets/logos/mindvalley.svg" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/stripe.svg" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/netcore.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/marketwatch.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/marketing-interactive.svg" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/yahoo-finance.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/dma.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/impact-com.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/benzinga.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/claude-my-logo.svg" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/maxim.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/daily-herald.png" alt="" aria-hidden="true" /><img src="/aiday/assets/logos/buffalo-news.png" alt="" aria-hidden="true" />
        </div></div>
      </div></section>

      <section className="band pap call"><div className="in">
        <div>
          <p className="kicker">Sound familiar?</p>
          <h2 className="d2" style={{ marginTop: "14px" }}>AI was meant to make business easier. So why are you <span className="serif">still doing everything?</span></h2>
          <div className="lines">
            <p>AI writes the post. <b>You still have to find the customer.</b></p>
            <p>AI answers your question. <b>You still do the work by hand.</b></p>
            <p>AI saves you an hour. <b>The hour fills up with more work.</b></p>
          </div>
          <p className="stmt">You started a business to be free. Now everything runs through you.</p>
        </div>
        <div className="answer">
          <p className="kicker">What nobody showed you</p>
          <h3>The answer isn't another tool. <span className="serif">It's the order.</span></h3>
          <p>There are 5 levels of AI in a business. Most owners are stuck at level 2: asking AI questions, then doing the work themselves. On 15 November we take you up one level at a time, live, until you can see your business running from your phone.</p>
          <a className="btn" href="#join">Save my free seat <span className="ar">→</span></a>
        </div>
      </div></section>

      <section className="band"><div className="in">
        <p className="kicker">Before and after the 15th</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Three hours. <span className="serif">Three changes you can see.</span></h2>
        <div className="chg">
          <div className="row"><div className="who"><img src="/aiday/assets/kingsley-lg.jpg" alt="" /><div><span>Hour 1</span><b>Kingsley Low</b></div></div><p className="b4">AI answers your questions. You still do the work.</p><p className="af">Your AI helper does the work. You check it.</p></div>
          <div className="row"><div className="who"><img src="/aiday/assets/alaric-lg.jpg" alt="" /><div><span>Hour 2</span><b>Alaric Ong</b></div></div><p className="b4">Leads come in and go cold while you're busy.</p><p className="af">AI writes the offer, the ad and every follow up.</p></div>
          <div className="row"><div className="who"><img src="/aiday/assets/rafay-close.jpg" alt="" /><div><span>Hour 3</span><b>Rafay Korai</b></div></div><p className="b4">Everything runs through you, on ten tabs.</p><p className="af">The business runs from your phone. You decide.</p></div>
        </div>
      </div></section>

      <section className="band pap" id="levels"><div className="in">
        <p className="kicker">The 5 levels of AI</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Where are you <span className="serif">right now?</span></h2>
        <p className="lede" style={{ marginTop: "14px" }}>Tap the one that sounds like you. After you register, a 30 second quiz confirms it.</p>
        <Levels />
      </div></section>

      <section className="band" id="day"><div className="in">
        <p className="kicker">The agenda · Sunday 15 November · Malaysia time</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Four hours. <span className="serif">One level up.</span></h2>
        <div className="ag">
          <div className="slot"><span className="tm">10:00<small>10 min</small></span><span className="face all">All<br />three</span><div><h3>Your level, found</h3><p>Bring your quiz result. We start from where you are.</p></div><span className="lv">Starting point</span></div>
          <div className="slot hour"><span className="tm">10:10<small>Hour 1</small></span><span className="face"><img src="/aiday/assets/kingsley-lg.jpg" alt="" /></span><div><h3><span className="live">Live build</span>Build your first AI helper</h3><p>Kingsley Low. You build along. It works for your business by 11:10.</p></div><span className="lv">Asker → Amplifier</span></div>
          <div className="slot hour"><span className="tm">11:10<small>Hour 2</small></span><span className="face"><img src="/aiday/assets/alaric-lg.jpg" alt="" /></span><div><h3><span className="live">Live build</span>AI that sells for you</h3><p>Alaric Ong. Your offer, your ad and your follow ups, written with AI live.</p></div><span className="lv">Amplifier → Builder</span></div>
          <div className="slot hour"><span className="tm">12:10<small>Hour 3</small></span><span className="face"><img src="/aiday/assets/rafay-close.jpg" alt="" /></span><div><h3><span className="live">Live demo</span>The Power CEO</h3><p>Rafay Korai. A real business run from a phone, on screen.</p></div><span className="lv">Builder → Power CEO</span></div>
          <div className="slot"><span className="tm">1:10<small>Hour 4</small></span><span className="face all">All<br />three</span><div><h3>Your questions, live</h3><p>A full hour to ask all three of us anything: your business, your tools, your next step. Ends about 2:10pm.</p></div><span className="lv">Live Q&amp;A</span></div>
        </div>
        <a className="btn" href="#join" style={{ marginTop: "36px" }}>Save my free seat <span className="ar">→</span></a>
      </div></section>

      <section className="band night" id="teachers"><div className="in">
        <p className="kicker">Your teachers</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>They've done it at scale. <span className="serif">Now they show you how, live.</span></h2>
        <div className="stats">
          <div><small>Alaric Ong</small><b>1,000+</b><span>client wins</span></div>
          <div><small>Kingsley Low</small><b>4,000+</b><span>members in his AI community</span></div>
          <div><small>Rafay Korai</small><b>USD 700M+</b><span>in sales helped</span></div>
        </div>
        <div>
          <article className="pf">
            <div className="photo"><img src="/aiday/assets/alaric-lg.jpg" alt="Alaric Ong on stage" /></div>
            <div className="tx">
              <span className="hr">Hour 2 · AI that sells · 11:10am</span>
              <h3>Alaric Ong</h3>
              <p className="ttl">Founder and CEO, Alaric.AI and OmniConvo.AI · Entrepreneur, speaker, author</p>
              <p className="claim">Zero to <em>USD 1.2M in 18 months</em>, with no starting capital.</p>
              <p className="bio">Started his first business at 19. Built a 140 person sales team in 10 months. Founded Singapore's largest Facebook marketing community, with clients in Singapore, Malaysia, the Philippines, the UK, the US, Australia and Ireland. Then built Alaric.AI, Singapore's first AI sales and marketing coach.</p>
              <div className="facts"><div><b>5</b>businesses built and scaled</div><div><b>1,000+</b>client wins</div><div><b>140</b>person sales team, built in 10 months</div></div>
              <div className="endorse"><p>“Whatever Alaric tells you to do, just do it.”</p><span>Myron Golden, Two Comma Club X Award winner. Also praised by Loren Ridinger, co-founder of SHOP.COM, and Richard Tan, founder of Success Resources.</span></div>
              <p className="see"><b>You'll see</b>your offer, your ad and your follow ups, written with AI live.</p>
              <div className="brands"><small>As featured on</small><div><img src="/aiday/assets/logos/marketwatch.png" alt="MarketWatch" /><img src="/aiday/assets/logos/yahoo-finance.png" alt="Yahoo Finance" /><img src="/aiday/assets/logos/benzinga.png" alt="Benzinga" /><img src="/aiday/assets/logos/maxim.png" alt="MAXIM" /><img src="/aiday/assets/logos/daily-herald.png" alt="Daily Herald" /></div></div>
            </div>
          </article>
          <article className="pf">
            <div className="photo"><img src="/aiday/assets/kingsley-lg.jpg" alt="Kingsley Low" /></div>
            <div className="tx">
              <span className="hr">Hour 1 · Your first AI helper · 10:10am</span>
              <h3>Kingsley Low</h3>
              <p className="ttl">Founder and CEO, Claude Malaysia and CloserKing.AI</p>
              <p className="claim">From his last 10k in savings to <em>USD 64K closed in 99 days.</em></p>
              <p className="bio">Ran 20+ events across Asia for an 8 figure entrepreneur. Built CloserKing.AI, where his students close USD 10K deals in two weeks, and once closed SGD 10K in a single day for Alaric. In May 2026 he started Claude Malaysia. It passed 4,000 members, and his last 5 workshop batches sold out.</p>
              <div className="facts"><div><b>4,000+</b>members in Claude Malaysia</div><div><b>5 of 5</b>recent workshop batches sold out</div><div><b>5X to 20X</b>a client's return on ad spend</div></div>
              <div className="endorse"><p>4.8 out of 5 from 21 Google reviews. 52+ five star reviews for CloserKing.AI.</p></div>
              <p className="see"><b>You'll see</b>your first AI helper, built step by step, while you build yours.</p>
              <div className="brands color"><small>Founded and delivers with</small><div><img src="/aiday/assets/logos/claude-my-logo.svg" alt="Claude Malaysia" /><img src="/aiday/assets/logos/hrdcorp-claimable.png" alt="HRD Corp Claimable" /><img src="/aiday/assets/logos/thriving-talents.png" alt="Thriving Talents" /></div></div>
            </div>
          </article>
          <article className="pf">
            <div className="photo"><img src="/aiday/assets/rafay-close.jpg" alt="Rafay Korai" /></div>
            <div className="tx">
              <span className="hr">Hour 3 · The Power CEO · 12:10pm</span>
              <h3>Rafay Korai</h3>
              <p className="ttl">Managing Director, Mindvalley · AI builder</p>
              <p className="claim">Took a membership business from <em>zero to USD 80M in two years.</em></p>
              <p className="bio">Went from Product Marketing Manager to Managing Director. Over 10 years he has helped bring in more than USD 700M in sales. He has built 6 AI products, including TAWK and Tomorrow, founded a natural food brand in Malaysia, and runs his own companies on AI.</p>
              <div className="facts"><div><b>USD 700M+</b>in sales over 10 years</div><div><b>0 to 80M</b>in two years</div><div><b>6</b>AI products built</div></div>
              <div className="endorse"><p>Judge, DMA Singapore Agency of the Year.</p><span>Spoken at Stripe Tour Singapore, Netcore, Digital Marketing Asia and impact.com.</span></div>
              <p className="see"><b>You'll see</b>a real business run from a phone: leads, posts, invoices and ads.</p>
              <div className="brands"><small>Worked with and spoken at</small><div><img src="/aiday/assets/logos/mindvalley.svg" alt="Mindvalley" /><img src="/aiday/assets/logos/stripe.svg" alt="Stripe" /><img src="/aiday/assets/logos/netcore.png" alt="Netcore" /><img src="/aiday/assets/logos/marketing-interactive.svg" alt="Marketing-Interactive" /><img src="/aiday/assets/logos/dma.png" alt="Digital Marketing Asia" /><img src="/aiday/assets/logos/impact-com.png" alt="impact.com" /></div></div>
            </div>
          </article>
        </div>
        <a className="btn" href="#join" style={{ marginTop: "40px" }}>Join Alaric, Kingsley and Rafay <span className="ar">→</span></a>
      </div></section>

      <section className="band"><div className="in">
        <p className="kicker">Stories</p>
        <h2 className="d2" style={{ marginTop: "14px" }}>Real owners. <span className="serif">Real results.</span></h2>
        <div className="stories">
          <article className="st"><p className="res">A 5 brand order dashboard, built in under 3 hours.</p><p className="desc">One view for every order across 5 brands on Shopee and Lazada.</p><div className="by"><span className="ini">YY</span><div><b>Yee Yin</b><span>Vending and e-commerce</span></div><em>Kingsley</em></div></article>
          <article className="st"><p className="res">A $1,780,000 property sold one week after the course.</p><p className="desc">Learned an appointment setting system on the course, then used it that week.</p><div className="by"><span className="ini">AJ</span><div><b>Alan Jeremiah</b><span>Property agent</span></div><em>Alaric</em></div></article>
          <article className="st"><p className="res">Lead generation and sales, significantly up.</p><q>Because of his work we could significantly increase our lead generation &amp; sales.</q><div className="by"><img src="/aiday/assets/david-szecsei.jpg" alt="" /><div><b>Dávid Szécsei</b><span>Training organisation</span></div><em>Rafay</em></div></article>
          <article className="st"><p className="res">An AI ads dashboard instead of an agency.</p><q>Hiring an agency would cost me around RM10,000 per month.</q><div className="by"><span className="ini">AL</span><div><b>Alycia and Leo</b><span>Marketing agency</span></div><em>Kingsley</em></div></article>
          <article className="st"><p className="res">Two $3,400 deals closed on the same day.</p><p className="desc">Used the 5 step consultation process from the course.</p><div className="by"><span className="ini">WY</span><div><b>Winston Yap</b><span>Top leader, 50,000 distributors</span></div><em>Alaric</em></div></article>
          <article className="st"><p className="res">A premium coaching program, scaled.</p><q>He is a fast mover, and as a marketing subscription expert worked with me to scale our Premium Coaching program.</q><div className="by"><img src="/aiday/assets/yvette-pelgrom.jpg" alt="" /><div><b>Yvette Pelgrom</b><span>CEO and founder, formerly LinkedIn</span></div><em>Rafay</em></div></article>
        </div>
        <p className="fine">Results are individual and depend on effort and circumstances. Shared by our teachers' clients and community members.</p>
      </div></section>

      <section className="band faq rule"><div className="in">
        <div>
          <p className="kicker">Still on the fence?</p>
          <h2 className="d2" style={{ marginTop: "14px" }}>Still wondering if this <span className="serif">is for you?</span></h2>
        </div>
        <div>
          <details open><summary>I'm not technical. Will I understand it?</summary><p>Yes. No coding. We go step by step in plain words, and you build along.</p></details>
          <details><summary>I already use ChatGPT or Claude. What's different?</summary><p>That's level 2. This day shows you levels 3 to 5: AI that does the work, sells for you, and runs from your phone.</p></details>
          <details><summary>Will it work for my kind of business?</summary><p>Yes. Shops, services, agencies, coaching, F&amp;B, property. New or already running.</p></details>
          <details><summary>What if I can't stay for four hours?</summary><p>Come for your hour. The free replay is up for 48 hours.</p></details>
          <details><summary>Is it really free?</summary><p>Yes. The live day and the 48 hour replay are free.</p></details>
          <details><summary>Will you sell something?</summary><p>Near the end we explain how to build it with us in KL in January. You get full value without buying anything.</p></details>
          <details><summary>What language is it in?</summary><p>English.</p></details>
        </div>
      </div></section>

      <section className="band close"><div className="in">
        <p className="kicker">Sunday 15 November · 10am · Online</p>
        <h2 className="d2">Stop running everything. <span className="serif">Run it from your phone.</span></h2>
        <Countdown />
        <RegisterForm variant="bottom" />
      </div></section>

      <footer className="foot dark"><div className="in">
        <span>Run It From Your Phone · Alaric, Kingsley and Rafay</span>
        <span>{aidayCompanyLine()} · <a href="/privacy" target="_blank" rel="noopener">Privacy</a> · <a href="/terms" target="_blank" rel="noopener">Terms</a></span>
      </div></footer>

      <div className="sticky"><div><b>Free AI day</b>Sun 15 Nov · 10am · Online</div><a className="btn" href="#register">Save my seat</a></div>
    </div>
  );
}
