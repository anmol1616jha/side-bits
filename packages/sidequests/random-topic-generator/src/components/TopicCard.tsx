import { Badge } from "@side-bits/ui";
import { DIFFICULTIES } from "../lib/topics";
import type { Difficulty } from "../lib/topics";

interface TopicCardProps {
  topic: string;
  difficulty: Difficulty;
}

export function TopicCard({ topic, difficulty }: TopicCardProps) {
  const label = DIFFICULTIES.find((option) => option.value === difficulty)!.label;

  return (
    <div className="rounded-md border border-border bg-surface-muted/60 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-text-muted">Your topic</p>
        <Badge>{label}</Badge>
      </div>
      <p className="mt-2 font-display text-display-md font-semibold text-balance">{topic}</p>
    </div>
  );
}
