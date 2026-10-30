import { BookOpen, Flame, Link, Shuffle, Spline, Sprout, Waypoints } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Association } from "../lib/generate";
import type { Difficulty } from "../lib/vocabulary";

/**
 * Colour classes for one tone. Written out in full so Tailwind finds them.
 * `selected` styles a chosen option card; `edge` and `wash` style word tiles.
 */
export interface Tone {
  text: string;
  selected: string;
  edge: string;
  wash: string;
}

export const ACCENT_TONE: Tone = {
  text: "text-accent",
  selected: "border-accent bg-accent/10 shadow-[0_0_32px_-12px_var(--color-accent)]",
  edge: "border-l-accent",
  wash: "from-accent/10",
};

/** Easy is green, Medium is cyan, Hard is yellow, as in Random Topic Generator. */
export const DIFFICULTY_LOOKS: Record<
  Difficulty,
  { icon: LucideIcon; description: string; tone: Tone }
> = {
  easy: {
    icon: Sprout,
    description: "Everyday words",
    tone: {
      text: "text-green",
      selected: "border-green bg-green-soft shadow-[0_0_32px_-12px_var(--color-green)]",
      edge: "border-l-green",
      wash: "from-green-soft",
    },
  },
  medium: {
    icon: BookOpen,
    description: "Familiar words",
    tone: ACCENT_TONE,
  },
  hard: {
    icon: Flame,
    description: "Advanced vocab",
    tone: {
      text: "text-warning",
      selected: "border-warning bg-warning/10 shadow-[0_0_32px_-12px_var(--color-warning)]",
      edge: "border-l-warning",
      wash: "from-warning/10",
    },
  },
};

export const ASSOCIATION_LOOKS: Record<Association, { icon: LucideIcon; description: string }> = {
  close: { icon: Link, description: "One category" },
  some: { icon: Waypoints, description: "A shared theme" },
  loose: { icon: Spline, description: "Faint links" },
  none: { icon: Shuffle, description: "Nothing in common" },
};
