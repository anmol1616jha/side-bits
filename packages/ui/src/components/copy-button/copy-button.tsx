"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../button/button";
import type { ButtonSize, ButtonVariant } from "../button/button";

export interface CopyButtonProps {
  /** Text to copy, or a function returning it at click time. */
  value: string | (() => string);
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

type CopyState = "idle" | "copied" | "failed";

const RESET_AFTER_MS = 2000;

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copies text and confirms it visibly and to screen readers. */
export function CopyButton({
  value,
  label = "Copy",
  variant = "secondary",
  size = "md",
  disabled,
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleClick() {
    const text = typeof value === "function" ? value() : value;
    const ok = await writeToClipboard(text);
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), RESET_AFTER_MS);
  }

  const Icon = state === "copied" ? Check : Copy;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
        onClick={handleClick}
      >
        <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
        {state === "copied" ? "Copied" : label}
      </Button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Copied to clipboard."
          : state === "failed"
            ? "Couldn't copy. Your browser blocked clipboard access; select the text and copy it manually."
            : ""}
      </span>
      {state === "failed" ? (
        <span className="text-sm text-danger">
          Copy blocked. Select the text and copy it manually.
        </span>
      ) : null}
    </>
  );
}
