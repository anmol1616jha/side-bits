"use client";

import { Eraser, Redo2, Undo2 } from "lucide-react";
import { Button, CopyButton } from "@side-bits/ui";

interface TextActionsProps {
  text: string;
  canUndo: boolean;
  canRedo: boolean;
  notice: string;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

/** Action bar joined to the bottom edge of the text box. */
export function TextActions({
  text,
  canUndo,
  canRedo,
  notice,
  onUndo,
  onRedo,
  onClear,
}: TextActionsProps) {
  return (
    <div className="-mt-px flex flex-wrap items-center gap-2 rounded-b-sm border border-text-muted bg-surface-muted px-2 py-2">
      <CopyButton
        value={text}
        label="Copy text"
        variant="primary"
        size="sm"
        disabled={text === ""}
      />
      <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
        <Undo2 aria-hidden="true" className="size-4" strokeWidth={2} />
        {/* Icon-only on phones so the bar fits on one line; the text stays as the accessible name. */}
        <span className="sr-only sm:not-sr-only">Undo</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
        <Redo2 aria-hidden="true" className="size-4" strokeWidth={2} />
        <span className="sr-only sm:not-sr-only">Redo</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear} disabled={text === ""}>
        <Eraser aria-hidden="true" className="size-4" strokeWidth={2} />
        <span className="sr-only sm:not-sr-only">Clear</span>
      </Button>
      {/* Always rendered (never display:none) so screen readers reliably announce updates. */}
      <p
        role="status"
        className="basis-full px-1 text-sm text-text-muted empty:basis-0 sm:ml-auto sm:basis-auto"
      >
        {notice}
      </p>
    </div>
  );
}
