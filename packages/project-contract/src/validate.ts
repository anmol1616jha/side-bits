import type { CollectionDefinition } from "./collection.ts";
import { PROJECT_LAYOUTS, PROJECT_STATUSES } from "./project.ts";
import type { ProjectMetadata } from "./project.ts";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_DESCRIPTION_LENGTH = 160;
export const MAX_TAGS = 6;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function validateProject(project: ProjectMetadata, collectionSlugs: Set<string>): string[] {
  const errors: string[] = [];
  const at = `Project "${project.slug}"`;

  if (!SLUG_PATTERN.test(project.slug)) errors.push(`${at}: slug must be lowercase kebab-case.`);
  for (const field of ["title", "description", "summary", "dataHandling"] as const) {
    if (isBlank(project[field])) errors.push(`${at}: "${field}" is required.`);
  }
  if (project.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`${at}: description is longer than ${MAX_DESCRIPTION_LENGTH} characters.`);
  }
  if (project.instructions.length === 0 || project.instructions.some(isBlank)) {
    errors.push(`${at}: needs at least one non-empty instruction.`);
  }
  if (!PROJECT_STATUSES.includes(project.status)) {
    errors.push(`${at}: unknown status "${project.status}".`);
  }

  if (project.layout !== undefined && !PROJECT_LAYOUTS.includes(project.layout)) {
    errors.push(`${at}: unknown layout "${project.layout}".`);
  }

  if (project.tags.length === 0 || project.tags.length > MAX_TAGS) {
    errors.push(`${at}: needs between 1 and ${MAX_TAGS} tags.`);
  }
  for (const tag of project.tags) {
    if (!SLUG_PATTERN.test(tag)) errors.push(`${at}: tag "${tag}" must be lowercase kebab-case.`);
  }
  for (const tag of findDuplicates(project.tags)) errors.push(`${at}: duplicate tag "${tag}".`);

  for (const slug of project.collectionSlugs) {
    if (!collectionSlugs.has(slug)) errors.push(`${at}: unknown collection "${slug}".`);
  }

  if (!isIsoDate(project.createdAt)) errors.push(`${at}: createdAt must be a YYYY-MM-DD date.`);
  if (!isIsoDate(project.updatedAt)) errors.push(`${at}: updatedAt must be a YYYY-MM-DD date.`);
  if (project.updatedAt < project.createdAt) errors.push(`${at}: updatedAt is before createdAt.`);

  if (isBlank(project.preview.alt)) errors.push(`${at}: preview needs alt text.`);
  if (project.preview.kind === "screenshot" && !project.preview.src?.startsWith("/")) {
    errors.push(`${at}: screenshot previews need a root-relative src.`);
  }

  if (project.sourceUrl !== undefined) {
    let protocol = "";
    try {
      protocol = new URL(project.sourceUrl).protocol;
    } catch {
      // Reported below.
    }
    if (protocol !== "https:") errors.push(`${at}: sourceUrl must be an absolute https URL.`);
  }

  return errors;
}

/**
 * Checks the whole registry. Returns a list of human-readable problems; an
 * empty list means the registry is valid.
 */
export function validateRegistry(
  projects: ProjectMetadata[],
  collections: CollectionDefinition[],
): string[] {
  const errors: string[] = [];
  const collectionSlugs = new Set(collections.map((collection) => collection.slug));

  for (const slug of findDuplicates(projects.map((project) => project.slug))) {
    errors.push(`Duplicate project slug "${slug}".`);
  }
  for (const slug of findDuplicates(collections.map((collection) => collection.slug))) {
    errors.push(`Duplicate collection slug "${slug}".`);
  }

  for (const collection of collections) {
    const at = `Collection "${collection.slug}"`;
    if (!SLUG_PATTERN.test(collection.slug))
      errors.push(`${at}: slug must be lowercase kebab-case.`);
    if (isBlank(collection.title)) errors.push(`${at}: "title" is required.`);
    if (isBlank(collection.description)) errors.push(`${at}: "description" is required.`);
    const hasVisibleProject = projects.some(
      (project) =>
        project.status !== "retired" && project.collectionSlugs.includes(collection.slug),
    );
    if (!hasVisibleProject) errors.push(`${at}: has no live or experimental projects.`);
  }

  for (const project of projects) errors.push(...validateProject(project, collectionSlugs));

  return errors;
}
