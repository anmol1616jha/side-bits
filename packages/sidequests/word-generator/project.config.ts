import type { ProjectMetadata } from "@side-bits/project-contract";

const metadata = {
  slug: "word-generator",
  title: "Word Generator",
  description:
    "Hand-picked English words for vocabulary games, at the difficulty and closeness you choose.",
  summary:
    "Word Generator picks one to ten English words from a curated list of about 1,600, at an easy, medium or hard level. Ask for words from one category, words linked by a theme, loosely linked words or words with nothing in common, then copy the list into your game.",
  instructions: [
    "Pick a difficulty.",
    "Choose how many words you want, from one to ten.",
    "Choose how closely related the words should be.",
    "Press Generate. Swap any single word with its replace button, or copy the whole list.",
  ],
  dataHandling:
    "Everything runs in your browser. It remembers recently shown words in this browser so new lists feel fresh; nothing is sent anywhere.",
  tags: ["words", "vocabulary", "game", "random"],
  collectionSlugs: ["brain-gym", "just-for-fun"],
  status: "live",
  // The settings and the word list sit side by side, so the card needs the full width.
  layout: "wide",
  createdAt: "2026-10-30",
  updatedAt: "2026-10-30",
  preview: {
    kind: "illustration",
    alt: "Three word cards in green, cyan and yellow beside a sparkle.",
  },
} satisfies ProjectMetadata;

export default metadata;
