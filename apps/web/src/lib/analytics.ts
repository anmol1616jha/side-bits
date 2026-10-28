/**
 * The single place analytics would be wired in (spec section 2.1). Nothing is
 * tracked: `trackEvent` is a no-op. To add analytics later, implement it here,
 * update the privacy copy on the About page and in the footer, and handle
 * consent. Event payloads must never include text the user typed.
 */
export type AnalyticsEvent = {
  name: "directory_filtered";
  properties: {
    resultCount: number;
    hasQuery: boolean;
    collection: string | null;
    status: string | null;
  };
};

export function trackEvent(_event: AnalyticsEvent): void {
  // Intentionally empty: no analytics by default.
}
