import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { WORDS } from "../lib/vocabulary";
import type { Difficulty } from "../lib/vocabulary";

/** Frames every slot flickers through before the first one lands. */
const LEAD_FRAMES = 6;

/** Gap before a frame, slowing down like a wheel before it stops (capped). */
const frameGap = (frame: number) => Math.min(40 + frame * 8, 110);

/**
 * Slot-machine flicker shown before new words land, one slot after another.
 * Purely visual: the list already holds the real words, and `frames` maps a
 * slot still spinning to the decoy on screen. Skipped when reduced motion is
 * preferred.
 */
export function useWordShuffle() {
  const [frames, setFrames] = useState<ReadonlyMap<number, string>>(new Map());
  const timeouts = useRef<number[]>([]);

  function stop() {
    // Emptied in place: the unmount cleanup below holds this same array.
    for (const id of timeouts.current.splice(0)) window.clearTimeout(id);
    setFrames(new Map());
  }

  /** Spins the given slots; the n-th of them lands n frames after the first. */
  function start(slots: readonly number[], difficulty: Difficulty) {
    stop();
    if (prefersReducedMotion() || slots.length === 0) return;

    const pool = WORDS.filter((word) => word.difficulty === difficulty);
    const decoy = () => pool[Math.floor(Math.random() * pool.length)]!.text;
    const spin = (frame: number) =>
      new Map(
        slots.flatMap((slot, order) =>
          frame < LEAD_FRAMES + order ? [[slot, decoy()] as const] : [],
        ),
      );
    setFrames(spin(0));
    let at = 0;
    const last = LEAD_FRAMES + slots.length - 1;
    for (let frame = 1; frame <= last; frame++) {
      at += frameGap(frame);
      const next = spin(frame);
      timeouts.current.push(window.setTimeout(() => setFrames(next), at));
    }
  }

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      for (const id of pending) window.clearTimeout(id);
    };
  }, []);

  return { frames, start, spinning: frames.size > 0 };
}
