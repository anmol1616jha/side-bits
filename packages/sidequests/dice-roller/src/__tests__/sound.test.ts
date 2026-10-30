import { describe, expect, it } from "vitest";
import { planThrows } from "../lib/dice";
import { soundCues } from "../lib/sound";

describe("soundCues", () => {
  it("times a rattle, landing, bounce and settle to each throw", () => {
    const [thrown] = planThrows([4], true, () => 0.5);
    const cues = soundCues([thrown!], () => 0);
    expect(cues.map((cue) => cue.kind)).toEqual([
      "rattle",
      "rattle",
      "rattle",
      "land",
      "bounce",
      "settle",
    ]);
    expect(cues.find((cue) => cue.kind === "land")!.at).toBe(Math.round(thrown!.duration * 0.58));
  });

  it("puts every die's cues in time order", () => {
    const cues = soundCues(planThrows([1, 2, 3, 4, 5], true));
    expect(cues).toHaveLength(30);
    expect(cues.map((cue) => cue.at)).toEqual([...cues.map((cue) => cue.at)].sort((a, b) => a - b));
  });

  it("just clacks dice down when they don't animate", () => {
    expect(soundCues(planThrows([6, 6], false))).toEqual([
      { at: 0, kind: "land" },
      { at: 35, kind: "land" },
    ]);
  });
});
