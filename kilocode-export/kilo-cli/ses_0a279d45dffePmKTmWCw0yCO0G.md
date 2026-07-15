# Upgrade MarketingTests component (@general subagent)
- **id**: `ses_0a279d45dffePmKTmWCw0yCO0G`
- **agent**: general  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:08:21.922000+00:00  |  **updated**: 2026-07-13T22:11:21.856000+00:00
- **cost**: $0.0000  |  **tokens**: in=164658 out=20854 reason=0
- **messages**: 6  |  **parts**: 24  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:08:22.119000+00:00  

You are UPGRADING an existing React client component in a Next.js marketing-hub project. This is the central integration piece of a "push to the limit" expansion of a recruiting-grade marketing-exams feature.

## File to OVERWRITE (existing file — read it first, then rewrite)
`/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx`

READ the current file first so you understand the existing structure (phases, timer, history, refs for stale-closure fix). You must PRESERVE the working behaviors: candidate identity capture, countdown timer with auto-submit, localStorage history persistence, the stale-closure ref pattern (answersRef/shuffledRef/candidateRef/startTimeRef/historyRef/activeExamRef), and the print button.

## The new data contract (from `@/lib/marketing-tests/exams` — already written by another agent)
```ts
export type QuestionType = "mcq" | "truefalse" | "multiselect" | "numeric";
export type Difficulty = 1 | 2 | 3;
export interface MCQQuestion { id; type:"mcq"; prompt; options:string[]; correct:number; explanation; skill; difficulty }
export interface TrueFalseQuestion { id; type:"truefalse"; prompt; options:string[]; correct:number; explanation; skill; difficulty }
export interface MultiSelectQuestion { id; type:"multiselect"; prompt; options:string[]; correct:number[]; explanation; skill; difficulty }
export interface NumericQuestion { id; type:"numeric"; prompt; options:[]; correct:number; tolerance:number; unit?:string; explanation; skill; difficulty }
export type Question = MCQQuestion | TrueFalseQuestion | MultiSelectQuestion | NumericQuestion;
export interface Exam { id; title; domain; description; durationMinutes; passingScore; level:"associate"|"professional"|"expert"; questions: Question[] }
export interface SkillBand { min; max; band; label }
export const SKILL_BANDS; export function bandFor(score:number):SkillBand;
export const EXAMS: Exam[]; export function getExam(id:string): Exam|undefined;
export const DIFFICULTY_WEIGHT: Record<Difficulty, number>;  // {1:1, 2:1.5, 3:2}
export function examMaxWeight(exam: Exam): number;
export function isMultiSelect(q: Question): q is MultiSelectQuestion;
export function isNumeric(q: Question): q is NumericQuestion;
export interface AttemptSummary { ... }  // for export
export const ATTEMPT_CSV_HEADER: string;
export function attemptToCsvRow(r: AttemptSummary): string;
export function certificateId(examId: string, candidate: string, takenAt: number): string;
```

## Sibling components being built in parallel (import them)
```ts
import { ExamCertificate } from "@/components/marketing/ExamCertificate";
import type { ExamResult } from "@/components/marketing/ExamCertificate";   // CANONICAL ExamResult type — USE THIS, do not redefine
import { RecruiterCompare } from "@/components/marketing/RecruiterCompare";
```
`ExamResult` (canonical, imported from ExamCertificate) has shape:
```ts
interface ExamResult {
  attemptId: string; examId: string; examTitle: string; domain: string;
  score: number; total: number; correctCount: number; percentage: number;
  passed: boolean; band: SkillBand; skillBreakdown: Record<string,{correct,total,pct}>;
  answers: AnswerRecord[]; candidate: string; email: string; elapsedSeconds: number;
  timedOut: boolean; tabSwitches: number; takenAt: number;
}
```
Note the NEW field `tabSwitches: number` vs the old version. Your `AnswerRecord` interface you define locally; `answers: AnswerRecord[]`.

## UI primitives (same as current file)
`@/components/marketing/ui`: `Card`, `Button`, `Badge`, `Input`.

## What to upgrade (the "limit" features)

### 1. New question types in the runner
The runner must handle all 4 question types via the discriminated union:
- **mcq / truefalse**: render option buttons as today (single select).
- **multiselect**: render checkboxes (toggle each option). Store answer as `Record<questionId, number[]>` — BUT the existing `answers` state is `Record<string, number>`. CHANGE the answers state to a union store: `Record<string, number | number[]>` where mcq/truefalse/numeric store a `number` and multiselect stores `number[]`. Update `selectAnswer` accordingly and add `toggleMultiAnswer(questionId, optionIdx)`.
- **numeric**: render an `Input type="number"`. Store the numeric value (number). Show the `unit` suffix if present.

### 2. Adaptive weighted scoring in computeResult
Replace simple correct-count scoring with difficulty-weighted scoring:
- For each question, compute `earnedWeight`: if correct → `DIFFICULTY_WEIGHT[q.difficulty]`, else 0. For multiselect, award PARTIAL credit: `partialFraction = (correctlySelected ∩ correct.length) ... ` — specifically: count true positives (selected ∩ correct) minus false positives (selected ∉ correct), clamped to [0,1], times the weight. If the clamp gives <0, award 0. If all correct and no extras, full weight.
- `weightedPercentage = round(earnedWeightSum / examMaxWeight(exam) * 100)`.
- Keep `percentage` (raw correct/total) too, but use `weightedPercentage` for pass/fail against `exam.passingScore` AND for `bandFor(...)`.
- Record per-question `earnedWeight` in AnswerRecord.

### 3. Anti-cheat: tab-switch detection
- Add state `tabSwitches` (number) and a `tabSwitchesRef` (mirror via useEffect like the other refs).
- In a `useEffect` active only during `phase === "running"`, listen to `document` `visibilitychange` (and window `blur` as backup). When the document becomes hidden (`document.hidden` true) or window blurs, increment `tabSwitches` and `tabSwitchesRef.current`.
- Show a live counter in the running header: "Tab switches: {n}" with a warning style (amber/red) when >0. Show a warning banner above the question when tabSwitches >= 3: "Repeated tab switching detected — this is recorded on your report."
- Include `tabSwitches` in the computed ExamResult (read from `tabSwitchesRef.current` so the timer's stale-closure auto-submit gets the latest count).
- Disable inputs on timeout as before.

### 4. Printable certificate on results
- On the results view, if `result.passed`, render `<ExamCertificate result={result} />` ABOVE the existing recruiting report card.
- If failed, ExamCertificate handles its own "not earned" notice (still render it — it self-gates).

### 5. Recruiter compare view
- Add a new phase `"compare"`. Add a "Recruiter Compare" button on the picker (next to/replacing the existing "View all" history button). When clicked, set phase to "compare" and render `<RecruiterCompare history={history} onBack={() => setPhase("picker")} onViewAttempt={(a) => { setViewingHistory(a); setPhase("results"); }} />`.
- Keep the existing history view too (phase "history"). The picker can have two buttons: "History" (→ phase history) and "Recruiter Compare" (→ phase compare).

### 6. Keep everything that works
- Candidate identity (name required, email optional), localStorage candidate persistence.
- Countdown timer with auto-submit on expiry, dual progress bars, red under 60s, timeout flag on report.
- localStorage history persistence (last 100), recent-attempts strip on picker, full history table view.
- The stale-closure ref pattern (answersRef, shuffledRef, candidateRef, startTimeRef, historyRef, activeExamRef) — ADD tabSwitchesRef to it.
- Print button.
- Answer review with explanations on results.

## AnswerRecord (define locally, used in ExamResult.answers)
```ts
interface AnswerRecord {
  questionId: string;
  type: QuestionType;
  selected: number | number[];   // number for mcq/truefalse/numeric, number[] for multiselect
  correct: number | number[];
  skill: string;
  difficulty: Difficulty;
  isCorrect: boolean;            // for partial credit, isCorrect = earnedFraction >= 1
  earnedWeight: number;          // weighted points earned
  maxWeight: number;             // DIFFICULTY_WEIGHT[difficulty]
}
```
For the answer review rendering, handle multiselect (show checkboxes state, mark correct set) and numeric (show entered value vs correct±tolerance).

## Hard constraints
- `"use client";` at top.
- TypeScript strict-compatible. No `any`. No unused imports/vars/params.
- Only `react` + the three import paths (`@/lib/marketing-tests/exams`, `@/components/marketing/ui`, `@/components/marketing/ExamCertificate`, `@/components/marketing/RecruiterCompare`). No new deps.
- Must compile under `tsc --strict` with noUnusedLocals/noUnusedParameters.
- `window`/`document` usage allowed (client component — needed for visibilitychange, blur, localStorage, print).
- Preserve the stale-closure ref pattern so timer auto-submit reads latest state.
- For the discriminated union, narrow with `q.type === "multiselect"` / `q.type === "numeric"` / `isMultiSelect(q)` / `isNumeric(q)` so TS knows the field shapes. CRITICAL: when iterating `q.options` for a numeric question, `options` is `[]` so the options.map renders nothing — that's why you branch on type BEFORE mapping options.

You cannot run tsc directly (bash blocked for subagents). Self-review EXTREMELY carefully for:
- Discriminated-union narrowing (the #1 source of errors). Use `if (q.type === "numeric") {...} else if (q.type === "multiselect") {...} else {...}` branches in both the runner and the answer review.
- The answers state type `Record<string, number | number[]>` and that computeResult reads `ans[q.id]` then narrows by `q.type`.
- Partial-credit multiselect math.
- All refs mirrored.
- `tabSwitches` included in the returned ExamResult.
- ExamResult matches the canonical shape from ExamCertificate (do NOT redefine ExamResult — import the type).
- No unused imports (e.g. if you import `isMultiSelect`/`isNumeric`/`examMaxWeight`/`DIFFICULTY_WEIGHT`/`certificateId` — make sure each is used; `certificateId` is used inside ExamCertificate, NOT here, so do NOT import it here unless you use it).

## Report back
1. Confirm file overwritten + all 6 upgrade features present.
2. Confirm the answers state type and how multiselect/numeric are stored.
3. Confirm weighted scoring math (paste the partial-credit multiselect block).
4. Confirm anti-cheat effect (visibilitychange + blur) and that tabSwitchesRef feeds the result.
5. Confirm ExamCertificate renders on passed results and RecruiterCompare is wired.
6. Paste the computeResult function body so I can verify the scoring.

### [assistant] 2026-07-13T22:08:22.696000+00:00  @glm-5.2


> _reasoning_: Let me start by reading the current file and understanding the structure, then check the sibling imports.

I'll read the existing file and the sibling components/data contract to understand the structure before rewriting.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx"
}
```
```output
<path>/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import { useEffect, useMemo, useRef, useState } from "react";
4: import { Card, Button, Badge, Input } from "@/components/marketing/ui";
5: import {
6:   EXAMS,
7:   getExam,
8:   bandFor,
9:   type Exam,
10:   type Question,
11: } from "@/lib/marketing-tests/exams";
12: 
13: type Phase = "picker" | "running" | "results" | "history";
14: 
15: interface AnswerRecord {
16:   questionId: string;
17:   selected: number;
18:   correct: number;
19:   skill: string;
20:   difficulty: number;
21:   isCorrect: boolean;
22: }
23: 
24: interface Candidate {
25:   name: string;
26:   email: string;
27: }
28: 
29: interface ExamResult {
30:   attemptId: string;
31:   examId: string;
32:   examTitle: string;
33:   domain: string;
34:   score: number;
35:   total: number;
36:   correctCount: number;
37:   percentage: number;
38:   passed: boolean;
39:   band: ReturnType<typeof bandFor>;
40:   skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;
41:   answers: AnswerRecord[];
42:   candidate: string;
43:   email: string;
44:   elapsedSeconds: number;
45:   timedOut: boolean;
46:   takenAt: number;
47: }
48: 
49: const HISTORY_KEY = "marketing-hub:exam-history";
50: const CANDIDATE_KEY = "marketing-hub:exam-candidate";
51: 
52: function loadHistory(): ExamResult[] {
53:   if (typeof window === "undefined") return [];
54:   try {
55: 
... [+34741 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts"
}
```
```output
<path>/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts</path>
<type>file</type>
<content>
1: // Marketing exams data + scoring helpers.
2: // Pure TypeScript — no React/next imports, no DOM access.
3: // Compiles under `tsc --strict` with noUnusedLocals / noUnusedParameters.
4: 
5: export type QuestionType = "mcq" | "truefalse" | "multiselect" | "numeric";
6: export type Difficulty = 1 | 2 | 3;
7: 
8: export interface MCQQuestion {
9:   id: string;
10:   type: "mcq";
11:   prompt: string;
12:   options: string[];
13:   correct: number;
14:   explanation: string;
15:   skill: string;
16:   difficulty: Difficulty;
17: }
18: 
19: export interface TrueFalseQuestion {
20:   id: string;
21:   type: "truefalse";
22:   prompt: string;
23:   options: string[];
24:   correct: number;
25:   explanation: string;
26:   skill: string;
27:   difficulty: Difficulty;
28: }
29: 
30: export interface MultiSelectQuestion {
31:   id: string;
32:   type: "multiselect";
33:   prompt: string;
34:   options: string[];
35:   correct: number[];
36:   explanation: string;
37:   skill: string;
38:   difficulty: Difficulty;
39: }
40: 
41: export interface NumericQuestion {
42:   id: string;
43:   type: "numeric";
44:   prompt: string;
45:   options: [];
46:   correct: number;
47:   tolerance: number;
48:   unit?: string;
49:   explanation: string;
50:   skill: string;
51:   difficulty: Difficulty;
52: }
53: 
54: export type Question =
55:   | MCQQuestion
56:   | TrueFalseQuestion
57:   | MultiSel
... [+56725 chars truncated]
```


### [assistant] 2026-07-13T22:08:25.681000+00:00  @glm-5.2


I have the data contract. Now let me check the sibling components and UI primitives to ensure imports line up.

**tool `glob`** completed
```input
{
  "pattern": "/home/uzer/marketing-hub/src/components/marketing/*.tsx"
}
```
```output
/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx
/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx
/home/uzer/marketing-hub/src/components/marketing/MarketingDashboard.tsx
/home/uzer/marketing-hub/src/components/marketing/CampaignManager.tsx
/home/uzer/marketing-hub/src/components/marketing/SkillsPanel.tsx
/home/uzer/marketing-hub/src/components/marketing/ui.tsx
/home/uzer/marketing-hub/src/components/marketing/AuditDashboard.tsx
/home/uzer/marketing-hub/src/components/marketing/PersonaBuilder.tsx
```


### [assistant] 2026-07-13T22:08:28.135000+00:00  @glm-5.2


RecruiterCompare isn't built yet (being built in parallel). Let me read ExamCertificate and ui.tsx to verify the ExamResult shape and the UI primitives' props.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx"
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
41:     month: "long",
42:     day: "numeric",
43:   });
44: }
45: 
46: export function ExamCertificate({ result }: { result: ExamResult }) {
47:   if (!result.passed) {
48:     return (
49:       <Card className="border-2 border-gray-
... [+8540 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ui.tsx"
}
```
```output
<path>/home/uzer/marketing-hub/src/components/marketing/ui.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import React from "react";
4: 
5: export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
6:   return (
7:     <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
8:       {children}
9:     </div>
10:   );
11: }
12: 
13: export function Button({ className = "", children, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" }) {
14:   const variants: Record<string, string> = {
15:     default: "bg-indigo-600 text-white hover:bg-indigo-700",
16:     outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
17:     ghost: "hover:bg-gray-100",
18:     destructive: "bg-red-600 text-white hover:bg-red-700",
19:     secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
20:   };
21:   return (
22:     <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${variants[variant] || variants.default} ${className}`} {...props}>
23:       {children}
24:     </button>
25:   );
26: }
27: 
28: export function Input({ className = "", invalid, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
29:   return (
30:     <input
31:  
... [+5284 chars truncated]
```


### [assistant] 2026-07-13T22:08:30.559000+00:00  @glm-5.2


> _reasoning_: Now I have all the pieces. The ExamCertificate exports `ExamResult` with `answers: unknown[]` and `tabSwitches: number`. My local `AnswerRecord[]` needs to be assignable to `unknown[]` — that's fine since `AnswerRecord[]` is assignable to `unknown[]`.

Let me check RecruiterCompare doesn't exist yet. It's being built in parallel — I should import it as specified. Let me verify it doesn't exist.

The glob only listed the existing files — RecruiterCompare.tsx wasn't there. I'll import it as specified anyway since it's being built in parallel.

Now let me write the new file. Let me carefully design everything.

Key types:
- `Phase = "picker" | "running" | "results" | "history" | "compare"`
- `answers: Record<string, number | number[]>`
- `AnswerRecord` local interface with `selected: number | number[]`, `correct: number | number[]`, `type: QuestionType`, `difficulty: Difficulty`, `isCorrect`, `earnedWeight`, `maxWeight`
- Import `ExamResult` from ExamCertificate (don't redefine). My local `AnswerRecord[]` assigned to `unknown[]` — fine.

Imports from exams: `EXAMS, getExam, bandFor, DIFFICULTY_WEIGHT, examMaxWeight, isMultiSelect, isNumeric, type Exam, type Question, type QuestionType, type Difficulty, type SkillBand`. I should NOT import `certificateId` (used in ExamCertificate only). Let me check which I use:
- `EXAMS` ✓ (picker)
- `getExam` ✓ (results)
- `bandFor` ✓ (computeResult)
- `DIFFICULTY_WEIGHT` ✓ (scoring)
- `examMaxWeight` ✓ (scoring)
- `isMultiSelect` ✓ (narrowing in review/render)
- `isNumeric` ✓ (narrowing)
- `Exam`, `Question` ✓
- `QuestionType` ✓ (AnswerRecord.type)
- `Difficulty` ✓ (AnswerRecord.difficulty)
- `SkillBand` — do I use it? ExamResult.band is SkillBand. I might not need to import it directly since it comes via ExamResult. Let me avoid importing it if unused. Actually I don't reference SkillBand by name in my code, so don't import it.

Wait, ExamResult is imported from ExamCertificate which has `band: SkillBand`. I don't need SkillBand locally. Good.

From ExamCertificate: `ExamCertificate` component + `type ExamResult`.
From RecruiterCompare: `RecruiterCompare` component.

Now let me design the runner render for the current question `q`. Need to branch on type:
- numeric: render Input type=number with unit suffix
- multiselect: render checkboxes (toggle)
- mcq/truefalse: render option buttons (single select)

For `selected` from answers: `answers[q.id]`. For mcq/truefalse/numeric it's `number | undefined`; for multiselect it's `number[] | undefined`.

Let me write a helper to read the selected. Actually I'll branch in render.

For the runner, after getting `q`:
```ts
const rawSelected = answers[q.id];
```

For numeric input — store as number. When user types, parse. If empty, remove from answers. Let me store the numeric value. `selectAnswer` for numeric: `setNumericAnswer(q.id, valueStr)`.

Let me design handlers:
- `selectAnswer(questionId, optionIdx)` — for mcq/truefalse: `setAnswers(prev => ({...prev, [questionId]: optionIdx}))`
- `toggleMultiAnswer(questionId, optionIdx)` — for multiselect: toggle option in number[]
- `setNumericAnswer(questionId, value)` — parse number

For the nav buttons "answered" check: `answers[sq.id] !== undefined`. For multiselect empty array `[]` — would be considered answered even if empty. Hmm. If a user toggles then untoggles all, it'd be `[]`. Let me treat `[]` as not answered for the allAnswered check. Actually, let me keep it simple: a question is "answered" if `answers[q.id] !== undefined` AND (for multiselect) the array is non-empty. Let me write a helper `isAnswered(q)`.

Actually simpler: in toggleMulti, if toggling produces empty array, remove the key. That way empty multiselect = not in answers = not answered. Let me do that.

```ts
const toggleMultiAnswer = (questionId, optionIdx) => {
  setAnswers(prev => {
    const cur = prev[questionId];
    const arr = Array.isArray(cur) ? cur : [];
    const next = arr.includes(optionIdx) ? arr.filter(i => i !== optionIdx) : [...arr, optionIdx];
    const cp = {...prev};
    if (next.length === 0) delete cp[questionId]; else cp[questionId] = next;
    return cp;
  });
};
```

For numeric:
```ts
const setNumericAnswer = (questionId, raw) => {
  setAnswers(prev => {
    const cp = {...prev};
    if (raw === "" || raw == null || Number.isNaN(Number(raw))) delete cp[questionId];
    else cp[questionId] = Number(raw);
    return cp;
  });
};
```

Wait, but numeric value could be a float like 0.15. Number(raw) handles that. But what about the answer being `0`? `Number("0")` = 0, fine, stored. Good. But if user clears, raw === "", delete. Good.

For numeric display value: `rawSelected` is number | undefined. Input value should be string. If undefined, "".

Now computeResult. For each question:
```ts
const ans = answersRef.current;
for (const q of qs) {
  const sel = ans[q.id];
  let earnedWeight = 0;
  let isCorrect = false;
  const maxWeight = DIFFICULTY_WEIGHT[q.difficulty];
  let selectedRec: number | number[];
  let correctRec: number | number[];
  if (q.type === "multiselect") {
    const selArr = Array.isArray(sel) ? sel : (sel === undefined ? [] : [sel]);
    // but sel for multiselect should be number[] if answered
    const selectedNums: number[] = Array.isArray(sel) ? sel : [];
    const correctSet = new Set(q.correct);
    const tp = selectedNums.filter(i => correctSet.has(i)).length;
    const fp = selectedNums.filter(i => !correctSet.has(i)).length;
    const frac = Math.max(0, Math.min(1, (tp - fp) / q.correct.length));
    earnedWeight = frac * maxWeight;
    isCorrect = frac >= 1;
    selectedRec = selectedNums;
    correctRec = q.correct;
  } else if (q.type === "numeric") {
    const selNum = typeof sel === "number" ? sel : NaN;
    const ok = Math.abs(selNum - q.correct) <= q.tolerance;
    earnedWeight = ok ? maxWeight : 0;
    isCorrect = ok;
    selectedRec = Number.isNaN(selNum) ? -1 : selNum;  // hmm, but selected is number|number[]. -1 for unanswered? But correct is a number. For numeric, -1 as "not answered" works but semantically odd. Let me store the number or a sentinel.
    correctRec = q.correct;
  } else {
    // mcq / truefalse
    const selNum = typeof sel === "number" ? sel : -1;
    const ok = selNum === q.correct;
    earnedWeight = ok ? maxWeight : 0;
    isCorrect = ok;
    selectedRec = selNum;
    correctRec = q.correct;
  }
  if (isCorrect) correctCount++;
  records.push({ questionId: q.id, type: q.type, selected: selectedRec, correct: correctRec, skill: q.skill, difficulty: q.difficulty, isCorrect, earnedWeight, maxWeight });
  // breakdown by isCorrect (raw count)
  ...
}
```

Wait, the partial credit clamp: "(tp - fp) / correct.length clamped to [0,1]". If tp-fp < 0 → 0. If all correct no extras → tp = correct.length, fp=0, frac = 1. Good. The instruction says "If the clamp gives <0, award 0." So `Math.max(0, Math.min(1, ...))`. Good.

`isCorrect` for partial = `frac >= 1` per the spec ("for partial credit, isCorrect = earnedFraction >= 1"). So full credit only.

`correctCount` — the spec says keep `percentage` (raw correct/total). So correctCount counts isCorrect (full credit). For multiselect with partial but not full, isCorrect=false, so not counted in correctCount. That's the raw percentage. Good.

`weightedPercentage = round(earnedWeightSum / examMaxWeight(exam) * 100)`.
`percentage = round(correctCount / total * 100)`.
`passed = weightedPercentage >= exam.passingScore`.
`band = bandFor(weightedPercentage)`.

ExamResult needs `score`, `total`, `correctCount`, `percentage`. `score` — I'll set to `correctCount` (matches old) or weighted? Old used `score: correctCount`. Keep `score: correctCount` for display "Score: x/total". Actually the ResultView shows `result.correctCount/result.total` for Score. So score field is somewhat redundant. I'll set `score: correctCount`.

ExamResult also needs `weightedPercentage`? Let me check the canonical ExamResult shape from ExamCertificate:
```
attemptId, examId, examTitle, domain, score, total, correctCount, percentage, passed, band, skillBreakdown, answers, candidate, email, elapsedSeconds, timedOut, tabSwitches, takenAt
```
No `weightedPercentage` field in ExamResult! But AttemptSummary has it. So I don't store weightedPercentage in ExamResult. But I should still compute it for pass/band. Maybe display it in the report. I can compute it on the fly in ResultView from answers (sum earnedWeight / sum maxWeight). Let me add a local derived value in ResultView.

Actually for the report, showing weighted percentage would be nice. Let me compute in ResultView: `result.answers.reduce((s,r)=>s+r.earnedWeight,0) / result.answers.reduce((s,r)=>s+r.maxWeight,0) * 100`. But AnswerRecord is the local type; ExamResult.answers is `unknown[]`. So I'd need to cast. Hmm. Since ExamResult.answers is `unknown[]`, in ResultView I'd cast `result.answers as AnswerRecord[]`. That's fine — I define AnswerRecord locally and cast.

Actually wait — `band` in ExamResult is `SkillBand` and is computed from weightedPercentage. The ResultView shows `result.band.band` and `result.percentage`. The percentage shown is raw. There might be a mismatch between band (weighted) and percentage (raw). That's acceptable per spec ("use weightedPercentage for pass/fail AND for bandFor").

Let me also display weighted percentage in the report for transparency. I'll compute it in ResultView via cast.

Now anti-cheat:
```ts
const [tabSwitches, setTabSwitches] = useState(0);
const tabSwitchesRef = useRef(0);
useEffect(() => { tabSwitchesRef.current = tabSwitches; }, [tabSwitches]);

useEffect(() => {
  if (phase !== "running") return;
  const onVis = () => { if (document.hidden) { setTabSwitches(n => n + 1); tabSwitchesRef.current += 1; } };
  const onBlur = () => { setTabSwitches(n => n + 1); tabSwitchesRef.current += 1; };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("blur", onBlur);
  return () => { document.removeEventListener("visibilitychange", onVis); window.removeEventListener("blur", onBlur); };
}, [phase]);
```

Note: visibilitychange fires when going hidden AND when coming back. Only count when `document.hidden` is true. Good. But blur might double-count with visibilitychange on tab switch. The spec says "blur as backup". Double counting is a minor issue but acceptable. Actually to avoid double counting, I could check. But spec says increment on hidden OR blur. I'll keep both but it may double count. That's fine for anti-cheat (slightly over-counts, conservative). Actually let me reconsider — the spec explicitly says "When the document becomes hidden (document.hidden true) or window blurs, increment". So both. Keep both.

Reset tabSwitches on startExam: `setTabSwitches(0); tabSwitchesRef.current = 0;`. Also on restart.

Live counter in running header: "Tab switches: {n}" with amber/red when >0.
Warning banner above question when tabSwitches >= 3.

computeResult reads `tabSwitchesRef.current` for the result.

ExamCertificate render on results: above the recruiting report card. The ResultView's first Card is the report. So render `<ExamCertificate result={result} />` before that Card. Spec: "if result.passed, render ExamCertificate ABOVE the existing recruiting report card. If failed, ExamCertificate handles its own 'not earned' notice (still render it — it self-gates)." So always render `<ExamCertificate result={result} />` above the report card. It self-gates on passed. 

RecruiterCompare: phase "compare". Button on picker. Render `<RecruiterCompare history={history} onBack={() => setPhase("picker")} onViewAttempt={(a) => { setViewingHistory(a); setPhase("results"); }} />`.

Now the answer review rendering needs to handle all types. Let me rewrite the review block with type branching:
- For numeric: show "Your answer: X" vs "Correct: correct ± tolerance unit". No options to map (options is []).
- For multiselect: show each option with checkbox state (checked if in selected), mark correct set.
- For mcq/truefalse: existing option rendering.

Let me write the review with branching:
```tsx
{exam.questions.map((q, idx) => {
  const rec = result.answers.find(...);
  ...
  if (q.type === "numeric") {
    return (...numeric review...);
  }
  // multiselect or mcq/truefalse share options rendering but differ in selected handling
  const selectedArr = (q.type === "multiselect") ? (Array.isArray(rec?.selected) ? rec.selected : []) : null;
  const selectedNum = (q.type !== "multiselect") ? (typeof rec?.selected === "number" ? rec.selected : -1) : -1;
  const correctArr = (q.type === "multiselect") ? q.correct : null;
  const correctNum = (q.type !== "multiselect" && q.type !== "numeric") ? q.correct : -1;
  return (...options map...);
})}
```

Hmm, this gets complex with TS narrowing inside map. The issue: `q` is `Question` union; inside `.map`, TS narrows per branch. Let me structure with explicit `if (q.type === "numeric") {...} else if (q.type === "multiselect") {...} else {...}` returning JSX in each branch. Within each branch `q` is narrowed.

For the else branch (mcq/truefalse), `q.correct` is `number`, `q.options` is `string[]`. Good.

For multiselect branch, `q.correct` is `number[]`, options string[].
For numeric branch, no options, show value.

`rec` is `AnswerRecord | undefined` from `result.answers.find`. But `result.answers` is `unknown[]` (from ExamResult). So `.find` won't work directly on unknown[]. I need to cast. Let me cast `result.answers as AnswerRecord[]` once at top of ResultView: `const answerRecords = result.answers as AnswerRecord[];` Then use `answerRecords.find(...)`.

That cast is safe since we created the records. Good.

Now the runner question rendering. `q` is `shuffled[currentIdx]` which is `Question`. Branch:
```tsx
{q.type === "numeric" ? (
  <NumericRunner ... />
) : q.type === "multiselect" ? (
  <MultiRunner ... />
) : (
  <OptionButtons ... />  // mcq/truefalse
)}
```

But to keep it inline and avoid sub-components, I'll inline with branches. Let me structure the question Card:

```tsx
<Card className="p-6">
  <div className="mb-3 flex items-center gap-2">...badges...</div>
  <p className="...">{q.prompt}</p>
  {tabSwitches >= 3 && <div className="...warning...">Repeated tab switching detected — this is recorded on your report.</div>}
  <div className="space-y-2 mt-4">
    {q.type === "numeric" ? (
      <div>
        <Input type="number" value={...} onChange={...} disabled={timedOut} />
        {q.unit && <span> {q.unit}</span>}
      </div>
    ) : q.type === "multiselect" ? (
      q.options.map((opt, idx) => { const checked = Array.isArray(rawSelected) && rawSelected.includes(idx); return checkbox row })
    ) : (
      q.options.map((opt, idx) => { const active = rawSelected === idx; return button row })
    )}
  </div>
</Card>
```

For the badges, `q.difficulty` works for all. `q.skill` works. Good. The difficulty label: `q.difficulty === 1 ? "Easy" : ...`.

For numeric, the "Skill" and difficulty badges still apply. Good.

Now `rawSelected = answers[q.id]`. Type is `number | number[] | undefined`. For numeric input value: `typeof rawSelected === "number" ? String(rawSelected) : ""`. For multiselect checked: `Array.isArray(rawSelected) && rawSelected.includes(idx)`. For mcq active: `rawSelected === idx` (number compare; if rawSelected is array it won't equal idx, fine; if undefined, fine).

Now the nav "answered" dots: `answers[sq.id] !== undefined`. For multiselect we delete empty arrays, so that's fine. But there's a subtlety: for numeric, value 0 is stored as number 0, `!== undefined` true. Good. For numeric unanswered, key absent. Good.

`allAnswered = answeredCount >= shuffled.length`. answeredCount = Object.keys(answers).length. Since we delete empty/invalid, this is accurate. Good.

Now, the Input component — does it accept `type="number"`? Yes, it spreads `...props` to input. And `value`/`onChange`. Good. But `value` must be string for controlled number input. I'll pass string.

Let me also handle the numeric onChange: `e.target.value` is string. Call `setNumericAnswer(q.id, e.target.value)`.

Let me write setNumericAnswer to handle the value. Actually I can inline:
```tsx
onChange={(e) => setNumericAnswer(q.id, e.target.value)}
```

Now, one concern: `q` in the runner is narrowed inside JSX ternary. Inside `q.type === "numeric" ? (...) : ...`, within the true branch `q` is narrowed to NumericQuestion. So `q.unit`, `q.tolerance` accessible. Good. Within multiselect branch `q.correct` is number[] (not used in render, but options is string[]). Good.

But wait — inside JSX ternary, does TS narrow `q`? Yes, conditional expression narrowing works: `q.type === "numeric" ? (q.unit...) : ...`. TS narrows in each branch. Good.

Let me also double check the badge line uses `q.difficulty` — for all types difficulty exists. Good. And the difficulty label helper.

Now let me also make sure I don't import unused. Let me list final imports from exams:
- EXAMS, getExam, bandFor, DIFFICULTY_WEIGHT, examMaxWeight, isMultiSelect, isNumeric
- type Exam, Question, QuestionType, Difficulty

Do I use isMultiSelect and isNumeric? In the runner I use `q.type === "numeric"` etc. (string literal narrowing works without the helpers). But the spec says "narrow with q.type === ... / isMultiSelect(q) / isNumeric(q)". Let me use the helpers somewhere to satisfy. Actually I must avoid unused imports. Let me decide: I'll use `isNumeric(q)` and `isMultiSelect(q)` in the answer review for clarity, and string-literal in runner. Or use them consistently. Let me use them in review and runner where helpful. To be safe and avoid unused, I'll use both helpers in the review code and string literals in runner. Actually, let me just use them where natural and ensure each imported symbol is used.

Let me verify each:
- `EXAMS` — picker map ✓
- `getExam` — results `getExam(r.examId)` ✓
- `bandFor` — computeResult ✓
- `DIFFICULTY_WEIGHT` — computeResult maxWeight ✓
- `examMaxWeight` — computeResult ✓
- `isMultiSelect` — review branch ✓
- `isNumeric` — review branch + maybe runner ✓
- `Exam` — types ✓
- `Question` — shuffle state type ✓
- `QuestionType` — AnswerRecord.type ✓
- `Difficulty` — AnswerRecord.difficulty ✓

Good, all used.

From ExamCertificate: `ExamCertificate`, `type ExamResult`. Both used.
From RecruiterCompare: `RecruiterCompare`. Used in compare phase.
From ui: `Card, Button, Badge, Input`. All used.

Now `SkillBand` — not imported (not needed). ExamResult.band is SkillBand via the imported type. Good.

Now, the ResultView needs `exam?: Exam`. We pass `getExam(r.examId)`. For review we iterate `exam.questions`. The review uses `q.type` narrowing. For numeric review, `q.correct`, `q.tolerance`, `q.unit`. For multiselect, `q.correct` number[], options.

`rec` fields: `rec.selected` is `number | number[]`, `rec.correct` is `number | number[]`, `rec.isCorrect`, `rec.earnedWeight`, `rec.maxWeight`.

Let me write the review per type:

Numeric:
```tsx
<div key={q.id} className="border ...">
  <div className="flex items-start gap-2">
    <span className={rec?.isCorrect ? green : red}>{rec?.isCorrect ? ✓ : ✗}</span>
    <div className="flex-1">
      <p>{idx+1}. {q.prompt}</p>
      <div className="mt-2 text-sm">
        <div>Your answer: {rec && typeof rec.selected === "number" ? rec.selected : "—"} {q.unit}</div>
        <div>Correct: {q.correct} ± {q.tolerance} {q.unit}</div>
      </div>
      <p className="...italic">{q.explanation}</p>
    </div>
  </div>
</div>
```

Multiselect:
```tsx
<div key={q.id} ...>
  <span ...>{rec?.isCorrect ? ✓ : ✗}</span>
  <div className="flex-1">
    <p>{idx+1}. {q.prompt}</p>
    <div className="mt-2 space-y-1 text-sm">
      {q.options.map((opt, oIdx) => {
        const correctSet = new Set(q.correct);
        const isCorrectOpt = correctSet.has(oIdx);
        const selArr = rec && Array.isArray(rec.selected) ? rec.selected : [];
        const isSelected = selArr.includes(oIdx);
        return (
          <div key={oIdx} className={isCorrectOpt ? green : isSelected ? red : gray}>
            <span>[{isSelected ? "x" : " "}]</span> {String.fromCharCode(65+oIdx)}. {opt}
            {isCorrectOpt && " (correct)"}
            {isSelected && !isCorrectOpt && " (your answer)"}
          </div>
        );
      })}
    </div>
    <p italic>{q.explanation}</p>
  </div>
</div>
```

mcq/truefalse:
```tsx
<div key={q.id} ...>
  <span ...>{rec?.isCorrect ? ✓ : ✗}</span>
  <div className="flex-1">
    <p>{idx+1}. {q.prompt}</p>
    <div className="mt-2 space-y-1 text-sm">
      {q.options.map((opt, oIdx) => {
        const isCorrectOpt = oIdx === q.correct;
        const selNum = rec && typeof rec.selected === "number" ? rec.selected : -1;
        const isSelected = oIdx === selNum;
        return (...same as old...);
      })}
    </div>
    <p italic>{q.explanation}</p>
  </div>
</div>
```

Use `isNumeric(q)` / `isMultiSelect(q)` for the branch conditions in review.

Now the ResultView BigStat — add weighted percentage? Let me add a BigStat for "Weighted" score. Compute weightedPct in ResultView from answerRecords. Show in the stats grid. Let me add it. Also show tabSwitches in the report (anti-cheat transparency). Add a BigStat "Tab switches" with value. And maybe show integrity note.

Let me restructure BigStats grid to include weighted percentage and tab switches. The old grid was 4 cols: Score, Percentage, Result, Pass mark. I'll make it 4 cols still but swap: Score, Percentage (raw), Weighted, Result. And pass mark shown elsewhere. Actually let me do a 4-col: Score, Raw %, Weighted %, Result. And put pass mark + tab switches in a secondary line. Hmm, keep it clean. Let me do grid-cols-2 sm:grid-cols-4 with: Score, Percentage, Weighted, Result. Then below, a line: "Pass mark: X% · Tab switches: N · Timed out: ...".

Actually the existing pass mark BigStat is useful. Let me do 4: Score, Percentage, Weighted %, Result. And add pass mark + tab switches as a small line under the grade badge area. I'll keep it simple.

Let me compute weightedPct in ResultView:
```ts
const weightedPct = useMemo(() => {
  const earned = answerRecords.reduce((s, r) => s + r.earnedWeight, 0);
  const max = answerRecords.reduce((s, r) => s + r.maxWeight, 0);
  return max > 0 ? Math.round((earned / max) * 100) : 0;
}, [answerRecords]);
```

Now writing the file. Let me be careful about the `q` narrowing in the runner JSX. I'll use explicit `isNumeric(q)` / `isMultiSelect(q)` checks via the helpers in the runner too, to be safe and use the imports. Actually in JSX ternary `isNumeric(q) ? (...) : isMultiSelect(q) ? (...) : (...)`, TS narrows via the type guards. Good, that uses both helpers in runner. Then in review I can also use them. Both used. 

Wait, but if I use them in runner, do I also need them in review? They'd still be "used" once. But I'll use in both for consistency. Fine.

Let me handle the `selected` variable in runner. I'll compute per-branch inside the JSX. Actually I need `rawSelected` for the nav dots elsewhere (answered). For the nav dots I use `answers[sq.id] !== undefined` — no narrowing needed. Good.

For the runner question card, let me write:
```tsx
const q = shuffled[currentIdx]!;
const rawSelected = answers[q.id];
```
Then in JSX:
```tsx
{isNumeric(q) ? (
  <div className="mt-4">
    <div className="flex items-center gap-2">
      <Input
        type="number"
        step="any"
        value={typeof rawSelected === "number" ? String(rawSelected) : ""}
        onChange={(e) => setNumericAnswer(q.id, e.target.value)}
        disabled={timedOut}
        className="max-w-xs"
      />
      {q.unit && <span className="text-sm text-gray-600">{q.unit}</span>}
    </div>
  </div>
) : isMultiSelect(q) ? (
  <div className="space-y-2 mt-4">
    {q.options.map((opt, idx) => {
      const checked = Array.isArray(rawSelected) && rawSelected.includes(idx);
      return (
        <button key={idx} onClick={() => toggleMultiAnswer(q.id, idx)} disabled={timedOut}
          className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition-colors ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"} ${timedOut ? "opacity-60 cursor-not-allowed" : ""}`}>
          <span className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300"}`}>{checked ? "✓" : ""}</span>
          <span className="font-medium mr-1 text-indigo-600">{String.fromCharCode(65 + idx)}.</span>
          <span className="text-sm text-gray-800">{opt}</span>
        </button>
      );
    })}
  </div>
) : (
  <div className="space-y-2 mt-4">
    {q.options.map((opt, idx) => {
      const active = rawSelected === idx;
      return (
        <button key={idx} onClick={() => selectAnswer(q.id, idx)} disabled={timedOut}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${active ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"} ${timedOut ? "opacity-60 cursor-not-allowed" : ""}`}>
          <span className="font-medium mr-2 text-indigo-600">{String.fromCharCode(65 + idx)}.</span>
          <span className="text-sm text-gray-800">{opt}</span>
        </button>
      );
    })}
  </div>
)}
```

Wait, `rawSelected === idx` — rawSelected is `number | number[] | undefined`. Comparing to idx (number). If rawSelected is number, works. If array, `=== idx` false. If undefined, false. TS: `number | number[] | undefined === number` — is this a type error? Comparing different types with ===. TS allows `===` between unrelated types only if they overlap. `number` and `number[]` don't overlap, so TS might error: "This comparison appears to be unintentional because the types 'number | number[]' and 'number' have no overlap." Hmm. Actually `number | number[] | undefined` compared to `number` — there IS overlap (number part). TS generally allows `===` when the union includes the compared type. Let me think: TS error for `x === y` occurs when types have no overlap. Here left includes `number`, right is `number`, so overlap exists. Should be OK. But to be safe, I'll narrow: `const active = typeof rawSelected === "number" && rawSelected === idx;`. Cleaner and safe.

Similarly for checked I already guard with Array.isArray.

For numeric value: `typeof rawSelected === "number" ? String(rawSelected) : ""`. Good.

Now the `setNumericAnswer` and `toggleMultiAnswer` and `selectAnswer` definitions. Note `selectAnswer` keeps signature `(questionId: string, optionIdx: number)`.

Now the timer effect — keep as is but it calls `finishExam(true)`. finishExam reads refs. Good. tabSwitchesRef is read in computeResult. Good.

Also need to reset tabSwitches in startExam and restart.

Let me also ensure the `submittedRef` and timer unchanged.

Now the computeResult returns ExamResult (imported type). My local AnswerRecord[] assigned to `unknown[]` — fine. `band: bandFor(weightedPercentage)` returns SkillBand — matches. `selected: selectedRec` where selectedRec is `number | number[]` — matches AnswerRecord.selected. `correct: correctRec` number | number[]. Good. `difficulty: q.difficulty` is Difficulty. `type: q.type` is QuestionType. Good.

For numeric selectedRec when unanswered: I'll use `NaN`? But selected is `number | number[]`. NaN is a number. In review I check `typeof rec.selected === "number" ? rec.selected : "—"`. NaN would display as "NaN". Let me instead store a sentinel. Hmm. For numeric unanswered, let me store `Number.NaN` and in review check `Number.isNaN`. Or store the value only if answered; if unanswered store... but selected must be number. Let me store `NaN` and display "—" when NaN. Actually simpler: store the number if answered else `NaN`, and review: `rec && typeof rec.selected === "number" && !Number.isNaN(rec.selected) ? rec.selected : "—"`. Let me do that.

Actually for mcq/truefalse unanswered I store -1 (old behavior). For numeric unanswered, -1 could be a legitimate answer? Unlikely for these questions but possible. Use NaN to be safe. But NaN === NaN is false; in review I use Number.isNaN check. Fine.

Hmm, but `selected: number | number[]` with NaN — TS fine (NaN is number).

Let me finalize computeResult numeric branch:
```ts
} else if (isNumeric(q)) {
  const selNum = typeof sel === "number" ? sel : NaN;
  const ok = !Number.isNaN(selNum) && Math.abs(selNum - q.correct) <= q.tolerance;
  earnedWeight = ok ? maxWeight : 0;
  isCorrect = ok;
  selectedRec = selNum;  // NaN if unanswered
  correctRec = q.correct;
}
```

Wait `isNumeric(q)` narrows to NumericQuestion. Inside, `q.correct`, `q.tolerance` accessible. Good. But I'm using `isNumeric`/`isMultiSelect` in computeResult too — that's fine, they're used.

But careful: in computeResult I branch `if (isMultiSelect(q)) {...} else if (isNumeric(q)) {...} else {...}`. The else is mcq/truefalse where `q.correct` is number. Good.

Now `sel` for multiselect: `ans[q.id]` is `number | number[] | undefined`. For multiselect answered it's number[]. `Array.isArray(sel) ? sel : []`. Good. For mcq, `typeof sel === "number" ? sel : -1`. Good.

Let me write the breakdown — count isCorrect per skill, total per skill. Keep raw. pct = round(correct/total*100).

Now the elapsed seconds, timedOut, takenAt, candidate, email — same as before. Add `tabSwitches: tabSwitchesRef.current`.

`attemptId: `${exam.id}-${Date.now()}`` — keep.

Now RecruiterCompare phase. Add to Phase type. In the main render, add `if (phase === "compare") { return <RecruiterCompare ... />; }`.

Picker: add a "Recruiter Compare" button. The existing recent attempts card has "View all" and "Clear". Spec: "Add a 'Recruiter Compare' button on the picker (next to/replacing the existing 'View all' history button)." and "The picker can have two buttons: 'History' (→ phase history) and 'Recruiter Compare' (→ phase compare)." So in the recent attempts header, replace "View all" with two buttons: "History" and "Recruiter Compare". I'll pass `onShowHistory` and `onShowCompare` props to ExamPicker.

Let me add `onShowCompare: () => void` prop.

Now let me also make sure `RecruiterCompare` import doesn't break compile if the file doesn't exist yet. The spec says it's being built in parallel, so it will exist. I'll import as specified. If it doesn't exist at compile time it'd error, but that's the parallel agent's responsibility. I'll trust the spec.

Let me write the file now. I'll be thorough.

One more: the `Input` for numeric — `step="any"` allows decimals. Good. `disabled={timedOut}`.

Also the warning banner: "above the question when tabSwitches >= 3". Place inside the question Card above the options, or above the Card? Spec says "Show a warning banner above the question". I'll put it inside the question Card, above the prompt or above options. Let me put it above the prompt actually "above the question" — I'll put it as a banner right above the question Card (between header Card and question Card), or inside top of question Card. I'll put it inside the question Card at the top, before badges. Actually "above the question" likely means above the question content. I'll place a banner div inside the question Card before the badges/prompt. Let me place it above the question Card entirely (between the two cards) so it's clearly a banner. I'll put it between header and question card.

Let me place it right before the question Card:
```tsx
{tabSwitches >= 3 && (
  <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium">
    Repeated tab switching detected — this is recorded on your report.
  </div>
)}
```

Now the tab switches live counter in header. Add to the header right-side cluster:
```tsx
<div className="text-center">
  <div className="text-xs text-gray-500">Tab switches</div>
  <div className={`text-lg font-bold tabular-nums ${tabSwitches > 0 ? (tabSwitches >= 3 ? "text-red-600" : "text-amber-600") : "text-gray-900"}`}>{tabSwitches}</div>
</div>
```

Good. Place it next to Time left / Pass mark. The header has "Time left" and "Pass mark". Add "Tab switches". Three items.

Now let me write everything.

Let me also double-check: the `answers` state type `Record<string, number | number[]>`. `setAnswers` updater returns same type. In toggleMulti I delete key or set number[]. In setNumeric I set number or delete. In selectAnswer I set number. Good.

`answeredCount = Object.keys(answers).length`. Good.

Now, the review `answerRecords = result.answers as AnswerRecord[]`. Then `answerRecords.find((r) => r.questionId === q.id)`. Good.

Let me write it all out now.

For the ResultView, I'll render ExamCertificate first (always), then the report card. Spec: "render <ExamCertificate result={result} /> ABOVE the existing recruiting report card."

Let me also keep `exam` prop for review. `getExam(r.examId)` may be undefined if exam removed, but exams are static. Keep optional.

Now writing.

Let me reconsider the `band` display in ResultView. `result.band.band` and `result.band.label`. Fine. The grade circle uses `gradeColor(result.percentage)` — but band is based on weighted. Minor mismatch but acceptable; or use weightedPct for the circle color. Let me use weightedPct for the circle color to be consistent with band. Actually `gradeColor` is just color buckets. I'll pass weightedPct to gradeColor for the circle and badges to align with band. Hmm, but the "Percentage" BigStat shows raw percentage. Mixed. I'll keep gradeColor on weightedPct for the band circle (since band is weighted), and show raw % in stat. That's consistent: band circle color matches band.

Let me use `weightedPct` in `gradeColor` calls in ResultView (circle + recruiter signal badge). And display both raw and weighted stats.

Let me finalize and write.

Also need `useMemo` import — already in react import. Keep `useEffect, useMemo, useRef, useState`.

Let me write the file.

I have everything I need. The `ExamResult` from ExamCertificate uses `answers: unknown[]` and includes `tabSwitches`. RecruiterCompare is being built in parallel — I'll import it as specified. Now writing the upgraded file.

**tool `write`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx",
  "content": "\"use client\";\n\nimport { useEffect, useMemo, useRef, useState } from \"react\";\nimport { Card, Button, Badge, Input } from \"@/components/marketing/ui\";\nimport {\n  EXAMS,\n  getExam,\n  bandFor,\n  DIFFICULTY_WEIGHT,\n  examMaxWeight,\n  isMultiSelect,\n  isNumeric,\n  type Exam,\n  type Question,\n  type QuestionType,\n  type Difficulty,\n} from \"@/lib/marketing-tests/exams\";\nimport { ExamCertificate } from \"@/components/marketing/ExamCertificate\";\nimport type { ExamResult } from \"@/components/marketing/ExamCertificate\";\nimport { RecruiterCompare } from \"@/components/marketing/RecruiterCompare\";\n\ntype Phase = \"picker\" | \"running\" | \"results\" | \"history\" | \"compare\";\n\ninterface AnswerRecord {\n  questionId: string;\n  type: QuestionType;\n  selected: number | number[];\n  correct: number | number[];\n  skill: string;\n  difficulty: Difficulty;\n  isCorrect: boolean;\n  earnedWeight: number;\n  maxWeight: number;\n}\n\ninterface Candidate {\n  name: string;\n  email: string;\n}\n\nconst HISTORY_KEY = \"marketing-hub:exam-history\";\nconst CANDIDATE_KEY = \"marketing-hub:exam-candidate\";\n\nfunction loadHistory(): ExamResult[] {\n  if (typeof window === \"undefined\") return [];\n  try {\n    const raw = localStorage.getItem(HISTORY_KEY);\n    if (!raw) return [];\n    const parsed = JSON.parse(raw) as ExamResult[];\n    if (!Array.isArray(parsed)) return [];\n    return parsed;\n  } catch {\n    return [];\n  }\n}\n\nfunction saveHistory(list: ExamResult[]) {\n  try {\n    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));\n  } catch {\n    // ignore quota / private mode\n  }\n}\n\nfunction loadCandidate(): Candidate {\n  if (typeof window === \"undefined\") return { name: \"\", email: \"\" };\n  try {\n    const raw = localStorage.getItem(CANDIDATE_KEY);\n    if (!raw) return { name: \"\", email: \"\" };\n    const parsed = JSON.parse(raw) as Partial<Candidate>;\n    return { name: parsed.name ?? \"\", email: parsed.email ?? \"\" };\n  } catch {\n    return { name: \"\", email: \"\" };\n  }\n}\n\nfunction saveCandidate(c: Candidate) {\n  try {\n    localStorage.setItem(CANDIDATE_KEY, JSON.stringify(c));\n  } catch {\n    // ignore\n  }\n}\n\nfunction shuffle<T>(arr: T[]): T[] {\n  const a = [...arr];\n  for (let i = a.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [a[i], a[j]] = [a[j]!, a[i]!];\n  }\n  return a;\n}\n\nfunction gradeColor(percentage: number): string {\n  if (percentage >= 85) return \"bg-green-100 text-green-800 border-green-200\";\n  if (percentage >= 70) return \"bg-blue-100 text-blue-800 border-blue-200\";\n  if (percentage >= 50) return \"bg-amber-100 text-amber-800 border-amber-200\";\n  return \"bg-red-100 text-red-800 border-red-200\";\n}\n\nfunction difficultyLabel(d: Difficulty): string {\n  return d === 1 ? \"Easy\" : d === 2 ? \"Medium\" : \"Hard\";\n}\n\nfunction fmtDuration(totalSeconds: number): string {\n  const m = Math.floor(totalSeconds / 60);\n  const s = totalSeconds % 60;\n  return `${m}m ${s.toString().padStart(2, \"0\")}s`;\n}\n\nfunction fmtCountdown(secondsLeft: number): string {\n  if (secondsLeft <= 0) return \"0:00\";\n  const m = Math.floor(secondsLeft / 60);\n  const s = secondsLeft % 60;\n  return `${m}:${s.toString().padStart(2, \"0\")}`;\n}\n\nexport function MarketingTests() {\n  const [phase, setPhase] = useState<Phase>(\"picker\");\n  const [activeExam, setActiveExam] = useState<Exam | null>(null);\n  const [shuffled, setShuffled] = useState<Question[]>([]);\n  const [currentIdx, setCurrentIdx] = useState(0);\n  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});\n  const [candidate, setCandidate] = useState<Candidate>({ name: \"\", email: \"\" });\n  const [result, setResult] = useState<ExamResult | null>(null);\n  const [history, setHistory] = useState<ExamResult[]>([]);\n  const [viewingHistory, setViewingHistory] = useState<ExamResult | null>(null);\n  const [startTime, setStartTime] = useState(0);\n  const [secondsLeft, setSecondsLeft] = useState(0);\n  const [timedOut, setTimedOut] = useState(false);\n  const [tabSwitches, setTabSwitches] = useState(0);\n\n  // Refs that mirror the latest state so the timer's auto-submit closure\n  // never reads stale answers/history (the interval effect only re-runs on\n  // phase/exam change, so it would otherwise capture the initial empty state).\n  const answersRef = useRef(answers);\n  const shuffledRef = useRef(shuffled);\n  const candidateRef = useRef(candidate);\n  const startTimeRef = useRef(startTime);\n  const historyRef = useRef(history);\n  const activeExamRef = useRef(activeExam);\n  const tabSwitchesRef = useRef(tabSwitches);\n  useEffect(() => { answersRef.current = answers; }, [answers]);\n  useEffect(() => { shuffledRef.current = shuffled; }, [shuffled]);\n  useEffect(() => { candidateRef.current = candidate; }, [candidate]);\n  useEffect(() => { startTimeRef.current = startTime; }, [startTime]);\n  useEffect(() => { historyRef.current = history; }, [history]);\n  useEffect(() => { activeExamRef.current = activeExam; }, [activeExam]);\n  useEffect(() => { tabSwitchesRef.current = tabSwitches; }, [tabSwitches]);\n\n  // hydrate candidate + history on mount\n  useEffect(() => {\n    setCandidate(loadCandidate());\n    setHistory(loadHistory());\n  }, []);\n\n  // countdown timer\n  const submittedRef = useRef(false);\n  useEffect(() => {\n    if (phase !== \"running\" || !activeExam) return;\n    submittedRef.current = false;\n    const total = activeExam.durationMinutes * 60;\n    setSecondsLeft(total);\n    const deadline = Date.now() + total * 1000;\n    const id = setInterval(() => {\n      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));\n      setSecondsLeft(left);\n      if (left <= 0 && !submittedRef.current) {\n        submittedRef.current = true;\n        setTimedOut(true);\n        clearInterval(id);\n        // auto-submit on expiry — reads latest state via refs\n        finishExam(true);\n      }\n    }, 1000);\n    return () => clearInterval(id);\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [phase, activeExam]);\n\n  // Anti-cheat: tab-switch detection. Active only while running so historical\n  // review / picker navigation doesn't inflate the count. Reads/writes the ref\n  // directly so the timer's stale-closure auto-submit captures the latest tally.\n  useEffect(() => {\n    if (phase !== \"running\") return;\n    const increment = () => {\n      setTabSwitches((n) => n + 1);\n      tabSwitchesRef.current += 1;\n    };\n    const onVisibility = () => {\n      if (document.hidden) increment();\n    };\n    const onBlur = () => increment();\n    document.addEventListener(\"visibilitychange\", onVisibility);\n    window.addEventListener(\"blur\", onBlur);\n    return () => {\n      document.removeEventListener(\"visibilitychange\", onVisibility);\n      window.removeEventListener(\"blur\", onBlur);\n    };\n  }, [phase]);\n\n  const startExam = (exam: Exam) => {\n    if (!candidate.name.trim()) return;\n    saveCandidate(candidate);\n    setActiveExam(exam);\n    setShuffled(shuffle(exam.questions));\n    setCurrentIdx(0);\n    setAnswers({});\n    setResult(null);\n    setViewingHistory(null);\n    setTimedOut(false);\n    setTabSwitches(0);\n    tabSwitchesRef.current = 0;\n    setStartTime(Date.now());\n    setPhase(\"running\");\n  };\n\n  const selectAnswer = (questionId: string, optionIdx: number) => {\n    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));\n  };\n\n  const toggleMultiAnswer = (questionId: string, optionIdx: number) => {\n    setAnswers((prev) => {\n      const cur = prev[questionId];\n      const arr = Array.isArray(cur) ? cur : [];\n      const next = arr.includes(optionIdx)\n        ? arr.filter((i) => i !== optionIdx)\n        : [...arr, optionIdx];\n      const cp = { ...prev };\n      if (next.length === 0) delete cp[questionId];\n      else cp[questionId] = next;\n      return cp;\n    });\n  };\n\n  const setNumericAnswer = (questionId: string, raw: string) => {\n    setAnswers((prev) => {\n      const cp = { ...prev };\n      if (raw === \"\" || Number.isNaN(Number(raw))) delete cp[questionId];\n      else cp[questionId] = Number(raw);\n      return cp;\n    });\n  };\n\n  const computeResult = (isTimeout: boolean): ExamResult => {\n    const exam = activeExamRef.current;\n    const qs = shuffledRef.current;\n    const ans = answersRef.current;\n    const cand = candidateRef.current;\n    const start = startTimeRef.current;\n    if (!exam) throw new Error(\"no active exam\");\n    const breakdown: Record<string, { correct: number; total: number; pct: number }> = {};\n    const records: AnswerRecord[] = [];\n    let correctCount = 0;\n    let earnedWeightSum = 0;\n    for (const q of qs) {\n      const sel = ans[q.id];\n      const maxWeight = DIFFICULTY_WEIGHT[q.difficulty];\n      let earnedWeight = 0;\n      let isCorrect = false;\n      let selectedRec: number | number[];\n      let correctRec: number | number[];\n      if (isMultiSelect(q)) {\n        const selectedNums: number[] = Array.isArray(sel) ? sel : [];\n        const correctSet = new Set(q.correct);\n        const tp = selectedNums.filter((i) => correctSet.has(i)).length;\n        const fp = selectedNums.filter((i) => !correctSet.has(i)).length;\n        // Partial credit: (true positives − false positives) / correct count,\n        // clamped to [0,1]. Full weight only when all correct and no extras.\n        const frac = Math.max(0, Math.min(1, (tp - fp) / q.correct.length));\n        earnedWeight = frac * maxWeight;\n        isCorrect = frac >= 1;\n        selectedRec = selectedNums;\n        correctRec = q.correct;\n      } else if (isNumeric(q)) {\n        const selNum = typeof sel === \"number\" ? sel : NaN;\n        const ok = !Number.isNaN(selNum) && Math.abs(selNum - q.correct) <= q.tolerance;\n        earnedWeight = ok ? maxWeight : 0;\n        isCorrect = ok;\n        selectedRec = selNum;\n        correctRec = q.correct;\n      } else {\n        const selNum = typeof sel === \"number\" ? sel : -1;\n        const ok = selNum === q.correct;\n        earnedWeight = ok ? maxWeight : 0;\n        isCorrect = ok;\n        selectedRec = selNum;\n        correctRec = q.correct;\n      }\n      earnedWeightSum += earnedWeight;\n      if (isCorrect) correctCount++;\n      records.push({\n        questionId: q.id,\n        type: q.type,\n        selected: selectedRec,\n        correct: correctRec,\n        skill: q.skill,\n        difficulty: q.difficulty,\n        isCorrect,\n        earnedWeight,\n        maxWeight,\n      });\n      if (!breakdown[q.skill]) breakdown[q.skill] = { correct: 0, total: 0, pct: 0 };\n      breakdown[q.skill]!.total += 1;\n      if (isCorrect) breakdown[q.skill]!.correct += 1;\n    }\n    for (const k of Object.keys(breakdown)) {\n      const b = breakdown[k]!;\n      b.pct = Math.round((b.correct / b.total) * 100);\n    }\n    const total = qs.length;\n    const percentage = Math.round((correctCount / total) * 100);\n    const maxWeight = examMaxWeight(exam);\n    const weightedPercentage = maxWeight > 0 ? Math.round((earnedWeightSum / maxWeight) * 100) : 0;\n    return {\n      attemptId: `${exam.id}-${Date.now()}`,\n      examId: exam.id,\n      examTitle: exam.title,\n      domain: exam.domain,\n      score: correctCount,\n      total,\n      correctCount,\n      percentage,\n      passed: weightedPercentage >= exam.passingScore,\n      band: bandFor(weightedPercentage),\n      skillBreakdown: breakdown,\n      answers: records,\n      candidate: cand.name.trim(),\n      email: cand.email.trim(),\n      elapsedSeconds: Math.round((Date.now() - start) / 1000),\n      timedOut: isTimeout,\n      tabSwitches: tabSwitchesRef.current,\n      takenAt: Date.now(),\n    };\n  };\n\n  const finishExam = (isTimeout: boolean) => {\n    submittedRef.current = true;\n    const r = computeResult(isTimeout);\n    setResult(r);\n    const next = [r, ...historyRef.current].slice(0, 100);\n    setHistory(next);\n    saveHistory(next);\n    setPhase(\"results\");\n  };\n\n  const submitExam = () => finishExam(false);\n\n  const restart = () => {\n    setPhase(\"picker\");\n    setActiveExam(null);\n    setShuffled([]);\n    setAnswers({});\n    setResult(null);\n    setViewingHistory(null);\n    setTimedOut(false);\n    setTabSwitches(0);\n    tabSwitchesRef.current = 0;\n  };\n\n  const clearHistory = () => {\n    setHistory([]);\n    saveHistory([]);\n  };\n\n  const viewHistoryItem = (item: ExamResult) => {\n    setViewingHistory(item);\n    setPhase(\"results\");\n  };\n\n  const answeredCount = Object.keys(answers).length;\n  const allAnswered = activeExam ? answeredCount >= shuffled.length : false;\n\n  if (phase === \"picker\") {\n    return (\n      <ExamPicker\n        onPick={startExam}\n        candidate={candidate}\n        setCandidate={setCandidate}\n        history={history}\n        onViewHistory={(item) => viewHistoryItem(item)}\n        onShowHistory={() => setPhase(\"history\")}\n        onShowCompare={() => setPhase(\"compare\")}\n        onClearHistory={clearHistory}\n      />\n    );\n  }\n\n  if (phase === \"history\") {\n    return (\n      <HistoryView\n        history={history}\n        onView={(item) => viewHistoryItem(item)}\n        onBack={() => setPhase(\"picker\")}\n        onClear={clearHistory}\n      />\n    );\n  }\n\n  if (phase === \"compare\") {\n    return (\n      <RecruiterCompare\n        history={history}\n        onBack={() => setPhase(\"picker\")}\n        onViewAttempt={(a) => {\n          setViewingHistory(a);\n          setPhase(\"results\");\n        }}\n      />\n    );\n  }\n\n  if (phase === \"results\") {\n    const r = viewingHistory ?? result;\n    if (r) {\n      return (\n        <ResultView\n          result={r}\n          exam={getExam(r.examId)}\n          onRestart={restart}\n          isHistorical={!!viewingHistory}\n        />\n      );\n    }\n  }\n\n  if (!activeExam) return null;\n  const q = shuffled[currentIdx]!;\n  const rawSelected = answers[q.id];\n  const progress = Math.round((answeredCount / shuffled.length) * 100);\n  const lowTime = secondsLeft <= 60;\n  const totalSeconds = activeExam.durationMinutes * 60;\n\n  return (\n    <div className=\"space-y-6\">\n      <Card className=\"p-6\">\n        <div className=\"flex items-center justify-between flex-wrap gap-3\">\n          <div>\n            <div className=\"flex items-center gap-2\">\n              <h2 className=\"text-xl font-bold text-gray-900\">{activeExam.title}</h2>\n              <Badge variant=\"secondary\">{activeExam.level}</Badge>\n            </div>\n            <p className=\"text-sm text-gray-500 mt-1\">\n              Question {currentIdx + 1} of {shuffled.length} · {answeredCount}/{shuffled.length} answered\n              {timedOut && <span className=\"text-red-600 font-medium\"> · Time expired — auto-submitted</span>}\n            </p>\n          </div>\n          <div className=\"flex items-center gap-4\">\n            <div className=\"text-center\">\n              <div className=\"text-xs text-gray-500\">Time left</div>\n              <div\n                className={`text-lg font-bold tabular-nums ${lowTime ? \"text-red-600\" : \"text-gray-900\"}`}\n              >\n                {fmtCountdown(secondsLeft)}\n              </div>\n            </div>\n            <div className=\"text-center\">\n              <div className=\"text-xs text-gray-500\">Pass mark</div>\n              <div className=\"text-lg font-bold text-gray-900\">{activeExam.passingScore}%</div>\n            </div>\n            <div className=\"text-center\">\n              <div className=\"text-xs text-gray-500\">Tab switches</div>\n              <div\n                className={`text-lg font-bold tabular-nums ${\n                  tabSwitches >= 3 ? \"text-red-600\" : tabSwitches > 0 ? \"text-amber-600\" : \"text-gray-900\"\n                }`}\n              >\n                {tabSwitches}\n              </div>\n            </div>\n          </div>\n        </div>\n        <div className=\"mt-4 h-2 bg-gray-100 rounded-full overflow-hidden\">\n          <div\n            className=\"h-full bg-indigo-600 transition-all\"\n            style={{ width: `${progress}%` }}\n          />\n        </div>\n        <div className=\"mt-2 h-1 bg-gray-100 rounded-full overflow-hidden\">\n          <div\n            className={`h-full transition-all ${lowTime ? \"bg-red-500\" : \"bg-gray-400\"}`}\n            style={{ width: `${(secondsLeft / totalSeconds) * 100}%` }}\n          />\n        </div>\n      </Card>\n\n      {tabSwitches >= 3 && (\n        <div className=\"rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium\">\n          Repeated tab switching detected — this is recorded on your report.\n        </div>\n      )}\n\n      <Card className=\"p-6\">\n        <div className=\"mb-3 flex items-center gap-2\">\n          <Badge variant=\"outline\">{activeExam.domain}</Badge>\n          <Badge variant=\"secondary\">Skill: {q.skill}</Badge>\n          <Badge variant=\"outline\">{difficultyLabel(q.difficulty)}</Badge>\n          <Badge variant=\"outline\">{q.type}</Badge>\n        </div>\n        <p className=\"text-lg font-semibold text-gray-900 mb-4\">{q.prompt}</p>\n        <div className=\"space-y-2\">\n          {isNumeric(q) ? (\n            <div className=\"flex items-center gap-2\">\n              <Input\n                type=\"number\"\n                step=\"any\"\n                value={typeof rawSelected === \"number\" ? String(rawSelected) : \"\"}\n                onChange={(e) => setNumericAnswer(q.id, e.target.value)}\n                disabled={timedOut}\n                className=\"max-w-xs\"\n                aria-label=\"Numeric answer\"\n              />\n              {q.unit && <span className=\"text-sm text-gray-600\">{q.unit}</span>}\n            </div>\n          ) : isMultiSelect(q) ? (\n            q.options.map((opt, idx) => {\n              const checked = Array.isArray(rawSelected) && rawSelected.includes(idx);\n              return (\n                <button\n                  key={idx}\n                  onClick={() => toggleMultiAnswer(q.id, idx)}\n                  disabled={timedOut}\n                  className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition-colors ${\n                    checked\n                      ? \"border-indigo-500 bg-indigo-50\"\n                      : \"border-gray-200 hover:border-indigo-300 hover:bg-gray-50\"\n                  } ${timedOut ? \"opacity-60 cursor-not-allowed\" : \"\"}`}\n                >\n                  <span\n                    className={`w-5 h-5 rounded border flex items-center justify-center text-xs flex-shrink-0 ${\n                      checked ? \"bg-indigo-600 border-indigo-600 text-white\" : \"border-gray-300\"\n                    }`}\n                  >\n                    {checked ? \"✓\" : \"\"}\n                  </span>\n                  <span className=\"font-medium mr-1 text-indigo-600\">\n                    {String.fromCharCode(65 + idx)}.\n                  </span>\n                  <span className=\"text-sm text-gray-800\">{opt}</span>\n                </button>\n              );\n            })\n          ) : (\n            q.options.map((opt, idx) => {\n              const active = typeof rawSelected === \"number\" && rawSelected === idx;\n              return (\n                <button\n                  key={idx}\n                  onClick={() => selectAnswer(q.id, idx)}\n                  disabled={timedOut}\n                  className={`w-full text-left p-3 rounded-lg border transition-colors ${\n                    active\n                      ? \"border-indigo-500 bg-indigo-50\"\n                      : \"border-gray-200 hover:border-indigo-300 hover:bg-gray-50\"\n                  } ${timedOut ? \"opacity-60 cursor-not-allowed\" : \"\"}`}\n                >\n                  <span className=\"font-medium mr-2 text-indigo-600\">\n                    {String.fromCharCode(65 + idx)}.\n                  </span>\n                  <span className=\"text-sm text-gray-800\">{opt}</span>\n                </button>\n              );\n            })\n          )}\n        </div>\n      </Card>\n\n      <div className=\"flex items-center justify-between flex-wrap gap-3\">\n        <Button\n          variant=\"outline\"\n          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}\n          disabled={currentIdx === 0 || timedOut}\n        >\n          Previous\n        </Button>\n        <div className=\"flex gap-1 flex-wrap max-w-full\">\n          {shuffled.map((sq, idx) => {\n            const answered = answers[sq.id] !== undefined;\n            const isCurrent = idx === currentIdx;\n            return (\n              <button\n                key={sq.id}\n                onClick={() => setCurrentIdx(idx)}\n                disabled={timedOut}\n                className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${\n                  isCurrent\n                    ? \"bg-indigo-600 text-white\"\n                    : answered\n                      ? \"bg-indigo-100 text-indigo-700\"\n                      : \"bg-gray-100 text-gray-500 hover:bg-gray-200\"\n                } ${timedOut ? \"cursor-not-allowed\" : \"\"}`}\n                aria-label={`Go to question ${idx + 1}`}\n              >\n                {idx + 1}\n              </button>\n            );\n          })}\n        </div>\n        {currentIdx < shuffled.length - 1 ? (\n          <Button\n            onClick={() => setCurrentIdx((i) => Math.min(shuffled.length - 1, i + 1))}\n            disabled={timedOut}\n          >\n            Next\n          </Button>\n        ) : (\n          <Button onClick={submitExam} disabled={!allAnswered || timedOut}>\n            {allAnswered ? \"Submit Exam\" : `Answer all (${answeredCount}/${shuffled.length})`}\n          </Button>\n        )}\n      </div>\n    </div>\n  );\n}\n\nfunction ExamPicker({\n  onPick,\n  candidate,\n  setCandidate,\n  history,\n  onViewHistory,\n  onShowHistory,\n  onShowCompare,\n  onClearHistory,\n}: {\n  onPick: (e: Exam) => void;\n  candidate: Candidate;\n  setCandidate: (c: Candidate) => void;\n  history: ExamResult[];\n  onViewHistory: (item: ExamResult) => void;\n  onShowHistory: () => void;\n  onShowCompare: () => void;\n  onClearHistory: () => void;\n}) {\n  const canStart = candidate.name.trim().length > 0;\n  return (\n    <div className=\"space-y-6\">\n      <Card className=\"p-6\">\n        <h2 className=\"text-xl font-bold text-gray-900\">Marketing Professional Exams</h2>\n        <p className=\"text-sm text-gray-600 mt-1\">\n          Recruiting-grade assessments across marketing disciplines. Each exam is timed,\n          skill-tagged, and scored against professional benchmarks with per-skill breakdowns\n          for hiring decisions.\n        </p>\n        <div className=\"mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center\">\n          <Stat label=\"Exams\" value={EXAMS.length} />\n          <Stat label=\"Questions\" value={EXAMS.reduce((n, e) => n + e.questions.length, 0)} />\n          <Stat label=\"Domains\" value={new Set(EXAMS.map((e) => e.domain)).size} />\n          <Stat label=\"Attempts\" value={history.length} />\n        </div>\n      </Card>\n\n      <Card className=\"p-6\">\n        <h3 className=\"text-lg font-semibold text-gray-900 mb-1\">Candidate Identity</h3>\n        <p className=\"text-sm text-gray-500 mb-4\">\n          Enter the candidate's name before starting. This is recorded on the report and\n          remembered for this browser.\n        </p>\n        <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n          <div>\n            <label className=\"block text-xs font-medium text-gray-700 mb-1\">Name *</label>\n            <Input\n              value={candidate.name}\n              onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}\n              placeholder=\"e.g. Jordan Rivera\"\n              invalid={false}\n            />\n          </div>\n          <div>\n            <label className=\"block text-xs font-medium text-gray-700 mb-1\">Email (optional)</label>\n            <Input\n              value={candidate.email}\n              onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}\n              placeholder=\"candidate@company.com\"\n              type=\"email\"\n            />\n          </div>\n        </div>\n        {!canStart && (\n          <p className=\"text-xs text-amber-600 mt-2\">A name is required to start an exam.</p>\n        )}\n      </Card>\n\n      {history.length > 0 && (\n        <Card className=\"p-5\">\n          <div className=\"flex items-center justify-between mb-3\">\n            <h3 className=\"text-sm font-semibold text-gray-900\">Recent Attempts</h3>\n            <div className=\"flex gap-2\">\n              <Button variant=\"ghost\" onClick={onShowHistory}>History</Button>\n              <Button variant=\"ghost\" onClick={onShowCompare}>Recruiter Compare</Button>\n              <Button variant=\"ghost\" onClick={onClearHistory}>Clear</Button>\n            </div>\n          </div>\n          <div className=\"space-y-2\">\n            {history.slice(0, 3).map((h) => (\n              <button\n                key={h.attemptId}\n                onClick={() => onViewHistory(h)}\n                className=\"w-full flex items-center justify-between text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-gray-50 transition-colors\"\n              >\n                <div>\n                  <div className=\"text-sm font-medium text-gray-900\">{h.candidate} · {h.examTitle}</div>\n                  <div className=\"text-xs text-gray-500\">\n                    {new Date(h.takenAt).toLocaleString()} · {fmtDuration(h.elapsedSeconds)}\n                    {h.timedOut && \" · timed out\"}\n                    {h.tabSwitches > 0 && ` · ${h.tabSwitches} tab switches`}\n                  </div>\n                </div>\n                <div className=\"flex items-center gap-2\">\n                  <span className={`text-sm font-bold ${h.passed ? \"text-green-600\" : \"text-red-600\"}`}>\n                    {h.percentage}%\n                  </span>\n                  <Badge variant={h.passed ? \"default\" : \"destructive\"}>{h.band.band}</Badge>\n                </div>\n              </button>\n            ))}\n          </div>\n        </Card>\n      )}\n\n      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n        {EXAMS.map((exam) => (\n          <Card key={exam.id} className=\"p-5 flex flex-col\">\n            <div className=\"flex items-center justify-between mb-2\">\n              <Badge variant=\"secondary\">{exam.domain}</Badge>\n              <Badge variant=\"outline\">{exam.level}</Badge>\n            </div>\n            <h3 className=\"text-lg font-bold text-gray-900\">{exam.title}</h3>\n            <p className=\"text-sm text-gray-600 mt-2 flex-1\">{exam.description}</p>\n            <div className=\"mt-4 grid grid-cols-3 gap-2 text-center text-xs\">\n              <MiniStat label=\"Questions\" value={exam.questions.length} />\n              <MiniStat label=\"Minutes\" value={exam.durationMinutes} />\n              <MiniStat label=\"Pass\" value={`${exam.passingScore}%`} />\n            </div>\n            <Button className=\"mt-4 w-full\" onClick={() => onPick(exam)} disabled={!canStart}>\n              {canStart ? \"Start Exam\" : \"Enter name to start\"}\n            </Button>\n          </Card>\n        ))}\n      </div>\n    </div>\n  );\n}\n\nfunction HistoryView({\n  history,\n  onView,\n  onBack,\n  onClear,\n}: {\n  history: ExamResult[];\n  onView: (item: ExamResult) => void;\n  onBack: () => void;\n  onClear: () => void;\n}) {\n  return (\n    <div className=\"space-y-6\">\n      <Card className=\"p-6\">\n        <div className=\"flex items-center justify-between flex-wrap gap-3\">\n          <div>\n            <h2 className=\"text-xl font-bold text-gray-900\">Exam History</h2>\n            <p className=\"text-sm text-gray-500 mt-1\">\n              {history.length} attempt{history.length === 1 ? \"\" : \"s\"} stored locally in this browser.\n            </p>\n          </div>\n          <div className=\"flex gap-2\">\n            <Button variant=\"outline\" onClick={onBack}>Back to exams</Button>\n            {history.length > 0 && <Button variant=\"ghost\" onClick={onClear}>Clear all</Button>}\n          </div>\n        </div>\n      </Card>\n\n      {history.length === 0 ? (\n        <Card className=\"p-10 text-center\">\n          <p className=\"text-gray-500\">No attempts yet. Complete an exam to see it here.</p>\n        </Card>\n      ) : (\n        <Card className=\"p-2\">\n          <div className=\"overflow-x-auto\">\n            <table className=\"w-full text-sm\">\n              <thead>\n                <tr className=\"text-left text-xs uppercase tracking-wider text-gray-500 border-b\">\n                  <th className=\"p-3\">Candidate</th>\n                  <th className=\"p-3\">Exam</th>\n                  <th className=\"p-3\">Date</th>\n                  <th className=\"p-3\">Duration</th>\n                  <th className=\"p-3\">Score</th>\n                  <th className=\"p-3\">Band</th>\n                  <th className=\"p-3\">Tabs</th>\n                  <th className=\"p-3\">Result</th>\n                  <th className=\"p-3\"></th>\n                </tr>\n              </thead>\n              <tbody>\n                {history.map((h) => (\n                  <tr key={h.attemptId} className=\"border-b last:border-0 hover:bg-gray-50\">\n                    <td className=\"p-3 font-medium text-gray-900\">{h.candidate}</td>\n                    <td className=\"p-3 text-gray-700\">{h.examTitle}</td>\n                    <td className=\"p-3 text-gray-500\">{new Date(h.takenAt).toLocaleString()}</td>\n                    <td className=\"p-3 text-gray-500\">\n                      {fmtDuration(h.elapsedSeconds)}{h.timedOut && \" ⏱\"}\n                    </td>\n                    <td className=\"p-3 font-semibold text-gray-900\">{h.percentage}%</td>\n                    <td className=\"p-3\">\n                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${gradeColor(h.percentage)}`}>\n                        {h.band.band}\n                      </span>\n                    </td>\n                    <td className=\"p-3\">\n                      <span className={`text-xs font-medium ${h.tabSwitches >= 3 ? \"text-red-600\" : h.tabSwitches > 0 ? \"text-amber-600\" : \"text-gray-400\"}`}>\n                        {h.tabSwitches}\n                      </span>\n                    </td>\n                    <td className=\"p-3\">\n                      <span className={`font-medium ${h.passed ? \"text-green-600\" : \"text-red-600\"}`}>\n                        {h.passed ? \"PASS\" : \"FAIL\"}\n                      </span>\n                    </td>\n                    <td className=\"p-3\">\n                      <Button variant=\"ghost\" onClick={() => onView(h)}>View</Button>\n                    </td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n          </div>\n        </Card>\n      )}\n    </div>\n  );\n}\n\nfunction ResultView({\n  result,\n  exam,\n  onRestart,\n  isHistorical,\n}: {\n  result: ExamResult;\n  exam?: Exam;\n  onRestart: () => void;\n  isHistorical: boolean;\n}) {\n  const answerRecords = result.answers as AnswerRecord[];\n  const skills = useMemo(\n    () =>\n      Object.entries(result.skillBreakdown).sort((a, b) => b[1].pct - a[1].pct),\n    [result],\n  );\n  const weightedPct = useMemo(() => {\n    const earned = answerRecords.reduce((s, r) => s + r.earnedWeight, 0);\n    const max = answerRecords.reduce((s, r) => s + r.maxWeight, 0);\n    return max > 0 ? Math.round((earned / max) * 100) : 0;\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [result]);\n\n  return (\n    <div className=\"space-y-6\">\n      <ExamCertificate result={result} />\n\n      <Card className=\"p-6\">\n        <div className=\"flex items-center justify-between flex-wrap gap-3\">\n          <div>\n            <div className=\"text-xs uppercase tracking-wider text-gray-500\">\n              {isHistorical ? \"Historical Report\" : \"Recruiting Report\"} · {result.domain}\n            </div>\n            <h2 className=\"text-xl font-bold text-gray-900\">{result.examTitle}</h2>\n            <p className=\"text-sm text-gray-600 mt-1\">\n              Candidate: <span className=\"font-medium\">{result.candidate}</span>\n              {result.email && <> · {result.email}</>}\n              <br />\n              Date: {new Date(result.takenAt).toLocaleString()} ·\n              Duration: {fmtDuration(result.elapsedSeconds)}\n              {result.timedOut && <span className=\"text-red-600 font-medium\"> · Timed out (auto-submitted)</span>}\n              {result.tabSwitches > 0 && (\n                <span className={`font-medium ${result.tabSwitches >= 3 ? \"text-red-600\" : \"text-amber-600\"}`}>\n                  {\" · \"}Tab switches: {result.tabSwitches}\n                </span>\n              )}\n            </p>\n          </div>\n          <div className=\"text-center\">\n            <div\n              className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 text-2xl font-bold ${gradeColor(\n                weightedPct,\n              )}`}\n            >\n              {result.band.band}\n            </div>\n            <div className=\"text-xs text-gray-500 mt-1\">{result.band.label}</div>\n          </div>\n        </div>\n\n        <div className=\"mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center\">\n          <BigStat label=\"Score\" value={`${result.correctCount}/${result.total}`} />\n          <BigStat label=\"Raw %\" value={`${result.percentage}%`} />\n          <BigStat label=\"Weighted %\" value={`${weightedPct}%`} />\n          <BigStat\n            label=\"Result\"\n            value={result.passed ? \"PASS\" : \"FAIL\"}\n            highlight={result.passed ? \"text-green-600\" : \"text-red-600\"}\n          />\n        </div>\n        <div className=\"mt-2 text-center text-xs text-gray-500\">\n          Pass mark: {exam?.passingScore ?? 70}% (weighted) · Tab switches: {result.tabSwitches}\n        </div>\n\n        <div className=\"mt-4\">\n          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${gradeColor(weightedPct)}`}>\n            {result.passed\n              ? weightedPct >= 85\n                ? \"Recruiter signal: Strong hire — clear command of the discipline.\"\n                : \"Recruiter signal: Pass — competent practitioner, probe weaker skills.\"\n              : \"Recruiter signal: Below threshold — revisit fundamentals before re-screen.\"}\n          </div>\n        </div>\n      </Card>\n\n      <Card className=\"p-6\">\n        <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Skill Breakdown</h3>\n        <div className=\"space-y-3\">\n          {skills.map(([skill, data]) => (\n            <div key={skill}>\n              <div className=\"flex items-center justify-between text-sm mb-1\">\n                <span className=\"font-medium text-gray-700 capitalize\">{skill.replace(/-/g, \" \")}</span>\n                <span className=\"text-gray-500\">\n                  {data.correct}/{data.total} · {data.pct}%\n                </span>\n              </div>\n              <div className=\"h-2 bg-gray-100 rounded-full overflow-hidden\">\n                <div\n                  className={`h-full transition-all ${\n                    data.pct >= 80 ? \"bg-green-500\" : data.pct >= 60 ? \"bg-indigo-500\" : \"bg-amber-500\"\n                  }`}\n                  style={{ width: `${data.pct}%` }}\n                />\n              </div>\n            </div>\n          ))}\n        </div>\n      </Card>\n\n      {exam && (\n        <Card className=\"p-6\">\n          <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">Answer Review</h3>\n          <div className=\"space-y-4\">\n            {exam.questions.map((q, idx) => {\n              const rec = answerRecords.find((r) => r.questionId === q.id);\n              return (\n                <div key={q.id} className=\"border border-gray-200 rounded-lg p-4\">\n                  <div className=\"flex items-start gap-2\">\n                    <span\n                      className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${\n                        rec?.isCorrect ? \"bg-green-100 text-green-700\" : \"bg-red-100 text-red-700\"\n                      }`}\n                    >\n                      {rec?.isCorrect ? \"✓\" : \"✗\"}\n                    </span>\n                    <div className=\"flex-1\">\n                      <p className=\"text-sm font-medium text-gray-900\">\n                        {idx + 1}. {q.prompt}\n                      </p>\n                      <div className=\"mt-2 space-y-1 text-sm\">\n                        {isNumeric(q) ? (\n                          <>\n                            <div className=\"text-gray-700\">\n                              Your answer:{\" \"}\n                              <span className=\"font-medium\">\n                                {rec && typeof rec.selected === \"number\" && !Number.isNaN(rec.selected)\n                                  ? rec.selected\n                                  : \"—\"}\n                                {q.unit ? ` ${q.unit}` : \"\"}\n                              </span>\n                            </div>\n                            <div className=\"text-green-800\">\n                              Correct: <span className=\"font-medium\">{q.correct} ± {q.tolerance}{q.unit ? ` ${q.unit}` : \"\"}</span>\n                            </div>\n                          </>\n                        ) : isMultiSelect(q) ? (\n                          q.options.map((opt, oIdx) => {\n                            const correctSet = new Set(q.correct);\n                            const isCorrectOpt = correctSet.has(oIdx);\n                            const selArr =\n                              rec && Array.isArray(rec.selected) ? rec.selected : [];\n                            const isSelected = selArr.includes(oIdx);\n                            return (\n                              <div\n                                key={oIdx}\n                                className={`px-2 py-1 rounded flex items-center gap-2 ${\n                                  isCorrectOpt\n                                    ? \"bg-green-50 text-green-800\"\n                                    : isSelected\n                                      ? \"bg-red-50 text-red-800\"\n                                      : \"text-gray-600\"\n                                }`}\n                              >\n                                <span className=\"font-mono text-xs\">\n                                  [{isSelected ? \"x\" : \" \"}]\n                                </span>\n                                <span className=\"font-medium mr-1\">\n                                  {String.fromCharCode(65 + oIdx)}.\n                                </span>\n                                {opt}\n                                {isCorrectOpt && \" (correct)\"}\n                                {isSelected && !isCorrectOpt && \" (your answer)\"}\n                                {!isCorrectOpt && !isSelected && selArr.length === 0 && \" (not answered)\"}\n                              </div>\n                            );\n                          })\n                        ) : (\n                          q.options.map((opt, oIdx) => {\n                            const isCorrectOpt = oIdx === q.correct;\n                            const selNum =\n                              rec && typeof rec.selected === \"number\" ? rec.selected : -1;\n                            const isSelected = oIdx === selNum;\n                            return (\n                              <div\n                                key={oIdx}\n                                className={`px-2 py-1 rounded ${\n                                  isCorrectOpt\n                                    ? \"bg-green-50 text-green-800\"\n                                    : isSelected\n                                      ? \"bg-red-50 text-red-800\"\n                                      : \"text-gray-600\"\n                                }`}\n                              >\n                                <span className=\"font-medium mr-1\">\n                                  {String.fromCharCode(65 + oIdx)}.\n                                </span>\n                                {opt}\n                                {isCorrectOpt && \" (correct)\"}\n                                {isSelected && !isCorrectOpt && \" (your answer)\"}\n                                {!isCorrectOpt && !isSelected && selNum === -1 && \" (not answered)\"}\n                              </div>\n                            );\n                          })\n                        )}\n                      </div>\n                      <p className=\"mt-2 text-xs text-gray-500 italic\">{q.explanation}</p>\n                    </div>\n                  </div>\n                </div>\n              );\n            })}\n          </div>\n        </Card>\n      )}\n\n      <div className=\"flex gap-3 flex-wrap\">\n        <Button onClick={onRestart}>Take Another Exam</Button>\n        <Button variant=\"outline\" onClick={() => window.print()}>\n          Print / Save PDF Report\n        </Button>\n      </div>\n    </div>\n  );\n}\n\nfunction Stat({ label, value }: { label: string; value: number | string }) {\n  return (\n    <div className=\"bg-gray-50 rounded-lg p-3\">\n      <div className=\"text-2xl font-bold text-gray-900\">{value}</div>\n      <div className=\"text-xs text-gray-500\">{label}</div>\n    </div>\n  );\n}\n\nfunction MiniStat({ label, value }: { label: string; value: number | string }) {\n  return (\n    <div className=\"bg-gray-50 rounded-md p-2\">\n      <div className=\"text-sm font-bold text-gray-900\">{value}</div>\n      <div className=\"text-[10px] text-gray-500\">{label}</div>\n    </div>\n  );\n}\n\nfunction BigStat({\n  label,\n  value,\n  highlight,\n}: {\n  label: string;\n  value: string;\n  highlight?: string;\n}) {\n  return (\n    <div className=\"bg-gray-50 rounded-lg p-3\">\n      <div className={`text-xl font-bold ${highlight ?? \"text-gray-900\"}`}>{value}</div>\n      <div className=\"text-xs text-gray-500\">{label}</div>\n    </div>\n  );\n}"
}
```
```output
Wrote file successfully.
```


### [assistant] 2026-07-13T22:11:05.058000+00:00  @glm-5.2


File overwritten. Self-reviewing the critical points before reporting.

**Type narrowing check:** In the runner I branch `isNumeric(q)` → `else if (isMultiSelect(q))` → `else` (mcq/truefalse). Inside each branch TS narrows `q` to the correct union member, so `q.unit`/`q.tolerance`/`q.correct: number[]`/`q.correct: number` are all accessible. Same in the answer review. ✓

**Answers state type:** `Record<string, number | number[]>` — numeric/mcq/truefalse store `number`, multiselect stores `number[]`. `toggleMultiAnswer` and `setNumericAnswer` added; `selectAnswer` unchanged for single-select. ✓

**Refs:** All 7 mirrored including `tabSwitchesRef`, reset in `startExam`/`restart`. ✓

**ExamResult shape:** Imported canonical type from ExamCertificate (uses `answers: unknown[]` there, cast to `AnswerRecord[]` locally via `result.answers as AnswerRecord[]`). Includes `tabSwitches` read from `tabSwitchesRef.current`. ✓

**Unused imports:** `EXAMS, getExam, bandFor, DIFFICULTY_WEIGHT, examMaxWeight, isMultiSelect, isNumeric, type Exam, Question, QuestionType, Difficulty, ExamCertificate, ExamResult, RecruiterCompare, Card, Button, Badge, Input, useEffect, useMemo, useRef, useState` — all used. No `certificateId`/`AttemptSummary`/`attemptToCsvRow`/`SKILL_BANDS` imported. ✓

The file is complete. Summary below.

---

## Report

### 1. File overwritten + 6 upgrade features
`/home/uzer/marketing-hub/src/components/marketing/MarketingTests.tsx` rewritten. All 6 features present:
1. 4 question types in runner (mcq/truefalse single-select, multiselect checkboxes, numeric `Input type="number"` with unit suffix).
2. Adaptive weighted scoring in `computeResult`.
3. Tab-switch anti-cheat (`visibilitychange` + `blur`, live counter, banner at ≥3, in result).
4. `<ExamCertificate result={result} />` rendered above the recruiting report card on results (self-gates fail/pass).
5. New `phase === "compare"` rendering `<RecruiterCompare>`; picker has both "History" and "Recruiter Compare" buttons.
6. Preserved: candidate identity + localStorage, countdown timer + auto-submit + dual progress bars + red <60s, localStorage history (last 100) + recent strip + full history table, all refs + `tabSwitchesRef`, print button, answer review with explanations.

### 2. Answers state type + storage
`Record<string, number | number[]>`. mcq/truefalse/numeric → `number` (via `selectAnswer` / `setNumericAnswer`); multiselect → `number[]` (via `toggleMultiAnswer`, empty array deletes the key so it counts as unanswered). `computeResult` narrows per `q.type` using `isMultiSelect(q)` / `isNumeric(q)`.

### 3. Weighted scoring — partial-credit multiselect block
```ts
if (isMultiSelect(q)) {
  const selectedNums: number[] = Array.isArray(sel) ? sel : [];
  const correctSet = new Set(q.correct);
  const tp = selectedNums.filter((i) => correctSet.has(i)).length;
  const fp = selectedNums.filter((i) => !correctSet.has(i)).length;
  // Partial credit: (true positives − false positives) / correct count,
  // clamped to [0,1]. Full weight only when all correct and no extras.
  const frac = Math.max(0, Math.min(1, (tp - fp) / q.correct.length));
  earnedWeight = frac * maxWeight;
  isCorrect = frac >= 1;
  selectedRec = selectedNums;
  correctRec = q.correct;
}
```
`weightedPercentage = round(earnedWeightSum / examMaxWeight(exam) * 100)`; pass/fail + `bandFor` use `weightedPercentage`; raw `percentage` (correct/total) kept for display.

### 4. Anti-cheat effect
Effect active only when `phase === "running"`: listens to `document` `visibilitychange` (increments when `document.hidden`) and `window` `blur` as backup. Each increment bumps both `tabSwitches` state and `tabSwitchesRef.current` directly, so the timer's stale-closure auto-submit reads the latest count. Live "Tab switches: {n}" header (amber >0, red ≥3) + amber banner at ≥3. `tabSwitches: tabSwitchesRef.current` written into the returned `ExamResult`.

### 5. Certificate + compare wiring
`ResultView` renders `<ExamCertificate result={result} />` first (self-gates failed state). Picker's recent-attempts strip has `History` (→ phase `history`) and `Recruiter Compare` (→ phase `compare`) buttons; `compare` phase renders `<RecruiterCompare history={history} onBack={() => setPhase("picker")} onViewAttempt={(a) => { setViewingHistory(a); setPhase("results"); }} />`.

### 6. `computeResult` body
```ts
const computeResult = (isTimeout: boolean): ExamResult => {
  const exam = activeExamRef.current;
  const qs = shuffledRef.current;
  const ans = answersRef.current;
  const cand = candidateRef.current;
  const start = startTimeRef.current;
  if (!exam) throw new Error("no active exam");
  const breakdown: Record<string, { correct: number; total: number; pct: number }> = {};
  const records: AnswerRecord[] = [];
  let correctCount = 0;
  let earnedWeightSum = 0;
  for (const q of qs) {
    const sel = ans[q.id];
    const maxWeight = DIFFICULTY_WEIGHT[q.difficulty];
    let earnedWeight = 0;
    let isCorrect = false;
    let selectedRec: number | number[];
    let correctRec: number | number[];
    if (isMultiSelect(q)) {
      const selectedNums: number[] = Array.isArray(sel) ? sel : [];
      const correctSet = new Set(q.correct);
      const tp = selectedNums.filter((i) => correctSet.has(i)).length;
      const fp = selectedNums.filter((i) => !correctSet.has(i)).length;
      const frac = Math.max(0, Math.min(1, (tp - fp) / q.correct.length));
      earnedWeight = frac * maxWeight;
      isCorrect = frac >= 1;
      selectedRec = selectedNums;
      correctRec = q.correct;
    } else if (isNumeric(q)) {
      const selNum = typeof sel === "number" ? sel : NaN;
      const ok = !Number.isNaN(selNum) && Math.abs(selNum - q.correct) <= q.tolerance;
      earnedWeight = ok ? maxWeight : 0;
      isCorrect = ok;
      selectedRec = selNum;
      correctRec = q.correct;
    } else {
      const selNum = typeof sel === "number" ? sel : -1;
      const ok = selNum === q.correct;
      earnedWeight = ok ? maxWeight : 0;
      isCorrect = ok;
      selectedRec = selNum;
      correctRec = q.correct;
    }
    earnedWeightSum += earnedWeight;
    if (isCorrect) correctCount++;
    records.push({
      questionId: q.id,
      type: q.type,
      selected: selectedRec,
      correct: correctRec,
      skill: q.skill,
      difficulty: q.difficulty,
      isCorrect,
      earnedWeight,
      maxWeight,
    });
    if (!breakdown[q.skill]) breakdown[q.skill] = { correct: 0, total: 0, pct: 0 };
    breakdown[q.skill]!.total += 1;
    if (isCorrect) breakdown[q.skill]!.correct += 1;
  }
  for (const k of Object.keys(breakdown)) {
    const b = breakdown[k]!;
    b.pct = Math.round((b.correct / b.total) * 100);
  }
  const total = qs.length;
  const percentage = Math.round((correctCount / total) * 100);
  const maxWeight = examMaxWeight(exam);
  const weightedPercentage = maxWeight > 0 ? Math.round((earnedWeightSum / maxWeight) * 100) : 0;
  return {
    attemptId: `${exam.id}-${Date.now()}`,
    examId: exam.id,
    examTitle: exam.title,
    domain: exam.domain,
    score: correctCount,
    total,
    correctCount,
    percentage,
    passed: weightedPercentage >= exam.passingScore,
    band: bandFor(weightedPercentage),
    skillBreakdown: breakdown,
    answers: records,
    candidate: cand.name.trim(),
    email: cand.email.trim(),
    elapsedSeconds: Math.round((Date.now() - start) / 1000),
    timedOut: isTimeout,
    tabSwitches: tabSwitchesRef.current,
    takenAt: Date.now(),
  };
};
```

Note: `ExamResult` is the canonical type imported from `ExamCertificate` (which declares `answers: unknown[]`); locally I cast `result.answers as AnswerRecord[]` in `ResultView` to read `earnedWeight`/`maxWeight` for the weighted-% display without redefining the canonical type. `RecruiterCompare` is imported per spec (built in parallel) — once that file exists, `tsc --strict` will resolve cleanly.

