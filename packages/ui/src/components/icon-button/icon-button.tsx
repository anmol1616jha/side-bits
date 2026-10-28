import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  icon: ReactNode;
}

export function IconButton({ label, icon, className, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex size-11 items-center justify-center rounded-sm border border-border bg-surface text-text",
        "transition-colors duration-(--motion-fast) hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  );
}
