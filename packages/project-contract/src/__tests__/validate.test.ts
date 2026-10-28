import { describe, expect, it } from "vitest";
import type { CollectionDefinition } from "../collection.ts";
import type { ProjectMetadata } from "../project.ts";
import { validateRegistry } from "../validate.ts";

const collections: CollectionDefinition[] = [
  { slug: "useful", title: "Useful", description: "Tools that help." },
];

function project(overrides: Partial<ProjectMetadata> = {}): ProjectMetadata {
  return {
    slug: "sample",
    title: "Sample",
    description: "A sample project.",
    summary: "Does sample things.",
    instructions: ["Use it."],
    dataHandling: "Stays in your browser.",
    tags: ["sample"],
    collectionSlugs: ["useful"],
    status: "live",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-02",
    preview: { kind: "illustration", alt: "A sample illustration." },
    ...overrides,
  };
}

describe("validateRegistry", () => {
  it("accepts a valid registry", () => {
    expect(validateRegistry([project()], collections)).toEqual([]);
  });

  it("catches duplicate project slugs", () => {
    const errors = validateRegistry([project(), project({ title: "Other" })], collections);
    expect(errors).toContain('Duplicate project slug "sample".');
  });

  it("catches duplicate collection slugs", () => {
    const errors = validateRegistry([project()], [...collections, ...collections]);
    expect(errors).toContain('Duplicate collection slug "useful".');
  });

  it("catches unknown collection references", () => {
    const errors = validateRegistry([project({ collectionSlugs: ["missing"] })], collections);
    expect(errors).toContain('Project "sample": unknown collection "missing".');
  });

  it("catches collections with nothing visible in them", () => {
    const errors = validateRegistry([project({ status: "retired" })], collections);
    expect(errors).toContain('Collection "useful": has no live or experimental projects.');
  });

  it("rejects invalid statuses, slugs and dates", () => {
    const errors = validateRegistry(
      [
        project({
          slug: "Bad Slug",
          status: "beta" as ProjectMetadata["status"],
          createdAt: "2026-02-30",
          updatedAt: "yesterday",
        }),
      ],
      collections,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'Project "Bad Slug": slug must be lowercase kebab-case.',
        'Project "Bad Slug": unknown status "beta".',
        'Project "Bad Slug": createdAt must be a YYYY-MM-DD date.',
        'Project "Bad Slug": updatedAt must be a YYYY-MM-DD date.',
      ]),
    );
  });

  it("accepts known layouts and rejects unknown ones", () => {
    expect(validateRegistry([project({ layout: "wide" })], collections)).toEqual([]);
    const errors = validateRegistry(
      [project({ layout: "huge" as ProjectMetadata["layout"] })],
      collections,
    );
    expect(errors).toContain('Project "sample": unknown layout "huge".');
  });

  it("rejects updatedAt before createdAt", () => {
    const errors = validateRegistry([project({ updatedAt: "2026-09-01" })], collections);
    expect(errors).toContain('Project "sample": updatedAt is before createdAt.');
  });

  it("requires content fields and instructions", () => {
    const errors = validateRegistry(
      [project({ title: " ", dataHandling: "", instructions: [] })],
      collections,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'Project "sample": "title" is required.',
        'Project "sample": "dataHandling" is required.',
        'Project "sample": needs at least one non-empty instruction.',
      ]),
    );
  });

  it("rejects duplicate instructions", () => {
    const errors = validateRegistry(
      [project({ instructions: ["Use it.", "Use it."] })],
      collections,
    );
    expect(errors).toContain('Project "sample": duplicate instruction "Use it.".');
  });

  it("rejects protocol-relative screenshot sources", () => {
    const errors = validateRegistry(
      [
        project({
          preview: { kind: "screenshot", src: "//elsewhere.example/a.png", alt: "Shot." },
        }),
      ],
      collections,
    );
    expect(errors).toContain('Project "sample": screenshot previews need a root-relative src.');
  });

  it("requires a src for screenshot previews and https source links", () => {
    const errors = validateRegistry(
      [
        project({
          preview: { kind: "screenshot", alt: "Screenshot." },
          sourceUrl: "http://example.com",
        }),
      ],
      collections,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'Project "sample": screenshot previews need a root-relative src.',
        'Project "sample": sourceUrl must be an absolute https URL.',
      ]),
    );
  });

  it("limits tags and their format", () => {
    const errors = validateRegistry(
      [project({ tags: ["Upper", "a", "a", "b", "c", "d", "e"] })],
      collections,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        'Project "sample": needs between 1 and 6 tags.',
        'Project "sample": tag "Upper" must be lowercase kebab-case.',
        'Project "sample": duplicate tag "a".',
      ]),
    );
  });
});
