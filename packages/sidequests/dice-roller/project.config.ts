import type { ProjectMetadata } from "@side-bits/project-contract";

const metadata = {
  slug: "dice-roller",
  title: "Dice Roller",
  description:
    "Pick one to five dice and throw them. They tumble, bounce, land and add themselves up.",
  summary:
    "Dice Roller throws up to five six-sided dice and tells you what came up and the total. Every roll is fair, drawn from your browser's cryptographic random number generator, and matching dice get a little celebration.",
  instructions: [
    "Choose how many dice to roll, from one to five.",
    "Press Roll and watch them land.",
    "Read each face and the total. Your last ten rolls are listed too.",
  ],
  dataHandling:
    "Everything runs in your browser. Nothing is stored or sent anywhere; your recent rolls disappear when you leave the page.",
  tags: ["game", "dice", "random", "chance"],
  collectionSlugs: ["just-for-fun"],
  status: "live",
  // The dice table and its history sit side by side, so the card needs the full width.
  layout: "wide",
  createdAt: "2026-10-30",
  updatedAt: "2026-10-30",
  preview: {
    kind: "illustration",
    alt: "Two dice mid-tumble, showing five and three.",
  },
} satisfies ProjectMetadata;

export default metadata;
