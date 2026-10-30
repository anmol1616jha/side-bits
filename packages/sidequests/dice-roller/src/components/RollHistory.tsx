import { RotateCcw } from "lucide-react";
import { Button, cx } from "@side-bits/ui";
import { HISTORY_LIMIT } from "../constants";
import { describeValues } from "../lib/dice";
import { Pips } from "./Pips";
import type { RollResult } from "./RollReadout";

interface RollHistoryProps {
  history: readonly RollResult[];
  onClear: () => void;
  className?: string;
  /** Extra classes for the list, e.g. to let it scroll inside a fixed-height column. */
  listClassName?: string;
}

/** The last few rolls, newest first. New rows slide in at the top. */
export function RollHistory({ history, onClear, className, listClassName }: RollHistoryProps) {
  return (
    <section
      aria-labelledby="dice-history-heading"
      className={cx("gap-3 space-y-3 lg:space-y-0", className)}
    >
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h3 id="dice-history-heading" className="hud-label text-meta text-text-muted">
          Recent rolls
        </h3>
        {history.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <RotateCcw aria-hidden="true" className="size-4" strokeWidth={2} />
            Clear
          </Button>
        ) : null}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-text-muted">
          Your last {HISTORY_LIMIT} rolls will show up here.
        </p>
      ) : (
        <ol className={cx("space-y-2", listClassName)}>
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-sm border border-border bg-surface-muted/40 px-3 py-2 transition-[opacity,translate] duration-300 ease-out starting:-translate-y-2 starting:opacity-0"
            >
              <span className="w-10 shrink-0 hud-label text-meta text-text-muted">#{entry.id}</span>
              <span className="flex flex-wrap gap-1">
                {entry.values.map((value, index) => (
                  <Pips
                    key={index}
                    value={value}
                    className="size-6 rounded-[18%] border border-border bg-surface p-0.5"
                  />
                ))}
              </span>
              <span className="sr-only">
                {describeValues(entry.values)}, total {entry.summary.total}
              </span>
              <span aria-hidden="true" className="ml-auto font-mono font-semibold">
                {entry.summary.total}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
