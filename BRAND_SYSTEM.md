# Claude Malaysia Brand System

This document is the implementation and deployment source of truth for every Claude Malaysia visual surface. Read it before changing or deploying UI. The live `/brand` page and `lib/brand/tokens.ts` are authoritative; if this summary ever differs, those sources win and this file must be corrected in the same change.

## Authoritative sources

- Brand book and usage examples: `app/brand/page.tsx` (`/brand`)
- Canonical typed tokens: `lib/brand/tokens.ts` — edit values here first
- Portable token export: `public/brand/tokens.json`
- Drop-in CSS variables: `public/brand/brand.css`
- Approved logo artwork: `public/brand/mark/*.svg`

Do not recreate, trace, recolour, stretch, rotate, skew, outline, or shadow the mark.

## Colour

**Everyday palette**

- Paper `#FAF7F2` — page ground
- Paper 2 `#F2EBDF` — secondary surface and insets
- Card `#FFFDF9` — raised surface, used sparingly
- Ink `#211C16` — primary text
- Ink Soft `#5F564B` — secondary text
- Ink Faint `#978C7B` — muted text and micro-labels
- Clay `#D97757` — primary UI accent, actions, links, and selected controls
- Clay Deep `#BE5C3B` — hover and emphasis
- Clay Logo `#CF6A4C` — **only** the logo ground and intentional full-bleed hero moments
- Hairlines: `rgba(33,28,22,.10)`; stronger lines: `rgba(33,28,22,.18)`
- Clay tints: `rgba(217,119,87,.12)` and `rgba(217,119,87,.20)`

Seasonal colours (`#B6802A` honey, `#4B7A5A` sage, `#A9533F` rust, `#6E6657` stone) are limited-edition accents: use one per drop, not as a replacement core palette.

Aim for the **60 / 25 / 12 / 3** balance: 60% paper, 25% ink, 12% clay, 3% seasonal accent. Clay is a spice, not a base; let cream breathe. Avoid gratuitous cards and gradients.

**Superseded legacy colours:** Terra Cotta `#DA7756`, Cream `#EEECE2`, and Coral `#BD5D3A` are obsolete. Dark black/orange UI treatments are not the Claude Malaysia core brand. Do not introduce either system in new work.

## Typography

Fonts are loaded in `app/layout.tsx`.

- **Montserrat Bold, ALL CAPS** (`--font-montserrat`, weight 700, `text-transform: uppercase`) — brand soul: display headlines, section titles, card titles, and statements. Emphasis is clay colour, upright (no italic caps). Keep headlines short (2–7 words). The wordmark stays in its locked mixed-case form.
- **Lora** (`--font-lora`) — all body copy, navigation, forms, buttons, and ordinary UI. Sentence case; never all caps.
- Rollout note (2026-11-04): /brand uses Montserrat caps + Lora. The rest of the site (`app/paper.css`, `app/layout.tsx`) still loads Fraunces + Hanken until rolled out.
- **IBM Plex Mono** (`--font-plex-mono`) — short labels, eyebrows, IDs, numbers, and technical microcopy; usually uppercase with wide tracking.
- **Space Grotesk** — merchandise and the approved box-logo only. Never body copy or ordinary UI.

Do not set long copy in mono or all caps, and do not mix serif and sans within one prose block.

## Logo

Use artwork, never a hand-built approximation:

- `/brand/mark/mark.svg` — primary full-colour mark
- `/brand/mark/mark-mono-ink.svg` — one-colour ink
- `/brand/mark/mark-mono-paper.svg` — reversed on dark/clay grounds
- `/brand/mark/mark-clay.svg` — clay stamp on cream
- `/brand/mark/mark-construction.svg` — construction/clear-space reference, not a public-facing logo

Keep clear space of at least **½ of the mark diameter on every side**. Minimum size is 24px on screen or 10mm in print; below that use a mono variant. Use the full-colour mark on a quiet surface only. Never place it directly on a busy image.

## Accessibility and motion

- Ink on Paper (~15:1) and Ink Soft on Paper (~7:1) are preferred for normal text.
- Clay Deep on Paper is for large text/emphasis; Clay on Paper is for large text, boundaries, selected controls, or non-text UI—not small body copy.
- Do not rely on colour alone: preserve labels, selected states, icons, and `aria-*` semantics.
- Interactive targets should be at least 44×44px, have visible keyboard focus, and retain keyboard order/operation.
- Preserve readable mobile layouts at 320px and avoid hidden horizontal overflow. Intentional rating rails may scroll and must remain labelled.
- Honour `prefers-reduced-motion`; motion is calm, short, and never required to understand state.

## Video editing

The Reel SOP lives at `/brand#video`. In short: transcribe and fix names and numbers, remove every um/uh/false start and dead air over ~0.3s, lead with the result in the first 3s, cut to 25–30s, brand captions (ink on paper, active word clay), motion graphics only on key beats (rise 14px, fade 0.7s), music around −24 dB under speech, and upload unlisted before anything goes public. Confirm every stat with the creator before export.

## Voice

Sound like a smart Malaysian friend who has figured out AI: plainspoken, useful, candid, specific, and warm. Focus on real work and credible outcomes. “We build it with you, not for you.”

Do not use corporate AI jargon, hype, guaranteed results, “get rich overnight,” “replace your whole team,” or claim approval/endorsement by Anthropic. Claude Malaysia is an independent community.

## Do / don’t

**Do**

- Begin with paper, ink, and generous negative space.
- Use Montserrat Bold caps to create hierarchy and Lora for reading.
- Use regular Clay for actions and Clay Logo only for the mark/hero ground.
- Use hairlines and spacing before reaching for cards.
- Use real approved SVG assets with correct clear space.
- Keep mobile, keyboard, focus, reduced-motion, validation, and semantic states intact.

**Don’t**

- Reintroduce black/orange premium-tech styling, cold blues, neon, or “AI-slop” gradients.
- Turn every section into a floating card or add decorative gradients/shadows by default.
- Improvise a lettermark, redraw the rays/star, or alter the logo colours.
- Use clay for paragraphs or low-contrast small text.
- Use Space Grotesk outside approved merch/box-logo applications.

## Visual-change and deployment QA

Before requesting review or deploying:

- [ ] Read this file, `/brand`, and `lib/brand/tokens.ts`; confirm token values have not drifted.
- [ ] Check the 60/25/12/3 balance and that Clay Logo is restricted to logo/hero grounds.
- [ ] Confirm exact type roles and approved mark path, variant, clear space, and minimum size.
- [ ] Search the changed UI for legacy colours, black/orange treatments, cold blue, unnecessary gradients/cards, and off-brand fonts.
- [ ] Test all states: empty, hover, focus, selected, disabled, validation/error, loading, success, and long content.
- [ ] Complete the real flow on desktop and mobile widths; verify payload/API behavior and external CTAs where applicable.
- [ ] Keyboard-test tab order, activation, focus visibility, and any horizontal control rails.
- [ ] Test at 200% zoom, 320px width, reduced motion, and with no accidental horizontal page overflow.
- [ ] Run TypeScript/build checks and inspect the final diff.
- [ ] Use a preview deployment and review screenshots before production. Never deploy production directly from an unreviewed local branch.
