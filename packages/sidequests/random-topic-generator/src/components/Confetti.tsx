import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

const COLORS = [
  "var(--color-accent)",
  "var(--color-green)",
  "var(--color-yellow)",
  "var(--color-focus)",
];
const PIECES = 40;

/**
 * One burst of confetti when it mounts. Decorative and hidden from screen
 * readers; skipped when reduced motion is preferred or Web Animations is missing.
 */
export function Confetti() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = container.current;
    if (!host || prefersReducedMotion() || typeof host.animate !== "function") return;

    const pieces: HTMLSpanElement[] = [];
    for (let index = 0; index < PIECES; index++) {
      const piece = document.createElement("span");
      const width = 6 + Math.random() * 6;
      Object.assign(piece.style, {
        position: "absolute",
        top: "35%",
        left: "50%",
        width: `${width}px`,
        height: `${width * 0.45}px`,
        borderRadius: "1px",
        background: COLORS[index % COLORS.length],
      });
      host.append(piece);
      pieces.push(piece);

      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 220;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * 0.6 - 80;
      const spin = (Math.random() - 0.5) * 1080;
      piece
        .animate(
          [
            { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${spin / 2}deg)`,
              opacity: 1,
              offset: 0.55,
            },
            {
              transform: `translate(calc(-50% + ${x * 1.1}px), calc(-50% + ${y + 220}px)) rotate(${spin}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 1400 + Math.random() * 900,
            delay: Math.random() * 120,
            easing: "cubic-bezier(0.2, 0.7, 0.3, 1)",
            fill: "forwards",
          },
        )
        .finished.then(
          () => piece.remove(),
          () => {},
        );
    }
    return () => {
      for (const piece of pieces) piece.remove();
    };
  }, []);

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
