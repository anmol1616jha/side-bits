import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { cx } from "../../lib/cx";
import { Container } from "../container/container";

export interface ProjectShellProps {
  title: string;
  /** "What this does": one short paragraph. */
  summary: string;
  instructions: string[];
  /** Plain statement of what happens to the user's data. */
  dataHandling: string;
  /** Status badge, tags or other metadata shown under the title. */
  meta?: ReactNode;
  /** Breadcrumb or back link shown above the title. */
  breadcrumb?: ReactNode;
  /**
   * `sidebar` puts "How to use it" beside the project on wide screens. `wide`
   * gives the project the full width and puts the steps underneath, for tools
   * that need their own side-by-side layout.
   */
  layout?: "sidebar" | "wide";
  /** The project itself. */
  children: ReactNode;
}

/**
 * Frame for a single project page. Owns the title, guidance and data notice so
 * every project explains itself the same way; the project owns everything
 * inside `children`.
 */
export function ProjectShell({
  title,
  summary,
  instructions,
  dataHandling,
  meta,
  breadcrumb,
  layout = "sidebar",
  children,
}: ProjectShellProps) {
  return (
    <Container className="py-10 sm:py-14">
      <header className="max-w-reading">
        {breadcrumb ? <div className="mb-4">{breadcrumb}</div> : null}
        <h1 className="font-display text-display-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-lg text-text-muted">{summary}</p>
        {meta ? <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div> : null}
        <p className="mt-4 flex items-start gap-2 text-sm text-text-muted">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-green"
            strokeWidth={2}
          />
          <span>{dataHandling}</span>
        </p>
      </header>

      <div
        className={cx(
          "mt-10 grid grid-cols-[minmax(0,1fr)] gap-10",
          layout === "sidebar" && "lg:grid-cols-[minmax(0,1fr)_18rem]",
        )}
      >
        <div className="min-w-0">{children}</div>
        <aside
          aria-labelledby="project-how-to"
          className={cx(layout === "wide" && "max-w-reading")}
        >
          <h2 id="project-how-to" className="font-display text-xl font-semibold">
            How to use it
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-text-muted marker:text-text">
            {instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </aside>
      </div>
    </Container>
  );
}
