"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/aiday/client";

/**
 * The summit page's page wide behaviours, ported from the pack's scripts:
 * 1. Once someone has scrolled past the top form, every seat button takes
 *    them DOWN to the bottom form, never back up.
 * 2. Phones: hide the bottom bar while a form is on screen.
 * Plus first landing attribution and the page_view event.
 */
export function SummitBehaviors() {
  useEffect(() => {
    captureAttribution();
    track("page_view", { props: { page: "summit" } });

    const top = document.getElementById("register");
    const bot = document.getElementById("join");
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.aid-summit a[href="#register"], .aid-summit a[href="#join"]'));
    const onClick = (e: MouseEvent) => {
      if (!top || !bot) return;
      const a = e.currentTarget as HTMLAnchorElement;
      const past = top.getBoundingClientRect().bottom < 0;
      const t = a.getAttribute("href") === "#join" || past ? bot : top;
      e.preventDefault();
      t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      const i = t.querySelector<HTMLInputElement>("input[type=text]");
      if (i) setTimeout(() => i.focus({ preventScroll: true }), 500);
    };
    links.forEach((a) => a.addEventListener("click", onClick));

    let io: IntersectionObserver | null = null;
    const bar = document.querySelector(".aid-summit .sticky");
    if (bar && "IntersectionObserver" in window) {
      const on = new Set<Element>();
      io = new IntersectionObserver(
        (es) => {
          es.forEach((en) => (en.isIntersecting ? on.add(en.target) : on.delete(en.target)));
          bar.classList.toggle("off", on.size > 0);
        },
        { threshold: 0.15 },
      );
      document.querySelectorAll(".aid-summit .form").forEach((el) => io!.observe(el));
    }

    return () => {
      links.forEach((a) => a.removeEventListener("click", onClick));
      io?.disconnect();
    };
  }, []);
  return null;
}
