/**
 * Run It From Your Phone: free online AI day, Sunday 15 Nov 2026, 10am MYT.
 * Shared constants for /aiday, /aiday/vip, /aiday/thank-you and /aiday/internal.
 * Safe to import from client components (no secrets here).
 */

export const AIDAY_EVENT = "ai-day-2026-11-15";

/** 10:00 MYT on Sunday 15 Nov 2026. */
export const AIDAY_START_ISO = "2026-11-15T02:00:00Z";
export const AIDAY_START_MS = Date.UTC(2026, 10, 15, 2, 0, 0);

export const AIDAY_SHARE_URL = "https://www.claudemalaysia.com/aiday";

/** Footer company line on all three pages. */
export const AIDAY_COMPANY_NAME = "CMO Consulting Sdn. Bhd.";
/** SSM registration number (matches /privacy). */
export const AIDAY_COMPANY_REG_NO = "202601024007 (1686104-X)";

export function aidayCompanyLine(): string {
  return AIDAY_COMPANY_REG_NO ? `${AIDAY_COMPANY_NAME} (${AIDAY_COMPANY_REG_NO})` : AIDAY_COMPANY_NAME;
}

/** Shown on the VIP page. Partners still to confirm (README section 5). */
export const AIDAY_VIP_PRICE_RM = 47;

export const AIDAY_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
  encodeURIComponent("Free AI day, live on Zoom") +
  "&dates=20261115T020000Z/20261115T061000Z&details=" +
  encodeURIComponent(
    "Alaric, Kingsley and Rafay. 10am to about 2:10pm Malaysia time. Your Zoom link comes by email and WhatsApp the day before.",
  );
