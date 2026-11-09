"use client";

import { useEffect, useState } from "react";
import { AIDAY_START_MS } from "@/lib/aiday/config";

type Parts = { d: number; h: number; m: number; s: number } | null;

function parts(): Parts {
  const d = Math.max(0, AIDAY_START_MS - Date.now());
  return { d: Math.floor(d / 864e5), h: Math.floor((d % 864e5) / 36e5), m: Math.floor((d % 36e5) / 6e4), s: Math.floor((d % 6e4) / 1e3) };
}

/** Four cell countdown to 10:00 MYT, Sun 15 Nov. Shows "--" until mounted (no hydration mismatch). */
export function Countdown() {
  const [p, setP] = useState<Parts>(null);
  useEffect(() => {
    const tick = () => setP(parts());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const v = (n: number | undefined) => (n == null ? "--" : String(n));
  return (
    <div className="cd" aria-label="Time until the AI day">
      <div><b className="cdd">{v(p?.d)}</b><span>Days</span></div>
      <div><b className="cdh">{v(p?.h)}</b><span>Hrs</span></div>
      <div><b className="cdm">{v(p?.m)}</b><span>Min</span></div>
      <div><b className="cds">{v(p?.s)}</b><span>Sec</span></div>
    </div>
  );
}
