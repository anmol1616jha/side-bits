import { TITLE_CASE_SMALL_WORDS } from "../constants";

export type TransformGroup = "case" | "whitespace" | "lines";

export interface Transform {
  id: string;
  label: string;
  group: TransformGroup;
  apply: (text: string) => string;
}

/** Windows (\r\n), Unix (\n) and old Mac (\r) line breaks. */
const LINE_BREAK = /\r\n?|\n/;
const WORD = /[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu;

const mapLines = (text: string, fn: (line: string) => string) =>
  text.split(LINE_BREAK).map(fn).join("\n");
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/** Acronyms and names such as NASA, iPhone or JavaScript: a capital after the first letter. */
const hasInnerCapital = (word: string) => /\p{Lu}/u.test(word.slice(1));

/**
 * Lowercases a line but keeps acronyms and names as written. A line with no
 * lowercase letters at all is treated as shouting and lowercased entirely.
 */
function lowerKeepingNames(line: string): string {
  if (!/\p{Ll}/u.test(line)) return line.toLowerCase();
  return line.replace(WORD, (word) => (hasInnerCapital(word) ? word : word.toLowerCase()));
}

/** Abbreviations whose final dot does not end a sentence. */
const ABBREVIATIONS = new Set([
  "e.g",
  "i.e",
  "cf",
  "vs",
  "approx",
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
]);

function titleCase(text: string): string {
  return mapLines(text, (line) => {
    let index = 0;
    return lowerKeepingNames(line).replace(WORD, (word) => {
      const isFirst = index++ === 0;
      if (hasInnerCapital(word)) return word;
      return !isFirst && TITLE_CASE_SMALL_WORDS.has(word) ? word : capitalize(word);
    });
  });
}

function sentenceCase(text: string): string {
  return mapLines(text, lowerKeepingNames)
    .replace(
      /(^|[.!?]\s+|\n\s*)(\p{L}[\p{L}\p{M}\p{N}'’]*)/gu,
      (match, before: string, word: string, offset: number, whole: string) => {
        if (hasInnerCapital(word)) return match;
        if (before.startsWith(".")) {
          const previous = /[\p{L}.]+$/u.exec(whole.slice(0, offset))?.[0].toLowerCase();
          if (previous && ABBREVIATIONS.has(previous)) return match;
        }
        return before + capitalize(word);
      },
    )
    .replace(/(^|\s)i(?=['’\s,!?;:)]|\.(?!\p{L})|$)/gu, "$1I");
}

/** Applies `fn` to the lines, keeping a final line break where it was. */
function editLines(text: string, fn: (lines: string[]) => string[]): string {
  const lines = text.split(LINE_BREAK);
  const trailingBreak = lines.length > 1 && lines.at(-1) === "";
  if (trailingBreak) lines.pop();
  const result = fn(lines).join("\n");
  return trailingBreak ? `${result}\n` : result;
}

/** Splits identifiers and phrases into lowercase words: "helloWorld-again" → hello, world, again. */
function splitWords(line: string): string[] {
  return (
    (
      line
        // "don't" is one word, not "don" and "t".
        .replace(/(\p{L})['’](?=\p{L})/gu, "$1")
        .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1 $2")
        .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2")
        .match(/[\p{L}\p{N}]+/gu) ?? []
    ).map((word) => word.toLowerCase())
  );
}

function joinWords(text: string, join: (words: string[]) => string): string {
  return mapLines(text, (line) => join(splitWords(line)));
}

const isBlank = (line: string) => line.trim() === "";

export const TRANSFORMS: Transform[] = [
  { id: "upper", label: "UPPERCASE", group: "case", apply: (text) => text.toUpperCase() },
  { id: "lower", label: "lowercase", group: "case", apply: (text) => text.toLowerCase() },
  { id: "title", label: "Title Case", group: "case", apply: titleCase },
  { id: "sentence", label: "Sentence case", group: "case", apply: sentenceCase },
  {
    id: "camel",
    label: "camelCase",
    group: "case",
    apply: (text) =>
      joinWords(text, (words) =>
        words.map((word, i) => (i === 0 ? word : capitalize(word))).join(""),
      ),
  },
  {
    id: "snake",
    label: "snake_case",
    group: "case",
    apply: (text) => joinWords(text, (words) => words.join("_")),
  },
  {
    id: "kebab",
    label: "kebab-case",
    group: "case",
    apply: (text) => joinWords(text, (words) => words.join("-")),
  },
  {
    id: "trim-lines",
    label: "Trim lines",
    group: "whitespace",
    apply: (text) => mapLines(text, (line) => line.trim()),
  },
  {
    id: "collapse-spaces",
    label: "Collapse spaces",
    group: "whitespace",
    apply: (text) => text.replace(/[^\S\r\n]{2,}/g, " "),
  },
  {
    id: "remove-blank-lines",
    label: "Tidy blank lines",
    group: "whitespace",
    apply: (text) => {
      const lines = text.split(LINE_BREAK);
      const kept = lines.filter((line, i) => !isBlank(line) || (i > 0 && !isBlank(lines[i - 1]!)));
      while (kept.length > 0 && isBlank(kept[0]!)) kept.shift();
      while (kept.length > 0 && isBlank(kept.at(-1)!)) kept.pop();
      return kept.join("\n");
    },
  },
  {
    id: "join-lines",
    label: "Join lines",
    group: "lines",
    apply: (text) =>
      text
        .split(LINE_BREAK)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" "),
  },
  {
    id: "sort-lines",
    label: "Sort A–Z",
    group: "lines",
    apply: (text) => {
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
      // Blank lines go last rather than bunching up at the top.
      return editLines(text, (lines) =>
        lines.sort((a, b) => Number(isBlank(a)) - Number(isBlank(b)) || collator.compare(a, b)),
      );
    },
  },
  {
    id: "dedupe-lines",
    label: "Remove duplicates",
    group: "lines",
    // Blank lines are kept so paragraphs stay apart.
    apply: (text) =>
      editLines(text, (lines) => {
        const seen = new Set<string>();
        return lines.filter((line) => {
          if (isBlank(line)) return true;
          if (seen.has(line)) return false;
          seen.add(line);
          return true;
        });
      }),
  },
];

export const TRANSFORM_GROUPS: { id: TransformGroup; label: string }[] = [
  { id: "case", label: "Case" },
  { id: "whitespace", label: "Whitespace" },
  { id: "lines", label: "Lines" },
];
