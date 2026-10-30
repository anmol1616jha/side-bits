import { Fragment } from "react";
import type { DieValue, RollSummary } from "../lib/dice";

export interface RollResult {
  /** Counts up from 1, so each roll gets a fresh key and its own number in the history. */
  id: number;
  values: DieValue[];
  summary: RollSummary;
}

interface RollReadoutProps {
  result: RollResult | null;
  rolling: boolean;
}

/**
 * The numbers under the dice. Each part pops in a beat after the last; the
 * screen reader announcement comes from the app's live region instead.
 */
export function RollReadout({ result, rolling }: RollReadoutProps) {
  return (
    // A fixed height, so the card doesn't change size between rolls or dice counts.
    <div className="flex h-48 flex-col items-center justify-center text-center lg:h-48 lg:rounded-md lg:border lg:border-border lg:bg-surface-muted/40 lg:p-3">
      {rolling ? (
        <p className="hud-label text-meta text-text-muted motion-safe:animate-pulse">Rolling…</p>
      ) : result ? (
        <ResultParts key={result.id} result={result} />
      ) : (
        <p className="text-text-muted">Pick how many dice, then roll.</p>
      )}
    </div>
  );
}

const POP =
  "transition-[opacity,scale,translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]";

/** The faces on top, then the total, then a line kept free for the callout. */
function ResultParts({ result }: { result: RollResult }) {
  const { values, summary } = result;
  const totalDelay = values.length > 1 ? values.length * 60 + 80 : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      {values.length > 1 ? (
        <p className="flex items-center justify-center gap-1.5 font-mono text-text-muted">
          {values.map((value, index) => (
            <Fragment key={index}>
              {index > 0 ? <span aria-hidden="true">+</span> : null}
              <span
                className={`inline-grid size-8 place-items-center rounded-sm border border-border bg-surface-muted font-semibold text-text ${POP} starting:scale-50 starting:opacity-0`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {value}
              </span>
            </Fragment>
          ))}
        </p>
      ) : null}
      <div className="flex flex-col items-center">
        <p className="hud-label text-meta text-text-muted">
          {values.length > 1 ? "Total" : "You rolled"}
        </p>
        <p
          className={`font-display text-display-xl font-semibold text-accent ${POP} starting:scale-50 starting:opacity-0`}
          style={{ transitionDelay: `${totalDelay}ms` }}
        >
          {summary.total}
        </p>
      </div>
      <div className="flex h-7 items-center">
        {summary.callout ? (
          <p
            className={`rounded-sm border border-warning bg-warning/10 px-3 py-0.5 hud-label text-sm text-warning ${POP} starting:translate-y-2 starting:opacity-0`}
            style={{ transitionDelay: `${totalDelay + 150}ms` }}
          >
            {summary.callout}
          </p>
        ) : null}
      </div>
    </div>
  );
}
