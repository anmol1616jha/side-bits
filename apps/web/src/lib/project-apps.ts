import type { ComponentType } from "react";

/**
 * Loaders for each project's interactive app, imported only by the project
 * page. Keeping them out of the registry (which the site header imports) means
 * no other page downloads project code.
 *
 * All project pages share one route, so they currently share these chunks.
 * That keeps each app's script in the page HTML, so it starts downloading
 * immediately and the app hydrates before anyone can type into it. If a single
 * project grows heavy, lazy-load its heavy part inside that project instead.
 */
export const projectAppLoaders: Record<string, () => Promise<ComponentType>> = {
  "dice-roller": () => import("@side-bits/sidequest-dice-roller").then((m) => m.DiceRollerApp),
  "json-fixer": () => import("@side-bits/sidequest-json-fixer").then((m) => m.JsonFixerApp),
  "random-topic-generator": () =>
    import("@side-bits/sidequest-random-topic-generator").then((m) => m.RandomTopicGeneratorApp),
  "tiny-text-lab": () => import("@side-bits/sidequest-tiny-text-lab").then((m) => m.TinyTextLabApp),
  "word-generator": () =>
    import("@side-bits/sidequest-word-generator").then((m) => m.WordGeneratorApp),
};

export function loadProjectApp(slug: string): Promise<ComponentType> {
  const load = projectAppLoaders[slug];
  if (!load) throw new Error(`No app registered for project "${slug}".`);
  return load();
}
