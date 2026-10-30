import { describe, expect, it } from "vitest";
import { THEMES as THEME_SOURCES } from "../data/themes";
import { areVariants, stem } from "../lib/variants";
import { CATEGORIES, DIFFICULTIES, GROUPS, THEMES, WORDS, parseList } from "../lib/vocabulary";

describe("vocabulary", () => {
  it("is a curated list of a sensible size", () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(1500);
    expect(WORDS.length).toBeLessThanOrEqual(2500);
  });

  it("never lists a word twice, in any category or difficulty", () => {
    const all = CATEGORIES.flatMap((category) => category.words.map((word) => word.text));
    expect(all.length - new Set(all).size).toBe(0);
  });

  it("stores plain lower-case words: no capitals, spaces, digits or punctuation", () => {
    for (const word of WORDS) expect(word.text).toMatch(/^[a-z]+$/);
  });

  it("keeps variations of a word out of the same category", () => {
    for (const category of CATEGORIES) {
      const clashes = category.words.flatMap((word, index) =>
        category.words
          .slice(index + 1)
          .filter((other) => areVariants(word.text, other.text))
          .map((other) => `${word.text}/${other.text}`),
      );
      expect(clashes, category.id).toEqual([]);
    }
  });

  it("has words at every difficulty, with enough for a full list in most categories", () => {
    for (const { value } of DIFFICULTIES) {
      const sizes = CATEGORIES.map(
        (category) => category.words.filter((word) => word.difficulty === value).length,
      );
      expect(sizes.filter((size) => size === 0)).toHaveLength(0);
      expect(sizes.filter((size) => size >= 6).length).toBeGreaterThan(CATEGORIES.length * 0.7);
    }
  });

  it("mixes nouns with verbs, adjectives and adverbs", () => {
    const kinds = new Set(WORDS.map((word) => word.pos));
    expect([...kinds].sort()).toEqual(["adjective", "adverb", "noun", "verb"]);
    expect(WORDS.filter((word) => word.pos !== "noun").length).toBeGreaterThan(WORDS.length / 5);
  });

  it("gives every group and category a unique id", () => {
    const groups = GROUPS.map((group) => group.id);
    const categories = CATEGORIES.map((category) => category.id);
    expect(new Set(groups).size).toBe(groups.length);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it("only uses category words in themes, each across several categories", () => {
    for (const source of THEME_SOURCES) {
      const named = parseList(source.words, "noun").map(({ text }) => text);
      const theme = THEMES.find((item) => item.id === source.id)!;
      expect(
        theme.words.map((word) => word.text),
        source.id,
      ).toEqual(named);
      expect(new Set(named).size, source.id).toBe(named.length);
      expect(new Set(theme.words.map((word) => word.category)).size).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("variants", () => {
  it.each([
    ["shoe", "shoes"],
    ["friend", "friendly"],
    ["happy", "happily"],
    ["sorcery", "sorcerer"],
    ["magnet", "magnetism"],
    ["patient", "patiently"],
    ["Ocean", "ocean"],
  ])("treats %s and %s as one word", (a, b) => {
    expect(areVariants(a, b)).toBe(true);
  });

  it.each([
    ["star", "starfish"],
    ["rain", "rainbow"],
    ["sea", "seal"],
    ["cat", "caterpillar"],
    ["ocean", "river"],
  ])("keeps %s and %s apart", (a, b) => {
    expect(areVariants(a, b)).toBe(false);
  });

  it("never strips a word below three letters", () => {
    expect(stem("sea")).toBe("sea");
    expect(stem("eyes")).toBe("eye");
  });
});
