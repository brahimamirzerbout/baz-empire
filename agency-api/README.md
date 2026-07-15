# Agency Directory API

A secure, robust REST API backing the **Agency Directory** — 24 marketing, media &
advertising agency types. Built with **Express + TypeScript + Prisma + SQLite + Zod**.

SQLite is used so it runs with **zero external database server**. The Prisma schema
is structured for a one-line migration to PostgreSQL (see `prisma/schema.prisma`).

---

## Quick start

```bash
npm install
cp .env.example .env          # already done in this repo
npm run generate              # generate Prisma client
npm run db:push               # create the SQLite tables
npm run seed                  # seed the 24 agencies (idempotent)
npm run dev                   # start with hot-reload  → http://localhost:4000
```

Production-ish run:

```bash
npm start                     # tsx, no watch
```

---

## Endpoints

| Method | Path                  | Auth        | Description |
|--------|-----------------------|-------------|-------------|
| GET    | `/health`             | —           | Health + uptime |
| GET    | `/api/agencies`       | —           | List all. `?search=` (case-insensitive, scans name/shortDesc/goal/modelRelevance/tasks) and `?category=` (exact). Filters compose (AND). |
| GET    | `/api/agencies/:id`   | —           | Single agency detail |
| POST   | `/api/agencies`       | `X-Api-Key` | Create |
| PUT    | `/api/agencies/:id`   | `X-Api-Key` | Update (partial OK) |
| DELETE | `/api/agencies/:id`   | `X-Api-Key` | Delete → `204` |

**Admin key:** write endpoints are guarded by `X-Api-Key`. In dev, leave
`ADMIN_API_KEY=` empty in `.env` to disable the guard. In production, set a
strong value and send it as the `X-Api-Key` header.

### Example requests

```bash
# list + search + category
curl "http://localhost:4000/api/agencies?search=film"
curl "http://localhost:4000/api/agencies?category=Creative%20%26%20Design"

# create
curl -X POST http://localhost:4000/api/agencies \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: your-key" \
  -d '{"name":"X Agency","category":"Digital & Web","shortDesc":"...","goal":"...","tasks":["a","b"],"modelRelevance":"..."}'

# update (partial)
curl -X PUT http://localhost:4000/api/agencies/3 \
  -H "Content-Type: application/json" -H "X-Api-Key: your-key" \
  -d '{"shortDesc":"New short description."}'

# delete
curl -X DELETE http://localhost:4000/api/agencies/3 -H "X-Api-Key: your-key"
```

---

## Response shapes

```jsonc
// collection
{ "count": 24, "data": [ { /* agency */ } ] }

// single
{ "data": {
    "id": 1, "name": "App Agency", "category": "Digital & Web",
    "shortDesc": "...", "goal": "...",
    "tasks": ["UI/UX mobile design", "iOS & Android development"],  // array
    "modelRelevance": "...",
    "createdAt": "2026-07-15T..Z", "updatedAt": "2026-07-15T..Z"
}}

// validation error → 422
{ "error": "Validation failed.",
  "details": [ { "path": "name", "message": "name must be at least 2 characters" } ] }

// not found → 404   |  duplicate name → 409   |  server error → 500
{ "error": "Agency not found." }
```

---

## Architecture

```
src/
  index.ts              server entry + graceful shutdown
  app.ts                express wiring (helmet, cors, rate-limit, morgan, routes)
  lib/
    config.ts           typed env parsing + allowed categories
    prisma.ts           PrismaClient singleton
    serialize.ts        row→API shape (tasks JSON→array) + error classifier
  schemas/
    agency.ts           Zod create/update schemas
  middleware/
    auth.ts             X-Api-Key guard (write endpoints)
    notFound.ts         404
    error.ts            centralized error handler (Zod + Prisma)
  routes/agencies.ts    REST routes
  controllers/agencies.ts  list/get/create/update/delete logic
prisma/
  schema.prisma         Agency model
  seed.ts               idempotent upsert of 24 agencies
data/                   SQLite file (gitignored)
```

## Security posture

- **helmet** — secure HTTP headers (HSTS, no-sniff, frameguard, etc.)
- **CORS** — configurable origin allowlist via `CORS_ORIGIN`
- **Rate limiting** — 300 req / 15 min / IP (express-rate-limit)
- **Body size cap** — 256kb JSON payload limit (reject oversized bodies)
- **Zod validation** — every write validated before it touches the DB
- **Admin API key** — write endpoints gated by `X-Api-Key`
- **No info leakage** — production responses never include stack traces
- **Parameterized queries** — Prisma, no raw SQL injection surface
- **Unique constraint** handled → clean `409`; not-found → clean `404`

## Migrating to PostgreSQL

1. `provider = "postgresql"` in `prisma/schema.prisma`
2. Change `tasks String` → `tasks String[]` (native array support)
3. Drop the `JSON.stringify`/`JSON.parse` in `serialize.ts` + controllers
4. Set `DATABASE_URL="postgresql://user:pass@host:5432/agency"`
5. `npx prisma migrate dev --name init && npm run seed`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | tsx watch (hot reload) |
| `npm start` | tsx (no watch) |
| `npm run seed` | seed 24 agencies (idempotent) |
| `npm run db:push` | sync schema → SQLite |
| `npm run db:reset` | drop + recreate + reseed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | compile to `dist/` |