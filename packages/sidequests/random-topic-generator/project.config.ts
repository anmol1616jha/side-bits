import type { ProjectMetadata } from "@side-bits/project-contract";

const metadata = {
  slug: "random-topic-generator",
  title: "Random Topic Generator",
  description:
    "Get a random topic, research it against the clock, then talk about it for one minute straight.",
  summary:
    "Random Topic Generator hands you a topic at the difficulty you pick, gives you 30, 45 or 60 minutes to research it, then unlocks a one-minute speaking test. Practice for thinking on your feet, with breaks allowed.",
  instructions: [
    "Pick a difficulty and how long you want to research.",
    "Get a topic. Reroll it as often as you like before you start.",
    "Start research. Use Break to pause the clock and Resume to carry on.",
    "When the research countdown ends, start the test and speak about the topic for one minute.",
  ],
  dataHandling:
    "Everything runs in your browser. Your current session is saved in this browser so a refresh doesn't lose it; nothing is sent anywhere and nothing is recorded.",
  tags: ["learning", "speaking", "timer", "practice"],
  collectionSlugs: ["brain-gym"],
  status: "live",
  createdAt: "2026-10-28",
  updatedAt: "2026-10-28",
  preview: {
    kind: "illustration",
    alt: "A countdown ring beside a speech bubble.",
  },
} satisfies ProjectMetadata;

export default metadata;
