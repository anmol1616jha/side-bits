/** Inputs larger than this are refused to keep the page responsive. */
export const MAX_INPUT_CHARACTERS = 1_000_000;

/** Characters of context shown either side of an error in the snippet. */
export const ERROR_SNIPPET_RADIUS = 40;

export const INDENT_OPTIONS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" },
  { value: "minify", label: "Minified" },
] as const;

export type IndentStyle = (typeof INDENT_OPTIONS)[number]["value"];

export const EXAMPLE_INPUT = `{
  // Paste your own JSON here. This example has a few common mistakes.
  name: 'Side-bits',
  "tags": ["tools", "toys",],
  "launched": True,
  "visitors": 12345678901234567890,
}`;
