# Dice Roller

Dice Roller throws one to five six-sided dice, animates them tumbling onto the table and shows each face and the total.

Package: `@side-bits/sidequest-dice-roller` · Route: `/projects/dice-roller`

## Entry points

| Import                                            | Contents                                   |
| ------------------------------------------------- | ------------------------------------------ |
| `@side-bits/sidequest-dice-roller`                | `DiceRollerApp`, the interactive app       |
| `@side-bits/sidequest-dice-roller/project.config` | Registry metadata (plain data)             |
| `@side-bits/sidequest-dice-roller/preview`        | `DiceRollerPreview`, the card illustration |

## Local development

Run the whole site with `pnpm dev` from the repository root and open `/projects/dice-roller`.

```sh
pnpm --filter @side-bits/sidequest-dice-roller test
pnpm --filter @side-bits/sidequest-dice-roller typecheck
```

## How it works

- `src/lib/dice.ts`: the maths, all pure. `secureRandomInt` draws from `crypto.getRandomValues` and redraws values from the uneven top of the range, so every face is exactly 1 in 6. `summarizeRoll` adds up the total and names matching rolls ("Snake eyes!", "Double sixes!", "Three of a kind!"). `planThrows` decides how each die is thrown: tumble time, a small stagger between dice, how many turns, and where it lands.
- `src/components/Die.tsx`: a 3D die made of six CSS faces (opposite faces add up to seven). A throw is three Web Animations: the cube spins from its last face to its new one with whole extra turns, the die is tossed up, squashes on landing and bounces once, and its shadow shrinks while it's in the air. The resting pose is plain inline style, so the die renders on the server and the animation only adds the journey.
- `src/DiceRollerApp.tsx`: rolls, waits until the last die has landed, then shows the result, adds it to the history and announces it. The Roll button stays focusable while dice are in the air and ignores extra presses.
- `src/components/RollReadout.tsx` and `RollHistory.tsx`: the numbers pop in one after another; new history rows slide in at the top. Matching dice glow and set off a confetti burst (`Confetti.tsx`).
- `src/lib/sound.ts`: the dice noises, made with Web Audio (no sound files). `soundCues` times them to each die's throw: a three-click rattle as it leaves the hand, a clack and low thump when it lands, a softer one on the bounce and a tick as it settles. Each click is a burst of white noise through a band-pass filter at a slightly random pitch, so no two rolls sound the same; a compressor keeps five dice landing at once from clipping. Sound starts from the Roll click, which browsers require, and can be switched off with "Dice sounds".
- Reduced motion: when the visitor prefers it, dice land on their faces instantly and the confetti is skipped.
- Accessibility: the dice table is decorative and hidden from screen readers. The result is announced once through a polite live region ("Rolled 4, 2 and 6. Total 12."), and the history list has a text version of each roll.

## Dependencies

- `@side-bits/ui` for shared components and design tokens.
- `@side-bits/project-contract` for the `ProjectMetadata` type.
- `lucide-react` for icons.
- React and React DOM (peer dependencies, provided by the host app).

No network access, environment variables, secrets or stored data.

## Extracting into a standalone app

1. Copy this folder to a new repository.
2. Install React and the declared dependencies.
3. Replace `@side-bits/ui` and `@side-bits/project-contract` imports with published packages or a small local adapter (button, `cx`, tokens CSS, `ProjectMetadata` type).
4. Add a page that renders `DiceRollerApp` with its own layout, and import the tokens stylesheet.
5. Run the tests and build.
6. Configure its own deployment.
7. Only once that deployment is live, update the main registry to link to it.
