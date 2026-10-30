"use client";

import { useEffect, useRef, useState } from "react";
import { Dices, Volume2, VolumeX } from "lucide-react";
import { Button, cx } from "@side-bits/ui";
import { Confetti } from "./components/Confetti";
import { DiceCountPicker } from "./components/DiceCountPicker";
import { Die } from "./components/Die";
import { RollHistory } from "./components/RollHistory";
import { RollReadout } from "./components/RollReadout";
import type { RollResult } from "./components/RollReadout";
import { DEFAULT_DICE, HISTORY_LIMIT } from "./constants";
import { describeValues, landingTime, planThrows, rollDice, summarizeRoll } from "./lib/dice";
import type { DieThrow, DieValue } from "./lib/dice";
import { prefersReducedMotion } from "./lib/motion";
import { createDiceSound, soundCues } from "./lib/sound";
import type { DiceSound } from "./lib/sound";

/**
 * One die per possible count, fixed so the server and the first client render
 * agree. Dice past the chosen count wait offstage.
 */
const RESTING_DICE: DieThrow[] = ([3, 5, 1, 6, 2] as const).map((value, index) => ({
  value,
  duration: 0,
  delay: 0,
  tilt: [-6, 4, -3, 7, -5][index]!,
  x: 0,
  y: 0,
  spinX: 0,
  spinY: 0,
}));

function announce(values: DieValue[], callout: string | null, total: number): string {
  const rolled =
    values.length > 1 ? `Rolled ${describeValues(values)}. Total ${total}.` : `Rolled ${total}.`;
  return callout ? `${rolled} ${callout}` : rolled;
}

export function DiceRollerApp() {
  const [count, setCount] = useState(DEFAULT_DICE);
  const [dice, setDice] = useState(RESTING_DICE);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const rolls = useRef(0);
  const landing = useRef<number | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const sound = useRef<DiceSound | null>(null);

  useEffect(
    () => () => {
      if (landing.current !== null) window.clearTimeout(landing.current);
    },
    [],
  );

  function roll() {
    // The button stays focusable while the dice are in the air, so ignore extra presses here.
    if (rolling) return;
    const values = rollDice(count);
    const throws = planThrows(values, !prefersReducedMotion());
    const id = ++rolls.current;
    setDice((current) => [...throws, ...current.slice(throws.length)]);
    setRolling(true);
    if (soundOn) {
      sound.current ??= createDiceSound();
      sound.current.play(soundCues(throws));
    }

    function land() {
      landing.current = null;
      const summary = summarizeRoll(values);
      const landed = { id, values, summary };
      setRolling(false);
      setResult(landed);
      setHistory((current) => [landed, ...current].slice(0, HISTORY_LIMIT));
      setAnnouncement(announce(values, summary.callout, summary.total));
    }
    const wait = landingTime(throws);
    if (wait === 0) land();
    else landing.current = window.setTimeout(land, wait);
  }

  const celebrate = !rolling && result !== null && result.summary.allSame;

  return (
    <section
      aria-labelledby="dice-roller-heading"
      className="hud-frame space-y-8 overflow-hidden rounded-md border border-border bg-surface p-5 sm:p-8 lg:space-y-6"
    >
      <h2 id="dice-roller-heading" className="sr-only">
        Dice roller
      </h2>

      {/* On desktop the picker and sound switch share a row, to keep the whole card on screen. */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="order-first flex w-full justify-end lg:order-last lg:w-auto">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={soundOn}
            onClick={() => setSoundOn(!soundOn)}
          >
            {soundOn ? (
              <Volume2 aria-hidden="true" className="size-4" strokeWidth={2} />
            ) : (
              <VolumeX aria-hidden="true" className="size-4" strokeWidth={2} />
            )}
            Dice sounds
          </Button>
        </div>
        <DiceCountPicker
          value={count}
          disabled={rolling}
          className="w-full lg:w-auto lg:max-w-xl lg:flex-1"
          onChange={(next) => {
            setCount(next);
            setResult(null);
          }}
        />
      </div>

      {/* Desktop: the table on the left, a panel with the result, Roll and history on the right. Mobile: one column. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6">
        <div
          aria-hidden="true"
          className={cx(
            "flex min-h-48 flex-wrap items-center justify-center gap-x-3 gap-y-10 rounded-md border border-border px-3 pt-14 pb-10 [--die:2.75rem]",
            "bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--color-accent)_10%,transparent),transparent_70%)] shadow-[inset_0_2px_24px_-8px_rgb(0_0_0/0.35)]",
            "sm:min-h-52 sm:gap-x-8 sm:[--die:4.5rem] lg:min-h-80",
          )}
        >
          {dice.slice(0, count).map((thrown, index) => (
            // A new die pops onto the table when the count goes up.
            <div
              key={index}
              className="transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] starting:scale-50 starting:opacity-0"
            >
              <Die thrown={thrown} highlight={celebrate} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:gap-4">
          <RollReadout result={result} rolling={rolling} />

          <div className="flex justify-center">
            <Button
              size="md"
              aria-disabled={rolling}
              onClick={roll}
              className={cx(
                "min-h-14 min-w-56 text-base lg:w-full",
                rolling && "cursor-progress opacity-80",
              )}
            >
              <Dices
                aria-hidden="true"
                className={cx("size-5", rolling && "motion-safe:animate-spin")}
                strokeWidth={2}
              />
              {count === 1 ? "Roll the die" : `Roll ${count} dice`}
            </Button>
          </div>

          {/* The list scrolls inside the panel on desktop rather than making the card taller. */}
          <div className="mt-2 lg:relative lg:mt-0 lg:min-h-36 lg:flex-1">
            <RollHistory
              history={history}
              className="lg:absolute lg:inset-0 lg:flex lg:flex-col"
              listClassName="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1"
              onClear={() => {
                setHistory([]);
                setAnnouncement("Recent rolls cleared.");
              }}
            />
          </div>
        </div>
      </div>

      {celebrate ? <Confetti key={result.id} /> : null}

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
