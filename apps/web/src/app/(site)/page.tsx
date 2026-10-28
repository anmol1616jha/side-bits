import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, buttonClasses } from "@side-bits/ui";
import { CollectionCard } from "@/components/collection-card";
import { ProjectGrid } from "@/components/project-grid";
import { ProjectPreview } from "@/components/project-preview";
import { getCollections, getProjectsInCollection } from "@/lib/collections";
import { defaultSocialImage, siteOpenGraph } from "@/lib/metadata";
import {
  getEntry,
  getFeaturedProjects,
  getLatestProjects,
  getVisibleProjects,
} from "@/lib/registry";

// Keeps the layout's default title. Page-level openGraph replaces the layout's, so the image is listed again.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, url: "/", images: [defaultSocialImage] },
};

const LATEST_LIMIT = 3;
const HERO_PREVIEW_LIMIT = 4;

export default function HomePage() {
  const featured = getFeaturedProjects();
  const featuredSlugs = new Set(featured.map((project) => project.slug));
  // Skip anything already shown under "Start here" so the page doesn't repeat itself.
  const latest = getLatestProjects(LATEST_LIMIT + featured.length)
    .filter((project) => !featuredSlugs.has(project.slug))
    .slice(0, LATEST_LIMIT);
  const heroEntries = getVisibleProjects()
    .slice(0, HERO_PREVIEW_LIMIT)
    .map((project) => getEntry(project.slug))
    .filter((entry) => entry !== undefined);
  const collections = getCollections();

  return (
    <>
      <Container className="grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <p className="mb-4 font-mono text-meta font-medium tracking-widest text-accent uppercase">
            <span aria-hidden="true">{"// "}</span>
            Small projects. Side quests. Questionable priorities.
          </p>
          <h1 className="font-display text-display-xl font-semibold tracking-tight">
            A little corner of the internet for things that didn&apos;t need to exist.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Useful tools, odd experiments, and tiny websites made because someone asked &ldquo;what
            if?&rdquo; Some may save you time. Others may steal three minutes. That&apos;s the
            arrangement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className={buttonClasses()}>
              Explore the bits
              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* A loose arrangement of real project previews; purely decorative. */}
        <div aria-hidden="true" className="hidden grid-cols-2 gap-4 sm:grid">
          {heroEntries.map((entry, index) => (
            <div
              key={entry.metadata.slug}
              className={`hud-frame aspect-video overflow-hidden rounded-md border border-border bg-surface shadow-[0_0_40px_-16px_var(--color-accent)] ${
                index % 2 === 1 ? "translate-y-6" : ""
              }`}
            >
              <ProjectPreview entry={entry} />
            </div>
          ))}
        </div>
      </Container>

      {featured.length > 0 ? (
        <Container as="section" aria-labelledby="featured-heading" className="py-10">
          <SectionHeading
            id="featured-heading"
            eyebrow="Sector 01"
            title="Start here"
            description="The ones most likely to be worth your three minutes."
            action={
              <Link
                href="/explore"
                className="inline-flex min-h-11 items-center gap-1 font-mono text-sm font-medium tracking-wider text-accent uppercase underline-offset-4 hover:underline"
              >
                See everything
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
              </Link>
            }
          />
          <div className="mt-8">
            <ProjectGrid projects={featured} />
          </div>
        </Container>
      ) : null}

      {latest.length > 0 ? (
        <Container as="section" aria-labelledby="latest-heading" className="py-10">
          <SectionHeading id="latest-heading" eyebrow="Sector 02" title="Freshly assembled" />
          <div className="mt-8">
            <ProjectGrid projects={latest} />
          </div>
        </Container>
      ) : null}

      <Container as="section" aria-labelledby="collections-heading" className="py-10">
        <SectionHeading
          id="collections-heading"
          eyebrow="Sector 03"
          title="Collections"
          description="Loosely curated, strictly optional."
        />
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <CollectionCard
                collection={collection}
                projects={getProjectsInCollection(collection.slug)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
