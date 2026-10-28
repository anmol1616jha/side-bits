/** Larger inputs are refused to keep typing and counting responsive. */
export const MAX_INPUT_CHARACTERS = 500_000;

/** Undo steps kept in memory. */
export const HISTORY_LIMIT = 50;

/** Average adult silent reading speed, words per minute. */
export const READING_WORDS_PER_MINUTE = 238;

/** Words kept lowercase in Title Case unless they start a line. */
export const TITLE_CASE_SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "the",
  "to",
  "via",
]);
