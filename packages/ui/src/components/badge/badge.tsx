import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

export type BadgeTone = "neutral" | "warning";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-muted text-text",
  warning: "border-warning text-warning bg-transparent",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Optional decorative icon. The text must carry the meaning on its own. */
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, tone = "neutral", icon, className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-meta font-medium",
        tones[tone],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
