import { useLayoutEffect, useRef } from "react";
import { cx } from "@side-bits/ui";
import type { DieThrow, DieValue } from "../lib/dice";
import { Pips } from "./Pips";

/** Where each face sits on the cube. Opposite faces add up to seven, like a real die. */
const FACES: readonly { value: DieValue; place: string }[] = [
  { value: 1, place: "rotateY(0deg)" },
  { value: 6, place: "rotateY(180deg)" },
  { value: 3, place: "rotateY(90deg)" },
  { value: 4, place: "rotateY(-90deg)" },
  { value: 2, place: "rotateX(90deg)" },
  { value: 5, place: "rotateX(-90deg)" },
];

/** How far to turn the cube to bring each face to the front. */
const FACE_UP: Record<DieValue, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  6: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  2: { x: -90, y: 0 },
  5: { x: 90, y: 0 },
};

/** The camera looks slightly down and from the right, so the top and side faces show. */
const VIEW = "rotateX(-20deg) rotateY(-24deg)";

interface Pose {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
}

function poseOf(thrown: DieThrow): Pose {
  return { ...FACE_UP[thrown.value], z: thrown.tilt, dx: thrown.x, dy: thrown.y };
}

// rotateZ comes first so the tilt turns the die flat on the table without changing its top face.
const rotation = ({ x, y, z }: Pose) => `rotateZ(${z}deg) rotateX(${x}deg) rotateY(${y}deg)`;
const offset = ({ dx, dy }: Pose) => `${dx}px ${dy}px`;

/** The first angle at or past `from` plus `turns` full turns that shows the same face as `to`. */
function spinForward(from: number, to: number, turns: number): number {
  return to + 360 * Math.ceil((from + 360 * turns - to) / 360);
}

/** Up, a fall, a squash on landing and one small bounce. */
const TOSS: Keyframe[] = [
  { transform: "translateY(0) scale(1)", easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
  {
    transform: "translateY(-56px) scale(1.1)",
    offset: 0.3,
    easing: "cubic-bezier(0.5, 0, 0.75, 0)",
  },
  { transform: "translateY(0) scale(1.08, 0.9)", offset: 0.58, easing: "ease-out" },
  { transform: "translateY(-14px) scale(1)", offset: 0.72, easing: "ease-in" },
  { transform: "translateY(0) scale(1.03, 0.97)", offset: 0.86 },
  { transform: "translateY(0) scale(1)" },
];

/** The shadow shrinks and fades while the die is in the air. */
const SHADOW: Keyframe[] = [
  { transform: "scale(1)", opacity: 0.5 },
  { transform: "scale(0.55)", opacity: 0.2, offset: 0.3 },
  { transform: "scale(1.05)", opacity: 0.55, offset: 0.58 },
  { transform: "scale(0.85)", opacity: 0.4, offset: 0.72 },
  { transform: "scale(1)", opacity: 0.5 },
];

interface DieProps {
  /** A new object for each roll; the die animates whenever it changes. */
  thrown: DieThrow;
  /** Glow, for a roll worth celebrating. */
  highlight?: boolean;
}

/**
 * A 3D die built from six CSS faces. Each throw tumbles it from wherever it
 * last landed to its new face with Web Animations; the resting pose is plain
 * inline style, so it renders on the server and without animation support.
 * Decorative: the app says the result in text.
 */
export function Die({ thrown, highlight = false }: DieProps) {
  const body = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const shown = useRef<Pose>(poseOf(thrown));
  const pose = poseOf(thrown);

  useLayoutEffect(() => {
    const from = shown.current;
    const to = poseOf(thrown);
    shown.current = to;
    const [bodyEl, cubeEl, shadowEl] = [body.current, cube.current, shadow.current];
    if (thrown.duration === 0 || !bodyEl || !cubeEl || !shadowEl) return;
    if (typeof cubeEl.animate !== "function") return;

    // Hold the old pose during the delay; afterwards the inline style already shows the new one.
    const timing = { duration: thrown.duration, delay: thrown.delay, fill: "backwards" } as const;
    const spun = {
      ...to,
      x: spinForward(from.x, to.x, thrown.spinX),
      y: spinForward(from.y, to.y, thrown.spinY),
    };
    const animations = [
      cubeEl.animate([{ transform: rotation(from) }, { transform: rotation(spun) }], {
        ...timing,
        easing: "cubic-bezier(0.2, 0.65, 0.3, 1)",
      }),
      bodyEl.animate(
        [
          { ...TOSS[0], translate: offset(from) },
          ...TOSS.slice(1, -1),
          { ...TOSS.at(-1), translate: offset(to) },
        ],
        timing,
      ),
      shadowEl.animate(SHADOW, timing),
    ];
    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, [thrown]);

  return (
    <div className="relative size-(--die)" style={{ perspective: "600px" }}>
      <div
        ref={shadow}
        className="absolute inset-x-[6%] -bottom-[16%] h-[18%] rounded-[50%] bg-black opacity-50 blur-[6px]"
        style={{ translate: `${pose.dx}px 0` }}
      />
      <div ref={body} className="size-full transform-3d" style={{ translate: offset(pose) }}>
        <div className="size-full transform-3d" style={{ transform: VIEW }}>
          <div
            ref={cube}
            className="relative size-full transform-3d"
            style={{ transform: rotation(pose) }}
          >
            {FACES.map((face) => (
              <Pips
                key={face.value}
                value={face.value}
                pipClassName={face.value === 1 ? "bg-accent" : "bg-text"}
                className={cx(
                  "absolute inset-0 rounded-[14%] border p-[14%] backface-hidden",
                  "bg-[linear-gradient(145deg,var(--color-surface),var(--color-surface-muted))]",
                  "transition-[border-color,box-shadow] duration-(--motion-slow)",
                  highlight
                    ? "border-accent shadow-[0_0_24px_-4px_var(--color-accent),inset_0_0_10px_rgb(0_0_0/0.12)]"
                    : "border-border shadow-[inset_0_0_10px_rgb(0_0_0/0.12)]",
                )}
                style={{ transform: `${face.place} translateZ(calc(var(--die) / 2))` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
