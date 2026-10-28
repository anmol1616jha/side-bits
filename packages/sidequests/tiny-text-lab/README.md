# Tiny Text Lab

Tiny Text Lab applies small, predictable transformations to text: case conversion, whitespace cleanup and counts of words, characters and lines.

Package: `@side-bits/sidequest-tiny-text-lab` · Route: `/projects/tiny-text-lab`

## Entry points

| Import                                              | Contents                                    |
| --------------------------------------------------- | ------------------------------------------- |
| `@side-bits/sidequest-tiny-text-lab`                | `TinyTextLabApp`, the interactive app       |
| `@side-bits/sidequest-tiny-text-lab/project.config` | Registry metadata (plain data)              |
| `@side-bits/sidequest-tiny-text-lab/preview`        | `TinyTextLabPreview`, the card illustration |

## Local development

Run the whole site with `pnpm dev` from the repository root and open `/projects/tiny-text-lab`.

```sh
pnpm --filter @side-bits/sidequest-tiny-text-lab test
pnpm --filter @side-bits/sidequest-tiny-text-lab typecheck
```

## How it works

- `src/lib/transforms.ts`: case, whitespace and line transformations as pure functions. Multi-line input is handled line by line where that makes sense.
- `src/lib/stats.ts`: counts using `Intl.Segmenter`, so characters are user-perceived (emoji and accented letters count once) and words follow the browser's language rules. Falls back to simpler counting where `Intl.Segmenter` is unavailable.
- `src/components/TextToolsPanel.tsx`: all actions in one panel to the right of the text (sticky from tablet width up); on phones it sits under the text with tabs and a swipeable row. The project uses the shell's `wide` layout so the panel has room.
- `src/lib/history.ts`: undo/redo for transformations and clearing (up to 50 steps).
- Input is capped at 500,000 characters (`src/constants.ts`).

## Dependencies

- `@side-bits/ui` for shared components and design tokens.
- `@side-bits/project-contract` for the `ProjectMetadata` type.
- `lucide-react` for icons.
- React and React DOM (peer dependencies, provided by the host app).

No network access, environment variables or secrets.

## Extracting into a standalone app

1. Copy this folder to a new repository.
2. Install React and the declared dependencies.
3. Replace `@side-bits/ui` and `@side-bits/project-contract` imports with published packages or a small local adapter (buttons, tokens CSS, `ProjectMetadata` type).
4. Add a page that renders `TinyTextLabApp` with its own layout, and import the tokens stylesheet.
5. Run the tests and build.
6. Configure its own deployment.
7. Only once that deployment is live, update the main registry to link to it.
