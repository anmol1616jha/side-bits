export const PROJECT_STATUSES = ["live", "experimental", "retired"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_LAYOUTS = ["sidebar", "wide"] as const;
export type ProjectLayout = (typeof PROJECT_LAYOUTS)[number];

export interface ProjectPreview {
  /** `screenshot` needs `src`; `illustration` and `css` are rendered by the project's Preview component. */
  kind: "screenshot" | "illustration" | "css";
  src?: string;
  alt: string;
}

/**
 * Content metadata for one project. Plain data with no React or framework
 * imports, so it can be validated by scripts and reused by a standalone app.
 */
export interface ProjectMetadata {
  /** Stable route identifier. Never derived from the title. */
  slug: string;
  title: string;
  /** Card copy. Aim for one or two lines. */
  description: string;
  /** "What this does" on the project page. */
  summary: string;
  /** Short usage steps, in order. */
  instructions: string[];
  /** Plain statement of what happens to anything the user enters. */
  dataHandling: string;
  tags: string[];
  collectionSlugs: string[];
  status: ProjectStatus;
  featured?: boolean;
  /** ISO date, YYYY-MM-DD. */
  createdAt: string;
  /** ISO date, YYYY-MM-DD. */
  updatedAt: string;
  preview: ProjectPreview;
  /** Page layout; defaults to `sidebar`. Use `wide` for tools with their own side panel. */
  layout?: ProjectLayout;
  sourceUrl?: string;
  seoDescription?: string;
}
