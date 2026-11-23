"use client";

import { useState } from "react";

const LEVELS: [number, string, string][] = [
  [1, "Watcher", "You don't use AI yet."],
  [2, "Asker", "You chat with AI, then do the work by hand."],
  [3, "Amplifier", "AI makes today's job faster."],
  [4, "Builder", "You build pages and systems with AI."],
  [5, "Power CEO", "Your business runs from your phone."],
];

const ANSWER: Record<number, [string, string]> = {
  1: ["Level 1 → 2", "Kingsley's session at 7pm starts from zero and gets your first AI helper working."],
  2: ["Level 2 → 3", "Kingsley's session at 7pm turns your questions into an AI helper that does the work."],
  3: ["Level 3 → 4", "Alaric's session at 7:45pm makes AI sell for you: offer, ad and follow ups."],
  4: ["Level 4 → 5", "Rafay's session at 8:30pm shows the last step: the whole business on your phone."],
  5: ["Level 5", "Come for Rafay's session at 8:30pm and the live Q&A at 9:15pm. Compare notes with all three of us."],
};

export function Levels() {
  const [lvl, setLvl] = useState(2);
  const [title, text] = ANSWER[lvl];
  return (
    <>
      <div className="lvls" role="group" aria-label="Choose your AI level">
        {LEVELS.map(([n, name, desc]) => (
          <button key={n} type="button" className="lvl" data-l={n} aria-pressed={lvl === n} onClick={() => setLvl(n)}>
            <span className="n">{n}</span>
            <b>{name}</b>
            <span>{desc}</span>
          </button>
        ))}
      </div>
      <p className="lvlans" aria-live="polite"><b id="aT">{title}</b><span id="aP">{text}</span></p>
    </>
  );
}
