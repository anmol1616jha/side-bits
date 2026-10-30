# Word Generator

Word Generator picks one to ten English words for vocabulary games from a curated list of about 1,600, at the difficulty and closeness you choose.

Package: `@side-bits/sidequest-word-generator` · Route: `/projects/word-generator`

## Entry points

| Import                                               | Contents                                      |
| ---------------------------------------------------- | --------------------------------------------- |
| `@side-bits/sidequest-word-generator`                | `WordGeneratorApp`, the interactive app       |
| `@side-bits/sidequest-word-generator/project.config` | Registry metadata (plain data)                |
| `@side-bits/sidequest-word-generator/preview`        | `WordGeneratorPreview`, the card illustration |

## Local development

Run the whole site with `pnpm dev` from the repository root and open `/projects/word-generator`.

```sh
pnpm --filter @side-bits/sidequest-word-generator test
pnpm --filter @side-bits/sidequest-word-generator typecheck
```

## How it works

- `src/data/`: the vocabulary, hand-curated. Words sit in about 60 categories ("Bodies of water", "Ways of moving", "Personality"…) inside 14 broad groups (nature, food, mind and feelings…), each split into easy, medium and hard. `themes.ts` lists scenes ("By the sea", "Spooky night"…) that tie words from different categories together. Words are nouns unless marked, e.g. `fly:v`, `rich:a`, `quickly:r`.
- Difficulty is about familiarity, not length: easy is everyday, medium is recognised but not used daily, hard is advanced vocabulary. Proper nouns, abbreviations, slang, obscure jargon and words with competing spellings (colour/color) are left out.
- `src/lib/generate.ts`: builds a list.
  - Closely related: one category.
  - Somewhat related: one theme, spread over its categories.
  - Loosely related: each word leans on an earlier one (same group or a shared theme) or comes from somewhere new; never two from one category, at most two from one group.
  - Unrelated: every word from a different group, away from shared themes.
  - Every list mixes word types, never repeats a word or a variation of one (`variants.ts`: shoe/shoes, friend/friendly), and never borrows from another difficulty. If not enough words fit, it returns fewer and the app says "Only 7 words matched your selected criteria."
  - `replaceWord` swaps a single word under the same rules.
- `src/lib/memory.ts`: recently shown words and categories/themes (last 15 lists, 8 threads), kept in `localStorage` under `side-bits:word-generator:recent`. Recent picks are made less likely, never excluded, and fade back in as they age.
- `src/hooks/useWordShuffle.ts`: the slot-machine reveal, words landing one after another. Skipped when the visitor prefers reduced motion; the real words are always available to screen readers.

### Adding or moving words

Edit the lists in `src/data/`, then run the tests (they check duplicates, variants within a category, theme words and per-level coverage). For a dictionary and frequency check, run `scripts/audit-words.py` as described at the top of that file. It uses `wordfreq` and `an-array-of-english-words` from outside the repo; neither is a dependency of the app. Its frequency flags are hints: familiar but rarely written words (giraffe, eraser) are still easy.

## Dependencies

- `@side-bits/ui` for shared components and design tokens.
- `@side-bits/project-contract` for the `ProjectMetadata` type.
- `lucide-react` for icons.
- React and React DOM (peer dependencies, provided by the host app).

No network access, environment variables or secrets.

## Extracting into a standalone app

1. Copy this folder to a new repository.
2. Install React and the declared dependencies.
3. Replace `@side-bits/ui` and `@side-bits/project-contract` imports with published packages or a small local adapter (button, icon button, copy button, tokens CSS, `ProjectMetadata` type).
4. Add a page that renders `WordGeneratorApp` with its own layout, and import the tokens stylesheet.
5. Run the tests and build.
6. Configure its own deployment.
7. Only once that deployment is live, update the main registry to link to it.
