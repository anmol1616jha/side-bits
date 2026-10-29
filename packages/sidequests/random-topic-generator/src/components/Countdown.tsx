import type { CSSProperties, ReactNode } from "react";
import { Coffee } from "lucide-react";
import { cx } from "@side-bits/ui";
import { formatClock } from "../lib/format";

interface CountdownProps {
  label: string;
  remainingMs: number;
  totalMs: number;
  /** Paused clocks turn grey and still; the badge says why. */
  paused?: boolean;
  /** Pulse the ring in the last 10 seconds. */
  pulseAtEnd?: boolean;
  badge?: ReactNode;
  size?: "lg" | "xl";
}

type Mood = "calm" | "low" | "critical" | "paused";

const MOOD_COLORS: Record<Mood, string> = {
  calm: "var(--color-accent)",
  low: "var(--color-warning)",
  critical: "var(--color-danger)",
  paused: "var(--color-text-muted)",
};

/** A faint blueprint grid behind the ring, fading out towards the edges. */
const GRID_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(color-mix(in oklab, var(--color-border) 45%, transparent) 1px, transparent 1px)," +
    "linear-gradient(90deg, color-mix(in oklab, var(--color-border) 45%, transparent) 1px, transparent 1px)",
  backgroundSize: "1rem 1rem",
  maskImage: "radial-gradient(circle, black 25%, transparent 68%)",
};

function moodFor(remainingMs: number, totalMs: number, paused: boolean): Mood {
  if (paused) return "paused";
  // The last few seconds go red; before that, the last tenth (at least 15 s) goes yellow.
  if (remainingMs <= Math.min(5_000, totalMs / 4)) return "critical";
  if (remainingMs <= Math.min(Math.max(totalMs * 0.1, 15_000), totalMs / 2)) return "low";
  return "calm";
}

/**
 * Big countdown ring with the time in the middle. `role="timer"` is not
 * announced on every change; the app announces the moments that matter instead.
 */
export function Countdown({
  label,
  remainingMs,
  totalMs,
  paused = false,
  pulseAtEnd = false,
  badge,
  size = "lg",
}: CountdownProps) {
  const left = totalMs > 0 ? Math.min(1, Math.max(0, remainingMs / totalMs)) : 0;
  const mood = moodFor(remainingMs, totalMs, paused);
  const color = MOOD_COLORS[mood];
  const pulsing = pulseAtEnd && !paused && remainingMs > 0 && remainingMs <= 10_000;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cx(
          "relative aspect-square",
          size === "xl" ? "w-[min(24rem,82vw)]" : "w-[min(18rem,76vw)]",
        )}
      >
        <div aria-hidden="true" className="absolute -inset-10" style={GRID_STYLE} />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full transition-[background] duration-500"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, ${color} 16%, transparent), transparent 70%)`,
          }}
        />
        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          focusable="false"
          className={cx("relative size-full -rotate-90", pulsing && "animate-pulse")}
        >
          <circle
            cx="60"
            cy="60"
            r="53"
            fill="none"
            strokeWidth="7"
            className="stroke-surface-muted"
          />
          {/* Sixty tick marks, like a clock face. */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            strokeWidth="2.5"
            pathLength={60}
            strokeDasharray="0.12 0.88"
            className="stroke-border"
          />
          <circle
            cx="60"
            cy="60"
            r="53"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100 - left * 100}
            className="transition-[stroke-dashoffset,stroke] duration-300 ease-linear"
            style={{ stroke: color, filter: `drop-shadow(0 0 3px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="hud-label text-meta text-text-muted">{label}</p>
          <p
            role="timer"
            aria-label={`${label}: ${formatClock(remainingMs)} left`}
            className={cx(
              "font-display font-semibold tracking-tight tabular-nums leading-none transition-colors duration-500",
              size === "xl"
                ? "text-[clamp(3.5rem,2.25rem+6vw,5.5rem)]"
                : "text-[clamp(2.75rem,2rem+4vw,4rem)]",
            )}
            style={mood === "calm" ? undefined : { color }}
          >
            {formatClock(remainingMs)}
          </p>
          {paused ? (
            <Coffee aria-hidden="true" className="mt-1 size-5 text-text-muted" strokeWidth={2} />
          ) : null}
        </div>
      </div>
      {badge}
    </div>
  );
}
