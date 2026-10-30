import { describe, expect, it } from "vitest";
import {
  ASSOCIATIONS,
  clampCount,
  generateWords,
  pickWeighted,
  replaceWord,
} from "../lib/generate";
import type { Association, Settings, WordList } from "../lib/generate";
import { emptyMemory, parseMemory, rememberList, rememberWord, wordFreshness } from "../lib/memory";
import { areVariants } from "../lib/variants";
import { CATEGORIES, DIFFICULTIES, THEMES } from "../lib/vocabulary";
import type { Difficulty } from "../lib/vocabulary";

/** A small seeded generator, so failures can be reproduced. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

const ALL_SETTINGS: Settings[] = DIFFICULTIES.flatMap(({ value: difficulty }) =>
  ASSOCIATIONS.flatMap(({ value: association }) =>
    [1, 2, 5, 10].map((count) => ({ difficulty, association, count })),
  ),
);

function noVariants(list: WordList) {
  list.words.forEach((word, index) => {
    for (const other of list.words.slice(index + 1)) {
      expect(areVariants(word.text, other.text), `${word.text}/${other.text}`).toBe(false);
    }
  });
}

describe("generateWords", () => {
  it.each(ALL_SETTINGS)(
    "$difficulty, $association, $count: right level, no repeats",
    (settings) => {
      for (let seed = 1; seed <= 25; seed++) {
        const list = generateWords(settings, emptyMemory, seeded(seed));
        expect(list.words.length).toBeGreaterThan(0);
        expect(list.words.length).toBeLessThanOrEqual(settings.count);
        for (const word of list.words) expect(word.difficulty).toBe(settings.difficulty);
        noVariants(list);
      }
    },
  );

  it("fills the list whenever enough words exist", () => {
    for (const settings of ALL_SETTINGS) {
      const list = generateWords(settings, emptyMemory, seeded(7));
      if (settings.association === "loose" || settings.association === "none") {
        expect(list.words).toHaveLength(settings.count);
        continue;
      }
      const source = settings.association === "close" ? CATEGORIES : THEMES;
      const fullest = Math.max(
        ...source.map(
          (item) => item.words.filter((word) => word.difficulty === settings.difficulty).length,
        ),
      );
      expect(list.words.length).toBe(Math.min(settings.count, fullest));
    }
  });

  it("keeps closely related lists in one category", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const list = generateWords(
        { difficulty: "medium", count: 6, association: "close" },
        emptyMemory,
        seeded(seed),
      );
      expect(list.link?.kind).toBe("category");
      expect(new Set(list.words.map((word) => word.category))).toEqual(new Set([list.link!.id]));
    }
  });

  it("builds somewhat related lists from one theme, spread over categories", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const list = generateWords(
        { difficulty: "easy", count: 4, association: "some" },
        emptyMemory,
        seeded(seed),
      );
      expect(list.link?.kind).toBe("theme");
      for (const word of list.words) expect(word.themes).toContain(list.link!.id);
      expect(new Set(list.words.map((word) => word.category)).size).toBeGreaterThanOrEqual(3);
    }
  });

  it("never puts two loosely related words in one category or three in one area", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const { words } = generateWords(
        { difficulty: "hard", count: 10, association: "loose" },
        emptyMemory,
        seeded(seed),
      );
      expect(new Set(words.map((word) => word.category)).size).toBe(words.length);
      for (const word of words) {
        expect(words.filter((other) => other.group === word.group).length).toBeLessThanOrEqual(2);
      }
    }
  });

  it("draws every unrelated word from a different broad area", () => {
    for (let seed = 1; seed <= 30; seed++) {
      const { words } = generateWords(
        { difficulty: "medium", count: 10, association: "none" },
        emptyMemory,
        seeded(seed),
      );
      expect(new Set(words.map((word) => word.group)).size).toBe(10);
    }
  });

  it("mixes in verbs, adjectives and adverbs across many lists", () => {
    const words = Array.from(
      { length: 60 },
      (_, seed) =>
        generateWords(
          { difficulty: "easy", count: 5, association: "none" },
          emptyMemory,
          seeded(seed + 1),
        ).words,
    ).flat();
    const others = words.filter((word) => word.pos !== "noun").length;
    expect(others / words.length).toBeGreaterThan(0.2);
    expect(others / words.length).toBeLessThan(0.6);
  });

  it("comes up short instead of lowering the bar", () => {
    const smallest = CATEGORIES.map((category) => ({
      category,
      size: category.words.filter((word) => word.difficulty === "hard").length,
    })).sort((a, b) => b.size - a.size)[0]!;
    const list = generateWords(
      { difficulty: "hard", count: 10, association: "close" },
      emptyMemory,
      seeded(3),
    );
    expect(list.words.length).toBeLessThanOrEqual(Math.max(10, smallest.size));
    for (const word of list.words) expect(word.difficulty).toBe("hard");
  });

  it("clamps the word count to 1–10", () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(14)).toBe(10);
    expect(clampCount(Number.NaN)).toBe(1);
  });
});

describe("recent memory", () => {
  const settings = {
    difficulty: "easy" as Difficulty,
    count: 5,
    association: "none" as Association,
  };

  it("makes recently shown words much less likely", () => {
    let memory = emptyMemory;
    const seen = new Set<string>();
    let repeats = 0;
    const random = seeded(11);
    for (let round = 0; round < 6; round++) {
      const list = generateWords(settings, memory, random);
      for (const word of list.words) {
        if (seen.has(word.text)) repeats++;
        seen.add(word.text);
      }
      memory = rememberList(
        memory,
        list.words.map((word) => word.text),
        null,
      );
    }
    expect(repeats).toBeLessThanOrEqual(1);
  });

  it("lets old words back in as they age out, and never rules them out", () => {
    let memory = rememberList(emptyMemory, ["ocean"], "water");
    const justShown = wordFreshness(memory, "ocean");
    expect(justShown).toBeGreaterThan(0);
    for (let round = 0; round < 5; round++) memory = rememberList(memory, ["river"], null);
    expect(wordFreshness(memory, "ocean")).toBeGreaterThan(justShown);
    for (let round = 0; round < 20; round++) memory = rememberList(memory, ["river"], null);
    expect(wordFreshness(memory, "ocean")).toBe(1);
  });

  it("adds replacements to the newest list", () => {
    const memory = rememberWord(rememberList(emptyMemory, ["ocean"], null), "lake");
    expect(memory.lists[0]).toEqual(["ocean", "lake"]);
  });

  it("reads saved memory defensively", () => {
    expect(parseMemory(null)).toEqual(emptyMemory);
    expect(parseMemory("not json")).toEqual(emptyMemory);
    expect(parseMemory('{"lists":[1],"links":[]}')).toEqual(emptyMemory);
    expect(parseMemory('{"lists":[["ocean"]],"links":["water"]}')).toEqual({
      lists: [["ocean"]],
      links: ["water"],
    });
  });
});

describe("replaceWord", () => {
  it.each(ASSOCIATIONS.map(({ value }) => value))("keeps a %s list's rules", (association) => {
    for (let seed = 1; seed <= 20; seed++) {
      const random = seeded(seed);
      const list = generateWords(
        { difficulty: "medium", count: 5, association },
        emptyMemory,
        random,
      );
      const replaced = replaceWord(list, 2, emptyMemory, random)!;
      expect(replaced).not.toBeNull();
      expect(replaced.words[2]!.text).not.toBe(list.words[2]!.text);
      expect(replaced.words.filter((_, index) => index !== 2)).toEqual(
        list.words.filter((_, index) => index !== 2),
      );
      expect(replaced.words[2]!.difficulty).toBe("medium");
      noVariants(replaced);
      if (association === "close") expect(replaced.words[2]!.category).toBe(list.link!.id);
      if (association === "some") expect(replaced.words[2]!.themes).toContain(list.link!.id);
      if (association === "none") {
        expect(new Set(replaced.words.map((word) => word.group)).size).toBe(5);
      }
    }
  });

  it("returns null when nothing else fits", () => {
    const category = CATEGORIES.find((item) => item.id === "reptiles")!;
    const hard = category.words.filter((word) => word.difficulty === "hard");
    const list: WordList = {
      settings: { difficulty: "hard", count: hard.length, association: "close" },
      words: hard,
      link: { kind: "category", id: category.id, label: category.label },
    };
    expect(replaceWord(list, 0, emptyMemory)).toBeNull();
  });
});

describe("pickWeighted", () => {
  it("never picks a zero-weight item", () => {
    expect(
      pickWeighted(
        ["a", "b"],
        (item) => (item === "a" ? 0 : 1),
        () => 0,
      ),
    ).toBe("b");
    expect(
      pickWeighted(
        ["a", "b"],
        (item) => (item === "b" ? 0 : 1),
        () => 0.9999,
      ),
    ).toBe("a");
    expect(
      pickWeighted(
        ["a"],
        () => 0,
        () => 0.5,
      ),
    ).toBeUndefined();
  });
});
