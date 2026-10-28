"use client";

import type { MouseEvent } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Scrolls smoothly to the top without adding "#top" to the URL. The href is
 * the no-JavaScript fallback: browsers treat "#top" as the start of the page.
 */
export function BackToTopLink({ className }: { className?: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Keyboard and screen reader users continue from the page content, not the footer.
    document.querySelector("main")?.focus({ preventScroll: true });
  }

  return (
    <a href="#top" onClick={handleClick} className={className}>
      <ArrowUp aria-hidden="true" className="size-4" strokeWidth={2} />
      Back to top
    </a>
  );
}
