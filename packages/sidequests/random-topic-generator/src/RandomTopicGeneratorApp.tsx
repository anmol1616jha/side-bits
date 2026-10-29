"use client";

import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@side-bits/ui";
import { PhaseSteps } from "./components/PhaseSteps";
import { useTopicShuffle } from "./hooks/useTopicShuffle";
import {
  ReadyPanel,
  ResearchPanel,
  SetupPanel,
  SummaryPanel,
  TestPanel,
} from "./components/SessionPanels";
import { STORAGE_KEY, TICK_INTERVAL_MS } from "./constants";
import { createChime } from "./lib/chime";
import type { Chime } from "./lib/chime";
import { formatClock } from "./lib/format";
import {
  initialSession,
  parseSession,
  researchDurationLabel,
  researchRemainingMs,
  sessionReducer,
  testRemainingMs,
} from "./lib/session";
import type { Phase, Session, SessionAction } from "./lib/session";
import { pickTopic } from "./lib/topics";

const subscribeToNothing = () => () => {};

/**
 * The saved session only exists in the browser, so the server renders a
 * placeholder and the app mounts once on the client. Reading storage during
 * the first client render would otherwise not match the server HTML.
 */
export function RandomTopicGeneratorApp() {
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  if (!isClient) {
    return (
      <div
        aria-hidden="true"
        className="min-h-[28rem] rounded-md border border-border bg-surface"
      />
    );
  }
  return <TopicSession />;
}

function loadSession(): Session {
  try {
    return parseSession(window.localStorage.getItem(STORAGE_KEY)) ?? initialSession;
  } catch {
    return initialSession;
  }
}

function saveSession(session: Session) {
  try {
    if (session === initialSession) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage is full or blocked (e.g. private mode). The session still works; it just won't survive a reload.
  }
}

/** A clock is on screen: the research countdown (or break timer) or the test. */
function isTicking(session: Session): boolean {
  return session.phase === "research" || session.phase === "test";
}

function isExpired(session: Session, now: number): boolean {
  if (session.phase === "research") {
    return session.runningSince !== null && researchRemainingMs(session, now) <= 0;
  }
  return session.phase === "test" && testRemainingMs(session, now) <= 0;
}

function TopicSession() {
  const [session, dispatch] = useReducer(sessionReducer, undefined, loadSession);
  const [now, setNow] = useState(Date.now);
  const [announcement, setAnnouncement] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const chime = useRef<Chime | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const shownPhase = useRef<Phase>(session.phase);
  const shuffle = useTopicShuffle();

  function getChime(): Chime {
    chime.current ??= createChime();
    return chime.current;
  }

  /** Runs a timed action at the current time, keeping the visible clock in step. */
  function act(make: (now: number) => SessionAction, message: string) {
    const time = Date.now();
    setNow(time);
    dispatch(make(time));
    setAnnouncement(message);
  }

  function roll() {
    const exclude = session.topic ? [session.topic, ...session.recent] : session.recent;
    const topic = pickTopic(session.difficulty, exclude);
    dispatch({ type: "showTopic", topic });
    shuffle.start(session.difficulty, topic);
    setAnnouncement("New topic ready.");
  }

  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Tick while a clock is on screen, and end a countdown once it runs out.
  useEffect(() => {
    if (!isTicking(session)) return;
    function tick() {
      const time = Date.now();
      setNow(time);
      if (!isExpired(session, time)) return;
      dispatch({ type: "expire", now: time });
      setAnnouncement(
        session.phase === "research"
          ? "Research time is up. You can start the test."
          : "Time's up. The test is over.",
      );
      if (soundOn) getChime().play();
    }
    const id = window.setInterval(tick, TICK_INTERVAL_MS);
    // Background tabs throttle timers; catch up as soon as the tab is visible again.
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [session, soundOn]);

  // Move focus to the new step's heading when the step changes, but not on first load.
  useEffect(() => {
    if (shownPhase.current === session.phase) return;
    shownPhase.current = session.phase;
    heading.current?.focus();
  }, [session.phase]);

  // Time left in the tab title, so it can be checked from another tab.
  const remaining =
    session.phase === "research"
      ? researchRemainingMs(session, now)
      : session.phase === "test"
        ? testRemainingMs(session, now)
        : null;
  const titlePrefix =
    remaining === null
      ? null
      : session.phase === "test"
        ? `${formatClock(remaining)} · Test`
        : session.breakSince !== null
          ? `Paused · ${formatClock(remaining)}`
          : `${formatClock(remaining)} · Research`;
  const baseTitle = useRef<string | null>(null);
  useEffect(() => {
    baseTitle.current ??= document.title;
    document.title = titlePrefix ? `${titlePrefix} · ${baseTitle.current}` : baseTitle.current;
  }, [titlePrefix]);
  useEffect(
    () => () => {
      if (baseTitle.current !== null) document.title = baseTitle.current;
    },
    [],
  );

  return (
    <section
      aria-labelledby="topic-session-heading"
      className="hud-frame space-y-8 overflow-hidden rounded-md border border-border bg-surface p-5 sm:p-8"
    >
      <h2 id="topic-session-heading" className="sr-only">
        Topic session
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <PhaseSteps phase={session.phase} className="min-w-[16rem] flex-1" />
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={soundOn}
          onClick={() => {
            if (!soundOn) getChime().unlock();
            setSoundOn(!soundOn);
          }}
        >
          {soundOn ? (
            <Volume2 aria-hidden="true" className="size-4" strokeWidth={2} />
          ) : (
            <VolumeX aria-hidden="true" className="size-4" strokeWidth={2} />
          )}
          Chime when time&apos;s up
        </Button>
      </div>

      {/* A fresh wrapper per step, so each step slides in as it appears. */}
      <div
        key={session.phase}
        className="transition-[opacity,translate] duration-300 ease-out starting:translate-y-3 starting:opacity-0"
      >
        {session.phase === "setup" ? (
          <SetupPanel
            session={session}
            shuffleFrame={shuffle.frame}
            headingRef={heading}
            onDifficulty={(difficulty) => dispatch({ type: "setDifficulty", difficulty })}
            onMinutes={(minutes) => dispatch({ type: "setResearchMinutes", minutes })}
            onRoll={roll}
            onStart={() => {
              if (soundOn) getChime().unlock();
              act(
                (time) => ({ type: "startResearch", now: time }),
                `Research started. ${researchDurationLabel(session)} on the clock.`,
              );
            }}
          />
        ) : null}

        {session.phase === "research" ? (
          <ResearchPanel
            session={session}
            now={now}
            headingRef={heading}
            onBreak={() =>
              act((time) => ({ type: "startBreak", now: time }), "On a break. The clock is paused.")
            }
            onResume={() =>
              act((time) => ({ type: "endBreak", now: time }), "Break over. Research resumed.")
            }
            onFinishEarly={() =>
              act(
                (time) => ({ type: "finishResearch", now: time }),
                "Research finished. You can start the test.",
              )
            }
            onGiveUp={() => {
              dispatch({ type: "reset" });
              setAnnouncement("Topic dropped. Pick your next challenge.");
            }}
          />
        ) : null}

        {session.phase === "ready" ? (
          <ReadyPanel
            session={session}
            headingRef={heading}
            onStartTest={() => {
              if (soundOn) getChime().unlock();
              act(
                (time) => ({ type: "startTest", now: time }),
                "Test started. Speak about the topic for one minute.",
              );
            }}
          />
        ) : null}

        {session.phase === "test" ? (
          <TestPanel
            session={session}
            now={now}
            headingRef={heading}
            onStop={() => act((time) => ({ type: "finishTest", now: time }), "Test stopped.")}
          />
        ) : null}

        {session.phase === "done" ? (
          <SummaryPanel
            session={session}
            headingRef={heading}
            onNewTopic={() => {
              const topic = pickTopic(session.difficulty, [session.topic!, ...session.recent]);
              dispatch({ type: "reset" });
              dispatch({ type: "showTopic", topic });
              shuffle.start(session.difficulty, topic);
              setAnnouncement("New topic ready.");
            }}
            onChangeSettings={() => {
              dispatch({ type: "reset" });
              setAnnouncement("Pick your next challenge.");
            }}
          />
        ) : null}
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
