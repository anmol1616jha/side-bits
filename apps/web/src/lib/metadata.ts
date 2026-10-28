import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { socialImageSize } from "@/lib/social-image-size";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Root-relative path, used for the canonical URL. */
  path: string;
  /** Set false when the route has its own opengraph-image file. */
  defaultImage?: boolean;
}

/**
 * The site-wide preview image. Page-level `openGraph` replaces the parent's
 * rather than merging, so pages must list it explicitly. Explicit images also
 * override opengraph-image files, so routes with their own file opt out.
 */
const defaultSocialImage = {
  url: "/opengraph-image",
  ...socialImageSize,
  alt: `${siteConfig.name}: ${siteConfig.tagline}`,
};

/** Title, description, canonical URL and social previews for one route. */
export function pageMetadata({
  title,
  description,
  path,
  defaultImage = true,
}: PageMetadataInput): Metadata {
  // Omit the key entirely when opting out: even `images: undefined` hides the file image.
  const images = defaultImage ? { images: [defaultSocialImage] } : {};
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      ...images,
    },
    twitter: { card: "summary_large_image", title, description, ...images },
  };
}
