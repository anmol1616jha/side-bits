import Link from "next/link";
import type { ReactNode } from "react";
import { ProjectCard } from "@side-bits/ui";
import type { ProjectMetadata } from "@side-bits/project-contract";
import { projectGridClassName } from "@/components/project-grid-class";
import { ProjectPreview } from "@/components/project-preview";
import { StatusBadge } from "@/components/status-badge";
import { getEntry, projectPath } from "@/lib/registry";

export function renderProjectCard(project: ProjectMetadata, headingLevel: 2 | 3 = 3): ReactNode {
  const entry = getEntry(project.slug);
  if (!entry) return null;
  const badge = project.status === "live" ? undefined : <StatusBadge status={project.status} />;

  return (
    <ProjectCard
      title={project.title}
      description={project.description}
      href={projectPath(project.slug)}
      tags={project.tags}
      badge={badge}
      headingLevel={headingLevel}
      linkComponent={Link}
      preview={<ProjectPreview entry={entry} />}
    />
  );
}

export function ProjectGrid({
  projects,
  headingLevel = 3,
}: {
  projects: ProjectMetadata[];
  headingLevel?: 2 | 3;
}) {
  return (
    <ul className={projectGridClassName}>
      {projects.map((project) => (
        <li key={project.slug}>{renderProjectCard(project, headingLevel)}</li>
      ))}
    </ul>
  );
}
