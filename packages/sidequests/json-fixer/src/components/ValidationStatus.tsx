import { Wand2 } from "lucide-react";
import { Button, StatusMessage } from "@side-bits/ui";
import { ERROR_SNIPPET_RADIUS, MAX_INPUT_CHARACTERS } from "../constants";
import type { Analysis } from "../lib/analyze";
import { describeSummary } from "../lib/analyze";
import { snippetAround } from "../lib/location";
import { REPAIR_LABELS } from "../lib/repair";

interface ValidationStatusProps {
  id: string;
  analysis: Analysis;
  input: string;
  onApplyFix: () => void;
}

const numberFormat = new Intl.NumberFormat("en");

function sentence(parts: string[]): string {
  const text =
    parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0]!;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Validation feedback. Not a live region: it changes on every keystroke, so it
 * is linked to the input with aria-describedby instead of being announced.
 */
export function ValidationStatus({ id, analysis, input, onApplyFix }: ValidationStatusProps) {
  if (analysis.state === "empty") {
    return (
      <div id={id}>
        <StatusMessage live="off">Paste JSON above to check it, or load the example.</StatusMessage>
      </div>
    );
  }

  if (analysis.state === "too-large") {
    return (
      <div id={id}>
        <StatusMessage live="off" tone="danger">
          That&apos;s {numberFormat.format(analysis.length)} characters. The limit is{" "}
          {numberFormat.format(MAX_INPUT_CHARACTERS)}, to keep your browser responsive. Try a
          smaller piece.
        </StatusMessage>
      </div>
    );
  }

  if (analysis.state === "valid") {
    const { summary } = analysis;
    const nesting = summary.depth > 1 ? `, nested ${summary.depth} levels deep` : "";
    return (
      <div id={id}>
        <StatusMessage live="off" tone="success">
          <strong className="font-semibold">Valid JSON.</strong> {describeSummary(summary)}
          {nesting}.
        </StatusMessage>
      </div>
    );
  }

  const { error, fix } = analysis;
  const snippet = snippetAround(input, error.offset, ERROR_SNIPPET_RADIUS);
  // Highlight the offending character rather than drawing a caret under it, which
  // drifts out of line after emoji and wide characters.
  const culprit = String.fromCodePoint(snippet.text.codePointAt(snippet.caret) ?? 0x20);

  return (
    <div className="space-y-3">
      <div id={id}>
        <StatusMessage live="off" tone="danger">
          <strong className="font-semibold">
            Line {error.line}, column {error.column}:
          </strong>{" "}
          {error.message}
        </StatusMessage>
      </div>
      <pre
        aria-hidden="true"
        className="overflow-x-auto rounded-sm bg-surface-muted px-3 py-2 font-mono text-sm leading-relaxed"
      >
        {snippet.text.slice(0, snippet.caret)}
        <span className="rounded-[2px] bg-danger text-surface underline decoration-2 underline-offset-2">
          {/\s/.test(culprit) ? " " : culprit}
        </span>
        {snippet.text.slice(snippet.caret + culprit.length)}
      </pre>
      {fix ? (
        <div className="flex flex-col gap-3 rounded-sm border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            <span className="font-medium">This looks fixable.</span>{" "}
            <span className="text-text-muted">
              {sentence(fix.repairs.map((kind) => REPAIR_LABELS[kind]))}.
            </span>
          </p>
          <Button size="sm" onClick={onApplyFix} className="shrink-0">
            <Wand2 aria-hidden="true" className="size-4" strokeWidth={2} />
            Apply fixes
          </Button>
        </div>
      ) : null}
    </div>
  );
}
