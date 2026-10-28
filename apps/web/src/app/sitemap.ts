import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { collectionPath, getCollections } from "@/lib/collections";
import { getVisibleProjects, projectPath } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const projects = getVisibleProjects();
  const latestUpdate = projects
    .map((project) => project.updatedAt)
    .sort()
    .at(-1);

  return [
    { url: url("/"), lastModified: latestUpdate },
    { url: url("/explore"), lastModified: latestUpdate },
    { url: url("/collections"), lastModified: latestUpdate },
    { url: url("/about") },
    ...getCollections().map((collection) => ({ url: url(collectionPath(collection.slug)) })),
    // Retired projects are excluded; their pages are also marked noindex.
    ...projects.map((project) => ({
      url: url(projectPath(project.slug)),
      lastModified: project.updatedAt,
    })),
  ];
}
