import { describe, expect, it } from "vitest";
import { computeStats, formatReadingTime } from "../lib/stats";

describe("computeStats", () => {
  it("handles empty text", () => {
    expect(computeStats("")).toEqual({
      characters: 0,
      charactersWithoutSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      readingMinutes: 0,
    });
  });

  it("counts words, lines and paragraphs", () => {
    const stats = computeStats("One two, three.\nFour\n\nFive's here");
    expect(stats.words).toBe(6);
    expect(stats.lines).toBe(4);
    expect(stats.paragraphs).toBe(2);
  });

  it("does not count a final line break as an extra line", () => {
    expect(computeStats("a\n").lines).toBe(1);
    expect(computeStats("a\r\nb\r\n").lines).toBe(2);
    expect(computeStats("\n").lines).toBe(1);
  });

  it("counts user-perceived characters", () => {
    expect(computeStats("é👍🏽🇬🇧").characters).toBe(3);
    expect(computeStats("a b\tc\n").charactersWithoutSpaces).toBe(3);
  });

  it("does not count punctuation or emoji as words", () => {
    expect(computeStats("— !!! 👍 ...").words).toBe(0);
  });
});

describe("formatReadingTime", () => {
  it("rounds to friendly values", () => {
    expect(formatReadingTime(0)).toBe("—");
    expect(formatReadingTime(0.4)).toBe("under a minute");
    expect(formatReadingTime(2.6)).toBe("about 3 min");
  });
});
