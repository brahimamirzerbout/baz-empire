# AGENTS.md — Æther (brand-aether)

Æther — Algorithmic Brand Asset System. A web app (static front-end + Supabase backend)
for generating/managing brand assets.

## Stack
- Front-end: vanilla HTML/CSS/JS (`index.html`, `dashboard.html`, `login.html`, `aether.css`, `js/`, `components/`)
- Back-end: Supabase (Postgres + types); small dependency footprint (~2 deps)
- `api/` for server-side endpoints

## Common commands
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run supabase:types` — regenerate TS types from the Supabase schema
- `npm run db:push` — push schema migrations
- `npm run db:reset` — reset the database (destructive — confirm first)

## Notes for the coding agent (pi)
- pi is the coding agent for this project. Keep changes small and reviewable.
- This project is **not** a git repo. Before any destructive change, back up the files
  you're modifying (e.g. `cp file file.bak`); there is no git rollback here.
- Confirm before running `db:reset` or any Supabase write that affects production data.
- `package.json.pi-bak` / `package-lock.json.pi-bak` are backups from a prior dependency
  audit — safe to delete once you're happy with the current `package.json`.