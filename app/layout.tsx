import type { Metadata } from "next";
import { Montserrat, Lora, IBM_Plex_Mono } from "next/font/google";
import "./_styles/brand.css";
import Script from "next/script";

/*
 * Run It From Your Phone (free AI day, 15 Nov 2026). Served at
 * www.claudemalaysia.com/aiday: the main site rewrites /aiday/* to this app,
 * which runs with basePath "/aiday". Styled to the Claude Malaysia brand
 * (claudemalaysia.com/brand, rules in BRAND_SYSTEM.md). No site nav or footer.
 * One page, one action.
 */
// Claude Malaysia brand type (claudemalaysia.com/brand): Montserrat Bold caps
// for display, Lora for reading and UI, IBM Plex Mono for labels and numbers.
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-montserrat", display: "swap" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-lora", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

// Same Meta Pixel as claudemalaysia.com, so AI Day ad traffic keeps tracking.
const FB_PIXEL_ID = "3618851711751697";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.claudemalaysia.com"),
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={`${montserrat.variable} ${lora.variable} ${plexMono.variable}`}>
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
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      </body>
    </html>
  );
}
