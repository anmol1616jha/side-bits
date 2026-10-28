import type { ButtonHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { chipClasses } from "../../lib/chip";

export interface FilterChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed"
> {
  selected: boolean;
}

/** Toggle button for a filter. Selection is shown by a check mark as well as color. */
export function FilterChip({
  selected,
  className,
  children,
  type = "button",
  ...props
}: FilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={chipClasses(selected, className)}
      {...props}
    >
      {selected ? <Check aria-hidden="true" className="size-4" strokeWidth={2.25} /> : null}
      {children}
    </button>
  );
}
