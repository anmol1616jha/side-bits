import { BookOpen, Check, Dices, Mic, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cx } from "@side-bits/ui";
import type { Phase } from "../lib/session";

const STEPS = [
  { label: "Topic", icon: Dices, phases: ["setup"] },
  { label: "Research", icon: BookOpen, phases: ["research"] },
  { label: "Test", icon: Mic, phases: ["ready", "test"] },
  { label: "Done", icon: Trophy, phases: ["done"] },
] as const satisfies readonly { label: string; icon: LucideIcon; phases: readonly Phase[] }[];

/** Where you are in the session, as a track that fills in. Purely a guide: steps aren't clickable. */
export function PhaseSteps({ phase, className }: { phase: Phase; className?: string }) {
  const current = STEPS.findIndex((step) => (step.phases as readonly Phase[]).includes(phase));

  return (
    <ol aria-label="Progress" className={cx("grid grid-cols-4 gap-1.5", className)}>
      {STEPS.map((step, index) => {
        const complete = index < current || phase === "done";
        const active = index === current;
        const Icon = complete ? Check : step.icon;
        return (
          <li
            key={step.label}
            aria-current={active ? "step" : undefined}
            className="flex flex-col gap-2"
          >
            <span
              aria-hidden="true"
              className={cx(
                "h-1.5 rounded-sm transition-[background-color,box-shadow] duration-500",
                complete
                  ? "bg-green"
                  : active
                    ? "bg-accent shadow-[0_0_12px_-2px_var(--color-accent)]"
                    : "bg-surface-muted",
              )}
            />
            <span
              className={cx(
                "flex items-center gap-1.5 hud-label text-meta",
                complete ? "text-green" : active ? "text-text" : "text-text-muted",
              )}
            >
              <Icon aria-hidden="true" className="hidden size-3.5 sm:inline" strokeWidth={2.25} />
              {step.label}
              {complete ? <span className="sr-only"> (done)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
