import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

export interface SectionHeadingProps {
  title: ReactNode;
  /** Heading level. Pages should have exactly one level 1 heading. */
  level?: 1 | 2 | 3;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Optional trailing action, such as a "See all" link. */
  action?: ReactNode;
  id?: string;
  className?: string;
}

const titleSizes = {
  1: "text-display-xl",
  2: "text-display-lg",
  3: "text-display-md",
} as const;

export function SectionHeading({
  title,
  level = 2,
  eyebrow,
  description,
  action,
  id,
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-reading">
        {eyebrow ? <p className="mb-2 text-sm font-medium text-accent">{eyebrow}</p> : null}
        <Heading
          id={id}
          className={cx("font-display font-semibold tracking-tight", titleSizes[level])}
        >
          {title}
        </Heading>
        {description ? <p className="mt-3 text-lg text-text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
