import { useState } from "react";
import type { Ref } from "react";
import { Coffee, Dices, Flag, Mic, Play, RotateCcw, Square, TimerReset } from "lucide-react";
import { Badge, Button, ChoiceGroup, StatusMessage } from "@side-bits/ui";
import { TEST_DURATION_MS } from "../constants";
import { formatDuration, formatElapsed } from "../lib/format";
import {
  RESEARCH_DURATIONS,
  breakElapsedMs,
  currentBreakMs,
  researchDurationMs,
  researchRemainingMs,
  testRemainingMs,
} from "../lib/session";
import type { ResearchMinutes, Session } from "../lib/session";
import { DIFFICULTIES } from "../lib/topics";
import type { Difficulty } from "../lib/topics";
import { Countdown } from "./Countdown";
import { TopicCard } from "./TopicCard";

const iconClass = "size-4";

interface PanelHeadingProps {
  children: string;
  headingRef: Ref<HTMLHeadingElement>;
}

/** Focus moves here when the phase changes, so keyboard users aren't left on a vanished button. */
function PanelHeading({ children, headingRef }: PanelHeadingProps) {
  return (
    <h2
      ref={headingRef}
      tabIndex={-1}
      className="font-display text-display-md font-semibold focus-visible:outline-none"
    >
      {children}
    </h2>
  );
}

interface SetupPanelProps {
  session: Session;
  headingRef: Ref<HTMLHeadingElement>;
  onDifficulty: (difficulty: Difficulty) => void;
  onMinutes: (minutes: ResearchMinutes) => void;
  onRoll: () => void;
  onStart: () => void;
}

export function SetupPanel({
  session,
  headingRef,
  onDifficulty,
  onMinutes,
  onRoll,
  onStart,
}: SetupPanelProps) {
  return (
    <div className="space-y-6">
      <PanelHeading headingRef={headingRef}>Pick your challenge</PanelHeading>
      <div className="grid gap-5 sm:grid-cols-2">
        <ChoiceGroup
          legend="Topic difficulty"
          options={DIFFICULTIES}
          value={session.difficulty}
          onChange={onDifficulty}
        />
        <ChoiceGroup
          legend="Research time"
          options={RESEARCH_DURATIONS}
          value={session.researchMinutes}
          onChange={onMinutes}
        />
      </div>

      {session.topic ? (
        <>
          <TopicCard topic={session.topic} difficulty={session.difficulty} />
          <div className="flex flex-wrap gap-3">
            <Button onClick={onStart}>
              <Play aria-hidden="true" className={iconClass} strokeWidth={2} />
              Start research
            </Button>
            <Button variant="secondary" onClick={onRoll}>
              <Dices aria-hidden="true" className={iconClass} strokeWidth={2} />
              New topic
            </Button>
          </div>
          <p className="text-sm text-text-muted">
            Reroll as often as you like. Once research starts, the topic is locked in.
          </p>
        </>
      ) : (
        <Button onClick={onRoll}>
          <Dices aria-hidden="true" className={iconClass} strokeWidth={2} />
          Get a topic
        </Button>
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
    <div className="space-y-6">
      <PanelHeading headingRef={headingRef}>Research time</PanelHeading>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />

      <Countdown
        label="Research time left"
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
  );
}

interface ReadyPanelProps {
  session: Session;
  headingRef: Ref<HTMLHeadingElement>;
  onStartTest: () => void;
}

export function ReadyPanel({ session, headingRef, onStartTest }: ReadyPanelProps) {
  return (
    <div className="space-y-6">
      <PanelHeading headingRef={headingRef}>Test time</PanelHeading>
      <StatusMessage tone="success" live="off">
        {session.endedEarly
          ? "Research finished early. Start the test when you're ready."
          : "Research time is up. Start the test when you're ready."}
      </StatusMessage>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />
      <p className="text-text-muted">
        You&apos;ll get one minute. Speak out loud about the topic until the clock runs out. Nothing
        is recorded.
      </p>
      <Button onClick={onStartTest}>
        <Mic aria-hidden="true" className={iconClass} strokeWidth={2} />
        Start the 1-minute test
      </Button>
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
    <div className="space-y-6">
      <PanelHeading headingRef={headingRef}>Speak!</PanelHeading>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />
      <Countdown
        label="Speaking time left"
        remainingMs={testRemainingMs(session, now)}
        totalMs={TEST_DURATION_MS}
        size="xl"
      />
      <Button variant="secondary" onClick={onStop}>
        <Square aria-hidden="true" className={iconClass} strokeWidth={2} />
        Stop early
      </Button>
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
  const rows = [
    {
      label: "Research",
      value: `${formatDuration(session.researchMs)} of ${session.researchMinutes} min${session.endedEarly ? " (finished early)" : ""}`,
    },
    {
      label: "Breaks",
      value:
        session.breakCount === 0
          ? "None"
          : `${session.breakCount}, ${formatDuration(session.breakMs)} in total`,
    },
    { label: "Spoke for", value: fullMinute ? "The full minute" : formatDuration(session.testMs) },
  ];

  return (
    <div className="space-y-6">
      <PanelHeading headingRef={headingRef}>
        {fullMinute ? "That's a full minute. Nice." : "Done"}
      </PanelHeading>
      <TopicCard topic={session.topic!} difficulty={session.difficulty} />
      <dl className="grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-md border border-border p-4">
            <dt className="text-sm text-text-muted">{row.label}</dt>
            <dd className="mt-1 font-medium">{row.value}</dd>
          </div>
        ))}
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
