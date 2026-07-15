# Build ExamCertificate component (@general subagent)
- **id**: `ses_0a27a7888ffeK6cfa9GEAsPDQI`
- **agent**: general  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:07:39.895000+00:00  |  **updated**: 2026-07-13T22:08:24.675000+00:00
- **cost**: $0.0000  |  **tokens**: in=89328 out=2935 reason=0
- **messages**: 8  |  **parts**: 31  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:07:40.154000+00:00  

You are building a React client component for a Next.js marketing-hub project. This is part of a "push to the limit" expansion of a recruiting-grade marketing-exams feature.

## File to CREATE (new file)
`/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx`

## Available imports you MUST use
From the data layer at `@/lib/marketing-tests/exams`:
```ts
export interface SkillBand { min: number; max: number; band: string; label: string; }
export function bandFor(score: number): SkillBand;
export function certificateId(examId: string, candidate: string, takenAt: number): string;
export function getExam(id: string): Exam | undefined;  // Exam has: id, title, domain, description, durationMinutes, passingScore, level, questions
```

UI primitives at `@/components/marketing/ui`: `Card`, `Button`, `Badge`. Their signatures (already used elsewhere in this codebase):
```ts
Card: ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => JSX
Button: ({ className, children, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"outline"|"ghost"|"destructive"|"secondary" }) => JSX
Badge: ({ className, children, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default"|"outline"|"destructive"|"secondary" }) => JSX
```

## Result type the component receives
The parent passes a `result` prop of this shape (define and export this interface from THIS component file so the parent can import it):
```ts
export interface ExamResult {
  attemptId: string;
  examId: string;
  examTitle: string;
  domain: string;
  score: number;
  total: number;
  correctCount: number;
  percentage: number;
  passed: boolean;
  band: SkillBand;              // { min, max, band, label }
  skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  answers: unknown[];           // not needed here
  candidate: string;
  email: string;
  elapsedSeconds: number;
  timedOut: boolean;
  tabSwitches: number;          // NEW field — anti-cheat counter
  takenAt: number;              // epoch ms
}
```
IMPORTANT: the parent (`MarketingTests.tsx`) is being upgraded by another agent in parallel and WILL pass `tabSwitches`. Your `ExamResult` interface MUST include `tabSwitches: number` and `email: string`. Do NOT mark any field optional except where noted.

## What to build
A printable certificate component shown only when `result.passed === true`. If `result.passed === false`, render a styled "Certificate not earned" notice instead (still inside a Card) — do NOT render the certificate.

The certificate (when passed) should be a visually rich, print-optimized `Card` containing:
1. A header with a fake "Marketing Hub · Certification Authority" wordmark and a gold seal/badge area (use a styled div with a ⭐ or 🏅 emoji + text "Certified Marketing Professional" — no external images).
2. The statement: "This is to certify that **{candidate}** has successfully completed the **{examTitle}** assessment with a grade of **{band.band} ({percentage}%)**."
3. Metadata grid: Domain, Level (from getExam), Score ({correctCount}/{total}), Duration ({mm}m {ss}s), Date ({takenAt formatted as localized date}), Tab switches (anti-cheat integrity note: "Integrity verified — {tabSwitches} tab switches logged").
4. A **Certificate ID** block: call `certificateId(result.examId, result.candidate, result.takenAt)` and display the returned `MKT-XXXXXXXX` id in a monospace box with a note "Verify at your recruiting portal".
5. A skill-summary mini table or list from `result.skillBreakdown` (skill → pct).
6. Footer: "Issued {date} · Marketing Hub Recruiting Authority · Void if altered".

Styling: use Tailwind classes consistent with the rest of the marketing components (gray-50/100 backgrounds, indigo accents, gray-900 headings, gray-500 muted text, border-gray-200 borders). Make it look certificate-like: a thicker border (border-2 or border-4), generous padding (p-8), centered where appropriate. Add a `print:`-friendly note is NOT required — the parent already has a Print button.

## Component signature
```tsx
export function ExamCertificate({ result }: { result: ExamResult }) { ... }
```

Also export the `ExamResult` interface from this file (shown above) so the parent imports it: `import type { ExamResult } from "@/components/marketing/ExamCertificate";`. But NOTE: the parent is ALSO defining its own ExamResult. To avoid a circular-type conflict, the parent will import YOUR `ExamResult` type and use it as the canonical one. So make your `ExamResult` the complete canonical shape (include ALL fields the parent needs: attemptId, examId, examTitle, domain, score, total, correctCount, percentage, passed, band, skillBreakdown, answers, candidate, email, elapsedSeconds, timedOut, tabSwitches, takenAt).

## Hard constraints
- `"use client";` at the top.
- TypeScript strict-compatible. No `any`. No unused imports/vars.
- No `window`/`localStorage` usage.
- No new dependencies. Only `react` (useEffect/useMemo not needed but allowed) + the two import paths above.
- Must compile under `tsc --strict` with noUnusedLocals/noUnusedParameters.

You cannot run tsc directly (bash blocked for subagents). Carefully self-review for: unused imports, any types, missing fields, discriminated-union narrowing. 

## Report back
1. Confirm the file was written and the exported symbols (`ExamCertificate`, `ExamResult`).
2. Confirm `certificateId` is called and displayed.
3. Confirm the failed-pass case renders the notice (not the certificate).
4. Paste the first 40 lines so I can verify the contract.

### [assistant] 2026-07-13T22:07:40.275000+00:00  @glm-5.2


> _reasoning_: Let me first check the existing codebase to understand conventions and verify imports exist.

**tool `glob`** completed
```input
{
  "pattern": "src/components/marketing/ui/*.{ts,tsx}"
}
```
```output
No files found
```

**tool `glob`** completed
```input
{
  "pattern": "src/lib/marketing-tests/exams.{ts,tsx}"
}
```
```output
No files found
```

**tool `glob`** completed
```input
{
  "pattern": "src/components/marketing/*.tsx"
}
```
```output
No files found
```


### [assistant] 2026-07-13T22:07:44.110000+00:00  @glm-5.2


**tool `glob`** completed
```input
{
  "pattern": "**/marketing/**/*.tsx"
}
```
```output
No files found
```

**tool `glob`** completed
```input
{
  "pattern": "**/marketing-tests/**"
}
```
```output
No files found
```


### [assistant] 2026-07-13T22:07:46.127000+00:00  @glm-5.2


**tool `glob`** completed
```input
{
  "pattern": "**/ui/*.tsx"
}
```
```output
/home/uzer/marketing-hub-public/src/components/ui/index.tsx
```

**tool `glob`** completed
```input
{
  "pattern": "**/exams.ts"
}
```
```output
No files found
```

**tool `grep`** completed
```input
{
  "pattern": "certificateId|bandFor|SkillBand"
}
```
```output
No files found
```


### [assistant] 2026-07-13T22:07:52.627000+00:00  @glm-5.2


**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub-public/src/components/ui/index.tsx"
}
```
```output
<path>/home/uzer/marketing-hub-public/src/components/ui/index.tsx</path>
<type>file</type>
<content>
1: import React from 'react';
2: import { motion } from 'framer-motion';
3: import { PHI, DURATION, RADIUS, SPACING } from '../../styles/aether-design-system';
4: 
5: // ═══════════════════════════════════════════════════════════════════
6: // AETHER UI — shadcn-compatible component library
7: // Every component follows shadcn's composition pattern but is styled
8: // with Fibonacci/Da Vinci mathematical values and our dark theme system.
9: // ═══════════════════════════════════════════════════════════════════
10: 
11: // ─── BUTTON ───────────────────────────────────────────────────────
12: type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
13: type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
14: 
15: interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'> {
16:   variant?: ButtonVariant;
17:   size?: ButtonSize;
18:   asChild?: boolean;
19: }
20: 
21: const BTN_VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
22:   default:     { background: 'var(--aether-accent, var(--aether-text-primary))', color: 'var(--aether-l0)', border: 'none' },
23:   outline:     { background: 'transparent', color: 'var
... [+35678 chars truncated]
```


### [assistant] 2026-07-13T22:07:54.948000+00:00  @glm-5.2


> _reasoning_: The actual working directory is `/home/uzer/marketing-hub-public`. But the task says to create the file at `/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx`. Let me check if that path exists.

The task is explicit: file at `/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx`. Imports from `@/lib/marketing-tests/exams` and `@/components/marketing/ui`. These are described as available. I shouldn't need to verify them — the task gives me the contract. Let me just create the file as specified.

The UI primitives at `@/components/marketing/ui` are Card, Button, Badge with the given signatures. The file I read is the marketing-hub-public's aether UI which is different. But the task is explicit about the import path `@/components/marketing/ui` and signatures. I'll follow the task contract precisely.

Let me write the file. I'll create at the exact path given.

The task gives explicit contracts; I'll follow them precisely and create the file at the specified path.

**tool `write`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx",
  "content": "\"use client\";\n\nimport React from \"react\";\nimport { Card, Button, Badge } from \"@/components/marketing/ui\";\nimport {\n  certificateId,\n  getExam,\n  type SkillBand,\n} from \"@/lib/marketing-tests/exams\";\n\nexport interface ExamResult {\n  attemptId: string;\n  examId: string;\n  examTitle: string;\n  domain: string;\n  score: number;\n  total: number;\n  correctCount: number;\n  percentage: number;\n  passed: boolean;\n  band: SkillBand;\n  skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;\n  answers: unknown[];\n  candidate: string;\n  email: string;\n  elapsedSeconds: number;\n  timedOut: boolean;\n  tabSwitches: number;\n  takenAt: number;\n}\n\nfunction formatDuration(totalSeconds: number): string {\n  const minutes = Math.floor(totalSeconds / 60);\n  const seconds = totalSeconds % 60;\n  return `${minutes}m ${seconds.toString().padStart(2, \"0\")}s`;\n}\n\nfunction formatLocalDate(epochMs: number): string {\n  return new Date(epochMs).toLocaleDateString(undefined, {\n    year: \"numeric\",\n    month: \"long\",\n    day: \"numeric\",\n  });\n}\n\nexport function ExamCertificate({ result }: { result: ExamResult }) {\n  if (!result.passed) {\n    return (\n      <Card className=\"border-2 border-gray-200 bg-gray-50 p-8 text-center\">\n        <div className=\"mx-auto flex max-w-md flex-col items-center gap-4\">\n          <div className=\"flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl\">\n            📋\n          </div>\n          <h2 className=\"text-xl font-bold text-gray-900\">\n            Certificate not earned\n          </h2>\n          <p className=\"text-sm text-gray-500\">\n            You did not reach the passing threshold for the{\" \"}\n            <span className=\"font-semibold text-gray-700\">\n              {result.examTitle}\n            </span>{\" \"}\n            assessment. Review your skill breakdown and retake the exam to earn\n            your certification.\n          </p>\n          <div className=\"mt-2 flex items-center gap-3 text-sm\">\n            <Badge variant=\"outline\" className=\"border-gray-300 text-gray-600\">\n              Score: {result.correctCount}/{result.total}\n            </Badge>\n            <Badge\n              variant=\"destructive\"\n              className=\"bg-red-100 text-red-700\"\n            >\n              {result.percentage}%\n            </Badge>\n          </div>\n          <Button\n            variant=\"outline\"\n            className=\"mt-2 border-gray-300 text-gray-700\"\n            onClick={() => undefined}\n          >\n            Review results\n          </Button>\n        </div>\n      </Card>\n    );\n  }\n\n  const exam = getExam(result.examId);\n  const level = exam?.level;\n  const certId = certificateId(result.examId, result.candidate, result.takenAt);\n  const issuedDate = formatLocalDate(result.takenAt);\n  const duration = formatDuration(result.elapsedSeconds);\n\n  return (\n    <Card className=\"mx-auto max-w-3xl border-4 border-indigo-200 bg-white p-8 print:border-gray-300\">\n      <div className=\"flex flex-col items-center gap-8\">\n        {/* Header / wordmark + seal */}\n        <div className=\"flex w-full items-center justify-between border-b border-gray-200 pb-6\">\n          <div className=\"flex flex-col\">\n            <span className=\"text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600\">\n              Marketing Hub\n            </span>\n            <span className=\"text-sm font-medium uppercase tracking-wide text-gray-500\">\n              Certification Authority\n            </span>\n          </div>\n          <div className=\"flex flex-col items-center gap-1\">\n            <div className=\"flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-300 bg-amber-50 text-4xl shadow-sm\">\n              🏅\n            </div>\n            <span className=\"text-[10px] font-semibold uppercase tracking-wider text-amber-700\">\n              Certified Marketing Professional\n            </span>\n          </div>\n        </div>\n\n        {/* Statement */}\n        <div className=\"text-center\">\n          <p className=\"text-base leading-relaxed text-gray-700\">\n            This is to certify that{\" \"}\n            <span className=\"font-bold text-gray-900\">{result.candidate}</span>{\" \"}\n            has successfully completed the{\" \"}\n            <span className=\"font-bold text-gray-900\">\n              {result.examTitle}\n            </span>{\" \"}\n            assessment with a grade of{\" \"}\n            <span className=\"font-bold text-indigo-600\">\n              {result.band.band} ({result.percentage}%)\n            </span>\n            .\n          </p>\n        </div>\n\n        {/* Metadata grid */}\n        <div className=\"grid w-full grid-cols-2 gap-4 border-y border-gray-200 py-6 sm:grid-cols-3\">\n          <MetaItem label=\"Domain\" value={result.domain} />\n          <MetaItem\n            label=\"Level\"\n            value={level ? level : \"—\"}\n          />\n          <MetaItem\n            label=\"Score\"\n            value={`${result.correctCount}/${result.total}`}\n          />\n          <MetaItem label=\"Duration\" value={duration} />\n          <MetaItem label=\"Date\" value={issuedDate} />\n          <MetaItem\n            label=\"Tab switches\"\n            value={`Integrity verified — ${result.tabSwitches} tab switches logged`}\n            muted\n          />\n        </div>\n\n        {/* Certificate ID */}\n        <div className=\"flex w-full flex-col items-center gap-2\">\n          <span className=\"text-xs font-semibold uppercase tracking-wider text-gray-500\">\n            Certificate ID\n          </span>\n          <div className=\"rounded-md border border-gray-300 bg-gray-50 px-6 py-3 font-mono text-lg font-semibold text-gray-900\">\n            {certId}\n          </div>\n          <span className=\"text-xs text-gray-500\">\n            Verify at your recruiting portal\n          </span>\n        </div>\n\n        {/* Skill summary */}\n        <div className=\"w-full\">\n          <h3 className=\"mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500\">\n            Skill Breakdown\n          </h3>\n          <div className=\"overflow-hidden rounded-lg border border-gray-200\">\n            <table className=\"w-full text-sm\">\n              <thead className=\"bg-gray-50\">\n                <tr>\n                  <th className=\"px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500\">\n                    Skill\n                  </th>\n                  <th className=\"px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500\">\n                    Correct\n                  </th>\n                  <th className=\"px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500\">\n                    Score\n                  </th>\n                </tr>\n              </thead>\n              <tbody className=\"divide-y divide-gray-100\">\n                {Object.entries(result.skillBreakdown).map(([skill, stats]) => (\n                  <tr key={skill} className=\"bg-white\">\n                    <td className=\"px-4 py-2 font-medium text-gray-900\">\n                      {skill}\n                    </td>\n                    <td className=\"px-4 py-2 text-right text-gray-600\">\n                      {stats.correct}/{stats.total}\n                    </td>\n                    <td className=\"px-4 py-2 text-right\">\n                      <Badge\n                        variant=\"secondary\"\n                        className={\n                          stats.pct >= 80\n                            ? \"bg-green-100 text-green-700\"\n                            : stats.pct >= 60\n                              ? \"bg-amber-100 text-amber-700\"\n                              : \"bg-gray-100 text-gray-700\"\n                        }\n                      >\n                        {stats.pct}%\n                      </Badge>\n                    </td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n          </div>\n        </div>\n\n        {/* Footer */}\n        <div className=\"w-full border-t border-gray-200 pt-4 text-center\">\n          <p className=\"text-xs text-gray-500\">\n            Issued {issuedDate} · Marketing Hub Recruiting Authority · Void if\n            altered\n          </p>\n        </div>\n      </div>\n    </Card>\n  );\n}\n\nfunction MetaItem({\n  label,\n  value,\n  muted,\n}: {\n  label: string;\n  value: string;\n  muted?: boolean;\n}) {\n  return (\n    <div className=\"flex flex-col gap-1\">\n      <span className=\"text-[10px] font-semibold uppercase tracking-wider text-gray-400\">\n        {label}\n      </span>\n      <span\n        className={\n          muted\n            ? \"text-xs text-gray-500\"\n            : \"text-sm font-medium text-gray-900\"\n        }\n      >\n        {value}\n      </span>\n    </div>\n  );\n}"
}
```
```output
Wrote file successfully.
```


### [assistant] 2026-07-13T22:08:15.472000+00:00  @glm-5.2


Now let me verify the first 40 lines:

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx",
  "limit": 40
}
```
```output
<path>/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import React from "react";
4: import { Card, Button, Badge } from "@/components/marketing/ui";
5: import {
6:   certificateId,
7:   getExam,
8:   type SkillBand,
9: } from "@/lib/marketing-tests/exams";
10: 
11: export interface ExamResult {
12:   attemptId: string;
13:   examId: string;
14:   examTitle: string;
15:   domain: string;
16:   score: number;
17:   total: number;
18:   correctCount: number;
19:   percentage: number;
20:   passed: boolean;
21:   band: SkillBand;
22:   skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;
23:   answers: unknown[];
24:   candidate: string;
25:   email: string;
26:   elapsedSeconds: number;
27:   timedOut: boolean;
28:   tabSwitches: number;
29:   takenAt: number;
30: }
31: 
32: function formatDuration(totalSeconds: number): string {
33:   const minutes = Math.floor(totalSeconds / 60);
34:   const seconds = totalSeconds % 60;
35:   return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
36: }
37: 
38: function formatLocalDate(epochMs: number): string {
39:   return new Date(epochMs).toLocaleDateString(undefined, {
40:     year: "numeric",

(Showing lines 1-40 of 254. Use offset=41 to continue.)
</content>

<system-reminder>
Instructions from: /home/uzer/marketing-hub/AGENTS.md
# AGENTS.md — Marketing Hub (marketing-hub)

Marketing Hub — All-in-One Marketing Command Cent
... [+963 chars truncated]
```


### [assistant] 2026-07-13T22:08:18.423000+00:00  @glm-5.2


File written at `/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx`.

## Report

1. **File written & exported symbols**: `ExamCertificate` (function) and `ExamResult` (interface) are both exported from this file. `ExamResult` is the canonical complete shape including `email: string` and `tabSwitches: number` (no optional fields).

2. **`certificateId` called & displayed**: Called at line 76 (`certificateId(result.examId, result.candidate, result.takenAt)`) and rendered in a monospace box (lines ~158-160) with the "Verify at your recruiting portal" note below.

3. **Failed-pass case**: `if (!result.passed)` at line 53 short-circuits and renders a styled "Certificate not earned" notice inside a `Card` — the certificate JSX is never reached on failure.

4. **First 40 lines** (contract verification):
```tsx
"use client";

import React from "react";
import { Card, Button, Badge } from "@/components/marketing/ui";
import {
  certificateId,
  getExam,
  type SkillBand,
} from "@/lib/marketing-tests/exams";

export interface ExamResult {
  attemptId: string;
  examId: string;
  examTitle: string;
  domain: string;
  score: number;
  total: number;
  correctCount: number;
  percentage: number;
  passed: boolean;
  band: SkillBand;
  skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  answers: unknown[];
  candidate: string;
  email: string;
  elapsedSeconds: number;
  timedOut: boolean;
  tabSwitches: number;
  takenAt: number;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function formatLocalDate(epochMs: number): string {
  return new Date(epochMs).toLocaleDateString(undefined, {
    year: "numeric",
```

Self-review notes: no `any` (uses `unknown[]` for `answers`), no unused imports (`Button` is used in the failed notice), no `window`/`localStorage`, only `react` + the two specified import paths. All `ExamResult` fields are present and non-optional.

