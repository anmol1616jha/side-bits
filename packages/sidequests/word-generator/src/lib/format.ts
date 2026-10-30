import type { Word } from "./vocabulary";

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The list as copied and announced: "Ocean, River, Lake". */
export function listText(words: readonly Word[]): string {
  return words.map((word) => capitalize(word.text)).join(", ");
}

/** "Only 7 words matched your selected criteria." */
export function shortfallNote(found: number): string {
  return `Only ${found} ${found === 1 ? "word" : "words"} matched your selected criteria.`;
}
