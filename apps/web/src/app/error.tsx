"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button, Container, EmptyState, buttonClasses } from "@side-bits/ui";

export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Keeps the cause visible in the browser console; the digest matches the server log.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        headingLevel={1}
        title="Something went wrong"
        description="This page failed to load. It's not something you did. Try again, or head back home."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={retry}>
              <RotateCcw aria-hidden="true" className="size-5" strokeWidth={1.75} />
              Try again
            </Button>
            <Link href="/" className={buttonClasses({ variant: "secondary" })}>
              Go home
            </Link>
          </div>
        }
      />
    </Container>
  );
}
