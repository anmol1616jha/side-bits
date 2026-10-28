import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

export interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  /** Decorative icon. */
  icon?: ReactNode;
  action?: ReactNode;
  /** Use 1 when the empty state is the whole page (404, errors). */
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      className={cx(
        "flex flex-col items-center rounded-md border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="mb-4 text-text-muted">
          {icon}
        </span>
      ) : null}
      <Heading className="font-display text-display-md font-semibold">{title}</Heading>
      {description ? <p className="mt-2 max-w-md text-text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
