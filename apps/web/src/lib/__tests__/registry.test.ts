import { describe, expect, it } from "vitest";
import { projectAppLoaders } from "../project-apps";
import { getAllEntries, getEntry, getLatestProjects, getVisibleProjects } from "../registry";

describe("project registry", () => {
  it("has at least one project", () => {
    expect(getAllEntries().length).toBeGreaterThan(0);
  });

  it.each(getAllEntries().map((entry) => [entry.metadata.slug, entry] as const))(
    "%s resolves to a valid entry point",
    async (_slug, entry) => {
      const App = await projectAppLoaders[entry.metadata.slug]!();
      expect(typeof App).toBe("function");
      if (entry.metadata.preview.kind !== "screenshot")
        expect(typeof entry.Preview).toBe("function");
    },
  );

  it("has exactly one app loader per registered project", () => {
    const slugs = getAllEntries().map((entry) => entry.metadata.slug);
    expect(Object.keys(projectAppLoaders).sort()).toEqual([...slugs].sort());
  });

  it("looks projects up by slug, not title", () => {
    const [first] = getAllEntries();
    expect(getEntry(first!.metadata.slug)).toBe(first);
    expect(getEntry(first!.metadata.title)).toBeUndefined();
    expect(getEntry("does-not-exist")).toBeUndefined();
  });

  it("keeps retired projects out of listings", () => {
    expect(getVisibleProjects().every((project) => project.status !== "retired")).toBe(true);
  });

  it("orders latest projects newest first", () => {
    const dates = getLatestProjects(10).map((project) => project.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});
