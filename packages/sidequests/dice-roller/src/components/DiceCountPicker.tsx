import { useId } from "react";
import { cx } from "@side-bits/ui";
import { MAX_DICE, MIN_DICE } from "../constants";
import type { DieValue } from "../lib/dice";
import { Pips } from "./Pips";

const COUNTS = Array.from({ length: MAX_DICE - MIN_DICE + 1 }, (_, index) => MIN_DICE + index);

interface DiceCountPickerProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * How many dice to roll, as a row of cards each showing that many pips.
 * Native radios underneath, so arrow keys and screen readers work as usual.
 */
export function DiceCountPicker({
  value,
  onChange,
  disabled = false,
  className,
}: DiceCountPickerProps) {
  const name = useId();

  return (
    <fieldset disabled={disabled} className={className}>
      <legend className="mb-3 hud-label text-meta text-text-muted">How many dice?</legend>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {COUNTS.map((count) => {
          const selected = count === value;
          return (
            <label
              key={count}
              className={cx(
                "flex cursor-pointer flex-col items-center gap-2 rounded-md border px-1 py-3 lg:flex-row lg:justify-center lg:gap-3 lg:py-2",
                "transition-[border-color,background-color,box-shadow,translate] duration-(--motion-base)",
                "hover:-translate-y-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:hover:translate-y-0",
                selected
                  ? "border-accent bg-accent/10 shadow-[0_0_32px_-12px_var(--color-accent)]"
                  : "border-border bg-surface hover:border-text-muted",
              )}
            >
              <input
                type="radio"
                name={name}
                value={count}
                checked={selected}
                onChange={() => onChange(count)}
                aria-label={count === 1 ? "1 die" : `${count} dice`}
                className="sr-only"
              />
              <Pips
                value={count as DieValue}
                pipClassName={selected ? "bg-accent" : "bg-text-muted"}
                className={cx(
                  "size-8 rounded-[18%] border p-1 transition-[border-color,rotate,scale] duration-(--motion-slow)",
                  selected ? "-rotate-12 scale-110 border-accent" : "border-border",
                )}
              />
              <span aria-hidden="true" className="font-display text-lg font-semibold">
                {count}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
