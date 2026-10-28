import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SearchableProject } from "@/lib/search";
import { ProjectDirectory } from "../project-directory";

let currentSearch = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(currentSearch),
}));

const projects: SearchableProject[] = [
  {
    slug: "json-fixer",
    title: "JSON Fixer",
    description: "Tidy JSON.",
    tags: ["json"],
    collectionSlugs: ["actually-useful"],
    collectionTitles: ["Actually useful"],
    status: "live",
  },
  {
    slug: "tiny-text-lab",
    title: "Tiny Text Lab",
    description: "Tidy text.",
    tags: ["writing"],
    collectionSlugs: ["odd-ones"],
    collectionTitles: ["Odd ones"],
    status: "live",
  },
];

const cards = Object.fromEntries(
  projects.map((project) => [project.slug, <p key={project.slug}>{project.title}</p>]),
);

function renderDirectory() {
  return render(
    <ProjectDirectory
      projects={projects}
      cards={cards}
      collections={[
        { value: "actually-useful", label: "Actually useful" },
        { value: "odd-ones", label: "Odd ones" },
      ]}
      statuses={[{ value: "live", label: "Live" }]}
    />,
  );
}

function visibleTitles() {
  return within(screen.getByRole("list"))
    .queryAllByRole("listitem")
    .map((item) => item.textContent);
}

beforeEach(() => {
  currentSearch = "";
  window.history.replaceState(null, "", "/explore");
});

describe("ProjectDirectory", () => {
  it("shows every project by default", () => {
    renderDirectory();
    expect(visibleTitles()).toEqual(["JSON Fixer", "Tiny Text Lab"]);
    expect(screen.getByText("Showing all 2 projects")).toBeTruthy();
  });

  it("filters by search text and writes it to the URL", () => {
    renderDirectory();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search projects" }), {
      target: { value: "json" },
    });
    expect(visibleTitles()).toEqual(["JSON Fixer"]);
    expect(window.location.search).toBe("?q=json");
  });

  it("filters by collection with a keyboard-operable toggle", () => {
    renderDirectory();
    const chip = screen.getByRole("button", { name: "Odd ones" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(visibleTitles()).toEqual(["Tiny Text Lab"]);
    fireEvent.click(chip);
    expect(visibleTitles()).toEqual(["JSON Fixer", "Tiny Text Lab"]);
  });

  it("hides the status filter when there is only one status", () => {
    renderDirectory();
    expect(screen.queryByRole("group", { name: "Status" })).toBeNull();
  });

  it("shows an empty state that can clear the filters", () => {
    renderDirectory();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "nothing matches" } });
    expect(screen.getByRole("heading", { name: "Nothing here" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(visibleTitles()).toEqual(["JSON Fixer", "Tiny Text Lab"]);
  });

  it("restores filters from the URL and ignores unknown values", () => {
    currentSearch = "?collection=actually-useful&status=bogus";
    renderDirectory();
    expect(visibleTitles()).toEqual(["JSON Fixer"]);
  });

  it("announces the result count after the user pauses", () => {
    vi.useFakeTimers();
    renderDirectory();
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "json" } });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(status.textContent).toBe("Showing 1 of 2 projects");
    vi.useRealTimers();
  });

  it("announces a change even when the count text stays the same", () => {
    vi.useFakeTimers();
    renderDirectory();
    const status = screen.getByRole("status");
    const chip = screen.getByRole("button", { name: "Odd ones" });
    fireEvent.click(chip);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    fireEvent.click(chip);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(status.textContent).toBe("Showing all 2 projects");
    fireEvent.click(screen.getByRole("button", { name: "Actually useful" }));
    fireEvent.click(screen.getByRole("button", { name: "Actually useful" }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(status.textContent).toBe("Showing all 2 projects\u00A0");
    vi.useRealTimers();
  });
});
