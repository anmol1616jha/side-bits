"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button, EmptyState, FilterChip, SearchInput } from "@side-bits/ui";
import type { ProjectStatus } from "@side-bits/project-contract";
import { projectGridClassName } from "@/components/project-grid-class";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { trackEvent } from "@/lib/analytics";
import { filterProjects } from "@/lib/search";
import type { ProjectFilters, SearchableProject } from "@/lib/search";

export interface DirectoryOption<T extends string = string> {
  value: T;
  label: string;
}

interface ProjectDirectoryProps {
  projects: SearchableProject[];
  /** Server-rendered cards keyed by project slug. */
  cards: Record<string, ReactNode>;
  collections: DirectoryOption[];
  statuses: DirectoryOption<ProjectStatus>[];
}

const ANNOUNCE_DELAY_MS = 500;

function readFilters(
  params: URLSearchParams,
  collections: DirectoryOption[],
  statuses: DirectoryOption<ProjectStatus>[],
): ProjectFilters {
  // Unknown values in a shared or hand-edited URL are ignored rather than trusted.
  const collection = params.get("collection");
  const status = params.get("status");
  return {
    query: params.get("q") ?? "",
    collection: collections.find((option) => option.value === collection)?.value ?? null,
    status: statuses.find((option) => option.value === status)?.value ?? null,
  };
}

function writeFiltersToUrl(filters: ProjectFilters): void {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.status) params.set("status", filters.status);
  const search = params.toString();
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
}

function countLabel(shown: number, total: number): string {
  const noun = total === 1 ? "project" : "projects";
  return shown === total ? `Showing all ${total} ${noun}` : `Showing ${shown} of ${total} ${noun}`;
}

export function ProjectDirectory({
  projects,
  cards,
  collections,
  statuses,
}: ProjectDirectoryProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProjectFilters>(() =>
    readFilters(new URLSearchParams(searchParams.toString()), collections, statuses),
  );
  const collectionLabelId = useId();
  const statusLabelId = useId();

  const results = useMemo(() => filterProjects(projects, filters), [projects, filters]);
  const summary = countLabel(results.length, projects.length);

  // Announce result counts only after the user changes something, and only once
  // they pause, to avoid a screen reader reading every keystroke. Every change is
  // announced, even when the count text is the same as last time.
  const hasInteracted = useRef(false);
  const [announcement, setAnnouncement] = useState("");
  const debouncedFilters = useDebouncedValue(filters, ANNOUNCE_DELAY_MS);
  useEffect(() => {
    if (!hasInteracted.current) return;
    const resultCount = filterProjects(projects, debouncedFilters).length;
    const message = countLabel(resultCount, projects.length);
    // Identical text doesn't change the live region, so alternate a trailing no-break space.
    setAnnouncement((previous) => (previous === message ? `${message}\u00A0` : message));
    trackEvent({
      name: "directory_filtered",
      properties: {
        resultCount,
        // Whether a search was made, never what was typed.
        hasQuery: debouncedFilters.query.trim() !== "",
        collection: debouncedFilters.collection,
        status: debouncedFilters.status,
      },
    });
  }, [debouncedFilters, projects]);

  function update(patch: Partial<ProjectFilters>) {
    hasInteracted.current = true;
    const next = { ...filters, ...patch };
    setFilters(next);
    writeFiltersToUrl(next);
  }

  const hasFilters = Boolean(filters.query.trim() || filters.collection || filters.status);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <SearchInput
          label="Search projects"
          placeholder="Try “json”, “text” or “case”"
          value={filters.query}
          onValueChange={(query) => update({ query })}
          className="max-w-xl"
          autoComplete="off"
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10">
          <div role="group" aria-labelledby={collectionLabelId}>
            <p id={collectionLabelId} className="mb-2 text-sm font-medium">
              Collection
            </p>
            <div className="flex flex-wrap gap-2">
              {collections.map((option) => (
                <FilterChip
                  key={option.value}
                  selected={filters.collection === option.value}
                  onClick={() =>
                    update({
                      collection: filters.collection === option.value ? null : option.value,
                    })
                  }
                >
                  {option.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {statuses.length > 1 ? (
            <div role="group" aria-labelledby={statusLabelId}>
              <p id={statusLabelId} className="mb-2 text-sm font-medium">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((option) => (
                  <FilterChip
                    key={option.value}
                    selected={filters.status === option.value}
                    onClick={() =>
                      update({ status: filters.status === option.value ? null : option.value })
                    }
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-text-muted">{summary}</p>
          {/* With no results, the empty state below has its own "Clear filters". */}
          {hasFilters && results.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => update({ query: "", collection: null, status: null })}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>

      {results.length > 0 ? (
        <ul className={projectGridClassName}>
          {results.map((project) => (
            <li key={project.slug}>{cards[project.slug]}</li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<SearchX className="size-8" strokeWidth={1.5} />}
          title="Nothing here"
          description="Either it's very specific, or it hasn't been built yet."
          action={
            <Button
              variant="secondary"
              onClick={() => update({ query: "", collection: null, status: null })}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
