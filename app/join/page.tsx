import type { Metadata } from "next";
import { DepositButton, ProgramView } from "../_components/Program";
import { aidayCompanyLine } from "@/lib/aiday/config";
import { PROGRAM, usd } from "@/lib/aiday/program";

export const metadata: Metadata = {
  title: { absolute: PROGRAM.name },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ t?: string | string[] }> };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

// claudemalaysia.com/aiday/join: the AI Day Program page. Anyone with the link.
// All copy and prices: lib/aiday/program.ts. ?t= is passed to EventOps for a test checkout.
export default async function JoinPage({ searchParams }: Props) {
  const sp = await searchParams;
  const t = one(sp.t).slice(0, 200);

  return (
    <div className="aid-prog">
      <ProgramView page="join" />
      <header className="bar"><div className="in">
        <span className="wordmark"><i></i>{PROGRAM.name}</span>
        {t && <span className="pill">Test mode</span>}
      </div></header>

      <main>
        <section className="hero"><div className="in">
          <div>
            <p className="kicker">After AI Day · limited seats</p>
            <h1 className="d1">{PROGRAM.name}</h1>
            <p className="lede">{PROGRAM.tagline}</p>
            <p className="lede" style={{ marginTop: 14 }}>{PROGRAM.intro}</p>
          </div>
          <aside className="price" aria-label="Reserve your seat">
            <p className="lbl">Reserve your seat</p>
            <p className="amt"><b>{usd(PROGRAM.depositUsd)}</b><span>{PROGRAM.currency} deposit</span></p>
            <p className="then">
              Then pay the {usd(PROGRAM.balanceUsd)} balance in full, or {PROGRAM.splitCount} monthly payments of {usd(PROGRAM.splitUsd)}.
            </p>
            <DepositButton testParam={t} />
            <p className="safe"><b>Deposit refundable within {PROGRAM.depositRefundDays} days.</b> Secure checkout by Stripe.</p>
          </aside>
        </div></section>

        <section className="band pap"><div className="in">
          <p className="kicker">What&apos;s included</p>
          <h2 className="d2" style={{ marginTop: 10 }}>Everything you get</h2>
          <ul className="inc">
            {PROGRAM.included.map((x, i) => (
              <li key={x.title}><span className="n">{String(i + 1).padStart(2, "0")}</span><div><b>{x.title}</b><p>{x.body}</p></div></li>
            ))}
          </ul>
        </div></section>

        <section className="band"><div className="in">
          <p className="kicker">Who it&apos;s for</p>
          <h2 className="d2" style={{ marginTop: 10 }}>Is this you?</h2>
          <ul className="who">
            {PROGRAM.whoFor.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div></section>

        <section className="band pap"><div className="in">
          <p className="kicker">Questions</p>
          <h2 className="d2" style={{ marginTop: 10 }}>FAQ</h2>
          <div className="faq">
            {PROGRAM.faq.map((x) => (
              <details key={x.q}><summary>{x.q}</summary><p>{x.a}</p></details>
            ))}
          </div>
          <div className="price" style={{ marginTop: 32, maxWidth: 460 }}>
            <p className="amt"><b>{usd(PROGRAM.depositUsd)}</b><span>{PROGRAM.currency} deposit</span></p>
            <DepositButton testParam={t} />
            <p className="safe">Deposit refundable within {PROGRAM.depositRefundDays} days.</p>
          </div>
        </div></section>
      </main>

      <footer className="foot"><div className="in"><span>{PROGRAM.name} · Alaric, Kingsley and Rafay</span><span>{aidayCompanyLine()}</span></div></footer>
    </div>
  );
}
