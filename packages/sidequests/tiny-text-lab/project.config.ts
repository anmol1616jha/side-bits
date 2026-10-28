import type { ProjectMetadata } from "@side-bits/project-contract";

const metadata = {
  slug: "tiny-text-lab",
  title: "Tiny Text Lab",
  description:
    "Change case, count words and tidy whitespace, without pasting your text into a stranger's server.",
  summary:
    "Tiny Text Lab applies small, predictable transformations to text: case conversion, whitespace cleanup and counts of words, characters and lines.",
  instructions: [
    "Paste or type text into the input box.",
    "Pick a transformation to apply.",
    "Check the counts and the result.",
    "Copy the result.",
  ],
  dataHandling: "Everything runs in your browser. Nothing you paste is sent anywhere or stored.",
  tags: ["text", "writing", "utility"],
  collectionSlugs: ["actually-useful"],
  status: "live",
  createdAt: "2026-10-27",
  updatedAt: "2026-10-27",
  layout: "wide",
  preview: {
    kind: "illustration",
    alt: "Large letters Aa beside lines of text.",
  },
} satisfies ProjectMetadata;

export default metadata;
