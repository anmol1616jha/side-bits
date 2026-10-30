import { afterEach, describe, expect, it, vi } from "vitest";
import {
  describeValues,
  landingTime,
  planThrows,
  rollDice,
  secureRandomInt,
  summarizeRoll,
} from "../lib/dice";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("secureRandomInt", () => {
  it("redraws values from the uneven top of the range", () => {
    const draws = [2 ** 32 - 1, 11];
    vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation(
      <T extends ArrayBufferView>(array: T) => {
        (array as unknown as Uint32Array)[0] = draws.shift()!;
        return array;
      },
    );
    expect(secureRandomInt(6)).toBe(5);
    expect(draws).toHaveLength(0);
  });

  it("stays in range", () => {
    for (let index = 0; index < 500; index++) {
      const value = secureRandomInt(6);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(6);
    }
  });
});

describe("rollDice", () => {
  it("rolls the requested number of dice from 1 to 6", () => {
    const faces = [0, 5, 2];
    expect(rollDice(3, () => faces.shift()!)).toEqual([1, 6, 3]);
  });

  it("shows every face over many rolls", () => {
    expect(new Set(rollDice(600))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });
});

describe("summarizeRoll", () => {
  it("adds up the total", () => {
    expect(summarizeRoll([4, 2, 6])).toEqual({ total: 12, allSame: false, callout: null });
  });

  it("doesn't cheer a single die", () => {
    expect(summarizeRoll([6])).toEqual({ total: 6, allSame: false, callout: null });
  });

  it("names matching dice", () => {
    expect(summarizeRoll([1, 1]).callout).toBe("Snake eyes!");
    expect(summarizeRoll([6, 6]).callout).toBe("Double sixes!");
    expect(summarizeRoll([3, 3, 3]).callout).toBe("Three of a kind!");
    expect(summarizeRoll([5, 5, 5, 5, 5])).toEqual({
      total: 25,
      allSame: true,
      callout: "Five of a kind!",
    });
  });
});

describe("describeValues", () => {
  it("lists the faces in words", () => {
    expect(describeValues([4])).toBe("4");
    expect(describeValues([4, 2])).toBe("4 and 2");
    expect(describeValues([4, 2, 6])).toBe("4, 2 and 6");
  });
});

describe("planThrows", () => {
  it("staggers animated dice and lands after the slowest", () => {
    const throws = planThrows([1, 2, 3], true, () => 0.5);
    expect(throws.map((thrown) => thrown.delay)).toEqual([0, 70, 140]);
    expect(throws.map((thrown) => thrown.value)).toEqual([1, 2, 3]);
    expect(landingTime(throws)).toBe(140 + throws[2]!.duration);
  });

  it("lands at once without animation", () => {
    const throws = planThrows([6, 6], false);
    expect(throws.every((thrown) => thrown.duration === 0 && thrown.delay === 0)).toBe(true);
    expect(landingTime(throws)).toBe(0);
  });
});
