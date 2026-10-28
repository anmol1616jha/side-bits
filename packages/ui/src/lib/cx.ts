/** Joins class names, skipping falsy values. Does not resolve Tailwind conflicts. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
