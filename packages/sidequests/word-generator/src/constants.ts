export const MIN_WORDS = 1;
export const MAX_WORDS = 10;

export const DEFAULT_SETTINGS = {
  difficulty: "medium",
  count: 2,
  association: "some",
} as const;

/** Recent lists remembered so new lists favour fresh words. */
export const RECENT_LISTS_LIMIT = 15;

/** Recent categories and themes remembered so the same thread doesn't come up twice running. */
export const RECENT_LINKS_LIMIT = 8;

/** localStorage key for the recent-words memory. */
export const STORAGE_KEY = "side-bits:word-generator:recent";
