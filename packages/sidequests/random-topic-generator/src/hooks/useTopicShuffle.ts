import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { pickTopic } from "../lib/topics";
import type { Difficulty } from "../lib/topics";

/** Gaps between shuffle frames, slowing down like a wheel before it lands (about a second in all). */
const FRAME_GAPS_MS = [55, 55, 60, 65, 75, 85, 100, 120, 145, 175];

/**
 * Slot-machine flicker shown before a new topic lands. Purely visual: the
 * session already holds the real topic, and `frame` is the decoy on screen
 * (null once it has landed). Skipped when reduced motion is preferred.
 */
export function useTopicShuffle() {
  const [frame, setFrame] = useState<string | null>(null);
  const timeouts = useRef<number[]>([]);

  function stop() {
    // Emptied in place: the unmount cleanup below holds this same array.
    for (const id of timeouts.current.splice(0)) window.clearTimeout(id);
    setFrame(null);
  }

  function start(difficulty: Difficulty, topic: string) {
    stop();
    if (prefersReducedMotion()) return;

    let previous = pickTopic(difficulty, [topic]);
    setFrame(previous);
    let at = 0;
    for (const gap of FRAME_GAPS_MS.slice(1)) {
      at += gap;
      const next = pickTopic(difficulty, [topic, previous]);
      previous = next;
      timeouts.current.push(window.setTimeout(() => setFrame(next), at));
    }
    timeouts.current.push(window.setTimeout(() => setFrame(null), at + FRAME_GAPS_MS.at(-1)!));
  }

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      for (const id of pending) window.clearTimeout(id);
    };
  }, []);

  return { frame, start };
}
