import { RECENT_LINKS_LIMIT, RECENT_LISTS_LIMIT } from "../constants";

/**
 * What was shown recently, newest first, so new lists lean towards fresh words
 * and themes. Nothing is ever ruled out: recent picks only become less
 * likely, and they fade back in as newer lists push them down.
 */
export interface Memory {
  /** Words of each recent list (replacements join the newest one). */
  lists: string[][];
  /** Category or theme ids recent lists were built around. */
  links: string[];
}

export const emptyMemory: Memory = { lists: [], links: [] };

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

/** Reads saved memory, falling back to empty on anything unexpected. */
export function parseMemory(raw: string | null): Memory {
  if (!raw) return emptyMemory;
  try {
    const value = JSON.parse(raw) as Partial<Memory> | null;
    if (!value || !Array.isArray(value.lists) || !isStringArray(value.links)) return emptyMemory;
    if (!value.lists.every(isStringArray)) return emptyMemory;
    return {
      lists: value.lists.slice(0, RECENT_LISTS_LIMIT),
      links: value.links.slice(0, RECENT_LINKS_LIMIT),
    };
  } catch {
    return emptyMemory;
  }
}

export function rememberList(memory: Memory, words: string[], link: string | null): Memory {
  return {
    lists: [words, ...memory.lists].slice(0, RECENT_LISTS_LIMIT),
    links: link ? [link, ...memory.links].slice(0, RECENT_LINKS_LIMIT) : memory.links,
  };
}

export function rememberWord(memory: Memory, word: string): Memory {
  const [newest = [], ...older] = memory.lists;
  return { ...memory, lists: [[...newest, word], ...older] };
}

/**
 * Weight for a word or link given how recently it was shown: 1 if not
 * recently, rising from near zero (just shown) back towards 1 as it ages out.
 */
function fade(age: number, limit: number): number {
  if (age < 0) return 1;
  return 0.03 + 0.6 * (age / limit) ** 2;
}

export function wordFreshness(memory: Memory, word: string): number {
  return fade(
    memory.lists.findIndex((list) => list.includes(word)),
    RECENT_LISTS_LIMIT,
  );
}

export function linkFreshness(memory: Memory, link: string): number {
  return fade(memory.links.indexOf(link), RECENT_LINKS_LIMIT);
}
