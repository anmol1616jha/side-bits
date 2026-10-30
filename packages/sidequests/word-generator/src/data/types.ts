export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb";

/**
 * One category of closely related words, written as space-separated lists per
 * difficulty so the data stays easy to read and edit. A word takes the
 * category's part of speech unless it carries a suffix: `fly:v`, `rich:a`,
 * `quickly:r` (adverb) or `glow:n`.
 *
 * Difficulty is about familiarity, not length or spelling:
 * - easy: everyday words almost everyone knows.
 * - medium: words people recognise but don't use every day.
 * - hard: advanced vocabulary, still real words a keen reader would meet.
 */
export interface CategorySource {
  id: string;
  label: string;
  pos: PartOfSpeech;
  easy?: string;
  medium?: string;
  hard?: string;
}

/** A broad area such as nature or food. "Unrelated" lists draw each word from a different group. */
export interface GroupSource {
  id: string;
  label: string;
  categories: CategorySource[];
}

/**
 * A scene that links words across categories, e.g. a day at the seaside
 * ties ocean, holiday, camera and sunset. Powers "Somewhat related".
 */
export interface ThemeSource {
  id: string;
  label: string;
  words: string;
}
