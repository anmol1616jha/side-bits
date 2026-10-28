"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cx } from "../../lib/cx";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  label: string;
  /** Hide the label visually while keeping it for assistive technology. */
  hideLabel?: boolean;
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchInput({
  label,
  hideLabel = false,
  value,
  onValueChange,
  className,
  id,
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={cx("mb-2 block font-medium", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-text-muted"
          strokeWidth={1.75}
        />
        {/* Field border uses text-muted: the default border token is too faint for a control outline. */}
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="min-h-11 w-full rounded-sm border border-text-muted bg-surface py-2 pr-11 pl-10 text-text placeholder:text-text-muted [&::-webkit-search-cancel-button]:hidden"
          {...props}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onValueChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-sm text-text-muted hover:bg-surface-muted hover:text-text"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
