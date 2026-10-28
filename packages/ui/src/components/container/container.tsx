import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** `content` for page layouts, `reading` for long-form text. */
  width?: "content" | "reading";
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
}

export function Container({
  width = "content",
  as: Element = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Element
      className={cx(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        width === "content" ? "max-w-content" : "max-w-reading",
        className,
      )}
      {...props}
    />
  );
}
