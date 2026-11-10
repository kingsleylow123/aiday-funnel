import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Montserrat } from "next/font/google";
import "../_styles/program.css";

/*
 * Fonts for the AI Day Program pages only (claudemalaysia.com brand).
 * Scoped here so the root layout stays untouched. Once the brand-redesign
 * branch loads these fonts site wide, this file can drop them.
 */
const display = Montserrat({ subsets: ["latin"], weight: ["700"], variable: "--font-cm-display", display: "swap" });
const body = Lora({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal"], variable: "--font-cm-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cm-mono", display: "swap" });

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>;
}
