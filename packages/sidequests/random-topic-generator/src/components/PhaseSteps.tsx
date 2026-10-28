import { Check } from "lucide-react";
import { cx } from "@side-bits/ui";
import type { Phase } from "../lib/session";

const STEPS = [
  { label: "Topic", phases: ["setup"] },
  { label: "Research", phases: ["research"] },
  { label: "Test", phases: ["ready", "test"] },
  { label: "Done", phases: ["done"] },
] as const satisfies readonly { label: string; phases: readonly Phase[] }[];

/** Where you are in the session. Purely a guide: steps aren't clickable. */
export function PhaseSteps({ phase }: { phase: Phase }) {
  const current = STEPS.findIndex((step) => (step.phases as readonly Phase[]).includes(phase));

  return (
    <ol aria-label="Progress" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      {STEPS.map((step, index) => {
        const complete = index < current || phase === "done";
        const active = index === current;
        return (
          <li
            key={step.label}
            aria-current={active ? "step" : undefined}
            className={cx(
              "flex items-center gap-1.5",
              active ? "font-semibold text-text" : "text-text-muted",
            )}
          >
            {index > 0 ? <span aria-hidden="true" className="mr-0.5 h-px w-4 bg-border" /> : null}
            <span
              aria-hidden="true"
              className={cx(
                "inline-flex size-5 items-center justify-center rounded-full border text-xs",
                complete
                  ? "border-green bg-green text-surface"
                  : active
                    ? "border-accent text-accent"
                    : "border-border",
              )}
            >
              {complete ? <Check className="size-3" strokeWidth={3} /> : index + 1}
            </span>
            {step.label}
            {complete ? <span className="sr-only"> (done)</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
