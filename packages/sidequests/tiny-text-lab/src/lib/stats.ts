import { READING_WORDS_PER_MINUTE } from "../constants";

export interface TextStats {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingMinutes: number;
}

const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
const wordSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : null;

/** User-perceived characters: "é", "👍🏽" and "🇬🇧" each count as one. */
function graphemes(text: string): string[] {
  if (graphemeSegmenter) return Array.from(graphemeSegmenter.segment(text), (part) => part.segment);
  return Array.from(text);
}

function countWords(text: string): number {
  if (wordSegmenter) {
    let count = 0;
    for (const part of wordSegmenter.segment(text)) if (part.isWordLike) count++;
    return count;
  }
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

const LINE_BREAK = /\r\n?|\n/;
const TRAILING_LINE_BREAK = /(?:\r\n?|\n)$/;
const PARAGRAPH_BREAK = /(?:\r\n?|\n)\s*(?:\r\n?|\n)/;

export function computeStats(text: string): TextStats {
  const characters = graphemes(text);
  const words = countWords(text);
  return {
    characters: characters.length,
    charactersWithoutSpaces: characters.filter((char) => !/^\s+$/u.test(char)).length,
    words,
    // A final line break ends the last line; it doesn't start a new one.
    lines: text === "" ? 0 : text.replace(TRAILING_LINE_BREAK, "").split(LINE_BREAK).length,
    paragraphs: text.split(PARAGRAPH_BREAK).filter((block) => block.trim() !== "").length,
    readingMinutes: words / READING_WORDS_PER_MINUTE,
  };
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return "—";
  if (minutes < 1) return "under a minute";
  const rounded = Math.round(minutes);
  return `about ${rounded} min`;
}
