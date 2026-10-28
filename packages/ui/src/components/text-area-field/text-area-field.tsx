"use client";

import { useId } from "react";
import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "../../lib/cx";

export interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> {
  label: string;
  hideLabel?: boolean;
  /** Help text under the label, linked with aria-describedby. */
  hint?: ReactNode;
  /** Ids of other elements that describe the field, such as a status message. */
  describedBy?: string;
  value: string;
  onValueChange?: (value: string) => void;
  /** Monospaced text for code and data. */
  mono?: boolean;
}

export function TextAreaField({
  label,
  hideLabel = false,
  hint,
  describedBy,
  value,
  onValueChange,
  mono = false,
  className,
  id,
  readOnly,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const describedByIds = [hint ? hintId : null, describedBy].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={cx("block font-medium", hideLabel && "sr-only")}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
      {/* Field border uses text-muted: the default border token is too faint for a control outline. */}
      <textarea
        id={fieldId}
        value={value}
        readOnly={readOnly}
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
        aria-describedby={describedByIds}
        className={cx(
          "mt-2 block w-full resize-y rounded-sm border border-text-muted px-3 py-2 text-text",
          "placeholder:text-text-muted aria-invalid:border-danger",
          readOnly ? "bg-surface-muted" : "bg-surface",
          mono && "font-mono text-sm leading-relaxed",
        )}
        {...props}
      />
    </div>
  );
}
