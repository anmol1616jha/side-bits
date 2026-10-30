import { useId } from "react";
import { cx } from "@side-bits/ui";
import { MAX_WORDS, MIN_WORDS } from "../constants";

const COUNTS = Array.from({ length: MAX_WORDS - MIN_WORDS + 1 }, (_, index) => MIN_WORDS + index);

interface CountPickerProps {
  value: number;
  onChange: (count: number) => void;
}

/** How many words, as a row of numbered tiles. Native radios underneath. */
export function CountPicker({ value, onChange }: CountPickerProps) {
  const name = useId();

  return (
    <fieldset>
      <legend className="mb-2 hud-label text-meta text-text-muted">How many words?</legend>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 lg:gap-1.5">
        {COUNTS.map((count) => {
          const selected = count === value;
          return (
            <label
              key={count}
              className={cx(
                "flex h-10 cursor-pointer items-center justify-center rounded-md border font-display font-semibold",
                "transition-[border-color,background-color,box-shadow,translate] duration-(--motion-base)",
                "hover:-translate-y-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                selected
                  ? "border-accent bg-accent/10 text-accent shadow-[0_0_24px_-10px_var(--color-accent)]"
                  : "border-border bg-surface hover:border-text-muted",
              )}
            >
              <input
                type="radio"
                name={name}
                value={count}
                checked={selected}
                onChange={() => onChange(count)}
                aria-label={count === 1 ? "1 word" : `${count} words`}
                className="sr-only"
              />
              <span aria-hidden="true">{count}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
