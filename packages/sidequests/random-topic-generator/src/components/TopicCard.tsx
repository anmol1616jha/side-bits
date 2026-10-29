import { cx } from "@side-bits/ui";
import { DIFFICULTIES } from "../lib/topics";
import type { Difficulty } from "../lib/topics";
import { DIFFICULTY_LOOKS } from "./looks";

interface TopicCardProps {
  topic: string;
  difficulty: Difficulty;
  /** A decoy topic flickering past while a new topic is being revealed. */
  shuffleFrame?: string | null;
  size?: "md" | "lg";
}

export function TopicCard({ topic, difficulty, shuffleFrame = null, size = "lg" }: TopicCardProps) {
  const label = DIFFICULTIES.find((option) => option.value === difficulty)!.label;
  const { icon: Icon, tone } = DIFFICULTY_LOOKS[difficulty];
  const textSize = size === "lg" ? "text-display-lg" : "text-display-md";

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-md border border-l-4 bg-surface p-5 sm:p-6",
        tone.card,
      )}
    >
      <div
        aria-hidden="true"
        className={cx("absolute inset-0 bg-linear-to-br to-transparent to-60%", tone.wash)}
      />
      <div className="relative flex items-center justify-between gap-2">
        <p className="hud-label text-meta text-text-muted">Your topic</p>
        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 hud-label text-meta",
            tone.border,
            tone.text,
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
          {label}
        </span>
      </div>
      <div className={cx("relative mt-3 font-display font-semibold", textSize)}>
        {shuffleFrame === null ? (
          // A fresh element per topic, so each one pops in as it lands.
          <p
            key={topic}
            className="text-balance transition-[opacity,scale] duration-300 ease-out starting:scale-95 starting:opacity-0"
          >
            {topic}
          </p>
        ) : (
          <>
            <p className="sr-only">{topic}</p>
            <p aria-hidden="true" className="text-balance text-text-muted blur-[1px]">
              {shuffleFrame}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
