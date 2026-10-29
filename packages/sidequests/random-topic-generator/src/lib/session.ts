import { RECENT_TOPICS_LIMIT, TEST_DURATION_MS } from "../constants";
import { isDifficulty, isKnownTopic } from "./topics";
import type { Difficulty } from "./topics";

export const RESEARCH_DURATIONS = [
  { value: "30", label: "30 min", ms: 30 * 60_000 },
  { value: "45", label: "45 min", ms: 45 * 60_000 },
  { value: "60", label: "60 min", ms: 60 * 60_000 },
] as const;
export type ResearchMinutes = (typeof RESEARCH_DURATIONS)[number]["value"];

export function isResearchMinutes(value: unknown): value is ResearchMinutes {
  return RESEARCH_DURATIONS.some((duration) => duration.value === value);
}

/**
 * setup: choosing settings and rerolling the topic.
 * research: the countdown is running, or paused while `breakSince` is set.
 * ready: research is over; the test can start.
 * test: the one-minute speaking countdown.
 * done: the summary.
 */
export type Phase = "setup" | "research" | "ready" | "test" | "done";

/**
 * All times are wall-clock timestamps (ms), so the clock stays right when the
 * tab is throttled in the background or the page is reloaded.
 */
export interface Session {
  phase: Phase;
  difficulty: Difficulty;
  researchMinutes: ResearchMinutes;
  topic: string | null;
  /** Recent topics, newest first, skipped when rerolling. */
  recent: string[];
  /** Research time used before the current running stretch. */
  researchMs: number;
  /** Start of the current running stretch; null while on a break or not researching. */
  runningSince: number | null;
  /** Break time used before the current break. */
  breakMs: number;
  /** Start of the current break; null while not on one. */
  breakSince: number | null;
  breakCount: number;
  /** Research ended with "I'm ready" before the countdown ran out. */
  endedEarly: boolean;
  testStartedAt: number | null;
  /** How long the test ran, once it is over. */
  testMs: number;
}

export type SessionAction =
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "setResearchMinutes"; minutes: ResearchMinutes }
  | { type: "showTopic"; topic: string }
  | { type: "startResearch"; now: number }
  | { type: "startBreak"; now: number }
  | { type: "endBreak"; now: number }
  | { type: "finishResearch"; now: number }
  | { type: "startTest"; now: number }
  | { type: "finishTest"; now: number }
  /** The clock caught up with a countdown; ends it if it really has run out. */
  | { type: "expire"; now: number }
  /** Back to setup with the same settings and no topic. */
  | { type: "reset" }
  | { type: "restore"; session: Session };

export const initialSession: Session = {
  phase: "setup",
  difficulty: "easy",
  researchMinutes: "30",
  topic: null,
  recent: [],
  researchMs: 0,
  runningSince: null,
  breakMs: 0,
  breakSince: null,
  breakCount: 0,
  endedEarly: false,
  testStartedAt: null,
  testMs: 0,
};

function researchDuration(minutes: ResearchMinutes) {
  return RESEARCH_DURATIONS.find((duration) => duration.value === minutes)!;
}

export function researchDurationMs(session: Session): number {
  return researchDuration(session.researchMinutes).ms;
}

/** E.g. "30 min". */
export function researchDurationLabel(session: Session): string {
  return researchDuration(session.researchMinutes).label;
}

export function researchElapsedMs(session: Session, now: number): number {
  const running = session.runningSince === null ? 0 : Math.max(0, now - session.runningSince);
  return Math.min(researchDurationMs(session), session.researchMs + running);
}

export function researchRemainingMs(session: Session, now: number): number {
  return researchDurationMs(session) - researchElapsedMs(session, now);
}

export function breakElapsedMs(session: Session, now: number): number {
  const current = session.breakSince === null ? 0 : Math.max(0, now - session.breakSince);
  return session.breakMs + current;
}

/** Length of the break in progress, or 0. */
export function currentBreakMs(session: Session, now: number): number {
  return session.breakSince === null ? 0 : Math.max(0, now - session.breakSince);
}

export function testElapsedMs(session: Session, now: number): number {
  if (session.phase !== "test" || session.testStartedAt === null) return session.testMs;
  return Math.min(TEST_DURATION_MS, Math.max(0, now - session.testStartedAt));
}

export function testRemainingMs(session: Session, now: number): number {
  return TEST_DURATION_MS - testElapsedMs(session, now);
}

/** Session with research stopped at `now`, ready for the test. */
function endResearch(session: Session, now: number, endedEarly: boolean): Session {
  return {
    ...session,
    phase: "ready",
    researchMs: researchElapsedMs(session, now),
    runningSince: null,
    breakMs: breakElapsedMs(session, now),
    breakSince: null,
    endedEarly,
  };
}

function endTest(session: Session, now: number): Session {
  return { ...session, phase: "done", testMs: testElapsedMs(session, now), testStartedAt: null };
}

export function sessionReducer(session: Session, action: SessionAction): Session {
  switch (action.type) {
    case "setDifficulty":
      if (session.phase !== "setup" || action.difficulty === session.difficulty) return session;
      // The topic belongs to the old difficulty.
      return { ...session, difficulty: action.difficulty, topic: null };
    case "setResearchMinutes":
      if (session.phase !== "setup") return session;
      return { ...session, researchMinutes: action.minutes };
    case "showTopic":
      if (session.phase !== "setup") return session;
      return {
        ...session,
        topic: action.topic,
        recent: [action.topic, ...session.recent.filter((topic) => topic !== action.topic)].slice(
          0,
          RECENT_TOPICS_LIMIT,
        ),
      };
    case "startResearch":
      if (session.phase !== "setup" || session.topic === null) return session;
      return {
        ...session,
        phase: "research",
        researchMs: 0,
        runningSince: action.now,
        breakMs: 0,
        breakSince: null,
        breakCount: 0,
        endedEarly: false,
        testStartedAt: null,
        testMs: 0,
      };
    case "startBreak":
      if (session.phase !== "research" || session.breakSince !== null) return session;
      if (researchRemainingMs(session, action.now) <= 0)
        return endResearch(session, action.now, false);
      return {
        ...session,
        researchMs: researchElapsedMs(session, action.now),
        runningSince: null,
        breakSince: action.now,
        breakCount: session.breakCount + 1,
      };
    case "endBreak":
      if (session.phase !== "research" || session.breakSince === null) return session;
      return {
        ...session,
        breakMs: breakElapsedMs(session, action.now),
        breakSince: null,
        runningSince: action.now,
      };
    case "finishResearch":
      if (session.phase !== "research") return session;
      return endResearch(session, action.now, researchRemainingMs(session, action.now) > 0);
    case "startTest":
      if (session.phase !== "ready") return session;
      return { ...session, phase: "test", testStartedAt: action.now, testMs: 0 };
    case "finishTest":
      if (session.phase !== "test") return session;
      return endTest(session, action.now);
    case "expire":
      if (session.phase === "research" && researchRemainingMs(session, action.now) <= 0) {
        return endResearch(session, action.now, false);
      }
      if (session.phase === "test" && testRemainingMs(session, action.now) <= 0) {
        return endTest(session, action.now);
      }
      return session;
    case "reset":
      return {
        ...initialSession,
        difficulty: session.difficulty,
        researchMinutes: session.researchMinutes,
        recent: session.recent,
      };
    case "restore":
      return action.session;
  }
}

const PHASES: readonly Phase[] = ["setup", "research", "ready", "test", "done"];

function isTime(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isTimeOrNull(value: unknown): value is number | null {
  return value === null || isTime(value);
}

/**
 * Reads a saved session back, or returns null if it is missing, from an
 * older version, or inconsistent. Anything odd starts a fresh session rather
 * than showing a broken clock.
 */
export function parseSession(raw: string | null): Session | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const value = data as Record<string, unknown>;

  if (!PHASES.includes(value.phase as Phase)) return null;
  if (!isDifficulty(value.difficulty) || !isResearchMinutes(value.researchMinutes)) return null;
  const difficulty = value.difficulty;
  if (value.topic !== null && !isKnownTopic(difficulty, value.topic)) return null;
  if (!Array.isArray(value.recent)) return null;
  for (const field of ["researchMs", "breakMs", "breakCount", "testMs"] as const) {
    if (!isTime(value[field])) return null;
  }
  for (const field of ["runningSince", "breakSince", "testStartedAt"] as const) {
    if (!isTimeOrNull(value[field])) return null;
  }
  if (typeof value.endedEarly !== "boolean") return null;

  const session: Session = {
    phase: value.phase as Phase,
    difficulty,
    researchMinutes: value.researchMinutes,
    topic: value.topic as string | null,
    recent: value.recent
      .filter((topic): topic is string => typeof topic === "string")
      .slice(0, RECENT_TOPICS_LIMIT),
    researchMs: value.researchMs as number,
    runningSince: value.runningSince as number | null,
    breakMs: value.breakMs as number,
    breakSince: value.breakSince as number | null,
    breakCount: value.breakCount as number,
    endedEarly: value.endedEarly,
    testStartedAt: value.testStartedAt as number | null,
    testMs: value.testMs as number,
  };

  if (session.phase !== "setup" && session.topic === null) return null;
  // While researching, exactly one of the clocks runs.
  if (
    session.phase === "research" &&
    (session.runningSince === null) === (session.breakSince === null)
  ) {
    return null;
  }
  if (session.phase === "test" && session.testStartedAt === null) return null;
  return session;
}
