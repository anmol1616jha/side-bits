"use client";

import { useRef, useState } from "react";
import { WandSparkles } from "lucide-react";
import { Button, cx } from "@side-bits/ui";
import { CountPicker } from "./components/CountPicker";
import { ACCENT_TONE, ASSOCIATION_LOOKS, DIFFICULTY_LOOKS } from "./components/looks";
import { OptionCards } from "./components/OptionCards";
import { WordBoard } from "./components/WordBoard";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "./constants";
import { useWordShuffle } from "./hooks/useWordShuffle";
import { capitalize, listText, shortfallNote } from "./lib/format";
import { ASSOCIATIONS, generateWords, replaceWord } from "./lib/generate";
import type { Association, WordList } from "./lib/generate";
import { parseMemory, rememberList, rememberWord } from "./lib/memory";
import type { Memory } from "./lib/memory";
import { DIFFICULTIES } from "./lib/vocabulary";
import type { Difficulty } from "./lib/vocabulary";

const DIFFICULTY_OPTIONS = DIFFICULTIES.map((difficulty) => ({
  ...difficulty,
  ...DIFFICULTY_LOOKS[difficulty.value],
}));
const ASSOCIATION_OPTIONS = ASSOCIATIONS.map((association) => ({
  ...association,
  ...ASSOCIATION_LOOKS[association.value],
  tone: ACCENT_TONE,
}));

const HINT = "Not keen on one word? Swap just that one with its ↻ button.";

function loadMemory(): Memory {
  try {
    return parseMemory(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return parseMemory(null);
  }
}

function saveMemory(memory: Memory) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // Storage is full or blocked (e.g. private mode). Lists still work; they just may repeat sooner.
  }
}

export function WordGeneratorApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_SETTINGS.difficulty);
  const [count, setCount] = useState<number>(DEFAULT_SETTINGS.count);
  const [association, setAssociation] = useState<Association>(DEFAULT_SETTINGS.association);
  const [list, setList] = useState<WordList | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Read from storage on first use, not during render, so server and client HTML match.
  const memory = useRef<Memory | null>(null);
  const shuffle = useWordShuffle();

  function remember(update: (current: Memory) => Memory) {
    memory.current = update(memory.current ?? loadMemory());
    saveMemory(memory.current);
  }

  function generate() {
    memory.current ??= loadMemory();
    const next = generateWords({ difficulty, count, association }, memory.current);
    remember((current) =>
      rememberList(
        current,
        next.words.map((word) => word.text),
        next.link?.id ?? null,
      ),
    );
    setList(next);
    setMessage(null);
    shuffle.start(
      next.words.map((_, index) => index),
      difficulty,
    );
    const short = next.words.length < count ? `${shortfallNote(next.words.length)} ` : "";
    setAnnouncement(`${short}Your words: ${listText(next.words)}.`);
  }

  function replace(index: number) {
    if (!list) return;
    memory.current ??= loadMemory();
    const old = capitalize(list.words[index]!.text);
    const next = replaceWord(list, index, memory.current);
    if (!next) {
      const note = `No other word fits in place of ${old}.`;
      setMessage(note);
      setAnnouncement(note);
      return;
    }
    const fresh = next.words[index]!.text;
    remember((current) => rememberWord(current, fresh));
    setList(next);
    setMessage(null);
    shuffle.start([index], next.settings.difficulty);
    setAnnouncement(`Replaced ${old} with ${capitalize(fresh)}.`);
  }

  const footer =
    message ??
    (list && list.words.length < list.settings.count
      ? shortfallNote(list.words.length)
      : list
        ? HINT
        : "");

  return (
    <section
      aria-labelledby="word-generator-heading"
      className="hud-frame overflow-hidden rounded-md border border-border bg-surface p-5 sm:p-8 lg:p-6"
    >
      <h2 id="word-generator-heading" className="sr-only">
        Word generator
      </h2>

      {/* Desktop: settings on the left, the words on the right. Mobile: one column. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-6">
        <div className="space-y-5">
          <OptionCards
            legend="Difficulty"
            options={DIFFICULTY_OPTIONS}
            value={difficulty}
            onChange={setDifficulty}
            className="grid-cols-3"
          />
          <CountPicker value={count} onChange={setCount} />
          <OptionCards
            legend="Word association"
            options={ASSOCIATION_OPTIONS}
            value={association}
            onChange={setAssociation}
            className="grid-cols-2"
          />
          <Button
            onClick={generate}
            className={cx(
              "min-h-14 w-full text-base",
              "shadow-[0_0_40px_-8px_var(--color-accent)] hover:shadow-[0_0_48px_-4px_var(--color-accent)]",
            )}
          >
            <WandSparkles
              aria-hidden="true"
              className={cx("size-5", shuffle.spinning && "motion-safe:animate-pulse")}
              strokeWidth={2}
            />
            {list ? "Generate again" : "Generate"}
          </Button>
        </div>

        <WordBoard
          list={list}
          placeholderCount={count}
          placeholderDifficulty={difficulty}
          frames={shuffle.frames}
          spinning={shuffle.spinning}
          footer={footer}
          onReplace={replace}
          className="min-h-80 lg:h-[30rem] lg:min-h-0"
        />
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
