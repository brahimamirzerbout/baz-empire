# 15 — Deploy / Source Drift: Live Site ≠ Committed Source (new, this pass)

**Severity:** HIGH
**Dimension:** Build integrity / Compliance / Auditability
**Status:** CONFIRMED

## What it is
The live deploy (https://marketing-hub-roan.vercel.app) contains a homepage marketplace section — "Hire Seth, Gary, PBD, Kotler, Ogilvy, Schwartz — plus 6 operators. Everyone eats." — that is **not in the local source checkout**. Grep across `src/` returns no such copy; `src/app/giants/page.tsx` (untracked WIP) is a video-quote search page, not the marketplace. Untracked WIP exists: `src/app/giants/`, `src/app/api/giants/`, `src/lib/wisdom/`, `scripts/import-giants-pilot.ts`.
So the live site **cannot be reproduced from the committed source** — the deployed product has content no one can audit, version, or roll back from source. The local checkout is *behind* the live deploy.

## How the enemy perceives and exploits it
- "BAZ's live site doesn't match its source — you can't audit what's actually deployed, can't reproduce it, can't guarantee a rollback. An auditor or security reviewer asks 'show me the source for what's live' and BAZ can't. That's a build-integrity + compliance failure — you can't attest to what's running. SOC2/ISO-style 'controlled environments' requirements (even without the cert) start here."
- It also blocks every fix in this dossier: edits to local source (07, 02, 04, 06, 12) **don't change the live site** until the deploy is reconciled — so the legal exposures stay live regardless of source edits.

## How we solve it
- Reconcile: commit the WIP (or explicitly drop it) so the live deploy is reproducible from a specific commit/branch.
- Lock the deploy pipeline: Vercel deploy pinned to a git commit SHA / protected branch; no deploy from uncommitted local state.
- Never have live content absent from source.
- Tie to 09 (canonical source of truth): the canonical positioning doc + the deploy must agree.

## Sequence
1. Inventory the WIP (giants/, wisdom/, api/giants/, import-giants-pilot.ts) — keep, rewrite, or drop.
2. Commit or drop so `git status` is clean against what's live.
3. Lock Vercel deploy to a protected branch / commit SHA.
4. Re-fetch the live site and diff against source; zero drift.

## Exit criterion
`git status` is clean; the live site re-fetch matches the committed source exactly (zero unsource-able content); deploy is pinned to a commit SHA.

## Ownership / budget / next
- **Owner:** Brahim (decide what's live) · BAZ Agent (commit + lock pipeline).
- **Budget:** ~0.5–1 day.
- **Next action (72h):** inventory the WIP; commit or drop; lock the deploy to a commit SHA.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.