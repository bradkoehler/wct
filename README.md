# World Cup Tracker

A single-page tracker for a World Cup pool among friends: each friend is assigned teams, and the page shows a leaderboard plus group standings pulled from football-data.org.

## Stack

Vite + React + TypeScript + Tailwind CSS, pnpm, Biome, Vitest.

## Setup

```bash
pnpm install
pnpm dev
```

Add friend &rarr; team assignments in `src/config/teams.ts` (team ids are FIFA 3-letter codes, e.g. `BRA`).

## Data

`public/data.json` is the data the page reads at runtime. In production it's generated on a schedule by `scripts/fetch-data.ts` via the `update-data` GitHub Actions workflow, which calls the football-data.org API using a `FOOTBALL_DATA_API_KEY` repository secret.

To run the fetch locally:

```bash
FOOTBALL_DATA_API_KEY=your-key pnpm fetch-data
```

## Scripts

- `pnpm dev` &mdash; local dev server
- `pnpm build` &mdash; type-check and production build
- `pnpm preview` &mdash; preview the production build
- `pnpm test` &mdash; run the Vitest suite
- `pnpm lint` &mdash; Biome check
- `pnpm fetch-data` &mdash; refresh `public/data.json` from football-data.org
