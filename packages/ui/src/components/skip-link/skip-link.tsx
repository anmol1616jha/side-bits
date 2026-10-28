import type { ReactNode } from "react";

export interface SkipLinkProps {
  /** Id of the main content element, without the leading `#`. */
  targetId: string;
  children?: ReactNode;
}

export function SkipLink({ targetId, children = "Skip to content" }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-3 focus:text-text focus:shadow"
    >
      {children}
    </a>
  );
}
