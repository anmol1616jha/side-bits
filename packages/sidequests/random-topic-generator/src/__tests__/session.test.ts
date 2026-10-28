import { describe, expect, it } from "vitest";
import { TEST_DURATION_MS } from "../constants";
import {
  breakElapsedMs,
  initialSession,
  parseSession,
  researchRemainingMs,
  sessionReducer,
  testRemainingMs,
} from "../lib/session";
import type { Session, SessionAction } from "../lib/session";
import { TOPICS } from "../lib/topics";

const MINUTE = 60_000;
const topic = TOPICS.easy[0]!;

function run(actions: SessionAction[], from: Session = initialSession): Session {
  return actions.reduce(sessionReducer, from);
}

const researching = run([
  { type: "showTopic", topic },
  { type: "startResearch", now: 0 },
]);

describe("setup", () => {
  it("won't start research without a topic", () => {
    expect(run([{ type: "startResearch", now: 0 }]).phase).toBe("setup");
  });

  it("drops the topic when the difficulty changes, but not the research time", () => {
    const withTopic = run([{ type: "showTopic", topic }]);
    expect(run([{ type: "setResearchMinutes", minutes: "45" }], withTopic).topic).toBe(topic);
    expect(run([{ type: "setDifficulty", difficulty: "medium" }], withTopic).topic).toBeNull();
  });

  it("remembers recent topics, newest first, without duplicates", () => {
    const [a, b] = TOPICS.easy;
    const session = run([
      { type: "showTopic", topic: a! },
      { type: "showTopic", topic: b! },
      { type: "showTopic", topic: a! },
    ]);
    expect(session.recent).toEqual([a, b]);
  });
});

describe("research", () => {
  it("counts down from the chosen time", () => {
    expect(researchRemainingMs(researching, 0)).toBe(30 * MINUTE);
    expect(researchRemainingMs(researching, 10 * MINUTE)).toBe(20 * MINUTE);
  });

  it("pauses the clock during a break and resumes where it left off", () => {
    const session = run(
      [
        { type: "startBreak", now: 5 * MINUTE },
        { type: "endBreak", now: 15 * MINUTE },
      ],
      researching,
    );
    expect(researchRemainingMs(session, 15 * MINUTE)).toBe(25 * MINUTE);
    expect(breakElapsedMs(session, 15 * MINUTE)).toBe(10 * MINUTE);
    expect(session.breakCount).toBe(1);
  });

  it("doesn't expire while on a break", () => {
    const onBreak = run([{ type: "startBreak", now: 29 * MINUTE }], researching);
    expect(run([{ type: "expire", now: 90 * MINUTE }], onBreak).phase).toBe("research");
  });

  it("ignores an early expire and ends research once time is really up", () => {
    expect(run([{ type: "expire", now: 29 * MINUTE }], researching).phase).toBe("research");
    const ready = run([{ type: "expire", now: 31 * MINUTE }], researching);
    expect(ready.phase).toBe("ready");
    expect(ready.researchMs).toBe(30 * MINUTE);
    expect(ready.endedEarly).toBe(false);
  });

  it("can finish early", () => {
    const ready = run([{ type: "finishResearch", now: 12 * MINUTE }], researching);
    expect(ready.phase).toBe("ready");
    expect(ready.researchMs).toBe(12 * MINUTE);
    expect(ready.endedEarly).toBe(true);
  });

  it("closes an open break when research finishes", () => {
    const ready = run(
      [
        { type: "startBreak", now: 10 * MINUTE },
        { type: "finishResearch", now: 13 * MINUTE },
      ],
      researching,
    );
    expect(ready.breakMs).toBe(3 * MINUTE);
    expect(ready.breakSince).toBeNull();
  });

  it("won't start the test before research is over", () => {
    expect(run([{ type: "startTest", now: 1 }], researching).phase).toBe("research");
  });
});

describe("test", () => {
  const testing = run(
    [
      { type: "finishResearch", now: MINUTE },
      { type: "startTest", now: 2 * MINUTE },
    ],
    researching,
  );

  it("lasts one minute", () => {
    expect(testRemainingMs(testing, 2 * MINUTE)).toBe(TEST_DURATION_MS);
    const done = run([{ type: "expire", now: 3 * MINUTE + 500 }], testing);
    expect(done.phase).toBe("done");
    expect(done.testMs).toBe(TEST_DURATION_MS);
  });

  it("records how long you spoke when stopped early", () => {
    const done = run([{ type: "finishTest", now: 2 * MINUTE + 20_000 }], testing);
    expect(done.testMs).toBe(20_000);
  });

  it("keeps settings and recent topics on reset", () => {
    const done = run([{ type: "finishTest", now: 3 * MINUTE }], {
      ...testing,
      difficulty: "difficult",
      researchMinutes: "60",
    });
    const reset = run([{ type: "reset" }], done);
    expect(reset.phase).toBe("setup");
    expect(reset.topic).toBeNull();
    expect(reset.difficulty).toBe("difficult");
    expect(reset.researchMinutes).toBe("60");
    expect(reset.recent).toEqual(testing.recent);
  });
});

describe("parseSession", () => {
  it("round-trips a saved session", () => {
    expect(parseSession(JSON.stringify(researching))).toEqual(researching);
  });

  it.each([
    ["nothing", null],
    ["not JSON", "{"],
    ["an unknown phase", JSON.stringify({ ...researching, phase: "lunch" })],
    ["an unknown topic", JSON.stringify({ ...researching, topic: "Why is cheese?" })],
    ["a negative time", JSON.stringify({ ...researching, researchMs: -1 })],
    ["research with no clock running", JSON.stringify({ ...researching, runningSince: null })],
    ["research with both clocks running", JSON.stringify({ ...researching, breakSince: 5 })],
  ])("rejects %s", (_label, raw) => {
    expect(parseSession(raw)).toBeNull();
  });
});
