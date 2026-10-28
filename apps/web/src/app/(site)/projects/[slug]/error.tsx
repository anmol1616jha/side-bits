"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button, Container, EmptyState, buttonClasses } from "@side-bits/ui";

// Contains a crash to this one project; the header and the rest of the site keep working.
export default function ProjectError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-16">
      <EmptyState
        headingLevel={1}
        title="This project stopped working"
        description="Something went wrong while running it. Trying again often helps; if not, the other projects are unaffected."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>
              <RotateCcw aria-hidden="true" className="size-5" strokeWidth={1.75} />
              Try again
            </Button>
            <Link href="/explore" className={buttonClasses({ variant: "secondary" })}>
              Explore other projects
            </Link>
          </div>
        }
      />
    </Container>
  );
}
