/*
 * Meta Pixel for the AI Day pages. Two pixels are loaded in app/layout.tsx:
 *   - mf_pixel (3618851711751697): the claudemalaysia.com site pixel, so AI Day
 *     visitors stay in Kingsley's main site audience.
 *   - AI Day Funnel (1641012040836812): AI Day only. Shared with partners for
 *     their ads, so they never see the rest of the site's data.
 * fbq('track', ...) sends every event to both.
 */
export const SITE_PIXEL_ID = "3618851711751697";
export const AIDAY_PIXEL_ID = "1641012040836812";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a standard Meta event once per browser for `onceKey` (e.g. a sign-up
 * token), so a refresh or back button never counts the same sign-up or
 * payment twice. `eventID` lets Meta dedupe against a future server event.
 */
export function pixelOnce(onceKey: string, event: string, params?: Record<string, unknown>, tries = 20): void {
  try {
    if (!onceKey || typeof window === "undefined") return;
    // The pixel script loads after the page; wait for it (up to ~5s).
    if (!window.fbq) {
      if (tries > 0) setTimeout(() => pixelOnce(onceKey, event, params, tries - 1), 250);
      return;
    }
    const k = `aiday_px_${event}_${onceKey}`;
    try {
      if (localStorage.getItem(k)) return;
      localStorage.setItem(k, "1");
    } catch {
      /* private mode: fire anyway */
    }
    window.fbq("track", event, params ?? {}, { eventID: `${event}_${onceKey}` });
  } catch {
    /* tracking never breaks the page */
  }
}
