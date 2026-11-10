/**
 * AI Day Program: every word and price on /aiday/join and /aiday/join/balance.
 *
 * Partners: edit this file on GitHub (pencil icon), commit to a branch, and
 * open a pull request. You don't need to touch any other file. Lines marked
 * TODO are placeholders waiting for the final copy.
 *
 * Prices here are display text only. What Stripe actually charges is set in
 * EventOps, so if you change a price here, ask Kingsley to change it there too.
 */

export const PROGRAM = {
  // TODO: final program name (placeholder).
  name: "AI Day Program",

  // TODO: final one-line promise under the name.
  tagline: "Take what you saw on AI Day and build it into your business, with us beside you.",

  // TODO: final intro paragraph.
  intro:
    "A guided program for business owners who want AI doing real work in their business, not just ideas from a workshop.",

  // TODO: final "what's included" list. Each item: a short title and one line.
  included: [
    { title: "Live build sessions", body: "Work through the build with Alaric, Kingsley and Rafay, step by step." },
    { title: "Your first AI helpers, set up", body: "Leave with helpers running on real jobs in your business." },
    { title: "Templates and prompts", body: "Every template and prompt we use, ready to copy." },
    { title: "Q&A and support", body: "Bring your questions and get unstuck between sessions." },
  ],

  // TODO: final "who it's for" list.
  whoFor: [
    "Business owners with a team who want AI to save real hours",
    "People who came to AI Day and want to go further",
    "Anyone who would rather build it with help than alone",
  ],

  // TODO: final FAQ. Keep answers short.
  faq: [
    { q: "How does payment work?", a: "Pay a $500 USD deposit today to hold your seat. Then pay the $4,500 balance in full, or in 3 monthly payments of $1,500." },
    { q: "Can I get my deposit back?", a: "Yes. The deposit is refundable within 7 days of paying it." },
    { q: "When is the balance due?", a: "Within 7 days of your deposit. You'll get a link to choose how you pay it." },
    { q: "How do the monthly payments work?", a: "The first $1,500 is charged when you choose the plan, then once a month for 2 more months. Then it stops." },
  ],

  // Prices (USD). Display only: Stripe amounts are set in EventOps.
  currency: "USD",
  depositUsd: 500,
  balanceUsd: 4500,
  splitCount: 3,
  splitUsd: 1500,
  depositRefundDays: 7,
  balanceDueDays: 7,
} as const;

/** "$4,500" style money text. */
export function usd(n: number): string {
  return "$" + n.toLocaleString("en-US");
}
