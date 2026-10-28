import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CollectionDefinition, ProjectMetadata } from "@side-bits/project-contract";
import { collectionPath } from "@/lib/collections";

interface CollectionCardProps {
  collection: CollectionDefinition;
  projects: ProjectMetadata[];
  headingLevel?: 2 | 3;
}

export function CollectionCard({ collection, projects, headingLevel = 3 }: CollectionCardProps) {
  const Heading = `h${headingLevel}` as const;
  const count = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;

  return (
    <article className="group relative flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-colors duration-(--motion-base) hover:border-text-muted has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus">
      <p className="text-meta font-medium text-text-muted">{count}</p>
      <Heading className="mt-1 font-display text-display-md font-semibold tracking-tight">
        <Link
          href={collectionPath(collection.slug)}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {collection.title}
        </Link>
      </Heading>
      <p className="mt-2 text-text-muted">{collection.description}</p>
      <p className="mt-4 text-sm text-text">
        {projects.map((project) => project.title).join(" · ")}
      </p>
      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent"
      >
        Browse collection
        <ArrowRight
          className="size-4 transition-transform duration-(--motion-base) group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </span>
    </article>
  );
}
