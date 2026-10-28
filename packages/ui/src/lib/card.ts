import { cx } from "./cx";

/**
 * Shared look for clickable cards (ProjectCard, collection cards). Cards use a
 * stretched link, so the focus ring is drawn on the card when that link has focus.
 */
export function cardClasses(...extra: Array<string | false | null | undefined>): string {
  return cx(
    "group hud-frame flex h-full flex-col rounded-md border border-border bg-surface/80 backdrop-blur-sm",
    "transition-[border-color,box-shadow] duration-(--motion-base) hover:border-accent/60 hover:shadow-[0_0_32px_-12px_var(--color-accent)]",
    "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
    ...extra,
  );
}
