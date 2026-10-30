import type { CSSProperties } from "react";
import { cx } from "@side-bits/ui";
import type { DieValue } from "../lib/dice";

/** Which cells of a 3×3 grid hold a pip, reading left to right, top to bottom. */
const PIP_CELLS: Record<DieValue, readonly number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface PipsProps {
  value: DieValue;
  /** Size, border and padding of the face. */
  className?: string;
  /** Colour of the pips. */
  pipClassName?: string;
  style?: CSSProperties;
}

/** A flat die face. Decorative: callers hide it and say the number in text. */
export function Pips({ value, className, pipClassName = "bg-text", style }: PipsProps) {
  const cells = PIP_CELLS[value];
  return (
    <span
      aria-hidden="true"
      className={cx("grid grid-cols-3 grid-rows-3 place-items-center", className)}
      style={style}
    >
      {Array.from({ length: 9 }, (_, cell) => (
        <span
          key={cell}
          className={cx(
            "aspect-square w-[68%] rounded-full",
            cells.includes(cell) ? pipClassName : "invisible",
          )}
        />
      ))}
    </span>
  );
}
