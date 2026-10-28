import { describe, expect, it } from "vitest";
import { formatClock, formatDuration, formatElapsed } from "../lib/format";
import { DIFFICULTIES, TOPICS, pickTopic } from "../lib/topics";

describe("topics", () => {
  it.each(DIFFICULTIES.map((difficulty) => difficulty.value))(
    "has plenty of unique %s topics",
    (difficulty) => {
      const topics = TOPICS[difficulty];
      expect(topics.length).toBeGreaterThanOrEqual(40);
      expect(new Set(topics).size).toBe(topics.length);
    },
  );

  it("never repeats a topic across difficulties", () => {
    const all = Object.values(TOPICS).flat();
    expect(new Set(all).size).toBe(all.length);
  });

  it("skips excluded topics while others remain", () => {
    const [first, ...rest] = TOPICS.easy;
    expect(pickTopic("easy", rest, () => 0.99)).toBe(first);
  });

  it("falls back to the full list when everything is excluded", () => {
    expect(pickTopic("easy", TOPICS.easy, () => 0)).toBe(TOPICS.easy[0]);
  });
});

describe("formatting", () => {
  it("rounds countdowns up and elapsed time down", () => {
    expect(formatClock(30 * 60_000)).toBe("30:00");
    expect(formatClock(59_001)).toBe("1:00");
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(-5)).toBe("0:00");
    expect(formatElapsed(59_999)).toBe("0:59");
  });

  it("writes durations out", () => {
    expect(formatDuration(5_000)).toBe("5 s");
    expect(formatDuration(120_000)).toBe("2 min");
    expect(formatDuration(725_000)).toBe("12 min 5 s");
  });
});
