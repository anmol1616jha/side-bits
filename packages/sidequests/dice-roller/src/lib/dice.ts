export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

/** Returns a whole number from 0 up to, but not including, `max`. */
export type RandomInt = (max: number) => number;

const UINT32_RANGE = 2 ** 32;

/**
 * A fair random integer from the browser's cryptographic generator. Values
 * from the uneven top end of the 32-bit range are thrown away and redrawn, so
 * every face is exactly as likely. Falls back to Math.random without Web Crypto.
 */
export function secureRandomInt(max: number): number {
  const crypto = globalThis.crypto;
  if (typeof crypto?.getRandomValues !== "function") return Math.floor(Math.random() * max);
  const limit = Math.floor(UINT32_RANGE / max) * max;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0]! >= limit);
  return buffer[0]! % max;
}

export function rollDice(count: number, randomInt: RandomInt = secureRandomInt): DieValue[] {
  return Array.from({ length: count }, () => (randomInt(6) + 1) as DieValue);
}

export interface RollSummary {
  total: number;
  /** Every die shows the same face (two or more dice). */
  allSame: boolean;
  /** A short cheer for a notable roll, or null. */
  callout: string | null;
}

const PLURALS = ["ones", "twos", "threes", "fours", "fives", "sixes"];
const COUNT_WORDS = ["", "", "Two", "Three", "Four", "Five"];

export function summarizeRoll(values: readonly DieValue[]): RollSummary {
  const total = values.reduce<number>((sum, value) => sum + value, 0);
  const allSame = values.length > 1 && values.every((value) => value === values[0]);
  let callout: string | null = null;
  if (allSame) {
    const face = values[0]!;
    if (values.length === 2) callout = face === 1 ? "Snake eyes!" : `Double ${PLURALS[face - 1]}!`;
    else callout = `${COUNT_WORDS[values.length]} of a kind!`;
  }
  return { total, allSame, callout };
}

/** "4", "4 and 2", "4, 2 and 6". */
export function describeValues(values: readonly DieValue[]): string {
  if (values.length < 2) return values.join("");
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

/** How one die is thrown: where it lands and how it gets there. */
export interface DieThrow {
  value: DieValue;
  /** Milliseconds in the air and tumbling; 0 means it just appears on its face. */
  duration: number;
  /** Milliseconds before it leaves the hand, so dice don't move in lockstep. */
  delay: number;
  /** Degrees the die ends up turned on the table. */
  tilt: number;
  /** Pixels it lands away from its spot, so a row of dice doesn't look lined up. */
  x: number;
  y: number;
  /** Full turns it makes on each axis before landing. */
  spinX: number;
  spinY: number;
}

export function planThrows(
  values: readonly DieValue[],
  animated: boolean,
  random: () => number = Math.random,
): DieThrow[] {
  const spread = (range: number) => Math.round((random() - 0.5) * range);
  return values.map((value, index) => ({
    value,
    duration: animated ? Math.round(950 + random() * 450) : 0,
    delay: animated ? index * 70 : 0,
    tilt: spread(30),
    x: spread(14),
    y: spread(14),
    spinX: 2 + Math.floor(random() * 2),
    spinY: 1 + Math.floor(random() * 2),
  }));
}

/** Milliseconds until the last die has landed. */
export function landingTime(throws: readonly DieThrow[]): number {
  return Math.max(0, ...throws.map((thrown) => thrown.delay + thrown.duration));
}
