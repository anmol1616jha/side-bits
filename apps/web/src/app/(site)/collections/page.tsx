import { Container, SectionHeading } from "@side-bits/ui";
import { CollectionCard } from "@/components/collection-card";
import { getCollections, getProjectsInCollection } from "@/lib/collections";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Collections",
  description: "Side-bits projects grouped loosely by what they are for, or what they are not for.",
  path: "/collections",
});

export default function CollectionsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        level={1}
        title="Collections"
        description="Projects grouped by purpose, or by the lack of one."
      />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {getCollections().map((collection) => (
          <li key={collection.slug}>
            <CollectionCard
              collection={collection}
              projects={getProjectsInCollection(collection.slug)}
              headingLevel={2}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}
