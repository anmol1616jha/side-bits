import { cx } from "./cx";

/** Shared look for selectable chips (FilterChip, ChoiceGroup options). */
export function chipClasses(selected: boolean, className?: string): string {
  return cx(
    "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-sm border px-3.5 font-mono text-meta font-medium uppercase tracking-wider",
    "transition-colors duration-(--motion-fast)",
    selected
      ? "border-accent bg-accent text-accent-contrast"
      : "border-text-muted bg-surface text-text hover:bg-surface-muted",
    className,
  );
}
