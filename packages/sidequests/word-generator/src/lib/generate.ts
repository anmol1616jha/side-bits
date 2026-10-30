import { MAX_WORDS, MIN_WORDS } from "../constants";
import { linkFreshness, wordFreshness } from "./memory";
import type { Memory } from "./memory";
import { areVariants } from "./variants";
import { CATEGORIES, GROUPS, THEMES } from "./vocabulary";
import type { Category, Difficulty, PartOfSpeech, Theme, Word } from "./vocabulary";

export const ASSOCIATIONS = [
  { value: "close", label: "Closely related" },
  { value: "some", label: "Somewhat related" },
  { value: "loose", label: "Loosely related" },
  { value: "none", label: "Unrelated" },
] as const;
export type Association = (typeof ASSOCIATIONS)[number]["value"];

export interface Settings {
  difficulty: Difficulty;
  count: number;
  association: Association;
}

/** What ties a closely or somewhat related list together. */
export interface Link {
  kind: "category" | "theme";
  id: string;
  label: string;
}

export interface WordList {
  settings: Settings;
  words: Word[];
  link: Link | null;
}

type Random = () => number;

export function isAssociation(value: unknown): value is Association {
  return ASSOCIATIONS.some((association) => association.value === value);
}

export function clampCount(count: number): number {
  return Math.min(MAX_WORDS, Math.max(MIN_WORDS, Math.round(count) || MIN_WORDS));
}

/** One item, chosen with probability proportional to its weight. Undefined if nothing has weight. */
export function pickWeighted<T>(
  items: readonly T[],
  weight: (item: T) => number,
  random: Random,
): T | undefined {
  const weights = items.map((item) => Math.max(0, weight(item)));
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return undefined;
  let roll = random() * total;
  let last: T | undefined;
  for (const [index, item] of items.entries()) {
    if (weights[index]! <= 0) continue;
    last = item;
    roll -= weights[index]!;
    if (roll < 0) return item;
  }
  return last;
}

/** Not the same word as, or a variation of, anything already picked. */
function fits(word: Word, picked: readonly Word[]): boolean {
  return !picked.some((other) => areVariants(other.text, word.text));
}

function countWhere<T>(items: readonly T[], test: (item: T) => boolean): number {
  return items.reduce((count, item) => count + (test(item) ? 1 : 0), 0);
}

/**
 * Keeps a mix of word types. Nouns make up most of the vocabulary and read
 * fine together; verbs, adjectives and adverbs get a nudge in, but not two of
 * the same kind in a row too often.
 */
function posWeight(pos: PartOfSpeech, picked: readonly Word[]): number {
  const same = countWhere(picked, (word) => word.pos === pos);
  return pos === "noun" ? 1 / (1 + 0.3 * same) : 1.6 / (1 + same);
}

const GROUP_SIZES = new Map(GROUPS.map((group) => [group.id, group.categories.length]));
/** Evens out groups with many categories, so every broad area is about as likely. */
const groupShare = (category: Category) => 1 / GROUP_SIZES.get(category.group)!;

const sharesTheme = (word: Word, picked: readonly Word[]) =>
  picked.some((other) => other.themes.some((theme) => word.themes.includes(theme)));

function candidates(
  words: readonly Word[],
  difficulty: Difficulty,
  picked: readonly Word[],
  exclude: ReadonlySet<string>,
): Word[] {
  return words.filter(
    (word) => word.difficulty === difficulty && !exclude.has(word.text) && fits(word, picked),
  );
}

/**
 * The category or theme a related list is built around. Prefers ones with
 * enough words at this difficulty for the whole list, and ones not used
 * lately. If none has enough, takes the fullest, and the list comes up short
 * rather than borrowing words from another level.
 */
function chooseLink<T extends Category | Theme>(
  links: readonly T[],
  settings: Settings,
  memory: Memory,
  random: Random,
): T | undefined {
  const sized = links
    .map((link) => ({
      link,
      size: candidates(link.words, settings.difficulty, [], new Set()).length,
    }))
    .filter(({ size }) => size > 0);
  const largest = Math.max(0, ...sized.map(({ size }) => size));
  const enough = sized.filter(({ size }) => size >= settings.count);
  const pool = enough.length > 0 ? enough : sized.filter(({ size }) => size === largest);
  return pickWeighted(pool, ({ link }) => linkFreshness(memory, link.id), random)?.link;
}

/** Weight for the next word of a related list: fresh words first, and in a theme, spread across categories. */
function relatedWeight(kind: Link["kind"], memory: Memory) {
  return (word: Word, picked: readonly Word[]) => {
    const fresh = wordFreshness(memory, word.text);
    if (kind === "category") return fresh;
    const sameCategory = countWhere(picked, (other) => other.category === word.category);
    return fresh * 0.2 ** sameCategory * posWeight(word.pos, picked);
  };
}

/**
 * Loosely related: each word either leans on one already picked (same broad
 * area or a shared theme) or, a bit less often, comes from somewhere new.
 * Never two from one category, at most two from one broad area.
 */
function nextLoose(
  picked: readonly Word[],
  settings: Settings,
  memory: Memory,
  random: Random,
  exclude: ReadonlySet<string>,
): Word | undefined {
  const near = picked.length > 0 && random() < 0.6;
  const options = CATEGORIES.filter(
    (category) =>
      !picked.some((word) => word.category === category.id) &&
      countWhere(picked, (word) => word.group === category.group) < 2,
  ).map((category) => ({
    category,
    words: candidates(category.words, settings.difficulty, picked, exclude),
  }));
  const isNear = (category: Category, words: readonly Word[]) =>
    picked.some((word) => word.group === category.group) ||
    words.some((word) => sharesTheme(word, picked));

  const chosen = pickWeighted(
    options,
    ({ category, words }) => {
      if (words.length === 0) return 0;
      const closeness = picked.length === 0 || near === isNear(category, words) ? 1 : 0.1;
      return closeness * groupShare(category) * posWeight(category.pos, picked);
    },
    random,
  );
  if (!chosen) return undefined;
  return pickWeighted(
    chosen.words,
    (word) => {
      const linked = sharesTheme(word, picked);
      return wordFreshness(memory, word.text) * (near ? (linked ? 3 : 1) : linked ? 0.3 : 1);
    },
    random,
  );
}

/**
 * Unrelated: every word from a different broad area while there are areas
 * left, and away from themes the others share. Difficulty is never relaxed.
 */
function nextUnrelated(
  picked: readonly Word[],
  settings: Settings,
  memory: Memory,
  random: Random,
  exclude: ReadonlySet<string>,
): Word | undefined {
  const usedGroups = new Set(picked.map((word) => word.group));
  const unusedCategories = CATEGORIES.filter(
    (category) => !picked.some((word) => word.category === category.id),
  );
  const freshAreas = unusedCategories.filter((category) => !usedGroups.has(category.group));
  const options = (freshAreas.length > 0 ? freshAreas : unusedCategories).map((category) => ({
    category,
    words: candidates(category.words, settings.difficulty, picked, exclude),
  }));

  const chosen = pickWeighted(
    options,
    ({ category, words }) =>
      words.length === 0 ? 0 : groupShare(category) * posWeight(category.pos, picked),
    random,
  );
  if (!chosen) return undefined;
  return pickWeighted(
    chosen.words,
    (word) => wordFreshness(memory, word.text) * (sharesTheme(word, picked) ? 0.05 : 1),
    random,
  );
}

function linkWords(link: Link): readonly Word[] {
  const source = link.kind === "category" ? CATEGORIES : THEMES;
  return source.find((item) => item.id === link.id)?.words ?? [];
}

/**
 * A fresh list for the given settings. Returns fewer words than asked for
 * only when not enough fit the difficulty and association; it never repeats
 * a word, uses a variation of one, or borrows from another difficulty.
 */
export function generateWords(
  requested: Settings,
  memory: Memory,
  random: Random = Math.random,
): WordList {
  const settings = { ...requested, count: clampCount(requested.count) };
  const none = new Set<string>();

  if (settings.association === "close" || settings.association === "some") {
    const kind = settings.association === "close" ? "category" : "theme";
    const source = kind === "category" ? CATEGORIES : THEMES;
    const chosen = chooseLink<Category | Theme>(source, settings, memory, random);
    if (!chosen) return { settings, words: [], link: null };
    const weight = relatedWeight(kind, memory);
    const words: Word[] = [];
    while (words.length < settings.count) {
      const pool = candidates(chosen.words, settings.difficulty, words, none);
      const next = pickWeighted(pool, (word) => weight(word, words), random);
      if (!next) break;
      words.push(next);
    }
    return { settings, words, link: { kind, id: chosen.id, label: chosen.label } };
  }

  const next = settings.association === "loose" ? nextLoose : nextUnrelated;
  const words: Word[] = [];
  while (words.length < settings.count) {
    const word = next(words, settings, memory, random, none);
    if (!word) break;
    words.push(word);
  }
  return { settings, words, link: null };
}

/**
 * Swaps one word for another that fits the same list: same category or theme
 * for related lists, the same loose or unrelated rules otherwise. Null when
 * nothing else fits.
 */
export function replaceWord(
  list: WordList,
  index: number,
  memory: Memory,
  random: Random = Math.random,
): WordList | null {
  const others = list.words.filter((_, position) => position !== index);
  const exclude = new Set(list.words.map((word) => word.text));
  const { settings, link } = list;

  let replacement: Word | undefined;
  if (link) {
    const weight = relatedWeight(link.kind, memory);
    const pool = candidates(linkWords(link), settings.difficulty, others, exclude);
    replacement = pickWeighted(pool, (word) => weight(word, others), random);
  } else {
    const next = settings.association === "loose" ? nextLoose : nextUnrelated;
    replacement = next(others, settings, memory, random, exclude);
  }
  if (!replacement) return null;

  const words = [...list.words];
  words[index] = replacement;
  return { ...list, words };
}
