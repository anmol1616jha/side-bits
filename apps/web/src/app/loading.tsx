import { Container } from "@side-bits/ui";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true">
      <p role="status" className="text-text-muted">
        Loading…
      </p>
    </Container>
  );
}
