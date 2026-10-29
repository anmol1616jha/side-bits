import { useState } from "react";
import type { ReactNode, Ref } from "react";
import {
  BookOpen,
  Coffee,
  Dices,
  Flag,
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  TimerReset,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Button, StatusMessage, cx } from "@side-bits/ui";
import { TEST_DURATION_MS } from "../constants";
import { formatDuration, formatElapsed } from "../lib/format";
import {
  RESEARCH_DURATIONS,
  breakElapsedMs,
  currentBreakMs,
  researchDurationLabel,
  researchDurationMs,
  researchRemainingMs,
  testRemainingMs,
} from "../lib/session";
import type { ResearchMinutes, Session } from "../lib/session";
import { DIFFICULTIES } from "../lib/topics";
import type { Difficulty } from "../lib/topics";
import { Confetti } from "./Confetti";
import { Countdown } from "./Countdown";
import { ACCENT_TONE, DIFFICULTY_LOOKS, DURATION_LOOKS } from "./looks";
import { OptionCards } from "./OptionCards";
import { TopicCard } from "./TopicCard";

const iconClass = "size-4";
/** The one big call to action on the Ready step. */
const bigButtonClass =
  "min-h-14 px-8 text-base shadow-[0_0_40px_-8px_var(--color-accent)] hover:shadow-[0_0_48px_-4px_var(--color-accent)]";

const DIFFICULTY_OPTIONS = DIFFICULTIES.map((difficulty) => ({
  ...difficulty,
  ...DIFFICULTY_LOOKS[difficulty.value],
}));
const DURATION_OPTIONS = RESEARCH_DURATIONS.map((duration) => ({
  ...duration,
  ...DURATION_LOOKS[duration.value],
  tone: ACCENT_TONE,
}));

interface PanelHeadingProps {
  children: string;
  eyebrow: string;
  icon: LucideIcon;
  headingRef: Ref<HTMLHeadingElement>;
  centered?: boolean;
}

/** Focus moves here when the phase changes, so keyboard users aren't left on a vanished button. */
function PanelHeading({ children, eyebrow, icon: Icon, headingRef, centered }: PanelHeadingProps) {
  return (
    <div className={cx("space-y-1.5", centered && "text-center")}>
      <p
        className={cx(
          "flex items-center gap-1.5 hud-label text-meta text-accent",
          centered && "justify-center",
        )}
      >
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
        {eyebrow}
      </p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-display-lg font-semibold focus-visible:outline-none"
      >
        {children}
      </h3>
    </div>
  );
}

interface SetupPanelProps {
  session: Session;
  shuffleFrame: string | null;
  headingRef: Ref<HTMLHeadingElement>;
  onDifficulty: (difficulty: Difficulty) => void;
  onMinutes: (minutes: ResearchMinutes) => void;
  onRoll: () => void;
  onStart: () => void;
}

export function SetupPanel({
  session,
  shuffleFrame,
  headingRef,
  onDifficulty,
  onMinutes,
  onRoll,
  onStart,
}: SetupPanelProps) {
  const shuffling = shuffleFrame !== null;

  return (
    <div className="space-y-8">
      <PanelHeading eyebrow="Step 1 of 4 · Pick" icon={Sparkles} headingRef={headingRef}>
        Pick your challenge
      </PanelHeading>
      <OptionCards
        legend="Topic difficulty"
        options={DIFFICULTY_OPTIONS}
        value={session.difficulty}
        onChange={onDifficulty}
        className="sm:grid-cols-3"
      />
      <OptionCards
        legend="Research time"
        options={DURATION_OPTIONS}
        value={session.researchMinutes}
        onChange={onMinutes}
        className="grid-cols-3"
      />

      {session.topic ? (
        <div className="space-y-4">
          <TopicCard
            topic={session.topic}
            difficulty={session.difficulty}
            shuffleFrame={shuffleFrame}
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={onStart}>
              <Play aria-hidden="true" className={iconClass} strokeWidth={2} />
              Start research
            </Button>
            <Button variant="secondary" onClick={onRoll}>
              <Dices
                aria-hidden="true"
                className={cx(iconClass, shuffling && "animate-spin")}
                strokeWidth={2}
              />
              New topic
            </Button>
          </div>
          <p className="text-sm text-text-muted">
            Reroll as often as you like. Once research starts, the topic is locked in.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border px-5 py-10 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-accent">
            <Dices aria-hidden="true" className="size-7" strokeWidth={1.75} />
          </span>
          <p className="text-text-muted">Your topic will land here.</p>
          <Button onClick={onRoll}>
            <Dices aria-hidden="true" className={iconClass} strokeWidth={2} />
            Get a topic
          </Button>
        </div>
      )}
    </div>
  );
}

interface ResearchPanelProps {
  session: Session;
  now: number;
  headingRef: Ref<HTMLHeadingElement>;
  onBreak: () => void;
  onResume: () => void;
  onFinishEarly: () => void;
  onGiveUp: () => void;
}

export function ResearchPanel({
  session,
  now,
  headingRef,
  onBreak,
  onResume,
  onFinishEarly,
  onGiveUp,
}: ResearchPanelProps) {
  const [confirming, setConfirming] = useState<"finish" | "give-up" | null>(null);
  const onBreakNow = session.breakSince !== null;
  const totalBreak = breakElapsedMs(session, now);

  return (
    <div className="space-y-8">
      <PanelHeading eyebrow="Step 2 of 4 · Dig in" icon={BookOpen} headingRef={headingRef}>
        Research time
      </PanelHeading>

      <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
        <Countdown
          label={onBreakNow ? "Paused" : "Time left"}
          remainingMs={researchRemainingMs(session, now)}
          totalMs={researchDurationMs(session)}
          paused={onBreakNow}
          badge={
            onBreakNow ? (
              <Badge tone="warning" icon={<Coffee className="size-3.5" strokeWidth={2} />}>
                Paused · on a break for {formatElapsed(currentBreakMs(session, now))}
              </Badge>
            ) : null
          }
        />

        <div className="space-y-5">
          <TopicCard topic={session.topic!} difficulty={session.difficulty} size="md" />

          {confirming ? (
            <div className="space-y-3 rounded-md border border-border bg-surface-muted/60 p-4">
              <p className="font-medium">
                {confirming === "finish"
                  ? "Finish research now and go straight to the test?"
                  : "Give up on this topic? Your progress on it will be lost."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  onClick={() => {
                    setConfirming(null);
                    if (confirming === "finish") onFinishEarly();
                    else onGiveUp();
                  }}
                >
                  {confirming === "finish" ? "Yes, I'm ready" : "Yes, give up"}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setConfirming(null)}>
                  Keep researching
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {onBreakNow ? (
                <Button onClick={onResume}>
                  <Play aria-hidden="true" className={iconClass} strokeWidth={2} />
                  Resume research
                </Button>
              ) : (
                <Button onClick={onBreak}>
                  <Coffee aria-hidden="true" className={iconClass} strokeWidth={2} />
                  Take a break
                </Button>
              )}
              <Button variant="secondary" onClick={() => setConfirming("finish")}>
                <Flag aria-hidden="true" className={iconClass} strokeWidth={2} />
                I&apos;m ready
              </Button>
              <Button variant="ghost" onClick={() => setConfirming("give-up")}>
                <TimerReset aria-hidden="true" className={iconClass} strokeWidth={2} />
                Give up
              </Button>
            </div>
          )}

          <p className="text-sm text-text-muted">
            {session.breakCount === 0
              ? "No breaks yet. The clock pauses while you're on one."
              : `${session.breakCount} ${session.breakCount === 1 ? "break" : "breaks"}, ${formatDuration(totalBreak)} in total.`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ReadyPanelProps {
  session: Session;
  headingRef: Ref<HTMLHeadingElement>;
  onStartTest: () => void;
}

export function ReadyPanel({ session, headingRef, onStartTest }: ReadyPanelProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-col items-center gap-5">
        <span
          aria-hidden="true"
          className="inline-flex size-20 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-accent shadow-[0_0_48px_-8px_var(--color-accent)]"
        >
          <Mic className="size-9" strokeWidth={1.75} />
        </span>
        <PanelHeading eyebrow="Step 3 of 4 · Your turn" icon={Mic} headingRef={headingRef} centered>
          Test time
        </PanelHeading>
      </div>
      <StatusMessage tone="success" live="off">
        {session.endedEarly
          ? "Research finished early. Start the test when you're ready."
          : "Research time is up. Start the test when you're ready."}
      </StatusMessage>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-text-muted">
          You&apos;ll get one minute. Speak out loud about the topic until the clock runs out.
          Nothing is recorded.
        </p>
        <Button onClick={onStartTest} className={bigButtonClass}>
          <Mic aria-hidden="true" className="size-5" strokeWidth={2} />
          Start the 1-minute test
        </Button>
      </div>
    </div>
  );
}

interface TestPanelProps {
  session: Session;
  now: number;
  headingRef: Ref<HTMLHeadingElement>;
  onStop: () => void;
}

export function TestPanel({ session, now, headingRef, onStop }: TestPanelProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PanelHeading eyebrow="Step 3 of 4 · Live" icon={Mic} headingRef={headingRef}>
          Speak!
        </PanelHeading>
        {/* Decorative "on air" light; nothing is actually recorded. */}
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-2 rounded-sm border border-danger/60 px-2.5 py-1 hud-label text-meta text-danger"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-danger" />
          </span>
          On air
        </span>
      </div>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />
      <Countdown
        label="Speaking time"
        remainingMs={testRemainingMs(session, now)}
        totalMs={TEST_DURATION_MS}
        pulseAtEnd
        size="xl"
      />
      <div className="flex justify-center">
        <Button variant="secondary" onClick={onStop}>
          <Square aria-hidden="true" className={iconClass} strokeWidth={2} />
          Stop early
        </Button>
      </div>
    </div>
  );
}

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  highlight?: boolean;
}

function StatTile({ icon: Icon, label, children, highlight }: StatTileProps) {
  return (
    <div
      className={cx(
        "rounded-md border bg-surface p-5",
        highlight ? "border-green bg-green-soft" : "border-border",
      )}
    >
      <dt className="flex items-center gap-1.5 hud-label text-meta text-text-muted">
        <Icon
          aria-hidden="true"
          className={cx("size-3.5", highlight && "text-green")}
          strokeWidth={2.25}
        />
        {label}
      </dt>
      <dd className="mt-2 font-display text-xl font-semibold">{children}</dd>
    </div>
  );
}

interface SummaryPanelProps {
  session: Session;
  headingRef: Ref<HTMLHeadingElement>;
  onNewTopic: () => void;
  onChangeSettings: () => void;
}

export function SummaryPanel({
  session,
  headingRef,
  onNewTopic,
  onChangeSettings,
}: SummaryPanelProps) {
  const fullMinute = session.testMs >= TEST_DURATION_MS;

  return (
    <div className="relative space-y-8">
      {fullMinute ? <Confetti /> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PanelHeading eyebrow="Step 4 of 4 · Results" icon={Trophy} headingRef={headingRef}>
          {fullMinute ? "That's a full minute. Nice." : "Done"}
        </PanelHeading>
        {fullMinute ? (
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-green bg-green-soft px-2.5 py-1 hud-label text-meta text-green">
            <Trophy aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
            Full minute
          </span>
        ) : null}
      </div>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} size="md" />
      <dl className="grid gap-3 sm:grid-cols-3">
        <StatTile icon={BookOpen} label="Research">
          {formatDuration(session.researchMs)}
          <span className="block text-sm font-normal text-text-muted font-sans">
            of {researchDurationLabel(session)}
            {session.endedEarly ? " (finished early)" : ""}
          </span>
        </StatTile>
        <StatTile icon={Coffee} label="Breaks">
          {session.breakCount === 0
            ? "None"
            : `${session.breakCount}, ${formatDuration(session.breakMs)} in total`}
        </StatTile>
        <StatTile icon={Mic} label="Spoke for" highlight={fullMinute}>
          {fullMinute ? "The full minute" : formatDuration(session.testMs)}
        </StatTile>
      </dl>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onNewTopic}>
          <Dices aria-hidden="true" className={iconClass} strokeWidth={2} />
          New topic, same settings
        </Button>
        <Button variant="secondary" onClick={onChangeSettings}>
          <RotateCcw aria-hidden="true" className={iconClass} strokeWidth={2} />
          Change settings
        </Button>
      </div>
    </div>
  );
}
