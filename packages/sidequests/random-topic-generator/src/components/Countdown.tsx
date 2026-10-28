import type { ReactNode } from "react";
import { cx } from "@side-bits/ui";
import { formatClock } from "../lib/format";

interface CountdownProps {
  label: string;
  remainingMs: number;
  totalMs: number;
  /** Paused clocks dim and stop the bar's accent colour; the badge says why. */
  paused?: boolean;
  badge?: ReactNode;
  size?: "lg" | "xl";
}

/**
 * Big countdown with a progress bar. `role="timer"` is not announced on every
 * change; the app announces the moments that matter instead.
 */
export function Countdown({
  label,
  remainingMs,
  totalMs,
  paused = false,
  badge,
  size = "lg",
}: CountdownProps) {
  const progress = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 1;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        {badge}
      </div>
      <p
        role="timer"
        aria-label={`${label}: ${formatClock(remainingMs)} left`}
        className={cx(
          "font-display font-semibold tracking-tight tabular-nums leading-none",
          size === "xl"
            ? "text-[clamp(4.5rem,3rem+8vw,8rem)]"
            : "text-[clamp(3.5rem,2.5rem+5vw,6rem)]",
          paused && "text-text-muted",
        )}
      >
        {formatClock(remainingMs)}
      </p>
      <div aria-hidden="true" className="h-2 overflow-hidden rounded-sm bg-surface-muted">
        <div
          className={cx(
            "h-full rounded-sm transition-[width] duration-(--motion-slow) ease-linear",
            paused ? "bg-text-muted" : "bg-accent",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
