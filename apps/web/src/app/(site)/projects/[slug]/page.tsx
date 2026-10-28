import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft } from "lucide-react";
import { EmptyState, ProjectShell, buttonClasses } from "@side-bits/ui";
import { StatusBadge } from "@/components/status-badge";
import { collectionPath, getCollection } from "@/lib/collections";
import { pageMetadata } from "@/lib/metadata";
import { loadProjectApp } from "@/lib/project-apps";
import { getAllEntries, getEntry, projectPath } from "@/lib/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.metadata.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getEntry(slug)?.metadata;
  if (!project) return {};
  return {
    ...pageMetadata({
      title: project.title,
      description: project.seoDescription ?? project.description,
      path: projectPath(project.slug),
      defaultImage: false,
    }),
    // Retired projects keep their page for old links but drop out of search results.
    ...(project.status === "retired" ? { robots: { index: false } } : {}),
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const project = entry.metadata;
  const collections = project.collectionSlugs
    .map((collectionSlug) => getCollection(collectionSlug))
    .filter((collection) => collection !== undefined);
  const ProjectApp = project.status === "retired" ? null : await loadProjectApp(project.slug);

  return (
    <ProjectShell
      title={project.title}
      summary={project.summary}
      instructions={project.instructions}
      dataHandling={project.dataHandling}
      layout={project.layout}
      breadcrumb={
        <Link
          href="/explore"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-text-muted hover:text-text"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
          All projects
        </Link>
      }
      meta={
        <>
          <StatusBadge status={project.status} />
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={collectionPath(collection.slug)}
              className="rounded-sm border border-border px-2 py-0.5 text-meta font-medium text-text-muted hover:border-text-muted hover:text-text"
            >
              {collection.title}
            </Link>
          ))}
        </>
      }
    >
      {ProjectApp ? (
        <ProjectApp />
      ) : (
        <EmptyState
          icon={<Archive className="size-8" strokeWidth={1.5} />}
          title="This bit has clocked out."
          description="It has been retired and is no longer available. The rest of the playground is still open."
          action={
            <Link href="/explore" className={buttonClasses({ variant: "secondary" })}>
              Explore other projects
            </Link>
          }
        />
      )}
    </ProjectShell>
  );
}
