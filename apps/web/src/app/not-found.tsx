import type { Metadata } from "next";
import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Container, EmptyState, buttonClasses } from "@side-bits/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        headingLevel={1}
        icon={<MapPinOff className="size-8" strokeWidth={1.5} />}
        title="Page not found"
        description="There's nothing at this address. It may have moved, or it never existed."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/explore" className={buttonClasses()}>
              Explore projects
            </Link>
            <Link href="/" className={buttonClasses({ variant: "secondary" })}>
              Go home
            </Link>
          </div>
        }
      />
    </Container>
  );
}
