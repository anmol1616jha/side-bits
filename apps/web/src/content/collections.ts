import type { CollectionDefinition } from "@side-bits/project-contract";

// Plain data, no runtime imports: also read by scripts/validate-project-registry.ts.
// Membership is declared by each project's `collectionSlugs`, not listed here.
export const collections: CollectionDefinition[] = [
  {
    slug: "actually-useful",
    title: "Actually useful",
    description: "Small tools that do one job and get out of the way.",
  },
  {
    slug: "brain-gym",
    title: "Brain gym",
    description: "Little workouts for thinking, remembering and talking on your feet.",
  },
  {
    slug: "just-for-fun",
    title: "Just for fun",
    description: "Toys with no purpose beyond the next click.",
  },
];
