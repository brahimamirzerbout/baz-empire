# 10 — baz-agent-system Has No Security / Compliance / Policy Docs

**Severity:** HIGH
**Dimension:** Security / AI-ops governance
**Status:** CONFIRMED

## What it is
`baz-agent-system` (the AI ops / Nova agents that handle client data + run campaigns + touch ad accounts) contains: `BAZ-Agent-System-Prompt.md`, `README.md`, `extensions/`, `skills/`, `scripts/`, `test/`, `package.json` — and **zero** security/compliance/policy files (find for `*secur*`/`*compliance*`/`*policy*`/`*gdpr*`/`*legal*` returned nothing). No data-handling policy, no access-control doc, no breach-response runbook, no sub-processor disclosure for the AI layer, no prompt-injection/abuse controls documented.

## How the enemy perceives and exploits it
- "BAZ's AI system processes client campaign data + ad accounts with no security or compliance documentation. Enterprise security review asks for: data-handling policy, access model, encryption, breach runbook, AI-abuse controls, sub-processors (which LLMs process my data?). BAZ can't answer. Security review fails → no enterprise deal. A competitor: 'they run AI on your data with no documented controls.'"

## How we solve it
Write the agent-system security + compliance doc set:
- **Data-handling policy:** what client data the agents touch, where it goes, retention.
- **Access control:** who/what can invoke agents, least privilege.
- **LLM sub-processor list:** which models/providers process client data (OpenAI/Anthropic/local?) — must be added to the sub-processor list (05/06).
- **Prompt-injection + abuse controls.**
- **Breach-response runbook + audit logging.**

## Sequence
1. Inventory what the agents touch + which LLMs process client data.
2. Draft the security/compliance docs.
3. Add LLM providers to the sub-processor list.
4. Publish a security/trust page.

## Exit criterion
A security reviewer receives data-handling + access + LLM-sub-processor + breach docs on request.

## Ownership / budget / next
- **Owner:** Brahim (architecture truth) · BAZ Agent (docs).
- **Budget:** ~1–2 days.
- **Next action (72h):** inventory agent data-touch + LLM providers; draft v1 security doc.

---
Diagnose first, architect the offer, ship the system, hold the line on what moves revenue.