"use client";

import { useDeferredValue, useMemo, useReducer, useState } from "react";
import { StatusMessage, TextAreaField } from "@side-bits/ui";
import { TextActions } from "./components/TextActions";
import { TextStatsList } from "./components/TextStatsList";
import { TextToolsPanel } from "./components/TextToolsPanel";
import { MAX_INPUT_CHARACTERS } from "./constants";
import { historyReducer, initialHistory } from "./lib/history";
import { computeStats } from "./lib/stats";
import type { Transform } from "./lib/transforms";

const numberFormat = new Intl.NumberFormat("en");

export function TinyTextLabApp() {
  const [history, dispatch] = useReducer(historyReducer, initialHistory);
  const [notice, setNotice] = useState("");
  const text = history.present;
  const tooLarge = text.length > MAX_INPUT_CHARACTERS;

  // Counting very long text on every keystroke would make typing lag.
  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => computeStats(deferredText), [deferredText]);

  function apply(transform: Transform) {
    const result = transform.apply(text);
    if (result === text) {
      setNotice(`${transform.label}: nothing to change.`);
      return;
    }
    dispatch({ type: "commit", text: result });
    setNotice(`Applied ${transform.label}.`);
  }

  return (
    // Phones: text, tools, counts. Wider: text and counts on the left, tools on the right.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_17rem] md:grid-rows-[auto_1fr] md:items-start lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-4 md:col-start-1 md:row-start-1">
        <div>
          <TextAreaField
            label="Your text"
            value={text}
            onValueChange={(value) => {
              dispatch({ type: "edit", text: value });
              setNotice("");
            }}
            aria-invalid={tooLarge}
            rows={10}
            placeholder="Paste or type something to tidy up."
            // Square bottom corners so the action bar joins the box; taller beside the tools panel.
            className="[&_textarea]:rounded-b-none md:[&_textarea]:min-h-[30rem]"
          />
          <TextActions
            text={text}
            canUndo={history.past.length > 0}
            canRedo={history.future.length > 0}
            notice={notice}
            onUndo={() => dispatch({ type: "undo" })}
            onRedo={() => dispatch({ type: "redo" })}
            onClear={() => {
              dispatch({ type: "commit", text: "" });
              setNotice("Text cleared. Undo brings it back.");
            }}
          />
        </div>

        {tooLarge ? (
          <StatusMessage tone="danger" live="assertive">
            That&apos;s {numberFormat.format(text.length)} characters. The limit is{" "}
            {numberFormat.format(MAX_INPUT_CHARACTERS)}; transformations are paused until it&apos;s
            shorter.
          </StatusMessage>
        ) : null}
      </div>

      <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-stretch">
        <TextToolsPanel transformsDisabled={text === "" || tooLarge} onApply={apply} />
      </div>

      <div className="md:col-start-1 md:row-start-2">
        <TextStatsList stats={stats} />
      </div>
    </div>
  );
}
