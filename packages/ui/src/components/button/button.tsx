import type { ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm border hud-label whitespace-nowrap " +
  "transition-[color,background-color,border-color,box-shadow] duration-(--motion-fast) disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-contrast hover:bg-accent/90 hover:shadow-[0_0_24px_-4px_var(--color-accent)]",
  secondary: "border-border bg-surface text-text hover:border-accent hover:bg-surface-muted",
  ghost: "border-transparent bg-transparent text-text hover:bg-surface-muted",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-5 text-sm",
};

/**
 * Button styling as a class string, so links (e.g. a framework `Link`) can look
 * like buttons without this package depending on a router.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cx(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
