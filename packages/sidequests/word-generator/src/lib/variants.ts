/** Endings stripped when comparing words, longest first so "ily" wins over "y". */
const SUFFIXES = [
  "ation",
  "ness",
  "ment",
  "ing",
  "ers",
  "ies",
  "ied",
  "ily",
  "ful",
  "ity",
  "ism",
  "ist",
  "er",
  "ed",
  "es",
  "ly",
  "al",
  "ic",
  "y",
  "s",
  "e",
];

/** A rough stem: up to two common endings removed, never below three letters. */
export function stem(word: string): string {
  let result = word.toLowerCase();
  for (let pass = 0; pass < 2; pass++) {
    const suffix = SUFFIXES.find(
      (ending) => result.endsWith(ending) && result.length - ending.length >= 3,
    );
    if (!suffix) break;
    result = result.slice(0, -suffix.length);
  }
  return result;
}

/**
 * True when two words are the same word or a minor variation of it: plurals,
 * "friend" and "friendly", "happy" and "happily", "sorcery" and "sorcerer".
 * Compounds such as "rainbow" stay separate words. Errs on the side of
 * caution; an occasional false match only means a different word is picked.
 */
export function areVariants(a: string, b: string): boolean {
  return stem(a) === stem(b);
}
