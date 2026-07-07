# AGENTS.md — Marketing Hub (marketing-hub)

Marketing Hub — All-in-One Marketing Command Center. A Next.js + React application.

## Stack
- Next.js + React (28 dependencies)
- `next.config.js`, `components.json` (shadcn-style UI), Capacitor (`capacitor.config.json`
  → mobile packaging), Tailwind/CSS
- `data/` and `docs/` hold content and documentation

## Common commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint
- `npm run seed` — seed local data

## Notes for the coding agent (pi)
- pi is the coding agent for this project.
- **The working tree is heavily modified (~119 uncommitted changes).** Do NOT run
  dependency upgrades, `git reset`, or branch-switching here without explicit
  confirmation — checkpoint first (commit or a safety branch) before destructive ops.
- Prefer small, targeted edits over broad refactors until the tree is committed.
- This project had 0 known vulnerabilities and 17 outdated deps at last audit.