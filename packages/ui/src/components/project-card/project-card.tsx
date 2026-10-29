import type { ComponentType, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cardClasses } from "../../lib/card";

export interface LinkLikeProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  /** Illustration or screenshot. Rendered in a fixed 16:9 frame. */
  preview: ReactNode;
  tags?: string[];
  /** Tags beyond this count are left off the card to avoid clutter. */
  maxTags?: number;
  /** Optional status badge. Live projects usually need none. */
  badge?: ReactNode;
  headingLevel?: 2 | 3;
  /** Router-aware link (e.g. Next.js `Link`). Defaults to a plain anchor. */
  linkComponent?: ComponentType<LinkLikeProps>;
  className?: string;
}

function Anchor({ href, className, children }: LinkLikeProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/**
 * The whole card is clickable through a stretched title link, so there is a
 * single tab stop and the link's name is the project title.
 */
export function ProjectCard({
  title,
  description,
  href,
  preview,
  tags = [],
  maxTags = 3,
  badge,
  headingLevel = 3,
  linkComponent: Link = Anchor,
  className,
}: ProjectCardProps) {
  const Heading = `h${headingLevel}` as const;
  const visibleTags = tags.slice(0, maxTags);

  return (
    <article className={cardClasses("overflow-hidden", className)}>
      <div className="aspect-video overflow-hidden border-b border-border bg-surface-muted">
        {preview}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {badge ? <div className="flex flex-wrap gap-2">{badge}</div> : null}
        <Heading className="font-display text-display-md font-semibold tracking-tight">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {title}
          </Link>
        </Heading>
        <p className="text-text-muted">{description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          {visibleTags.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {visibleTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm bg-surface-muted px-2 py-0.5 font-mono text-meta text-text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 hud-label text-meta text-accent"
          >
            Open
            <ArrowRight
              className="size-4 transition-transform duration-(--motion-base) group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </article>
  );
}
