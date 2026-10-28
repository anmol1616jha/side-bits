/**
 * Countdown display, rounding up so "0:00" only shows once time is really up
 * and a fresh 30-minute timer reads 30:00, not 29:59.
 */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Elapsed-time display, rounding down: "4:59" until five minutes have passed. */
export function formatElapsed(ms: number): string {
  return formatClock(Math.floor(Math.max(0, ms) / 1000) * 1000);
}

/** Spoken-style duration for summaries and announcements, e.g. "12 min 5 s". */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} s`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} s`;
}
