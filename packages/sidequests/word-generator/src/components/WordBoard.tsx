import { RefreshCw } from "lucide-react";
import { CopyButton, IconButton, cx } from "@side-bits/ui";
import { ASSOCIATIONS } from "../lib/generate";
import type { WordList } from "../lib/generate";
import { capitalize, listText } from "../lib/format";
import type { Difficulty } from "../lib/vocabulary";
import { DIFFICULTY_LOOKS } from "./looks";

interface WordBoardProps {
  list: WordList | null;
  /** Slots to show before the first list: the chosen word count. */
  placeholderCount: number;
  placeholderDifficulty: Difficulty;
  /** Decoys on screen for slots still shuffling. */
  frames: ReadonlyMap<number, string>;
  spinning: boolean;
  /** The line under the list: a shortfall note, a message, or a hint. */
  footer: string;
  onReplace: (index: number) => void;
  className?: string;
}

function linkLine(list: WordList | null): string {
  if (!list) return "Pick your settings, then generate.";
  if (list.link?.kind === "category") return `All from: ${list.link.label}`;
  if (list.link?.kind === "theme") return `Theme: ${list.link.label}`;
  return ASSOCIATIONS.find((option) => option.value === list.settings.association)!.label;
}

/**
 * The generated words as numbered tiles, each with a button to swap just that
 * word. Up to four words get one roomy column; more share
 * two columns, so ten still fit without the card growing.
 */
export function WordBoard({
  list,
  placeholderCount,
  placeholderDifficulty,
  frames,
  spinning,
  footer,
  onReplace,
  className,
}: WordBoardProps) {
  const slots = list ? list.words.length : placeholderCount;
  const roomy = slots <= 4;
  const tone = DIFFICULTY_LOOKS[list?.settings.difficulty ?? placeholderDifficulty].tone;
  const tileClass = cx(
    "relative flex items-center gap-3 overflow-hidden rounded-md border border-l-4 border-border px-3",
    roomy ? "h-16 lg:h-20" : "h-14 lg:h-16",
  );

  return (
    <section
      aria-labelledby="word-list-heading"
      className={cx("flex flex-col gap-3 rounded-md border border-border p-4", className)}
    >
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h3 id="word-list-heading" className="hud-label text-meta text-text-muted">
            Your words
          </h3>
          <p className="truncate text-sm font-semibold">{linkLine(list)}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton
            value={() => (list ? listText(list.words) : "")}
            label="Copy list"
            size="sm"
            disabled={!list || list.words.length === 0 || spinning}
          />
        </div>
      </div>

      <ol
        className={cx("grid content-start gap-2 lg:min-h-0 lg:flex-1", !roomy && "sm:grid-cols-2")}
      >
        {list
          ? list.words.map((word, index) => {
              const frame = frames.get(index);
              return (
                <li key={index} className={cx(tileClass, "bg-surface", tone.edge)}>
                  <div
                    aria-hidden="true"
                    className={cx(
                      "absolute inset-0 bg-linear-to-r to-transparent to-70%",
                      tone.wash,
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="relative w-5 shrink-0 font-mono text-sm text-text-muted"
                  >
                    {index + 1}
                  </span>
                  <div
                    // A fresh element per word, so each one pops in as it lands.
                    key={frame === undefined ? word.text : "shuffling"}
                    className={cx(
                      "relative min-w-0 flex-1",
                      frame === undefined &&
                        "origin-left transition-[opacity,scale] duration-300 ease-out starting:scale-90 starting:opacity-0",
                    )}
                  >
                    {frame === undefined ? (
                      <p
                        className={cx(
                          "truncate font-display font-semibold",
                          roomy ? "text-display-md" : "text-xl",
                        )}
                      >
                        {capitalize(word.text)}
                      </p>
                    ) : (
                      <>
                        <p className="sr-only">{capitalize(word.text)}</p>
                        <p
                          aria-hidden="true"
                          className={cx(
                            "truncate font-display font-semibold text-text-muted blur-[1px]",
                            roomy ? "text-display-md" : "text-xl",
                          )}
                        >
                          {capitalize(frame)}
                        </p>
                      </>
                    )}
                  </div>
                  <IconButton
                    label={`Replace ${capitalize(word.text)}`}
                    icon={<RefreshCw className="size-4" strokeWidth={2} />}
                    disabled={spinning}
                    onClick={() => onReplace(index)}
                    className="relative size-9 shrink-0 bg-surface/70"
                  />
                </li>
              );
            })
          : Array.from({ length: placeholderCount }, (_, index) => (
              <li
                key={index}
                aria-hidden="true"
                className={cx(
                  tileClass,
                  "border-dashed bg-transparent text-text-muted",
                  "transition-[opacity,scale] duration-300 ease-out starting:scale-95 starting:opacity-0",
                )}
              >
                <span className="w-5 shrink-0 font-mono text-sm">{index + 1}</span>
                <span
                  className={cx(
                    "font-display font-semibold",
                    roomy ? "text-display-md" : "text-xl",
                  )}
                >
                  ?
                </span>
              </li>
            ))}
      </ol>

      <p className="min-h-5 text-sm text-text-muted">{footer}</p>
    </section>
  );
}
