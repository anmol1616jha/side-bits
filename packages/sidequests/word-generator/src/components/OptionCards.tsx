import { useId } from "react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cx } from "@side-bits/ui";
import type { Tone } from "./looks";

export interface OptionCard<T extends string> {
  value: T;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}

interface OptionCardsProps<T extends string> {
  legend: string;
  options: readonly OptionCard<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Grid columns, e.g. "grid-cols-3". */
  className?: string;
}

/**
 * A single choice shown as compact cards. Native radios underneath, so arrow
 * keys and screen readers work as usual; each radio is named by its title
 * alone and described by the line under it.
 */
export function OptionCards<T extends string>({
  legend,
  options,
  value,
  onChange,
  className,
}: OptionCardsProps<T>) {
  const name = useId();

  return (
    <fieldset>
      <legend className="mb-2 hud-label text-meta text-text-muted">{legend}</legend>
      <div className={cx("grid gap-2", className)}>
        {options.map((option) => {
          const selected = option.value === value;
          const Icon = option.icon;
          const titleId = `${name}-${option.value}-title`;
          const descriptionId = `${name}-${option.value}-description`;
          return (
            <label
              key={option.value}
              className={cx(
                "flex cursor-pointer flex-col gap-0.5 rounded-md border px-3 py-2.5",
                "transition-[border-color,background-color,box-shadow,translate] duration-(--motion-base)",
                "hover:-translate-y-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                selected
                  ? option.tone.selected
                  : "border-border bg-surface hover:border-text-muted",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="sr-only"
              />
              <span className="flex items-center gap-2">
                <Icon
                  aria-hidden="true"
                  className={cx("size-4 shrink-0", selected ? option.tone.text : "text-text-muted")}
                  strokeWidth={2}
                />
                <span id={titleId} className="font-display font-semibold sm:whitespace-nowrap">
                  {option.label}
                </span>
              </span>
              {/* The tick sits on the description line, so selecting a card never rewraps its title. */}
              <span className="flex items-center justify-between gap-2">
                <span id={descriptionId} className="text-sm text-text-muted">
                  {option.description}
                </span>
                {selected ? (
                  <Check
                    aria-hidden="true"
                    className={cx("size-4 shrink-0", option.tone.text)}
                    strokeWidth={2.5}
                  />
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
