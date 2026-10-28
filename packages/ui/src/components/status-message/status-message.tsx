import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cx } from "../../lib/cx";

export type StatusTone = "info" | "success" | "warning" | "danger";

export interface StatusMessageProps {
  tone?: StatusTone;
  children: ReactNode;
  /**
   * `polite` announces changes without interrupting; `assertive` is for errors
   * that block the user; `off` renders a static message.
   */
  live?: "polite" | "assertive" | "off";
  className?: string;
}

const toneStyles: Record<StatusTone, { className: string; Icon: typeof Info }> = {
  info: { className: "border-border text-text", Icon: Info },
  success: { className: "border-success text-success", Icon: CircleCheck },
  warning: { className: "border-warning text-warning", Icon: TriangleAlert },
  danger: { className: "border-danger text-danger", Icon: CircleAlert },
};

/** Inline message with an icon and text, so meaning never relies on color alone. */
export function StatusMessage({
  tone = "info",
  children,
  live = "polite",
  className,
}: StatusMessageProps) {
  const { className: toneClass, Icon } = toneStyles[tone];
  const role = live === "assertive" ? "alert" : live === "polite" ? "status" : undefined;

  return (
    <div
      role={role}
      className={cx(
        "flex items-start gap-2 rounded-sm border bg-surface px-3 py-2",
        toneClass,
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
      <div className="text-text">{children}</div>
    </div>
  );
}
