"use client";

import { useDeferredValue, useId, useMemo, useReducer, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { StatusMessage, TextAreaField } from "@side-bits/ui";
import { TextActions } from "./components/TextActions";
import { TextStatsList } from "./components/TextStatsList";
import { TextToolsPanel } from "./components/TextToolsPanel";
import { MAX_INPUT_CHARACTERS } from "./constants";
import { historyReducer, initialHistory } from "./lib/history";
import type { HistoryAction } from "./lib/history";
import { computeStats } from "./lib/stats";
import type { Transform } from "./lib/transforms";

const numberFormat = new Intl.NumberFormat("en");

export function TinyTextLabApp() {
  const [history, dispatch] = useReducer(historyReducer, initialHistory);
  const [notice, setNotice] = useState("");
  const limitId = useId();
  const text = history.present;
  const tooLarge = text.length > MAX_INPUT_CHARACTERS;
  /**
   * True while the latest change came from the app (a transform, clear, undo
   * or redo) rather than typing. Setting the text programmatically leaves the
   * browser's own undo history out of step, so Ctrl/Cmd+Z uses ours until the
   * user types again.
   */
  const appChangedLast = useRef(false);

  // Counting very long text on every keystroke would make typing lag.
  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => computeStats(deferredText), [deferredText]);

  function change(action: HistoryAction) {
    appChangedLast.current = action.type !== "edit";
    dispatch(action);
  }

  function edit(value: string) {
    change({ type: "edit", text: value });
    // Announced once when crossing the limit; the message below the box is not a live region.
    setNotice(
      value.length > MAX_INPUT_CHARACTERS && !tooLarge
        ? "Too long: transformations are paused."
        : "",
    );
  }

  function apply(transform: Transform) {
    const result = transform.apply(text);
    if (result === text) {
      setNotice(`${transform.label}: nothing to change.`);
      return;
    }
    change({ type: "commit", text: result });
    setNotice(`Applied ${transform.label}.`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!appChangedLast.current || !(event.metaKey || event.ctrlKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === "z" && !event.shiftKey && history.past.length > 0) {
      event.preventDefault();
      change({ type: "undo" });
    } else if (((key === "z" && event.shiftKey) || key === "y") && history.future.length > 0) {
      event.preventDefault();
      change({ type: "redo" });
    }
  }

  return (
    // Phones: text, tools, counts. Wider: text and counts on the left, tools on the right.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_17rem] md:grid-rows-[auto_1fr] md:items-start lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-4 md:col-start-1 md:row-start-1">
        <div>
          <TextAreaField
            label="Your text"
            value={text}
            onValueChange={edit}
            onKeyDown={handleKeyDown}
            aria-invalid={tooLarge}
            describedBy={tooLarge ? limitId : undefined}
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
            onUndo={() => change({ type: "undo" })}
            onRedo={() => change({ type: "redo" })}
            onClear={() => {
              change({ type: "commit", text: "" });
              setNotice("Text cleared. Undo brings it back.");
            }}
          />
        </div>

        {/* Not a live region: the count changes on every keystroke. Linked to the text box instead. */}
        {tooLarge ? (
          <div id={limitId}>
            <StatusMessage tone="danger" live="off">
              That&apos;s {numberFormat.format(text.length)} characters. The limit is{" "}
              {numberFormat.format(MAX_INPUT_CHARACTERS)}; transformations are paused until
              it&apos;s shorter.
            </StatusMessage>
          </div>
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
