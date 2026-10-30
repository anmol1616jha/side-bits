import { CULTURE, SOCIETY } from "../data/people";
import { DESCRIBING, IDEAS, MIND } from "../data/describing";
import { BODY, FOOD, HOME } from "../data/everyday";
import { ANIMALS, NATURE } from "../data/nature";
import { PLAY, SCIENCE, TRAVEL, WORK } from "../data/pursuits";
import { THEMES as THEME_SOURCES } from "../data/themes";
import type { GroupSource, PartOfSpeech } from "../data/types";

export type { PartOfSpeech } from "../data/types";

export const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;
export type Difficulty = (typeof DIFFICULTIES)[number]["value"];

export interface Word {
  /** Lower case, as stored. Displayed capitalised. */
  text: string;
  pos: PartOfSpeech;
  difficulty: Difficulty;
  category: string;
  group: string;
  /** Ids of the themes this word belongs to. */
  themes: readonly string[];
}

export interface Category {
  id: string;
  label: string;
  group: string;
  pos: PartOfSpeech;
  words: readonly Word[];
}

export interface Theme {
  id: string;
  label: string;
  words: readonly Word[];
}

export const GROUPS: readonly GroupSource[] = [
  NATURE,
  ANIMALS,
  FOOD,
  HOME,
  BODY,
  SOCIETY,
  CULTURE,
  SCIENCE,
  WORK,
  PLAY,
  TRAVEL,
  MIND,
  DESCRIBING,
  IDEAS,
];

const POS_SUFFIXES: Record<string, PartOfSpeech> = {
  n: "noun",
  v: "verb",
  a: "adjective",
  r: "adverb",
};

/** Splits a source list such as "fly:v ocean" into words and their parts of speech. */
export function parseList(list: string | undefined, fallback: PartOfSpeech) {
  return (list ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const [text, suffix] = token.split(":");
      return { text: text!, pos: (suffix && POS_SUFFIXES[suffix]) || fallback };
    });
}

function themesByWord(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const theme of THEME_SOURCES) {
    for (const { text } of parseList(theme.words, "noun")) {
      map.set(text, [...(map.get(text) ?? []), theme.id]);
    }
  }
  return map;
}

function build() {
  const themeIds = themesByWord();
  const categories: Category[] = [];
  for (const group of GROUPS) {
    for (const source of group.categories) {
      const words = DIFFICULTIES.flatMap(({ value: difficulty }) =>
        parseList(source[difficulty], source.pos).map(({ text, pos }): Word => ({
          text,
          pos,
          difficulty,
          category: source.id,
          group: group.id,
          themes: themeIds.get(text) ?? [],
        })),
      );
      categories.push({
        id: source.id,
        label: source.label,
        group: group.id,
        pos: source.pos,
        words,
      });
    }
  }
  const byText = new Map(categories.flatMap((category) => category.words).map((w) => [w.text, w]));
  // Theme words come from the categories; any a theme names but no category has are skipped (the tests flag them).
  const themes: Theme[] = THEME_SOURCES.map((source) => ({
    id: source.id,
    label: source.label,
    words: parseList(source.words, "noun").flatMap(({ text }) => byText.get(text) ?? []),
  }));
  return { categories, themes, byText };
}

const VOCABULARY = build();

export const CATEGORIES: readonly Category[] = VOCABULARY.categories;
export const THEMES: readonly Theme[] = VOCABULARY.themes;
export const WORDS: readonly Word[] = [...VOCABULARY.byText.values()];

export function findWord(text: string): Word | undefined {
  return VOCABULARY.byText.get(text);
}

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty.value === value);
}
