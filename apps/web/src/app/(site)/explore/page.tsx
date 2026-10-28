import { Suspense } from "react";
import type { ReactNode } from "react";
import { Container, SectionHeading } from "@side-bits/ui";
import type { ProjectStatus } from "@side-bits/project-contract";
import { siteConfig } from "@/config/site";
import { ProjectDirectory } from "@/components/project-directory";
import type { DirectoryOption } from "@/components/project-directory";
import { ProjectGrid, renderProjectCard } from "@/components/project-grid";
import { getCollection, getCollections } from "@/lib/collections";
import { pageMetadata } from "@/lib/metadata";
import { getVisibleProjects } from "@/lib/registry";
import type { SearchableProject } from "@/lib/search";

export const metadata = pageMetadata({
  title: "Explore",
  description: `Search and filter every ${siteConfig.name} project: small tools, odd experiments and tiny websites.`,
  path: "/explore",
});

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  experimental: "Experimental",
  retired: "Retired",
};

export default function ExplorePage() {
  const projects = getVisibleProjects();

  const searchable: SearchableProject[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    tags: project.tags,
    collectionSlugs: project.collectionSlugs,
    collectionTitles: project.collectionSlugs
      .map((slug) => getCollection(slug)?.title)
      .filter((title) => title !== undefined),
    status: project.status,
  }));

  const cards: Record<string, ReactNode> = Object.fromEntries(
    projects.map((project) => [project.slug, renderProjectCard(project, 2)]),
  );

  const collections: DirectoryOption[] = getCollections().map((collection) => ({
    value: collection.slug,
    label: collection.title,
  }));

  const statuses: DirectoryOption<ProjectStatus>[] = [
    ...new Set(projects.map((project) => project.status)),
  ].map((status) => ({ value: status, label: STATUS_LABELS[status] }));

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        level={1}
        title="Explore the bits"
        description="Everything currently on the shelf. Search by name, tag or collection."
      />
      <div className="mt-10">
        {/* Without JavaScript (or before it loads) the full list still renders. */}
        <Suspense fallback={<ProjectGrid projects={projects} headingLevel={2} />}>
          <ProjectDirectory
            projects={searchable}
            cards={cards}
            collections={collections}
            statuses={statuses}
          />
        </Suspense>
      </div>
    </Container>
  );
}
