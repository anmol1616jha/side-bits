import type { ReactNode } from "react";

/** Content available to assistive technology but not shown visually. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
