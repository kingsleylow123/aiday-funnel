import type { Metadata } from "next";
import { BalanceFlow, ProgramView } from "../../_components/Program";
import { aidayCompanyLine } from "@/lib/aiday/config";
import { PROGRAM } from "@/lib/aiday/program";

export const metadata: Metadata = {
  title: { absolute: `${PROGRAM.name}: your seat` },
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ b?: string | string[]; s?: string | string[]; paid?: string | string[] }> };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
const TOKEN = /^[A-Za-z0-9._~-]{8,200}$/;
const SESSION = /^cs_[A-Za-z0-9_]{8,250}$/;

// claudemalaysia.com/aiday/join/balance?b=<token>[&s=<cs_id>][&paid=1]
// Where Stripe sends the buyer back. Shows deposit / plan / paid state from EventOps.
export default async function JoinBalancePage({ searchParams }: Props) {
  const sp = await searchParams;
  const b = one(sp.b);
  const s = one(sp.s);
  const token = TOKEN.test(b) ? b : "";
  const session = SESSION.test(s) ? s : "";
  const paid = one(sp.paid) === "1";

  return (
    <div className="aid-prog">
      <ProgramView page="balance" />
      <header className="bar"><div className="in">
        <a className="wordmark" href="/aiday/join"><i></i>{PROGRAM.name}</a>
      </div></header>
      <main>
        <section className="status"><div className="in">
          <BalanceFlow token={token} session={session} paid={paid} />
          <p className="note" style={{ marginTop: 40 }}>Questions about your payment? Reply to your receipt email and we&apos;ll help.</p>
        </div></section>
      </main>
      <footer className="foot"><div className="in"><span>{PROGRAM.name} · Alaric, Kingsley and Rafay</span><span>{aidayCompanyLine()}</span></div></footer>
    </div>
  );
}
