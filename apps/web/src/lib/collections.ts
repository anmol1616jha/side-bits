import type { CollectionDefinition, ProjectMetadata } from "@side-bits/project-contract";
import { collections } from "@/content/collections";
import { getVisibleProjects } from "@/lib/registry";

export function getCollections(): CollectionDefinition[] {
  return collections;
}

export function getCollection(slug: string): CollectionDefinition | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProjectsInCollection(slug: string): ProjectMetadata[] {
  return getVisibleProjects().filter((project) => project.collectionSlugs.includes(slug));
}

export function collectionPath(slug: string): string {
  return `/collections/${slug}`;
}
