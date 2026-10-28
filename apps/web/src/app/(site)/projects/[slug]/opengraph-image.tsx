import { siteConfig } from "@/config/site";
import { getAllEntries, getEntry } from "@/lib/registry";
import { renderSocialImage, socialImageContentType, socialImageSize } from "@/lib/social-image";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = `Preview card for a ${siteConfig.name} project`;

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.metadata.slug }));
}

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getEntry(slug)?.metadata;
  return renderSocialImage({
    eyebrow: `A ${siteConfig.name} project`,
    title: project?.title ?? "Project",
    description: project?.description ?? "",
  });
}
