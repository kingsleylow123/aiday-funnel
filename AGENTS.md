# AI Day funnel (Run It From Your Phone, Sun 15 Nov 2026)

The free AI Day pages, live at **www.claudemalaysia.com/aiday**. Owned by
Alaric, Kingsley and Rafay. This repo holds only these pages.

| Page | URL | File |
|---|---|---|
| Registration | /aiday | `app/page.tsx` |
| VIP upsell | /aiday/vip | `app/vip/page.tsx` |
| Thank you + quiz | /aiday/thank-you | `app/thank-you/page.tsx` |
| Partner dashboard | /aiday/internal | `app/internal/` |

Dates, times, prices text, calendar link and company line: `lib/aiday/config.ts`.
Styles: `app/_styles/`. Photos and logos: `public/assets/` (use them as `/aiday/assets/...`).

## How it fits together

- claudemalaysia.com rewrites `/aiday` and `/aiday/*` to this app. The app runs
  with `basePath: "/aiday"`, so links, images and `fetch()` calls must start with `/aiday/`.
- Sign ups, VIP payment (Stripe, RM 47), quiz, tracking and dashboard numbers
  live in EventOps. The routes in `app/api/*` only forward to EventOps.
- WhatsApp group links and the Zoom link are data in EventOps, not code. Ask Kingsley to change them.

## How to change something

1. Make a branch, edit, run `npm run build` (it must pass).
2. Push the branch to the `preview` branch to see it at the preview link.
3. Merge to `main`. `main` is what's live on claudemalaysia.com/aiday.

## Rules

- Never put passwords, keys or customer data in code, commits or chat.
- Don't change `app/api/*`, `lib/aiday/server.ts` or `lib/aiday/session.ts`
  unless you know why: they handle sign ups, payments and the dashboard login.
- Follow the Claude Malaysia brand (claudemalaysia.com/brand). Read BRAND_SYSTEM.md before any visual change. Use the tokens in app/_styles/brand.css: paper background, ink text, clay #D97757 buttons with ink text. Headlines are Montserrat Bold ALL CAPS. Body and buttons are Lora. Labels and numbers are IBM Plex Mono. No italics, no blue, no gradients.
- The dashboard login uses env vars on Vercel (AIDAY_DASH_SECRET and
  AIDAY_DASH_PASS_<NAME>). Ask Kingsley to change a password.
