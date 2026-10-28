import { Archive, FlaskConical } from "lucide-react";
import { Badge } from "@side-bits/ui";
import type { ProjectStatus } from "@side-bits/project-contract";

/** Live projects get no badge; the others say so in words, not just color. */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "experimental") {
    return (
      <Badge tone="warning" icon={<FlaskConical className="size-3.5" strokeWidth={2} />}>
        Experimental
      </Badge>
    );
  }
  if (status === "retired") {
    return <Badge icon={<Archive className="size-3.5" strokeWidth={2} />}>Retired</Badge>;
  }
  return null;
}
