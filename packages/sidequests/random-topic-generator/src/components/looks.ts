import { BookOpen, Cog, Flame, Hourglass, Sprout, Telescope, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ResearchMinutes } from "../lib/session";
import type { Difficulty } from "../lib/topics";

/**
 * Colour classes for one tone. Written out in full so Tailwind finds them.
 * `selected` styles a chosen option card; `card` and `wash` style the topic card.
 */
export interface Tone {
  text: string;
  border: string;
  selected: string;
  card: string;
  wash: string;
}

export const ACCENT_TONE: Tone = {
  text: "text-accent",
  border: "border-accent",
  selected: "border-accent bg-accent/10 shadow-[0_0_32px_-12px_var(--color-accent)]",
  card: "border-accent shadow-[0_0_56px_-20px_var(--color-accent)]",
  wash: "from-accent/12",
};

/** Easy is green, Medium is cyan, Difficult is yellow, everywhere they appear. */
export const DIFFICULTY_LOOKS: Record<
  Difficulty,
  { icon: LucideIcon; description: string; tone: Tone }
> = {
  easy: {
    icon: Sprout,
    description: "Everyday curiosities",
    tone: {
      text: "text-green",
      border: "border-green",
      selected: "border-green bg-green-soft shadow-[0_0_32px_-12px_var(--color-green)]",
      card: "border-green shadow-[0_0_56px_-20px_var(--color-green)]",
      wash: "from-green-soft",
    },
  },
  medium: {
    icon: Cog,
    description: "How things work",
    tone: ACCENT_TONE,
  },
  difficult: {
    icon: Flame,
    description: "Take a side",
    tone: {
      text: "text-warning",
      border: "border-warning",
      selected: "border-warning bg-warning/10 shadow-[0_0_32px_-12px_var(--color-warning)]",
      card: "border-warning shadow-[0_0_56px_-20px_var(--color-warning)]",
      wash: "from-warning/12",
    },
  },
};

export const DURATION_LOOKS: Record<ResearchMinutes, { icon: LucideIcon; description: string }> = {
  "10s": { icon: Zap, description: "Dev shortcut" },
  "30": { icon: Hourglass, description: "Quick dig" },
  "45": { icon: BookOpen, description: "Solid read" },
  "60": { icon: Telescope, description: "Deep dive" },
};
