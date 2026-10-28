"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@side-bits/ui";
import type { NavigationItem } from "@/config/navigation";

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ items, className }: { items: NavigationItem[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cx(
                  "inline-flex min-h-11 items-center rounded-sm px-3 font-mono text-sm font-medium tracking-wider uppercase transition-colors duration-(--motion-fast)",
                  current
                    ? "text-accent underline decoration-accent decoration-2 underline-offset-8"
                    : "text-text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
