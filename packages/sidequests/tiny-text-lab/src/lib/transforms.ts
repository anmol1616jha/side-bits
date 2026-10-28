import { TITLE_CASE_SMALL_WORDS } from "../constants";

export type TransformGroup = "case" | "whitespace" | "lines";

export interface Transform {
  id: string;
  label: string;
  group: TransformGroup;
  apply: (text: string) => string;
}

const LINE_BREAK = /\r?\n/;
const WORD = /[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu;

const mapLines = (text: string, fn: (line: string) => string) =>
  text.split(LINE_BREAK).map(fn).join("\n");
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

function titleCase(text: string): string {
  return mapLines(text, (line) => {
    let index = 0;
    return line.toLowerCase().replace(WORD, (word) => {
      const isFirst = index++ === 0;
      return !isFirst && TITLE_CASE_SMALL_WORDS.has(word) ? word : capitalize(word);
    });
  });
}

function sentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(
      /(^|[.!?]\s+|\n\s*)(\p{L})/gu,
      (_, before: string, letter: string) => before + letter.toUpperCase(),
    )
    .replace(/(^|\s)i(?=['’\s.,!?;:]|$)/g, "$1I");
}

/** Splits identifiers and phrases into lowercase words: "helloWorld-again" → hello, world, again. */
function splitWords(line: string): string[] {
  return (
    line
      .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1 $2")
      .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2")
      .match(/[\p{L}\p{N}]+/gu) ?? []
  ).map((word) => word.toLowerCase());
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
      return text.split(LINE_BREAK).sort(collator.compare).join("\n");
    },
  },
  {
    id: "dedupe-lines",
    label: "Remove duplicates",
    group: "lines",
    apply: (text) => [...new Set(text.split(LINE_BREAK))].join("\n"),
  },
];

export const TRANSFORM_GROUPS: { id: TransformGroup; label: string }[] = [
  { id: "case", label: "Case" },
  { id: "whitespace", label: "Whitespace" },
  { id: "lines", label: "Lines" },
];
