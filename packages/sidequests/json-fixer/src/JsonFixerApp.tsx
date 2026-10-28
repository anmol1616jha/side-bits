"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { Eraser, FileCode, Undo2 } from "lucide-react";
import { Button, ChoiceGroup, CopyButton, TextAreaField } from "@side-bits/ui";
import { ValidationStatus } from "./components/ValidationStatus";
import { EXAMPLE_INPUT, INDENT_OPTIONS } from "./constants";
import type { IndentStyle } from "./constants";
import { analyzeJson } from "./lib/analyze";

export function JsonFixerApp() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<IndentStyle>("2");
  /** Input as it was before "Apply fixes", for a one-step undo. */
  const [beforeFix, setBeforeFix] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const statusId = useId();

  // Keeps typing responsive on large documents: validation can lag a frame behind.
  const deferredInput = useDeferredValue(input);
  const analysis = useMemo(() => analyzeJson(deferredInput, style), [deferredInput, style]);
  const output = analysis.state === "valid" ? analysis.output : "";

  function edit(value: string) {
    setInput(value);
    setBeforeFix(null);
    setNotice("");
  }

  function applyFix() {
    if (analysis.state !== "invalid" || !analysis.fix) return;
    setBeforeFix(input);
    setInput(analysis.fix.text);
    setNotice("Fixes applied. The JSON is now valid.");
  }

  function undoFix() {
    if (beforeFix === null) return;
    setInput(beforeFix);
    setBeforeFix(null);
    setNotice("Fixes undone.");
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="json-input-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="json-input-heading" className="font-display text-xl font-semibold">
            Input
          </h2>
          <div className="flex flex-wrap gap-2">
            {beforeFix !== null ? (
              <Button variant="ghost" size="sm" onClick={undoFix}>
                <Undo2 aria-hidden="true" className="size-4" strokeWidth={2} />
                Undo fixes
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={() => edit(EXAMPLE_INPUT)}>
              <FileCode aria-hidden="true" className="size-4" strokeWidth={2} />
              Load example
            </Button>
            <Button variant="ghost" size="sm" onClick={() => edit("")} disabled={input === ""}>
              <Eraser aria-hidden="true" className="size-4" strokeWidth={2} />
              Clear
            </Button>
          </div>
        </div>

        <TextAreaField
          label="JSON to check"
          hideLabel
          value={input}
          onValueChange={edit}
          describedBy={statusId}
          aria-invalid={analysis.state === "invalid" || analysis.state === "too-large"}
          placeholder='{"paste": "your JSON here"}'
          rows={12}
          mono
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
        />

        <ValidationStatus
          id={statusId}
          analysis={analysis}
          input={deferredInput}
          onApplyFix={applyFix}
        />
        <p role="status" className="sr-only">
          {notice}
        </p>
      </section>

      <section aria-labelledby="json-output-heading" className="space-y-4">
        <h2 id="json-output-heading" className="font-display text-xl font-semibold">
          Result
        </h2>
        <ChoiceGroup
          legend="Output style"
          options={INDENT_OPTIONS}
          value={style}
          onChange={setStyle}
        />
        <TextAreaField
          label="Formatted JSON"
          hideLabel
          value={output}
          readOnly
          rows={12}
          mono
          spellCheck={false}
          placeholder="The formatted JSON appears here once the input is valid."
        />
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton value={output} label="Copy JSON" variant="primary" disabled={output === ""} />
        </div>
      </section>
    </div>
  );
}
