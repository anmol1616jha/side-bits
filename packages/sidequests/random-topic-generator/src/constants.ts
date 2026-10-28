/** How long the speaking test lasts. */
export const TEST_DURATION_MS = 60_000;

/** Topics remembered per session so rerolls don't repeat them. */
export const RECENT_TOPICS_LIMIT = 20;

/** localStorage key for the saved session, so a refresh doesn't lose a running timer. */
export const STORAGE_KEY = "side-bits:random-topic-generator:session";

/** How often the visible clock updates. Timing itself uses timestamps, not tick counts. */
export const TICK_INTERVAL_MS = 250;
