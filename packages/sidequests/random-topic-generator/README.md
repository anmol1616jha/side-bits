# Random Topic Generator

Random Topic Generator hands you a topic at the difficulty you pick, gives you 30, 45 or 60 minutes to research it, then unlocks a one-minute speaking test.

Package: `@side-bits/sidequest-random-topic-generator` · Route: `/projects/random-topic-generator`

## Entry points

| Import                                                       | Contents                                             |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| `@side-bits/sidequest-random-topic-generator`                | `RandomTopicGeneratorApp`, the interactive app       |
| `@side-bits/sidequest-random-topic-generator/project.config` | Registry metadata (plain data)                       |
| `@side-bits/sidequest-random-topic-generator/preview`        | `RandomTopicGeneratorPreview`, the card illustration |

## Local development

Run the whole site with `pnpm dev` from the repository root and open `/projects/random-topic-generator`.

```sh
pnpm --filter @side-bits/sidequest-random-topic-generator test
pnpm --filter @side-bits/sidequest-random-topic-generator typecheck
```

## How it works

- `src/lib/topics.ts`: the curated topic list, 50 per difficulty, and `pickTopic`, which skips recently shown topics so rerolls don't repeat. Add topics here.
- `src/lib/session.ts`: the session as a pure reducer: setup → research (with breaks) → ready → test → done. Times are wall-clock timestamps rather than tick counts, so the clock stays right in a throttled background tab and after a reload. `parseSession` validates a saved session and discards anything inconsistent.
- `src/RandomTopicGeneratorApp.tsx`: ticks the visible clock every 250 ms while a countdown is on screen, ends a countdown when it runs out, saves the session to `localStorage`, shows the time left in the tab title and plays the chime.
- `src/lib/chime.ts`: a two-note chime made with Web Audio (no sound file). Audio is unlocked by the Start buttons, since browsers block sound that isn't started by a click. It can be switched off.
- Breaks pause the research clock with no time limit. "I'm ready" ends research early; "Give up" drops the topic. Both ask for confirmation.
- Screen readers hear the moments that matter (start, break, time's up) through one polite live region, not every second of the countdown. Focus moves to the new step's heading when the step changes.

## Dependencies

- `@side-bits/ui` for shared components and design tokens.
- `@side-bits/project-contract` for the `ProjectMetadata` type.
- `lucide-react` for icons.
- React and React DOM (peer dependencies, provided by the host app).

No network access, environment variables or secrets. The only stored data is the current session, under `side-bits:random-topic-generator:session` in `localStorage`.

## Extracting into a standalone app

1. Copy this folder to a new repository.
2. Install React and the declared dependencies.
3. Replace `@side-bits/ui` and `@side-bits/project-contract` imports with published packages or a small local adapter (buttons, badge, choice group, status message, tokens CSS, `ProjectMetadata` type).
4. Add a page that renders `RandomTopicGeneratorApp` with its own layout, and import the tokens stylesheet.
5. Run the tests and build.
6. Configure its own deployment.
7. Only once that deployment is live, update the main registry to link to it.
