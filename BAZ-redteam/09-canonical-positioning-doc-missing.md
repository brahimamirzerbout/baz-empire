# 09 — Canonical Positioning Doc Missing (Source of Truth Absent)

**Severity:** HIGH
**Dimension:** Governance / Brand control
**Status:** CONFIRMED

## What it is
Operator doctrine references `~/Desktop/BAZventures-Public-Site-Canonical.md §1` as the decision source for the public fork (Midnight Terminal + BAZventures). The file is **ENOENT** (Desktop holds only `api key` + a tar.gz backup). Fragments exist elsewhere (`/home/uzer/baz/bazventures.html`, `/home/uzer/marketing-docs/bazventures-org-chart.md`, `/home/uzer/marketing-hub/docs/kotler/CANONICAL_BIBLIOGRAPHY.md`) but no single canonical positioning doc.
So the single source of truth for what BAZ is, what it sells, what it may claim — doesn't exist (or is lost). The site has already drifted (SaaS vs retainer, three brand names, fabricated proof) because nothing owns the truth.

## How the enemy perceives and exploits it
- "No canonical positioning doc → no version-controlled truth. Anyone can claim anything; the site drifts. There's no artifact a senior partner can point to and say 'this is what we are.' A competitor exploits the drift: the site contradicts itself because no one owns the truth."

## How we solve it
- Write + version-control (git) ONE canonical positioning doc covering: legal name, brand, domain; what BAZ is (agency vs product — ties to 01); pricing model (ties to 01/07); the **claim library** (what we may/may not say — ties to 02/04/06/12); sub-processor posture (05/06); compliance posture (03/05/10).
- Make it the single source every public surface must match; changes require a commit + review.

## Sequence
1. Brahim makes the open decisions (01, 07, 08, 12).
2. Operator drafts the canonical doc.
3. Commit to a governance repo (baz-agent-system or a dedicated governance repo).
4. Reconcile every public surface to it.

## Exit criterion
One canonical doc, git-versioned, that every public claim can be checked against.

## Ownership / budget / next
- **Owner:** Brahim (decisions) · BAZ Agent (draft + maintain).
- **Budget:** ~1 day operator.
- **Next action (72h):** Brahim answers the open decisions; operator drafts v1.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.