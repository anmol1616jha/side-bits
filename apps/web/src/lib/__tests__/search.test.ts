import { describe, expect, it } from "vitest";
import { filterProjects } from "../search";
import type { ProjectFilters, SearchableProject } from "../search";

const projects: SearchableProject[] = [
  {
    slug: "json-fixer",
    title: "JSON Fixer",
    description: "Tidy messy JSON.",
    tags: ["json", "developer-tools"],
    collectionSlugs: ["actually-useful"],
    collectionTitles: ["Actually useful"],
    status: "live",
  },
  {
    slug: "tiny-text-lab",
    title: "Tiny Text Lab",
    description: "Questionable text tricks, on demand.",
    tags: ["writing"],
    collectionSlugs: ["odd-ones"],
    collectionTitles: ["Odd ones"],
    status: "experimental",
  },
];

const none: ProjectFilters = { query: "", collection: null, status: null };
const slugs = (filters: Partial<ProjectFilters>) =>
  filterProjects(projects, { ...none, ...filters }).map((project) => project.slug);

describe("filterProjects", () => {
  it("returns everything with no filters", () => {
    expect(slugs({})).toEqual(["json-fixer", "tiny-text-lab"]);
  });

  it("matches title, description, tags and collection titles, ignoring case", () => {
    expect(slugs({ query: "json" })).toEqual(["json-fixer"]);
    expect(slugs({ query: "ON DEMAND" })).toEqual(["tiny-text-lab"]);
    expect(slugs({ query: "writing" })).toEqual(["tiny-text-lab"]);
    expect(slugs({ query: "useful" })).toEqual(["json-fixer"]);
  });

  it("requires every word to match", () => {
    expect(slugs({ query: "json writing" })).toEqual([]);
    expect(slugs({ query: "  tidy   json " })).toEqual(["json-fixer"]);
  });

  it("ignores accents", () => {
    expect(slugs({ query: "téxt" })).toEqual(["tiny-text-lab"]);
  });

  it("filters by collection and status", () => {
    expect(slugs({ collection: "actually-useful" })).toEqual(["json-fixer"]);
    expect(slugs({ status: "experimental" })).toEqual(["tiny-text-lab"]);
    expect(slugs({ collection: "actually-useful", status: "experimental" })).toEqual([]);
  });

  it("treats regex characters as plain text", () => {
    expect(slugs({ query: ".*" })).toEqual([]);
  });
});
