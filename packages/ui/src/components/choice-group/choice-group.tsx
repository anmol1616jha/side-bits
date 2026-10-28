"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { chipClasses } from "../../lib/chip";
import { cx } from "../../lib/cx";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

export interface ChoiceGroupProps<T extends string> {
  legend: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hideLegend?: boolean;
  className?: string;
}

/**
 * Single choice from a few options, built on native radio buttons so arrow
 * keys, form semantics and screen readers work without custom code.
 */
export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  hideLegend = false,
  className,
}: ChoiceGroupProps<T>) {
  const name = useId();

  return (
    <fieldset className={className}>
      <legend className={cx("mb-2 text-sm font-medium", hideLegend && "sr-only")}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={chipClasses(
                selected,
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {selected ? <Check aria-hidden="true" className="size-4" strokeWidth={2.25} /> : null}
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
