import type { ComponentType } from "react";
import { validateRegistry } from "@side-bits/project-contract";
import type { ProjectMetadata } from "@side-bits/project-contract";
import jsonFixer from "@side-bits/sidequest-json-fixer/project.config";
import { JsonFixerPreview } from "@side-bits/sidequest-json-fixer/preview";
import randomTopicGenerator from "@side-bits/sidequest-random-topic-generator/project.config";
import { RandomTopicGeneratorPreview } from "@side-bits/sidequest-random-topic-generator/preview";
import tinyTextLab from "@side-bits/sidequest-tiny-text-lab/project.config";
import { TinyTextLabPreview } from "@side-bits/sidequest-tiny-text-lab/preview";
import { collections } from "@/content/collections";

export interface RegistryEntry {
  metadata: ProjectMetadata;
  /** Card illustration, used when `metadata.preview.kind` is not `screenshot`. */
  Preview?: ComponentType;
}

/**
 * The single source of truth for which projects exist. Explicit static imports
 * keep the build deterministic and auditable (spec section 4.5). To add a
 * project, create its package, add it to apps/web/package.json, add one
 * entry here and one loader in project-apps.ts.
 *
 * Only metadata and card previews live here, because the site header imports
 * this module on every page. The interactive apps are in project-apps.ts.
 */
const entries: RegistryEntry[] = [
  {
    metadata: jsonFixer,
    Preview: JsonFixerPreview,
  },
  {
    metadata: tinyTextLab,
    Preview: TinyTextLabPreview,
  },
  {
    metadata: randomTopicGenerator,
    Preview: RandomTopicGeneratorPreview,
  },
];

// Fail the build (and every test) on an invalid registry rather than shipping it.
const problems = validateRegistry(
  entries.map((entry) => entry.metadata),
  collections,
);
for (const entry of entries) {
  if (entry.metadata.preview.kind !== "screenshot" && !entry.Preview) {
    problems.push(`Project "${entry.metadata.slug}": needs a Preview component.`);
  }
}
if (problems.length > 0) {
  throw new Error(`Invalid project registry:\n- ${problems.join("\n- ")}`);
}

const bySlug = new Map(entries.map((entry) => [entry.metadata.slug, entry]));

export function getAllEntries(): RegistryEntry[] {
  return entries;
}

export function getEntry(slug: string): RegistryEntry | undefined {
  return bySlug.get(slug);
}

/** Projects shown in listings: everything except retired ones. */
export function getVisibleProjects(): ProjectMetadata[] {
  return entries.map((entry) => entry.metadata).filter((project) => project.status !== "retired");
}

export function getFeaturedProjects(): ProjectMetadata[] {
  return getVisibleProjects().filter((project) => project.featured);
}

/** Newest first; ties keep registry order. */
export function getLatestProjects(limit: number): ProjectMetadata[] {
  return [...getVisibleProjects()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`;
}
