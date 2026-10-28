# Side-bits

**Small projects. Side quests. Questionable priorities.**

## The idea

Side-bits is a little corner of the internet for things that didn't need to exist.

It's a public playground: a home for useful little tools, odd experiments and delightfully unnecessary websites, made because someone asked "what if?" Some will save you time. Others may steal three minutes. That's the arrangement.

Every project stands on its own. You can open one, understand it in a few seconds and use it without a manual. Together they read like one small publication rather than a pile of demos, with a shared look, a shared voice, and the same care for the person using it.

## What it stands for

- **Small on purpose.** Each project does one thing well and gets out of the way.
- **Honest.** Every project says what it does, how to use it, and what happens to anything you type into it. Experiments are labelled as experiments, and projects that stop being maintained are retired openly.
- **Private by default.** No accounts and no tracking. Projects run in your browser unless there's a clear reason not to, and if one ever needs to send data somewhere, it will say what, where and why first.
- **For everyone.** Built to be accessible: usable with a keyboard and a screen reader, in light or dark, on a phone or a big screen.
- **Playful, never at your expense.** The copy is allowed to be dry and a little mischievous, but instructions, errors and privacy notes are always plain and clear.

## Running it locally

You need **Node.js 22.18 or newer**. pnpm comes through Corepack, which ships with Node, so there's nothing extra to install.

```sh
# 1. Get the code
git clone https://github.com/anmol1616jha/side-bits.git
cd side-bits

# 2. Use the right Node version (if you use nvm)
nvm install
nvm use

# 3. Enable pnpm (the exact version is pinned in package.json)
corepack enable

# 4. Install dependencies
pnpm install

# 5. Start the site
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Production build

```sh
pnpm build
pnpm start
```

To build for a real domain, set `SITE_URL` first. It's used for canonical links, the sitemap and social previews. You can set it in your host's environment, or locally in `apps/web/.env.local` (copy `.env.example`; Next.js reads env files from the app folder, not the repository root):

```sh
SITE_URL=https://example.com pnpm build
```

### Useful commands

| Command                  | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `pnpm dev`               | Run the site locally with hot reload         |
| `pnpm build`             | Create a production build                    |
| `pnpm start`             | Serve the production build                   |
| `pnpm test`              | Run all tests                                |
| `pnpm lint`              | Check code style and project boundaries      |
| `pnpm typecheck`         | Check types across the whole repository      |
| `pnpm format`            | Format everything with Prettier              |
| `pnpm validate:projects` | Check that every project is set up correctly |

### Troubleshooting

- **`pnpm: command not found`:** run `corepack enable`, then open a new terminal.
- **Errors mentioning the Node version:** check `node -v`. It must be 22.18 or newer.
- **Port 3000 already in use:** run `pnpm dev -p 3001` and open port 3001 instead.

## Under the hood

Next.js, TypeScript and Tailwind CSS, organised as a pnpm monorepo. The website lives in `apps/web`, shared building blocks in `packages/`, and each project is its own package in `packages/sidequests/`. Each project folder has a README explaining how it works.
