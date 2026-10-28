"use client";

import { useId, useState } from "react";
import { Button, ChoiceGroup, cx } from "@side-bits/ui";
import { TRANSFORMS, TRANSFORM_GROUPS } from "../lib/transforms";
import type { Transform, TransformGroup } from "../lib/transforms";

interface TextToolsPanelProps {
  /** Transformations are paused (empty or oversized text). */
  transformsDisabled: boolean;
  onApply: (transform: Transform) => void;
}

/**
 * The transformations, in one panel beside the text (copy, undo, redo and clear
 * live in the bar under the text box). From tablet width up it sits to the
 * right of the text box and stays in view while scrolling; on phones it sits
 * under the text box, with tabs picking a group and its buttons in one
 * swipeable row.
 */
export function TextToolsPanel({ transformsDisabled, onApply }: TextToolsPanelProps) {
  const [activeGroup, setActiveGroup] = useState<TransformGroup>("case");
  const idPrefix = useId();

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="space-y-4 rounded-md border border-border bg-surface p-4 md:sticky md:top-4"
    >
      <h2 id={`${idPrefix}-heading`} className="sr-only">
        Text tools
      </h2>
      <ChoiceGroup
        legend="Tool group"
        hideLegend
        options={TRANSFORM_GROUPS.map((group) => ({ value: group.id, label: group.label }))}
        value={activeGroup}
        onChange={setActiveGroup}
        className="md:hidden"
      />

      <div className="space-y-4">
        {TRANSFORM_GROUPS.map((group) => {
          const labelId = `${idPrefix}-${group.id}`;
          return (
            <div
              key={group.id}
              role="group"
              aria-labelledby={labelId}
              className={cx(group.id === activeGroup ? "block" : "hidden", "md:block")}
            >
              <h3 id={labelId} className="mb-2 hidden text-sm font-medium text-text-muted md:block">
                {group.label}
              </h3>
              {/* One swipeable row on phones; wraps in the side panel. Padding keeps focus rings unclipped. */}
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 md:flex-wrap md:overflow-visible">
                {TRANSFORMS.filter((transform) => transform.group === group.id).map((transform) => (
                  <Button
                    key={transform.id}
                    variant="secondary"
                    size="sm"
                    onClick={() => onApply(transform)}
                    disabled={transformsDisabled}
                    className="shrink-0"
                  >
                    {transform.label}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
