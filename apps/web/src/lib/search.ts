import type { ProjectStatus } from "@side-bits/project-contract";

/** The searchable view of a project, also sent to the client directory. */
export interface SearchableProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  collectionSlugs: string[];
  collectionTitles: string[];
  status: ProjectStatus;
}

export interface ProjectFilters {
  query: string;
  collection: string | null;
  status: ProjectStatus | null;
}

function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function searchableText(project: SearchableProject): string {
  return normalize(
    [project.title, project.description, ...project.tags, ...project.collectionTitles].join(" "),
  );
}

/**
 * Every word in the query must appear somewhere in the project's title,
 * description, tags or collection names. Case and accents are ignored.
 */
export function filterProjects<T extends SearchableProject>(
  projects: T[],
  filters: ProjectFilters,
): T[] {
  const words = normalize(filters.query).split(/\s+/).filter(Boolean);

  return projects.filter((project) => {
    if (filters.collection && !project.collectionSlugs.includes(filters.collection)) return false;
    if (filters.status && project.status !== filters.status) return false;
    if (words.length === 0) return true;
    const text = searchableText(project);
    return words.every((word) => text.includes(word));
  });
}
