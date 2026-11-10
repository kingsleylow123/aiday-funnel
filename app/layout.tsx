import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { AIDAY_PIXEL_ID, SITE_PIXEL_ID } from "@/lib/aiday/pixel";

/*
 * Run It From Your Phone (free AI day, 15 Nov 2026). Served at
 * www.claudemalaysia.com/aiday: the main site rewrites /aiday/* to this app,
 * which runs with basePath "/aiday". These pages are a faithful port of the
 * partner approved pack (Alaric, Kingsley and Rafay): the pack's own design,
 * no site nav or footer. One page, one action.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-pjs",
  display: "swap",
  // No metric matched Arial fallback: glyphs Jakarta lacks (the → arrows) fall
  // through to the pack's own system font stack, as in the source pages.
  adjustFontFallback: false,
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.claudemalaysia.com"),
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={jakarta.variable}>
      <body style={{ margin: 0 }}>
        {children}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${SITE_PIXEL_ID}');
fbq('init', '${AIDAY_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      </body>
    </html>
  );
}
