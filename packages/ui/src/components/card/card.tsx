import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section" | "li";
}

export function Card({ as: Element = "div", className, ...props }: CardProps) {
  return (
    <Element
      className={cx("rounded-md border border-border bg-surface text-text", className)}
      {...props}
    />
  );
}
