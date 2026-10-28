import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, SectionHeading } from "@side-bits/ui";
import { ProjectGrid } from "@/components/project-grid";
import {
  collectionPath,
  getCollection,
  getCollections,
  getProjectsInCollection,
} from "@/lib/collections";
import { pageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return pageMetadata({
    title: collection.title,
    description: collection.description,
    path: collectionPath(collection.slug),
  });
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href="/collections"
        className="mb-6 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-text-muted hover:text-text"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
        All collections
      </Link>
      <SectionHeading
        level={1}
        eyebrow="Collection"
        title={collection.title}
        description={collection.description}
      />
      <div className="mt-10">
        <ProjectGrid projects={getProjectsInCollection(collection.slug)} headingLevel={2} />
      </div>
    </Container>
  );
}
