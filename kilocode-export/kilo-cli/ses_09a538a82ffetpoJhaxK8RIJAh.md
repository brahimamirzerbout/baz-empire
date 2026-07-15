# Map baz-agent-system swarm core (@explore subagent)
- **id**: `ses_09a538a82ffetpoJhaxK8RIJAh`
- **agent**: explore  |  **model**: {"id":"kilo-auto/free","providerID":"kilo","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-15T12:07:08.926000+00:00  |  **updated**: 2026-07-15T12:07:09.149000+00:00
- **cost**: $0.0000  |  **tokens**: in=81251 out=5519 reason=2167
- **messages**: 9  |  **parts**: 57  |  **todos**: 0

## Transcript

### [user] 2026-07-15T12:07:09.123000+00:00  

Explore the directory /home/uzer/baz-agent-system thoroughly (this is "our agentic AI coding swarm"). I need a complete map so I can upgrade it.

Report the following with concrete file paths and key excerpts:
1. Full directory tree (files and subfolders).
2. The purpose/README of the system.
3. Contents/summary of BAZ-Agent-System-Prompt.md — what roles, agents, or orchestration does it define?
4. Any agent role definitions, persona files, or sub-agent specs (list each file and summarize its role, tools, and responsibilities).
5. How agents are orchestrated / coordinated (any orchestrator code, prompts, or routing logic).
6. Any "coding swarm" specific features — parallel agents, review loops, sub-agent spawning, self-correction.
7. Tech stack: package.json, configs, scripts, languages used.
8. Anything that looks incomplete, hacky, or a candidate for upgrade.

Be thorough (medium-to-very-thorough). Return a structured report I can act on. Do NOT edit any files.

### [assistant] 2026-07-15T12:07:09.186000+00:00  @kilo-auto/free


> _reasoning_: Let me explore the directory thoroughly. I'll start by looking at the structure

I'll explore the directory thoroughly. Let me start by mapping the structure and reading key files.

**tool `bash`** error
```input
{
  "command": "cd /home/uzer/baz-agent-system && find . -type f -not -path '*/.git/*' | head -200 && echo \"=== TREE ===\" && ls -la",
  "description": "List all files in baz-agent-system"
}
```
```output

```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system"
}
```
```output
<path>/home/uzer/baz-agent-system</path>
<type>directory</type>
<entries>
.git/
.gitignore
BAZ-Agent-System-Prompt.md
extensions/
README.md
settings.example.json
skills/

(7 entries)
</entries>
```


### [assistant] 2026-07-15T12:07:14.022000+00:00  @kilo-auto/free


> _reasoning_: Let me explore further with the available

**tool `bash`** error
```input
{
  "command": "cd /home/uzer/baz-agent-system && find . -type f -not -path '*/.git/*' | sort",
  "description": "List all files sorted"
}
```
```output

```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/README.md"
}
```
```output
<path>/home/uzer/baz-agent-system/README.md</path>
<type>file</type>
<content>
1: # BAZ Agent System
2: 
3: The BAZ senior-partner marketing-agency AI agent — **orchestrator, operators, extensions,
4: guardrails, and the canonical master prompt** — built to run on [pi](https://github.com/fgrehm/pi)
5: (the coding-agent harness). This is the system that powers the BAZ operator instances: an
6: S-tier, doctrine-locked, mode-switchable agent that ships operator-grade marketing work.
7: 
8: > Hierarchy: **orchestrator** (Brahim ZERBOUT, human, founder-engineer) → **operator** (the BAZ
9: > Agent instance) → **modes** (`/strategy /copy /systems /growth /sales /web`) → **tooling**
10: > (baz-review, baz-guardrails, baz-guard).
11: 
12: ## What's in here
13: 
14: ```
15: BAZ-Agent-System-Prompt.md   # The canonical master prompt — source of truth (baz.ts bakes it in)
16: extensions/
17:   baz.ts                     # BAZ OS: operator identity + 6 execution modes (the doctrine injector)
18:   brahim-os.ts               # Operator-context extension (executor voice, security-first)
19:   orchestrator/              # Meta-extension: curates pi's example extensions into conflict-free profiles
20:   baz-guard/                 # Repo-deletion safety guard (confirm destructive ops)
21:   baz-guardrails/            # Reusable guardrail snippets (security-checklist, careful, tdd, style-guide, …)
22:   baz-review/                # 5-dimension code review (code-quality, security, performance, t
... [+2575 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/BAZ-Agent-System-Prompt.md"
}
```
```output
<path>/home/uzer/baz-agent-system/BAZ-Agent-System-Prompt.md</path>
<type>file</type>
<content>
1: # BAZ — S-Tier Agent System Prompt
2: 
3: The single master system prompt for your own specialized AI agency agent.
4: Grounded in the **real** BAZ (18-service catalog, project/retainer pricing, senior-partner model,
5: Stitch Gold brand, MENA/EU/US, 60+ brands shipped) — not the speculative "terminal hacker" draft.
6: Founder technical depth (AI, CRM, Linux/security, Next.js+Supabase) is the execution backbone and
7: trust signal, not the public pitch.
8: 
9: ## How to use
10: 1. Paste everything inside the `BEGIN SYSTEM PROMPT` … `END SYSTEM PROMPT` fence as the **system** message.
11: 2. Then send a normal **user** message with the task (see the Invocation Cheat-Sheet at the bottom).
12: 3. The agent auto-switches "mode" based on what you ask (strategy / copy / systems / growth / sales).
13: 4. Replace the composite proof points (`60+`, `94%`, `<6mo`, etc.) with real client metrics before any public-facing output.
14: 
15: ---
16: 
17: ## BEGIN SYSTEM PROMPT
18: 
19: You are the **BAZ Agent** — the in-house senior partner, strategist, copy chief, and growth operator
20: for BAZ, a senior-led boutique marketing agency founded by **Brahim ZERBOUT**.
21: 
22: You operate at S-tier: elite, decisive, measurable, and execution-ready. You are never generic, never
23: bloated, and never soft. You ship operator-grade work that a CMO can put in front of a board without
24: editing. You
... [+10896 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/settings.example.json"
}
```
```output
<path>/home/uzer/baz-agent-system/settings.example.json</path>
<type>file</type>
<content>
1: {
2:   "lastChangelogVersion": "0.80.3",
3:   "theme": "dark",
4:   "packages": [
5:     "git:github.com/fgrehm/pi-ollama-cloud"
6:   ],
7:   "defaultProvider": "ollama-cloud",
8:   "defaultModel": "glm-5.2",
9:   "hideThinkingBlock": false,
10:   "defaultThinkingLevel": "xhigh"
11: }

(End of file - total 11 lines)
</content>
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/.gitignore"
}
```
```output
<path>/home/uzer/baz-agent-system/.gitignore</path>
<type>file</type>
<content>
1: # Runtime / secret exclusions — never commit these
2: **/auth.json
3: **/sessions/
4: **/cache/
5: **/git/
6: **/bin/
7: *.lock
8: .failsafe.lock
9: *.log
10: 
11: # OS / editor
12: .DS_Store
13: *.swp
14: .idea/
15: .vscode/

(End of file - total 15 lines)
</content>
```


### [assistant] 2026-07-15T12:07:19.757000+00:00  @kilo-auto/free


> _reasoning_: The bash tool seems to be unavailable in this read context — it returned "Model tried to call unavailable tool 'invalid'". Wait, actually the bash tool isn't in my available tools. Let me re-check. My available tools are: glob, grep, read, skill, webfetch, websearch. The bash tool is NOT available. The system prompt said I have Bash for file operations but the actual tool list doesn't include it. So I cannot use bash. I should use glob and grep and read.

Let me explore the extensions and skills folders. The find didn't output because bash isn't available. Let me use glob.

The bash tool isn't available here. Let me use glob to map the full tree, then read the extension and skill files.

**tool `glob`** completed
```input
{
  "pattern": "**/*",
  "path": "/home/uzer/baz-agent-system"
}
```
```output
/home/uzer/baz-agent-system/.git/logs/refs/remotes/origin/main
/home/uzer/baz-agent-system/.git/refs/remotes/origin/main
/home/uzer/baz-agent-system/.git/config
/home/uzer/baz-agent-system/.git/index
/home/uzer/baz-agent-system/.git/COMMIT_EDITMSG
/home/uzer/baz-agent-system/.git/logs/HEAD
/home/uzer/baz-agent-system/.git/refs/heads/main
/home/uzer/baz-agent-system/.git/logs/refs/heads/main
/home/uzer/baz-agent-system/.git/objects/86/2b631b9e1e8e2d2be9da51518cb833d26d0455
/home/uzer/baz-agent-system/.git/objects/a0/775519ee870913e2be1dcc929d7fc75505fbd6
/home/uzer/baz-agent-system/.git/objects/27/8ee22f9c7553de6592be40f8ec0263e73fd76e
/home/uzer/baz-agent-system/.git/objects/06/322cd61964cc6b69e9a011dfa11543d912a99e
/home/uzer/baz-agent-system/.git/objects/bc/59d227dd576975516f5c5c95b0ef5e676eb77d
/home/uzer/baz-agent-system/.git/objects/3f/d9c915e7ec5d412645c3173b172fc55a476e4e
/home/uzer/baz-agent-system/.git/objects/63/55608e472d3e374b775580700050ad0c0a0b20
/home/uzer/baz-agent-system/.git/objects/49/a4aa9042050b75c435c86c07c35cd147f17287
/home/uzer/baz-agent-system/.git/objects/22/e4fbdd19e176325bc9395b2475ceaf331fb6ff
/home/uzer/baz-agent-system/.git/objects/90/853e2946e931c77278f67ea1fcdaa9cdf9e2b8
/home/uzer/baz-agent-system/.git/objects/61/9d49b0b59fde9249c0b4afd61411c7ff1145f9
/home/uzer/baz-agent-system/.git/objects/e5/3fb6986a371d00ce2fedbca193ab2a2ff0661b
/home/uzer/baz-agent-system/.git/objects/0c/601efa17a2f120baaa3c46c513d139a05c590f
/home/uzer/baz-agent-system
... [+5491 chars truncated]
```


### [assistant] 2026-07-15T12:07:26.992000+00:00  @kilo-auto/free


> _reasoning_: Now I have the full file list. Let me read all the key files. The directory is actually about a "marketing agency AI agent" running on "pi" harness, not strictly a "coding swarm." But the user calls it a "coding swarm." Let me read all the extension files and skill files to understand them thoroughly.

Let me read the main extensions: baz.ts, brahim-os.ts, orchestrator (index.ts, manage.ts, catalog.ts, README.md), baz-guard/index.ts, baz-guardrails/index.ts + snippets, baz-review/index.ts + SKILL.md, and the pi-sync skill.

Let me read them all in parallel.

Now let me read all the extension and skill files to understand roles, orchestration, and tech stack.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz.ts</path>
<type>file</type>
<content>
1: /**
2:  * baz — BAZ OS: operator identity + execution modes for BAZ operator instances.
3:  *
4:  * Source of truth: ~/Desktop/BAZ-Agent-System-Prompt.md (the canonical master
5:  * prompt). This extension bakes that protocol into the system prompt on every
6:  * turn (via before_agent_start) and exposes the 6 canonical modes as commands.
7:  *
8:  * Hierarchy (by function):
9:  *   orchestrator  : Brahim ZERBOUT (human, founder-engineer) — top
10:  *   operator      : this BAZ Agent instance — mode-switchable
11:  *   agents (modes): /strategy /copy /systems /growth /sales /web
12:  *   tooling       : baz-review (code review), baz-guardrails (snippets),
13:  *                   baz-guard (repo-deletion safety)
14:  *
15:  * State persists to ~/.pi/baz/modes/<session>.json (atomic writes).
16:  */
17: 
18: import * as fs from "node:fs";
19: import * as path from "node:path";
20: import * as os from "node:os";
21: import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
22: 
23: const STATE_DIR = path.join(os.homedir(), ".pi", "baz", "modes");
24: 
25: const MODES: Record<string, string> = {
26: 	strategy:
27: 		"boardroom operator: diagnose, model, architect, roadmap. Lead with the strongest conclusion; tables for strategy/channels/KPIs/pricing. Default mode.",
28: 	copy:
29: 		"best direct-response writer alive: hook–story–offer, VoC, tested. Pass market/offer lenses first 
... [+13280 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/brahim-os.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/brahim-os.ts</path>
<type>file</type>
<content>
1: /**
2:  * brahim-os — operator identity + execution modes for Brahim-OS instances.
3:  *
4:  * The orchestrator is Brahim Amir Zerbout (human). Every pi instance on this
5:  * machine is a subordinate Brahim-OS operator acting on his behalf. This
6:  * extension appends an operator-context block + the current mode to the
7:  * system prompt on every turn (via before_agent_start).
8:  *
9:  * Modes (switchable, persisted per session):
10:  *   /architect   systems & topology
11:  *   /executor    high-intensity completion (default)
12:  *   /strategist  positioning / brand / GTM / moats
13:  *   /judge       audit mode (verdict + fixes)
14:  *
15:  * Also: /mode [name] (show/switch), /orchestrator (status + identity exposure).
16:  *
17:  * Modes shape FOCUS via the prompt, not tool locks — no tools are disabled,
18:  * to avoid breaking flows. /judge nudges to /review (ties baz in).
19:  *
20:  * ## PII / data-minimization gate (important)
21:  * The operator block is split into:
22:  *   - OPERATOR_IDENTITY  (PII-bearing: name, location, ecosystem, orchestrator framing)
23:  *   - OPERATOR_RULES     (PII-free: operating rules, voice, output format)
24:  * Identity is only appended when it is SAFE to send to the active provider.
25:  * Config at ~/.pi/brahim-os/config.json:
26:  *   {
27:  *     "exposeIdentity": "auto",            // "auto" | "always" | "never"
28:  *     "identit
... [+10602 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/orchestrator/index.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/orchestrator/index.ts</path>
<type>file</type>
<content>
1: // Orchestrator: a meta-extension that curates pi's example extensions into
2: // conflict-free "profiles" and activates the right bundle for the task.
3: //
4: //   - /orchestrate            interactive menu (profiles + individual extensions)
5: //   - /orchestrate-reload      triggers ctx.reload() (queued as a follow-up by the tool)
6: //   - orchestrate (tool)       the agent calls this "when appropriate" to enable/disable
7: //
8: // Enable = copy examples/<key> -> extensions/<key>, then /reload. The new extensions
9: // become active on SUBSEQUENT turns (reload happens after the current turn finishes).
10: // The orchestrator refuses conflicting combos (singleton groups) -> "perfect synergy".
11: 
12: import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
13: import { getAgentDir } from "@earendil-works/pi-coding-agent";
14: import { Type } from "typebox";
15: import { StringEnum } from "@earendil-works/pi-ai";
16: import { join } from "node:path";
17: import { existsSync } from "node:fs";
18: import { createManager, type Result } from "./manage.ts";
19: import { PROFILES, CATALOG } from "./catalog.ts";
20: 
21: export default function (pi: ExtensionAPI) {
22:   const agentDir = getAgentDir();
23:   const extDir = join(agentDir, "extensions");
24:   const examplesDir = join(extDir, "examples");
25:   const stateFile = join(extDir, ".orchestrator-state.js
... [+9315 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/orchestrator/manage.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/orchestrator/manage.ts</path>
<type>file</type>
<content>
1: // Pure filesystem-level management of enabled example extensions.
2: // Enable = copy the example from <examplesDir>/<key> to <extDir>/<key> (real file/dir,
3: //   so pi's auto-discovery picks it up after /reload).
4: // Disable = remove <extDir>/<key>, but ONLY if it's in our managed state file
5: //   (never touch baz/, orchestrator/, examples/, or user-added files).
6: // Conflict check = no two members of the same singleton `group` active at once.
7: //
8: // No pi imports here -> unit-testable in isolation.
9: 
10: import { cpSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
11: import { join } from "node:path";
12: import { CATALOG, PROFILES, type CatalogEntry } from "./catalog.ts";
13: 
14: export type Result = {
15:   ok: boolean;
16:   message: string;
17:   changed: boolean;
18:   enabled?: string[];
19:   conflicts?: string[];
20: };
21: 
22: export function createManager(opts: { extDir: string; examplesDir: string; stateFile: string }) {
23:   const { extDir, examplesDir, stateFile } = opts;
24: 
25:   const byKey = new Map<string, CatalogEntry>();
26:   for (const e of CATALOG) byKey.set(e.key, e);
27: 
28:   function readState(): string[] {
29:     try {
30:       const v = JSON.parse(readFileSync(stateFile, "utf8"));
31:       return Array.isArray(v) ? v as string[] : [];
32:     } catch {
33:       return [];
34:     }
35
... [+6955 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/orchestrator/catalog.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/orchestrator/catalog.ts</path>
<type>file</type>
<content>
1: // Catalog of pi example extensions + curated, conflict-free profiles.
2: // `key` is the on-disk name under ~/.pi/agent/extensions/ (e.g. "snake.ts" or "plan-mode").
3: // Extensions sharing a `group` are singletons: only one may be active at a time
4: // (the orchestrator refuses to enable a second member of the same group).
5: 
6: export type CatalogEntry = {
7:   key: string;
8:   desc: string;
9:   group?: string; // singleton conflict group
10:   requiresSetup?: boolean; // external deps/config needed -> orchestrator won't auto-enable
11:   note?: string;
12: };
13: 
14: export type Profile = {
15:   desc: string;
16:   when: string; // when the agent should enable it
17:   keys: string[]; // example keys to enable
18: };
19: 
20: export const PROFILES: Record<string, Profile> = {
21:   safe: {
22:     desc: "Safety gates: confirm dangerous ops, protect sensitive paths, guard dirty repos",
23:     when: "before destructive commands (rm -rf, sudo, git push --force, dropping tables) or work in sensitive repos",
24:     keys: ["permission-gate.ts", "protected-paths.ts", "confirm-destructive.ts", "dirty-repo-guard.ts"],
25:   },
26:   git: {
27:     desc: "Git workflow: stash checkpoints each turn, guard dirty repos, auto-commit on exit",
28:     when: "working inside a git repository (look for .git)",
29:     keys: ["git-checkpoint.ts", "dirty-repo-guard.ts", "auto-co
... [+7611 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/orchestrator/README.md"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/orchestrator/README.md</path>
<type>file</type>
<content>
1: # Orchestrator
2: 
3: A meta-extension that curates pi's example extensions (`~/.pi/agent/extensions/examples/`)
4: into conflict-free **profiles** and activates the right bundle for the task.
5: 
6: ## Why
7: 
8: The examples folder has 80+ extensions, many of which conflict (multiple footers,
9: editors, tool renderers…). The orchestrator picks combinations that compose and
10: **refuses** conflicting ones, so you get "perfect synergy" instead of a broken TUI.
11: 
12: ## Profiles
13: 
14: | Profile | When | Extensions |
15: |---|---|---|
16: | `safe` | before destructive ops / sensitive repos | permission-gate, protected-paths, confirm-destructive, dirty-repo-guard |
17: | `git` | inside a git repo | git-checkpoint, dirty-repo-guard, auto-commit-on-exit |
18: | `ui` | richer interface | custom-header, custom-footer, titlebar-spinner, notify |
19: | `focus` | minimal/distraction-free | minimal-mode, hidden-thinking-label, working-indicator |
20: | `play` | long task, user waiting | snake, space-invaders, tic-tac-toe, notify |
21: | `review` | code review / long session | summarize, bookmark, trigger-compact |
22: | `power` | power-user model/tools/sessions | preset, tools, handoff, session-name |
23: | `plan` | exploring before changing | plan-mode |
24: | `context` | extra prompt context | claude-rules, prompt-customizer |
25: 
26: Profiles layer freely except for **si
... [+1620 chars truncated]
```


### [assistant] 2026-07-15T12:07:36.760000+00:00  @kilo-auto/free


> _reasoning_: Now let me read the remaining files: baz-guard/index.ts, baz-guardrails/index.ts, baz-review/index.ts + SKILL.md, pi-sync/SKILL.md + sync-pi, and a few snippets to summarize. Let me also grep for the "build-bus" references which appear to be a cross-instance coordination feature (swarm-like). Let me read these

Now let me read the guard, guardrails, review, and skill files, plus grep for cross-instance/"swarm" coordination logic.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-guard/index.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-guard/index.ts</path>
<type>file</type>
<content>
1: /**
2:  * baz-guard — repo-deletion safety function.
3:  * Confirms before destructive bash ops that would delete a whole git repo in
4:  * the user's home, so repos can't be wiped by mistake. Passive guard (tool_call).
5:  */
6: 
7: import { existsSync, readdirSync, statSync } from "node:fs";
8: import { basename, join } from "node:path";
9: import { homedir } from "node:os";
10: import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
11: 
12: const HOME = homedir();
13: 
14: function escapeRegex(s: string): string {
15:   return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
16: }
17: 
18: function isDestructive(cmd: string): boolean {
19:   if (/\brm\b/.test(cmd) && /-[a-zA-Z]*[rRfF]/.test(cmd)) return true;
20:   if (/\bgit\s+rm\b/.test(cmd)) return true;
21:   if (/\bgit\s+reset\s+--hard\b/.test(cmd)) return true;
22:   if (/\bgit\s+clean\s+(-[a-zA-Z]*f|--force)/.test(cmd)) return true;
23:   if (/\bgit\s+push\b[^|\n]*(-f\b|--force\b|--force-with-lease\b)/.test(cmd)) return true;
24:   if (/\bfind\b[^|\n]*-delete\b/.test(cmd)) return true;
25:   if (/\bshred\b/.test(cmd)) return true;
26:   if (/\bmv\b[^|\n]*\/dev\/null/.test(cmd)) return true;
27:   return false;
28: }
29: 
30: // True if `cmd` would delete/destroy the whole `repoAbs` (root, or root + glob).
31: function targetsRepoRoot(cmd: string, repoAbs: string, cwd: string): boolean {
32:   const name = bas
... [+2611 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-guardrails/index.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-guardrails/index.ts</path>
<type>file</type>
<content>
1: /**
2:  * baz-guardrails — reusable guardrail snippets function.
3:  * Provides: baz_snippet tool (load a snippet), /snippet command, and the
4:  * snippet library in ./snippets/*.md.
5:  */
6: 
7: import { existsSync, readdirSync, readFileSync } from "node:fs";
8: import { dirname, join } from "node:path";
9: import { fileURLToPath } from "node:url";
10: import { StringEnum } from "@earendil-works/pi-ai";
11: import { Type } from "typebox";
12: import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
13: 
14: const baseDir = dirname(fileURLToPath(import.meta.url));
15: const SNIPPET_DIR = join(baseDir, "snippets");
16: 
17: function listSnippets(): string[] {
18:   try {
19:     return readdirSync(SNIPPET_DIR).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)).sort();
20:   } catch {
21:     return [];
22:   }
23: }
24: 
25: function readSnippet(name: string): string | null {
26:   try {
27:     const f = join(SNIPPET_DIR, `${name}.md`);
28:     if (!existsSync(f)) return null;
29:     return readFileSync(f, "utf-8");
30:   } catch {
31:     return null;
32:   }
33: }
34: 
35: export default function bazGuardrails(pi: ExtensionAPI) {
36:   const snippets = listSnippets();
37: 
38:   pi.on("before_agent_start", async (event) => {
39:     const snipList = snippets.map((s) => `  - ${s}`).join("\n") || "  (none found)";
40:     const block = `
41: 
42: 
... [+2873 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-review/index.ts"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-review/index.ts</path>
<type>file</type>
<content>
1: /**
2:  * baz-review — code review function.
3:  * Provides: baz-review skill (5-dimension review), baz_review_changes tool
4:  * (fetch a git diff), /review command.
5:  */
6: 
7: import { spawnSync } from "node:child_process";
8: import { existsSync } from "node:fs";
9: import { dirname, join } from "node:path";
10: import { fileURLToPath } from "node:url";
11: import { StringEnum } from "@earendil-works/pi-ai";
12: import { Type } from "typebox";
13: import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
14: 
15: const baseDir = dirname(fileURLToPath(import.meta.url));
16: const SKILL_FILE = join(baseDir, "SKILL.md");
17: const MAX_DIFF = 50 * 1024;
18: 
19: function git(args: string[], cwd: string): string {
20:   const r = spawnSync("git", args, { cwd, encoding: "utf-8", maxBuffer: 20 * 1024 * 1024 });
21:   return (r.stdout || "") + (r.stderr ? `\n[stderr]\n${r.stderr}` : "");
22: }
23: 
24: function branchBase(cwd: string): string {
25:   for (const ref of ["origin/main", "origin/master", "main", "master", "HEAD~1"]) {
26:     const r = spawnSync("git", ["rev-parse", "--verify", ref], { cwd, encoding: "utf-8" });
27:     if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
28:   }
29:   return "HEAD~1";
30: }
31: 
32: function truncate(s: string): string {
33:   return s.length > MAX_DIFF
34:     ? s.slice(0, MAX_DIFF) + `\n\n[... BAZ truncated
... [+4233 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-review/SKILL.md"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-review/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: baz-review
3: description: BAZ multi-dimension code review. Use when the user asks to review code, runs /review, or wants a review of staged changes, a commit, a branch, or specific files. Reviews across 5 dimensions (code-quality, security, performance, testing, documentation) with critical/suggestion/highlight severity, citing file_path:line_number.
4: ---
5: 
6: # BAZ Code Review
7: 
8: A structured, 5-dimension code review. Load this skill when the user asks for a code review or runs `/review`.
9: 
10: ## Workflow
11: 
12: 1. **Determine scope** — `staged` (default), `last` (last commit), `branch` (diff vs base branch), or explicit paths.
13: 2. **Fetch the diff** — use the `baz_review_changes` tool, or run git directly:
14:    - staged: `git diff --cached`
15:    - last: `git show HEAD`
16:    - branch: `git diff $(git merge-base HEAD main)...HEAD`
17: 3. **Review across all 5 dimensions** (below). Cite `file_path:line_number` for every finding.
18: 4. **Apply guardrails** — before finalizing, load relevant BAZ guardrail snippets with the `baz_snippet` tool and apply them to the review: `security-checklist`, `careful`, `testing-requirements`, `style-guide`, `error-handling`, `performance-tips`. Use only the ones relevant to the change.
19: 5. **Output the BAZ report** (format below).
20: 
21: ## Dimensions
22: 
23: ### code-quality
24: - Readability: clear 
... [+2142 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/skills/pi-sync/SKILL.md"
}
```
```output
<path>/home/uzer/baz-agent-system/skills/pi-sync/SKILL.md</path>
<type>file</type>
<content>
1: ---
2: name: pi-sync
3: description: Keep multiple pi instances synced across XFCE workspaces on this Kali machine. Use when the user runs pi on several desktops/workspaces and wants config/extension/skill changes propagated to all of them, wants a status overview of which pi is where, or wants to move/share session context between desktops.
4: ---
5: 
6: # pi-sync — keep pi instances synced across XFCE workspaces
7: 
8: This machine runs **Kali + XFCE4 with 4 workspaces**, the terminal is **QTerminal**,
9: and the user often runs a `pi` instance on more than one desktop at once.
10: 
11: ## The model (read this first)
12: 
13: All `pi` instances on this **one machine** already share the same directory:
14: `~/.pi/agent/` — `settings.json`, `models.json`, `extensions/`, `skills/`,
15: `prompts/`, `themes/`, and `sessions/`. So shared resources are **already
16: synced on disk**. There are only two real "sync" problems across desktops:
17: 
18: 1. **Running instances don't auto-pick-up disk changes.** When you change
19:    settings, install/enable an extension (e.g. via the `orchestrate` tool),
20:    add a skill/prompt/theme, or edit `models.json`, every *other* running pi
21:    needs a `/reload` to apply it. This skill broadcasts `/reload`.
22: 2. **Context lives in separate sessions.** Each pi has its own session (keyed
23:    by its working directory). To continue work on anot
... [+3725 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/skills/pi-sync/sync-pi"
}
```
```output
<path>/home/uzer/baz-agent-system/skills/pi-sync/sync-pi</path>
<type>file</type>
<content>
1: #!/usr/bin/env bash
2: # sync-pi — keep pi instances synced across XFCE workspaces.
3: #
4: # All pi instances share ~/.pi/agent/ (settings, extensions, skills, prompts,
5: # themes, sessions). So config is already shared on disk; "sync" means:
6: #   1) make running instances pick up disk changes (/reload), and
7: #   2) move/share context between desktops via pi sessions files.
8: #
9: # Subcommands:
10: #   sync-pi status            pi processes (pid, cwd, session, stale?) + desktops
11: #   sync-pi sessions          list session files with cwd + mtime + active pi
12: #   sync-pi reload [--yes]    type /reload into every pi terminal (xdotool)
13: #   sync-pi apply <cmd> [--yes]   type any slash command into every pi terminal
14: #   sync-pi notify [msg]      desktop notification reminding to /reload
15: #   sync-pi check             shared-resource consistency report
16: #
17: # Requires: pgrep, ps, readlink/pwdx, date, stat, find. Optional: xdotool, xprop
18: # (for desktop mapping and reload/apply broadcasting), notify-send (for notify).
19: 
20: set -uo pipefail
21: AGENT_DIR="${PI_AGENT_DIR:-$HOME/.pi/agent}"
22: SESSIONS="$AGENT_DIR/sessions"
23: EXT="$AGENT_DIR/extensions"
24: SKILLS="$AGENT_DIR/skills"
25: PROMPTS="$AGENT_DIR/prompts"
26: THEMES="$AGENT_DIR/themes"
27: SELF="$(readlink -f "$0" 2>/dev/null || echo "$0")"
28: 
29: have() { command -v "$1" >/dev/null 2>&1; }

... [+9015 chars truncated]
```


### [assistant] 2026-07-15T12:07:45.347000+00:00  @kilo-auto/free


> _reasoning_: I have a thorough understanding now. Let me also check the snippet files briefly - I'll read a couple to summarize, and grep for "build-bus" to understand the cross-instance coordination (swarm-like) feature. The baz.ts and brahim-os.ts both reference "build-bus" and "~/.pi/build-bus/reports". Let me search for that. Also let me look at a few snippets to summarize guardrails.

Let me grep for build-bus and cross-instance references, and read a few representative snippets.

Let me grep for the cross-instance coordination feature ("build-bus") and sample a few guardrail snippets to summarize.

**tool `grep`** completed
```input
{
  "pattern": "build-bus|cross-instance|subagent|spawn|peer-subordinate",
  "path": "/home/uzer/baz-agent-system",
  "include": "*.{ts,md,json}"
}
```
```output
Found 11 matches
/home/uzer/baz-agent-system/extensions/baz.ts:
  Line 52: BAZ operators run on this machine — cross-instance intel arrives via build-bus; treat it as

  Line 53: peer-subordinate comms under the orchestrator.

  Line 262: 				"  cross-bus    : ~/.pi/build-bus/reports (peer-subordinate intel)",


/home/uzer/baz-agent-system/extensions/brahim-os.ts:
  Line 68: instances run on this machine — cross-instance intel arrives via build-bus;

  Line 69: treat it as peer-subordinate comms under the orchestrator.`;

  Line 75: cross-instance intel arrives via build-bus; treat it as peer-subordinate comms.`;

  Line 260: 				"  cross-bus    : ~/.pi/build-bus/reports (peer-subordinate intel)",


/home/uzer/baz-agent-system/extensions/baz-review/index.ts:
  Line 7: import { spawnSync } from "node:child_process";

  Line 20:   const r = spawnSync("git", args, { cwd, encoding: "utf-8", maxBuffer: 20 * 1024 * 1024 });

  Line 26:     const r = spawnSync("git", ["rev-parse", "--verify", ref], { cwd, encoding: "utf-8" });


/home/uzer/baz-agent-system/extensions/orchestrator/catalog.ts:
  Line 127:   { key: "subagent", desc: "Delegate tasks to specialized subagents", requiresSetup: true, note: "Spawns pi subagents" },

```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/security-checklist.md"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/security-checklist.md</path>
<type>file</type>
<content>
1: Security considerations:
2: - Never log or expose secrets, API keys, or credentials
3: - Validate and sanitize all user inputs
4: - Use parameterized queries to prevent SQL injection
5: - Implement proper authentication and authorization checks
6: - Keep dependencies up to date
7: - Follow the principle of least privilege

(End of file - total 7 lines)
</content>
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/careful.md"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/careful.md</path>
<type>file</type>
<content>
1: Think step by step. Double-check your work before committing changes.
2: Ask clarifying questions if anything is ambiguous.

(End of file - total 2 lines)
</content>
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/tdd.md"
}
```
```output
<path>/home/uzer/baz-agent-system/extensions/baz-guardrails/snippets/tdd.md</path>
<type>file</type>
<content>
1: Test-Driven Development approach:
2: 1. Write a failing test first
3: 2. Implement the minimum code to pass the test
4: 3. Refactor while keeping tests passing
5: 4. Repeat for each new feature or bug fix
6: 
7: Write tests that define expected behavior before implementation.

(End of file - total 7 lines)
</content>
```


### [assistant] 2026-07-15T12:07:54.136000+00:00  @kilo-auto/free


> _reasoning_: I have enough now. The "build-bus" is referenced but there's no implementation in this repo — it's a conceptual cross-instance coordination mechanism (peer-subordinate comms) that reads from ~/.pi/build-bus/reports. This is a swarm-like feature but not implemented here.

Let me also check the git log to understand the project state / recent activity for "incomplete" assessment. Let me read the git log. Actually I can't use bash. Let me try to read .git/logs/HEAD.

Actually that's fine, I have enough. Let me also sample a couple more snippets quickly to characterize them, but I think I have a good picture. Let me quickly read a few more snippet names (I have the list). The snippet list: base-style, incremental-commits, cherry-pick, git-status, code-style, minimal, performance-tips, error-handling, tdd, conventional-commits, python-style, careful, testing-requirements, project-context, style-guide, security-checklist.

I have enough to write a thorough report. Let me also note the git history - I'll read the COMMIT_EDITMSG or logs/HEAD via read. Let me do that to assess recency/incompleteness.

Let me check the git history to assess maturity/recency.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/baz-agent-system/.git/logs/HEAD"
}
```
```output
<path>/home/uzer/baz-agent-system/.git/logs/HEAD</path>
<type>file</type>
<content>
1: 0000000000000000000000000000000000000000 a0775519ee870913e2be1dcc929d7fc75505fbd6 Baz Aslan <zerboutbrahimamir@gmail.com> 1783372701 -0400	commit (initial): feat: BAZ agent system — orchestrator, operators, extensions, guardrails, master prompt

(End of file - total 1 lines)
</content>
```


### [assistant] 2026-07-15T12:08:00.380000+00:00  @kilo-auto/free


> _reasoning_: Now I have a complete picture. Let me write the thorough structured report.

Let me note key facts:
- This is a single initial commit, no package.json (no build tooling!). It's TypeScript source for the "pi" coding-agent harness (@earendil-works/pi-coding-agent). No package.json, no tsconfig, no build scripts in this repo — relies on pi to run .ts extensions directly (it mentions jiti resolution). So "tech stack" is TypeScript ESM on Node, with typebox + pi-ai StringEnum, run by pi harness.

- The "swarm" aspect: Multiple pi instances on one machine (Kali + XFCE4, 4 workspaces), coordinated via pi-sync skill and "build-bus" peer-subordinate comms (conceptual, not implemented). Subagents via the `subagent` example (requiresSetup, not in this repo).

- Incomplete/hacky things:
  - Brand drift: README admits "Stitch Gold" vs "Midnight Terminal" mismatch. BAZ-Agent-System-Prompt.md still uses Stitch Gold #16130E/#E7C274, but baz.ts OPERATOR_IDENTITY uses Midnight Terminal #020617/#22D3EE. README §"Known drift" warns to reconcile. Also baz.ts references "Public fork: Midnight Terminal + BAZventures — decided per ~/Desktop/BAZventures-Public-Site-Canonical.md §1" which is an external file that doesn't live in repo.
  - "build-bus" referenced repeatedly but no implementation present (no build-bus tool/reader; just a read path ~/.pi/build-bus/reports). Peer-subordinate cross-instance intel is declared but not wired.
  - No package.json / no tsconfig / no build step → can't typecheck or run standalone; depends on an external `pi` runtime + its separate `examples/` dir (orchestrator references examples not in repo).
  - orchestrator catalog.ts references ~80 example extensions that are NOT in this repo (in pi's examples/). The `subagent` (spawns pi subagents) is `requiresSetup: true` — swarm sub-agent spawning is referenced but not provided.
  - baz.ts reads canonical prompt from ~/Desktop/BAZ-Agent-System-Prompt.md (hardcoded default path), and the OPERATOR_IDENTITY block in baz.ts is a duplicate/divergent copy of the master prompt — drift risk (two sources of truth).
  - PII handling in brahim-os.ts: identityExposed is exact-match on provider string; comment warns "ollama-cloud" is NOT treated as "ollama". Default model in settings.example.json is "glm-5.2" on "ollama-cloud" provider — meaning identity would be WITHHELD by default (auto mode) — but the BAZ agent (baz.ts) has no such PII gating, so the BAZ operator identity (naming Brahim, locations) is always injected regardless of provider. Inconsistency.
  - baz-review truncates diffs at 50KB — large PRs reviewed in chunks; the "If truncated, call again" instruction relies on agent loop.
  - Atomic writes use .tmp + rename — good, but no locking for concurrent sessions.
  - The `name` in brahim-os.ts OPERATOR_IDENTITY includes a real name + home address ('Ain Benian, Algiers) — PII embedded in code; gated but gating depends on provider config that defaults to withhold on cloud.

Let me structure the report now. I'll provide the directory tree, README purpose, master prompt summary, role definitions, orchestration, swarm features, tech stack, and upgrade candidates.

Let me build the file tree explicitly.

Tree:
```
baz-agent-system/
├── .gitignore
├── README.md
├── BAZ-Agent-System-Prompt.md          (canonical master prompt, 158 lines)
├── settings.example.json               (provider/model config)
├── extensions/
│   ├── baz.ts                          (BAZ OS operator identity + 6 modes)
│   ├── brahim-os.ts                    (Brahim-OS subordinate operator + 4 modes + PII gate)
│   ├── baz-review/
│   │   ├── SKILL.md                    (5-dimension review skill)
│   │   └── index.ts                    (baz_review_changes tool + /review cmd)
│   ├── baz-guardrails/
│   │   ├── index.ts                    (baz_snippet tool + /snippet cmd)
│   │   └── snippets/                   (16 .md snippets)
│   │       ├── base-style.md
│   │       ├── incremental-commits.md
│   │       ├── cherry-pick.md
│   │       ├── git-status.md
│   │       ├── code-style.md
│   │       ├── minimal.md
│   │       ├── performance-tips.md
│   │       ├── error-handling.md
│   │       ├── tdd.md
│   │       ├── conventional-commits.md
│   │       ├── python-style.md
│   │       ├── careful.md
│   │       ├── testing-requirements.md
│   │       ├── project-context.md
│   │       ├── style-guide.md
│   │       └── security-checklist.md
│   ├── baz-guard/
│   │   └── index.ts                    (repo-deletion safety guard)
│   └── orchestrator/
│       ├── index.ts                    (orchestrate tool + /orchestrate cmd)
│       ├── manage.ts                   (enable/disable/state/conflict logic)
│       ├── catalog.ts                  (80+ extension catalog + 9 profiles)
│       └── README.md
└── skills/
    └── pi-sync/
        ├── SKILL.md
        └── sync-pi                     (bash helper)
```

Now I'll write the report. I should be thorough but structured. Let me write it.

The user said "agentic AI coding swarm" but this is actually a marketing-agency AI agent system on top of the "pi" coding agent harness. The "swarm" is multiple pi instances coordinated across XFCE workspaces. I should note the mismatch: it's framed as a marketing operator, but coded as a coding-agent extension system. The user's framing of "coding swarm" maps to the multi-instance pi coordination (orchestrator + modes + pi-sync + build-bus).

Let me write final

I have a complete picture of the system. Here is the structured report.

---

# BAZ Agent System — Complete Map & Upgrade Report

`/home/uzer/baz-agent-system` is **not literally a "coding swarm" repo** — it is the extension/prompt pack for **BAZ**, a senior-partner *marketing-agency* AI agent, built to run on the **`pi` coding-agent harness** (`@earendil-works/pi-coding-agent`, github.com/fgrehm/pi). The "swarm" angle lives in the multi-instance coordination layer (the orchestrator + `pi-sync` + the conceptual `build-bus`). It is a single initial git commit (author "Baz Aslan", one commit, no ongoing history).

---

## 1. Full directory tree

```
baz-agent-system/
├── .gitignore                         # excludes auth.json, sessions/, cache/, *.log, etc.
├── README.md                          # system overview, modes table, install, "known drift" warning
├── BAZ-Agent-System-Prompt.md         # canonical master prompt (158 lines) — source of truth
├── settings.example.json              # provider/model defaults (no secrets)
├── extensions/
│   ├── baz.ts                         # BAZ OS: operator identity + 6 execution modes (doctrine injector)
│   ├── brahim-os.ts                   # Brahim-OS subordinate operator + 4 modes + PII/gate
│   ├── baz-review/
│   │   ├── SKILL.md                   # 5-dimension review skill definition
│   │   └── index.ts                   # baz_review_changes tool + /review command
│   ├── baz-guardrails/
│   │   ├── index.ts                   # baz_snippet tool + /snippet command
│   │   └── snippets/                  # 16 loadable .md guardrail snippets
│   │       ├── base-style.md          ├── incremental-commits.md
│   │       ├── cherry-pick.md         ├── git-status.md
│   │       ├── code-style.md          ├── minimal.md
│   │       ├── performance-tips.md    ├── error-handling.md
│   │       ├── tdd.md                 ├── conventional-commits.md
│   │       ├── python-style.md        ├── careful.md
│   │       ├── testing-requirements.md├── project-context.md
│   │       ├── style-guide.md         └── security-checklist.md
│   ├── baz-guard/
│   │   └── index.ts                   # repo-deletion safety guard (tool_call hook)
│   └── orchestrator/
│       ├── index.ts                   # orchestrate tool + /orchestrate, /orchestrate-reload commands
│       ├── manage.ts                  # enable/disable/state/conflict filesystem logic (unit-testable)
│       ├── catalog.ts                 # 80+ example-extension catalog + 9 curated profiles
│       └── README.md                  # orchestrator docs
└── skills/
    └── pi-sync/
        ├── SKILL.md                   # multi-instance sync skill (XFCE workspaces)
        └── sync-pi                    # bash helper (status/sessions/reload/apply/notify/check)
```

No `package.json`, `tsconfig.json`, lockfile, or build script exists in this repo.

---

## 2. System purpose / README

`README.md` defines BAZ as *"the BAZ senior-partner marketing-agency AI agent — orchestrator, operators, extensions, guardrails, and the canonical master prompt — built to run on pi."*

- **Hierarchy:** orchestrator (Brahim ZERBOUT, human) → operator (the BAZ Agent instance) → modes (`/strategy /copy /systems /growth /sales /web`) → tooling (`baz-review`, `baz-guardrails`, `baz-guard`).
- **6 canonical modes** documented in a table (strategy/copy/systems/growth/sales/web).
- **Install** copies `extensions/*` → `~/.pi/agent/extensions/`, `skills/*` → `~/.pi/agent/skills/`, keeps `BAZ-Agent-System-Prompt.md` as source of truth (default `~/Desktop/BAZ-Agent-System-Prompt.md`).
- **Guardrail snippets** loadable via `baz_snippet` tool or `/snippet <name>`.
- **⚠️ Known drift (important):** the master prompt still references the **"Stitch Gold"** palette (`#16130E`/`#E7C274`), while the live identity is **Midnight Terminal** (`#020617`/`#22D3EE`). README tells you to reconcile before running a fresh operator.

---

## 3. `BAZ-Agent-System-Prompt.md` summary

The canonical master prompt, wrapped in `BEGIN SYSTEM PROMPT` … `END SYSTEM PROMPT` fences. Defines:

- **Identity/ground truth:** boutique senior-partner-led marketing agency, founded by Brahim ZERBOUT; project+retainer pricing (Core $6.5–9.5k/mo, Growth $18–28k/mo, Project $12–80k); 18-service catalog across 5 pillars (owned/earned/paid/data/platform); MENA/EU/US; tracking is the moat (server-side GTM, GA4, CAPI, MMM); sub-1.5s LCP floor.
- **Brand & voice — "Stitch Gold"** (`#16130E` bg, `#E9E1D8` text, `#E7C274` gold, Outfit/Poppins/JetBrains Mono, square corners). This is the **old** palette — contradicts `baz.ts`.
- **Marketer synthesis — 10 lenses** (Ogilvy, Schwartz, Hopkins, Godin, Kennedy, Halbert, Brunson, Wiebe, Deiss, Hormozi) with triggers + default sequencing.
- **Operating rules, standard deliverable shape (7 steps), and 6 modes.**
- **Guardrails:** no fabricated metrics, never SaaS/junior-pod, GDPR-compliant tracking, no copy-first.
- **Invocation cheat-sheet** + a **Reconciliation note** acknowledging the "Stitch Gold (A)" vs "midnight-cyan AI-native (B)" split — (A) is used as public truth.

Note: it defines **modes/voices/doctrine**, not literal sub-agents or routing code.

---

## 4. Agent role definitions / persona files / sub-agent specs

There is **no separate persona-file directory**; roles are embedded in `.ts` `OPERATOR_IDENTITY` strings.

| File | Role | Modes | Tools / mechanism | Responsibilities |
|---|---|---|---|---|
| `extensions/baz.ts` | **BAZ Agent** (operator instance of Brahim's agency) | strategy, copy, systems, growth, sales, web | `before_agent_start` (bakes prompt), `/mode`, `/<mode>`, `/orchestrator` cmds; persists mode to `~/.pi/baz/modes/<session>.json` (atomic) | Injects operator identity + 6-mode doctrine every turn; auto-switches mode by intent; status/notify; frames other BAZ operators as peer-subordinates under orchestrator |
| `extensions/brahim-os.ts` | **Brahim-OS** (subordinate operator acting for the human orchestrator) | architect, executor (default), strategist, judge | same hook pattern; **PII gate** (`exposeIdentity` auto/always/never; exact-match provider check) | Same mode-switching; but **splits identity (PII) from rules** and only sends identity to local providers (ollama/lmstudio/etc.); redacts name/location otherwise; `/judge` nudges to `/review` |
| `extensions/baz-review/` | **Code reviewer** | (via `/review`, `baz-review` skill) | `baz_review_changes` tool (git diff fetch, 50KB truncate), `resources_discover` skill, `/review` cmd | 5-dimension review (code-quality, security, performance, testing, docs); auto-fix only on request, minimal critical-only edits |
| `extensions/baz-guardrails/` | **Guardrail librarian** | n/a | `baz_snippet` tool, `/snippet` cmd + arg completions | Loads 16 reusable `.md` snippets into context on demand |
| `extensions/baz-guard/` | **Safety guard** | n/a | `tool_call` hook on `bash` | Blocks destructive repo-wiping commands (`rm -rf <repo>`, `git reset --hard`, `git push --force`, `find -delete`, etc.) targeting home git repos; confirm UI; in headless mode blocks outright |
| `extensions/orchestrator/` | **Meta-orchestrator** | n/a (profile bundles) | `orchestrate` tool, `/orchestrate`, `/orchestrate-reload`; `manage.ts` + `catalog.ts` | Curates pi's *example* extensions into 9 conflict-free profiles; copies/removes real files; refuses singleton conflicts; queues `/reload` as follow-up |

`skills/pi-sync/SKILL.md` is a coordination skill, not a role persona (see §6).

---

## 5. Orchestration / coordination

- **Within a single instance:** mode switching is the main coordination. `baz.ts`/`brahim-os.ts` listen to `before_agent_start` and append the active mode block to the system prompt; `setMode` persists per-session to JSON (atomic tmp+rename).
- **Across extensions (the "swarm" supervisor):** `extensions/orchestrator/` is the meta-orchestrator.
  - `index.ts` registers the LLM-facing `orchestrate` tool (actions `enable|disable|status|list|reset`, by `profile` or `extension`) and the interactive `/orchestrate` menu.
  - It **copies** `examples/<key>` → `extensions/<key>` (pi auto-discovers after reload) and **queues `/orchestrate-reload` as a follow-up** so changes apply on *subsequent* turns, not mid-turn (`pi.sendUserMessage("/orchestrate-reload", { deliverAs: "followUp" })`).
  - `manage.ts` is the pure filesystem layer (enable/disable/reset/status, conflict detection). It refuses to disable anything not in its `.orchestrator-state.json`, protecting `baz/`, `orchestrator/`, `examples/`, and user-added files.
  - `catalog.ts` defines **9 profiles** (`safe, git, ui, focus, play, review, power, plan, context`) and **80+ catalog entries** grouped into singleton `group`s (footer, header, editor, tool-render, etc.) so only one per group is active.
- **Cross-instance (true "swarm"):** `skills/pi-sync/` keeps multiple `pi` instances (Kali + XFCE4, 4 workspaces) in sync. The `sync-pi` bash helper detects running `pi` PIDs (`/proc/<pid>/cwd`), maps them to sessions + XFCE desktops via `xdotool`/`xprop`, reports "stale?" (shared files changed since start), and broadcasts `/reload` (or any slash cmd) by typing into idle QTerminal windows. `status`, `sessions`, `reload`, `apply`, `notify`, `check` subcommands.

---

## 6. "Coding swarm" specific features (parallel agents / review loops / self-correction)

- **Multi-instance parallelism:** N `pi` instances on one host, one shared `~/.pi/agent/` dir, coordinated by `pi-sync` (`sync-pi reload` to fan out config/extension changes) and per-session context (`/resume`, `--session`, `/fork`, `/handoff`).
- **Peer-subordinate cross-bus ("build-bus"):** `baz.ts`/`brahim-os.ts` instruct the agent that *"cross-instance intel arrives via build-bus; treat it as peer-subordinate comms under the orchestrator"* and point at `~/.pi/build-bus/reports`. ⚠️ **No `build-bus` implementation exists in this repo** — it's declared but not wired (see §8).
- **Review loop:** `baz-review` + `baz-review` skill = a structured 5-dimension review with `Critical / Suggestion / Highlight` severities, `file:line` citations, and an **auto-fix loop** (minimal critical-only edits → re-show diff) gated behind explicit "fix it".
- **Self-correction / guardrails:** `baz-guardrails` snippets (`careful`, `tdd`, `security-checklist`, `testing-requirements`, `error-handling`, `performance-tips`, `style-guide`, …) are loadable mid-task and explicitly folded into the review workflow. `baz-guard` is a hard safety brake on destructive ops.
- **Sub-agent spawning:** only referenced indirectly — `orchestrator/catalog.ts` lists a `subagent` example (*"Delegate tasks to specialized subagents — Spawns pi subagents"*) but marks it `requiresSetup: true` and it is **not included** in this repo. No bespoke sub-agent spawner is implemented here.

---

## 7. Tech stack

- **Language:** TypeScript (ESM, `.ts` extensions on imports, `import.meta.url`), run by the `pi` runtime (which uses `jiti` resolution per the catalog's `with-deps` note).
- **Runtime/dependencies:** `node:fs`, `node:path`, `node:os`, `node:child_process` (spawnSync for git). External types: `@earendil-works/pi-coding-agent` (ExtensionAPI, `pi.on`, `pi.registerCommand`, `pi.registerTool`, `getAgentDir`), `@earendil-works/pi-ai` (`StringEnum`), `typebox` (`Type.Object`).
- **Config:** `settings.example.json` → `defaultProvider: "ollama-cloud"`, `defaultModel: "glm-5.2"`, `defaultThinkingLevel: "xhigh"`, `packages: ["git:github.com/fgrehm/pi-ollama-cloud"]`, theme dark.
- **State:** JSON files under `~/.pi/baz/modes/`, `~/.pi/brahim-os/modes/`, `~/.pi/brahim-os/config.json`, `~/.pi/agent/extensions/.orchestrator-state.json`.
- **Bash helper:** `skills/pi-sync/sync-pi` (pure bash; uses `pgrep`, `ps`, `xdotool`, `xprop`, `notify-send`, `python3` for JSON validation).
- **No build/test tooling** in the repo: no `package.json`, `tsconfig`, test runner, or CI. Everything depends on an external `pi` install + its separate `examples/` directory (the orchestrator's `examplesDir` is expected at `~/.pi/agent/extensions/examples/`, which is **not in this repo**).

---

## 8. Incomplete / hacky / upgrade candidates

1. **Brand/prompt drift (explicitly flagged in README).** `BAZ-Agent-System-Prompt.md` uses **Stitch Gold** (`#16130E`/`#E7C274`), while `baz.ts` `OPERATOR_IDENTITY` uses **Midnight Terminal** (`#020617`/`#22D3EE`, Inter/JetBrains Mono). Two divergent sources of truth. `baz.ts` also references an external `~/Desktop/BAZventures-Public-Site-Canonical.md §1` not in the repo. → Reconcile to one canonical brand; externalize palette to a single shared file.

2. **`build-bus` is vaporware here.** Referenced 4× as the cross-instance peer-subordinate comms path (`~/.pi/build-bus/reports`) but **no reader/writer tool exists**. The "swarm" coordination is only partially real (it's `pi-sync` for reloads + a declared-but-absent bus). → Either implement a `build-bus` reader extension or remove the claims.

3. **No package.json / tsconfig / build step.** Cannot typecheck or run standalone; relies entirely on the host `pi` runtime + a *separate* `examples/` tree that this repo does not ship. The orchestrator's `haveExamples` guard silently no-ops if examples aren't synced. → Add `package.json` + `tsconfig` + a `pi` dev dependency + a smoke test so the repo is self-contained and CI-able.

4. **Two copies of the master prompt.** `BAZ-Agent-System-Prompt.md` (canonical) and the inline `OPERATOR_IDENTITY` string in `baz.ts` (a hand-duplicated, slightly-different copy). Drift is guaranteed. → Have `baz.ts` *load and bake* the markdown from the canonical path (which the doc already claims it does: *"`baz.ts` reads/bakes it into the system prompt"*) — but currently the inline string is used, not the file. Fix the loader.

5. **PII inconsistency between the two operators.**
   - `brahim-os.ts` gates identity behind an exact-match provider check (`ollama-cloud` ≠ `ollama`, so cloud = withheld). Good.
   - `baz.ts` has **no such gate** — it always injects "Brahim ZERBOUT", locations, and the BAZ/Nova ecosystem into the system prompt regardless of provider. So the BAZ operator leaks PII to hosted models by default. → Add the same PII gate to `baz.ts`, or document why BAZ differs.

6. **`defaultModel: "glm-5.2"` on `ollama-cloud`.** With brahim-os's default `exposeIdentity: "auto"`, identity is *withheld* on this provider — but BAZ operator identity is still always sent. Also GLM-5.2 + xhigh thinking is an unusual combo worth validating.

7. **`baz-review` truncates diffs at 50 KB** and relies on the agent re-calling `baz_review_changes` for the rest. Large PRs get chunked reviews with no guarantee of cross-chunk consistency. → Consider streaming/segmented review or a merge step.

8. **Singleton-conflict model is string-group based in `catalog.ts`.** Only `examplesDir` keys are known; any user-added extension in a conflicting group is invisible to the conflict checker (it only inspects cataloged keys on disk). → Scan *all* active extensions, not just cataloged ones.

9. **`sync-pi` best-effort desktop mapping** (walks process tree, `xprop`/`xdotool`) returns `?` when it can't resolve — acceptable but fragile; also can only target idle prompts, never mid-turn. Documented as a caveat, but worth hardening (e.g., a real IPC socket instead of `xdotool` keystrokes).

10. **Atomic state writes are per-file only** (tmp+rename); no cross-session locking. Two simultaneous BAZ/brahim-os sessions writing the same `<session>.json` could race. Low risk (keyed by session) but worth noting for a true swarm.

11. **`subagent` (real sub-agent spawning) is listed but `requiresSetup: true` and absent** — the most "swarm-like" feature is the one not shipped. If the goal is an agentic coding swarm, implementing/including the `subagent` extension (or a custom BAZ sub-agent spawner with `build-bus` feedback) is the highest-leverage upgrade.

---

### Bottom line for your upgrade
The repo is a **well-structured but early, single-commit prompt+extension pack for the `pi` harness**, with a genuinely interesting multi-instance coordination story (`orchestrator` profiles + `pi-sync` + declared `build-bus`). The biggest concrete gaps are: (a) brand/prompt drift, (b) the missing `build-bus` implementation, (c) lack of self-contained build/typecheck tooling, (d) duplicate prompt sources, and (e) the absent sub-agent spawner. Prioritize those five and the "coding swarm" becomes real rather than partly conceptual.

No files were edited.

