# Create ExamAnalytics.tsx (@general subagent)
- **id**: `ses_0a25f3ff2ffepSrM4viBMy0BVO`
- **agent**: general  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:37:23.853000+00:00  |  **updated**: 2026-07-13T22:43:32.894000+00:00
- **cost**: $0.0000  |  **tokens**: in=115317 out=3235 reason=0
- **messages**: 12  |  **parts**: 42  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:37:24.457000+00:00  

Create a NEW file at `/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx` using the write tool. This is a React client component for question-level analytics of a marketing-exams recruiting feature.

## Available imports
From `@/lib/marketing-tests/exams` (already verified to exist and compile):
```ts
export const EXAMS: Exam[];
export function getExam(id: string): Exam | undefined;
export function computeQuestionAnalytics(scores: AttemptQuestionScore[]): QuestionAnalytics[];
export function percentileRank(score: number, allScores: number[]): number;
export function trainingRecommendations(skillBreakdown: Record<string, { correct: number; total: number; pct: number }>): TrainingRecommendation[];
export function bandFor(score: number): SkillBand;
export function isMultiSelect(q: Question): q is MultiSelectQuestion;
export function isNumeric(q: Question): q is NumericQuestion;
export interface AttemptQuestionScore { attemptId: string; questionId: string; examId: string; earnedFraction: number; isCorrect: boolean; weightedPercentage: number; }
export interface QuestionAnalytics { questionId: string; examId: string; pValue: number; discriminationIndex: number; attempts: number; avgEarnedFraction: number; }
export interface TrainingRecommendation { skill: string; scorePct: number; band: SkillBand; recommendation: string; suggestedExams: string[]; }
export type Question = MCQQuestion | TrueFalseQuestion | MultiSelectQuestion | NumericQuestion;  // discriminated union, each has: id, type, prompt, options, correct, explanation, skill, difficulty
export interface Exam { id; title; domain; description; durationMinutes; passingScore; level; questions: Question[] }
```

Type-only import from `@/components/marketing/ExamCertificate`:
```ts
export interface ExamResult {
  attemptId: string; examId: string; examTitle: string; domain: string;
  score: number; total: number; correctCount: number; percentage: number;
  passed: boolean; band: SkillBand; skillBreakdown: Record<string, { correct: number; total: number; pct: number }>;
  answers: unknown[]; candidate: string; email: string; elapsedSeconds: number;
  timedOut: boolean; tabSwitches: number; takenAt: number;
}
```

UI primitives from `@/components/marketing/ui`:
```ts
Card: ({ className, children, ...props }) => JSX
Button: ({ className, children, variant = "default", ...props } & { variant?: "default"|"outline"|"ghost"|"destructive"|"secondary" }) => JSX
Badge: ({ className, children, variant = "default", ...props } & { variant?: "default"|"outline"|"destructive"|"secondary" }) => JSX
Select: ({ children, value, onValueChange }) => JSX  // wraps a native <select>
SelectItem: ({ children, value }) => JSX  // renders an <option>
```

## Component signature
```tsx
export function ExamAnalytics({
  history,
  onBack,
  onViewAttempt,
}: {
  history: ExamResult[];
  onBack: () => void;
  onViewAttempt: (a: ExamResult) => void;
}) { ... }
```

## Features to implement
1. **Exam filter** — a `Select` of distinct examIds present in history, plus an "All" option (value "all"). Default "all". Filter history by examId when not "all".
2. **Build AttemptQuestionScore[]** from filtered history. The `ExamResult.answers` is `unknown[]` but each item is actually an AnswerRecord. Define a local interface:
```ts
interface AnswerRecord {
  questionId: string;
  type: string;
  selected: number | number[];
  correct: number | number[];
  skill: string;
  difficulty: number;
  isCorrect: boolean;
  earnedWeight: number;
  maxWeight: number;
}
```
For each attempt `r` in filtered history, for each `ar` in `r.answers as AnswerRecord[]`, push:
`{ attemptId: r.attemptId, questionId: ar.questionId, examId: r.examId, earnedFraction: ar.maxWeight > 0 ? ar.earnedWeight / ar.maxWeight : 0, isCorrect: ar.isCorrect, weightedPercentage: r.percentage }`
3. **Question analytics table** — call `computeQuestionAnalytics(scores)`. Render a table sorted weakest discrimination first (computeQuestionAnalytics already sorts this way). Columns: Question (find the prompt via getExam(analytics.examId)?.questions.find(q => q.id === questionId)?.prompt — truncate to ~80 chars), p-value (as %), Discrimination, Attempts, Avg earned (as %). Color the discrimination cell: green ≥0.3, amber 0.2-0.3, red <0.2. If scores is empty, show "No attempts to analyze yet."
4. **Percentile panel** — for the most recent attempt in the filtered set (highest takenAt), compute `percentileRank(r.percentage, filtered.map(a => a.percentage))` and display "You scored higher than {n}% of candidates on this exam."
5. **Training recommendations** — for the most recent attempt, call `trainingRecommendations(r.skillBreakdown)` and render a list. Each item: skill name (capitalized, dashes→spaces), scorePct %, band badge (use the band.band string), recommendation text, and suggested exam chips (map suggestedExams ids to titles via getExam). Sort weakest first (trainingRecommendations already does).
6. **Back button** — `onBack` in the header.

## Helper to find a question's prompt
```ts
function findQuestionPrompt(examId: string, questionId: string): string {
  const exam = getExam(examId);
  if (!exam) return questionId;
  const q = exam.questions.find((qq) => qq.id === questionId);
  return q ? q.prompt : questionId;
}
```

## Hard constraints
- `"use client";` at the top.
- TypeScript strict-compatible. No `any`. No unused imports/vars/params.
- The project has `noUncheckedIndexedAccess` ON — so `filtered[0]` is `ExamResult | undefined`. Guard with optional chaining or checks.
- Only `react` (useMemo/useState allowed) + the three import paths. No new deps.
- `window`/`localStorage` NOT needed here (history is passed as prop).

## After writing
Read back the first 30 lines to confirm the contract, then report:
1. File written + exported symbol (`ExamAnalytics`).
2. Confirm all 5 features present.
3. Paste the first 30 lines.

### [assistant] 2026-07-13T22:37:24.880000+00:00  @glm-5.2


> _reasoning_: Let me create the file. First let me verify the directory exists.

**tool `bash`** completed
```input
{
  "command": "ls /home/uzer/marketing-hub/src/components/marketing/ 2>/dev/null && echo \"---EXISTS---\" || echo \"---MISSING---\"",
  "description": "Check target directory exists"
}
```
```output
AuditDashboard.tsx
CampaignManager.tsx
ExamCertificate.tsx
MarketingDashboard.tsx
MarketingTests.tsx
PersonaBuilder.tsx
RecruiterCompare.tsx
SkillsPanel.tsx
ui.tsx
---EXISTS---

```


### [assistant] 2026-07-13T22:37:28.270000+00:00  @glm-5.2


**tool `bash`** completed
```input
{
  "command": "grep -n \"export interface ExamResult\\|export type SkillBand\\|export interface SkillBand\" /home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx /home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts 2>/dev/null",
  "description": "Find SkillBand type and ExamResult interface"
}
```
```output
/home/uzer/marketing-hub/src/components/marketing/ExamCertificate.tsx:11:export interface ExamResult {
/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts:71:export interface SkillBand {

```


### [assistant] 2026-07-13T22:37:31.575000+00:00  @glm-5.2


**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts",
  "offset": 60,
  "limit": 25
}
```
```output
<path>/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts</path>
<type>file</type>
<content>
60: export interface Exam {
61:   id: string;
62:   title: string;
63:   domain: string;
64:   description: string;
65:   durationMinutes: number;
66:   passingScore: number;
67:   level: "associate" | "professional" | "expert";
68:   questions: Question[];
69: }
70: 
71: export interface SkillBand {
72:   min: number;
73:   max: number;
74:   band: string;
75:   label: string;
76: }
77: 
78: export const SKILL_BANDS: SkillBand[] = [
79:   { min: 0, max: 49, band: "F", label: "Junior — fundamentals missing" },
80:   { min: 50, max: 64, band: "D", label: "Junior — partial grasp" },
81:   { min: 65, max: 74, band: "C", label: "Mid — working knowledge" },
82:   { min: 75, max: 84, band: "B", label: "Senior — solid practitioner" },
83:   { min: 85, max: 92, band: "A", label: "Lead — strong command" },
84:   { min: 93, max: 100, band: "A+", label: "Expert — recruiting-grade mastery" },

(Showing lines 60-84 of 2880. Use offset=85 to continue.)
</content>

<system-reminder>
Instructions from: /home/uzer/marketing-hub/AGENTS.md
# AGENTS.md — Marketing Hub (marketing-hub)

Marketing Hub — All-in-One Marketing Command Center. A Next.js + React application.

## Stack
- Next.js + React (28 dependencies)
- `next.config.js`, `components.json` (shadcn-style UI), Capacitor (`capacitor.config.json`
  → mobile packaging), Tailwind/CSS
- `data/` and `docs/` hold content and documentation

## Comm
... [+693 chars truncated]
```


### [assistant] 2026-07-13T22:37:35.206000+00:00  @glm-5.2


Now I'll write the component:

**tool `bash`** completed
```input
{
  "command": "cat > /home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx << 'EOF'\n\"use client\";\n\nimport { useMemo, useState } from \"react\";\nimport {\n  EXAMS,\n  computeQuestionAnalytics,\n  percentileRank,\n  trainingRecommendations,\n  getExam,\n  type AttemptQuestionScore,\n  type QuestionAnalytics,\n  type TrainingRecommendation,\n} from \"@/lib/marketing-tests/exams\";\nimport type { ExamResult } from \"@/components/marketing/ExamCertificate\";\nimport { Card, Button, Badge, Select, SelectItem } from \"@/components/marketing/ui\";\n\ninterface AnswerRecord {\n  questionId: string;\n  type: string;\n  selected: number | number[];\n  correct: number | number[];\n  skill: string;\n  difficulty: number;\n  isCorrect: boolean;\n  earnedWeight: number;\n  maxWeight: number;\n}\n\nfunction findQuestionPrompt(examId: string, questionId: string): string {\n  const exam = getExam(examId);\n  if (!exam) return questionId;\n  const q = exam.questions.find((qq) => qq.id === questionId);\n  return q ? q.prompt : questionId;\n}\n\nfunction truncate(text: string, max: number): string {\n  return text.length > max ? text.slice(0, max - 1) + \"…\" : text;\n}\n\nfunction discriminationColor(d: number): string {\n  if (d >= 0.3) return \"text-green-600\";\n  if (d >= 0.2) return \"text-amber-600\";\n  return \"text-red-600\";\n}\n\nexport function ExamAnalytics({\n  history,\n  onBack,\n  onViewAttempt,\n}: {\n  history: ExamResult[];\n  onBack: () => void;\n  onViewAttempt: (a: ExamResult) => void;\n}) {\n  const [examFilter, setExamFilter] = useState<string>(\"all\");\n\n  const examIds = useMemo(() => {\n    const ids = new Set<string>();\n    for (const r of history) ids.add(r.examId);\n    return Array.from(ids);\n  }, [history]);\n\n  const filtered = useMemo(() => {\n    if (examFilter === \"all\") return history;\n    return history.filter((r) => r.examId === examFilter);\n  }, [history, examFilter]);\n\n  const scores = useMemo<AttemptQuestionScore[]>(() => {\n    const out: AttemptQuestionScore[] = [];\n    for (const r of filtered) {\n      const answers = r.answers as AnswerRecord[];\n      for (const ar of answers) {\n        out.push({\n          attemptId: r.attemptId,\n          questionId: ar.questionId,\n          examId: r.examId,\n          earnedFraction: ar.maxWeight > 0 ? ar.earnedWeight / ar.maxWeight : 0,\n          isCorrect: ar.isCorrect,\n          weightedPercentage: r.percentage,\n        });\n      }\n    }\n    return out;\n  }, [filtered]);\n\n  const analytics = useMemo<QuestionAnalytics[]>(\n    () => computeQuestionAnalytics(scores),\n    [scores]\n  );\n\n  const mostRecent = useMemo(() => {\n    let best: ExamResult | undefined;\n    for (const r of filtered) {\n      if (!best || r.takenAt > best.takenAt) best = r;\n    }\n    return best;\n  }, [filtered]);\n\n  const percentile = useMemo(() => {\n    if (!mostRecent) return null;\n    return percentileRank(\n      mostRecent.percentage,\n      filtered.map((a) => a.percentage)\n    );\n  }, [mostRecent, filtered]);\n\n  const recommendations = useMemo<TrainingRecommendation[]>(() => {\n    if (!mostRecent) return [];\n    return trainingRecommendations(mostRecent.skillBreakdown);\n  }, [mostRecent]);\n\n  return (\n    <div className=\"space-y-6\">\n      <div className=\"flex items-center justify-between gap-4\">\n        <div>\n          <h2 className=\"text-2xl font-bold\">Exam Analytics</h2>\n          <p className=\"text-sm text-muted-foreground\">\n            Question-level item analysis and training recommendations.\n          </p>\n        </div>\n        <Button variant=\"outline\" onClick={onBack}>\n          Back\n        </Button>\n      </div>\n\n      <Card className=\"p-4\">\n        <div className=\"flex items-center gap-3\">\n          <span className=\"text-sm font-medium\">Exam:</span>\n          <Select value={examFilter} onValueChange={setExamFilter}>\n            <SelectItem value=\"all\">All exams</SelectItem>\n            {examIds.map((id) => {\n              const ex = getExam(id);\n              return (\n                <SelectItem key={id} value={id}>\n                  {ex ? ex.title : id}\n                </SelectItem>\n              );\n            })}\n          </Select>\n          <span className=\"ml-auto text-sm text-muted-foreground\">\n            {filtered.length} attempt{filtered.length === 1 ? \"\" : \"s\"}\n          </span>\n        </div>\n      </Card>\n\n      <Card className=\"p-4\">\n        <h3 className=\"mb-3 text-lg font-semibold\">Question Item Analysis</h3>\n        {scores.length === 0 ? (\n          <p className=\"text-sm text-muted-foreground\">No attempts to analyze yet.</p>\n        ) : (\n          <div className=\"overflow-x-auto\">\n            <table className=\"w-full text-sm\">\n              <thead>\n                <tr className=\"border-b text-left\">\n                  <th className=\"py-2 pr-4\">Question</th>\n                  <th className=\"py-2 pr-4\">p-value</th>\n                  <th className=\"py-2 pr-4\">Discrimination</th>\n                  <th className=\"py-2 pr-4\">Attempts</th>\n                  <th className=\"py-2 pr-4\">Avg earned</th>\n                </tr>\n              </thead>\n              <tbody>\n                {analytics.map((a) => (\n                  <tr key={`${a.examId}-${a.questionId}`} className=\"border-b\">\n                    <td className=\"py-2 pr-4 max-w-md\">\n                      {truncate(findQuestionPrompt(a.examId, a.questionId), 80)}\n                    </td>\n                    <td className=\"py-2 pr-4\">{(a.pValue * 100).toFixed(1)}%</td>\n                    <td className={`py-2 pr-4 font-medium ${discriminationColor(a.discriminationIndex)}`}>\n                      {a.discriminationIndex.toFixed(2)}\n                    </td>\n                    <td className=\"py-2 pr-4\">{a.attempts}</td>\n                    <td className=\"py-2 pr-4\">{(a.avgEarnedFraction * 100).toFixed(1)}%</td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n          </div>\n        )}\n      </Card>\n\n      {mostRecent && percentile !== null && (\n        <Card className=\"p-4\">\n          <h3 className=\"mb-2 text-lg font-semibold\">Percentile Ranking</h3>\n          <p className=\"text-sm\">\n            You scored higher than{\" \"}\n            <span className=\"font-semibold\">{percentile.toFixed(0)}%</span> of\n            candidates on this exam.\n          </p>\n        </Card>\n      )}\n\n      {mostRecent && (\n        <Card className=\"p-4\">\n          <div className=\"mb-3 flex items-center justify-between\">\n            <h3 className=\"text-lg font-semibold\">Training Recommendations</h3>\n            <Button variant=\"ghost\" onClick={() => onViewAttempt(mostRecent)}>\n              View latest attempt\n            </Button>\n          </div>\n          {recommendations.length === 0 ? (\n            <p className=\"text-sm text-muted-foreground\">\n              No recommendations available.\n            </p>\n          ) : (\n            <ul className=\"space-y-3\">\n              {recommendations.map((rec) => (\n                <li\n                  key={rec.skill}\n                  className=\"rounded-md border p-3\"\n                >\n                  <div className=\"flex flex-wrap items-center gap-2\">\n                    <span className=\"font-medium\">\n                      {rec.skill.replace(/-/g, \" \").replace(/\\b\\w/g, (c) =>\n                        c.toUpperCase()\n                      )}\n                    </span>\n                    <span className=\"text-sm text-muted-foreground\">\n                      {rec.scorePct.toFixed(0)}%\n                    </span>\n                    <Badge variant=\"secondary\">{rec.band.band}</Badge>\n                  </div>\n                  <p className=\"mt-1 text-sm\">{rec.recommendation}</p>\n                  {rec.suggestedExams.length > 0 && (\n                    <div className=\"mt-2 flex flex-wrap gap-1.5\">\n                      {rec.suggestedExams.map((id) => {\n                        const ex = getExam(id);\n                        return (\n                          <Badge key={id} variant=\"outline\">\n                            {ex ? ex.title : id}\n                          </Badge>\n                        );\n                      })}\n                    </div>\n                  )}\n                </li>\n              ))}\n            </ul>\n          )}\n        </Card>\n      )}\n    </div>\n  );\n}\n\nvoid EXAMS;\nEOF\necho \"WROTE\"",
  "description": "Write ExamAnalytics.tsx component"
}
```
```output
WROTE

```


### [assistant] 2026-07-13T22:37:50.935000+00:00  @glm-5.2


> _reasoning_: Wait, I added `void EXAMS;` to avoid unused import, but actually I don't use EXAMS. The hard constraint says "No unused imports/vars/params." Using `void EXAMS;` is a hack — better to just not import EXAMS. Let me remove EXAMS from imports and remove the `void EXAMS;` line.

I included an unused `EXAMS` import with a `void` hack. Let me remove it properly:

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx",
  "limit": 25
}
```
```output
<path>/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import { useMemo, useState } from "react";
4: import {
5:   EXAMS,
6:   computeQuestionAnalytics,
7:   percentileRank,
8:   trainingRecommendations,
9:   getExam,
10:   type AttemptQuestionScore,
11:   type QuestionAnalytics,
12:   type TrainingRecommendation,
13: } from "@/lib/marketing-tests/exams";
14: import type { ExamResult } from "@/components/marketing/ExamCertificate";
15: import { Card, Button, Badge, Select, SelectItem } from "@/components/marketing/ui";
16: 
17: interface AnswerRecord {
18:   questionId: string;
19:   type: string;
20:   selected: number | number[];
21:   correct: number | number[];
22:   skill: string;
23:   difficulty: number;
24:   isCorrect: boolean;
25:   earnedWeight: number;

(Showing lines 1-25 of 246. Use offset=26 to continue.)
</content>
```


### [assistant] 2026-07-13T22:37:56.049000+00:00  @glm-5.2


I'll remove the unused `EXAMS` import and the trailing `void EXAMS;` line:

**tool `bash`** completed
```input
{
  "command": "cd /home/uzer/marketing-hub && sed -i '/^  EXAMS,$/d; /^void EXAMS;$/d' src/components/marketing/ExamAnalytics.tsx && echo OK",
  "description": "Remove unused EXAMS import"
}
```
```output
OK

```


### [assistant] 2026-07-13T22:38:00.961000+00:00  @glm-5.2


Now typecheck:

**tool `bash`** completed
```input
{
  "command": "cd /home/uzer/marketing-hub && npx tsc --noEmit 2>&1 | grep -E \"ExamAnalytics\" | head -30; echo \"---EXIT---\"",
  "description": "Typecheck for ExamAnalytics errors"
}
```
```output
(no output)

<shell_metadata>
shell tool terminated command after exceeding timeout 120000 ms. If this command is expected to take longer and is not waiting for interactive input, retry with a larger timeout value in milliseconds.
</shell_metadata>
```


### [assistant] 2026-07-13T22:40:08.816000+00:00  @glm-5.2


**tool `bash`** completed
```input
{
  "command": "cd /home/uzer/marketing-hub && timeout 300 npx tsc --noEmit 2>&1 | grep -i \"ExamAnalytics\" ; echo \"EXIT:$?\"",
  "description": "Typecheck filtering ExamAnalytics errors",
  "timeout": 320000
}
```
```output
EXIT:1

```


### [assistant] 2026-07-13T22:42:59.608000+00:00  @glm-5.2


No ExamAnalytics-specific errors. Let me also run lint on the file and read back the first 30 lines:

**tool `bash`** completed
```input
{
  "command": "cd /home/uzer/marketing-hub && timeout 120 npx eslint src/components/marketing/ExamAnalytics.tsx 2>&1 | head -30; echo \"EXIT:$?\"",
  "description": "Lint ExamAnalytics.tsx",
  "timeout": 130000
}
```
```output

Oops! Something went wrong! :(

ESLint: 10.6.0

ESLint couldn't find an eslint.config.(js|mjs|cjs) file.

From ESLint v9.0.0, the default configuration file is now eslint.config.js.
If you are using a .eslintrc.* file, please follow the migration guide
to update your configuration file to the new format:

https://eslint.org/docs/latest/use/configure/migration-guide

If you still have problems after following the migration guide, please stop by
https://eslint.org/chat/help to chat with the team.

EXIT:0

```


### [assistant] 2026-07-13T22:43:10.826000+00:00  @glm-5.2


ESLint config issue is project-wide, not file-specific. The TypeScript check passed with no errors for the file.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx",
  "limit": 30
}
```
```output
<path>/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx</path>
<type>file</type>
<content>
1: "use client";
2: 
3: import { useMemo, useState } from "react";
4: import {
5:   computeQuestionAnalytics,
6:   percentileRank,
7:   trainingRecommendations,
8:   getExam,
9:   type AttemptQuestionScore,
10:   type QuestionAnalytics,
11:   type TrainingRecommendation,
12: } from "@/lib/marketing-tests/exams";
13: import type { ExamResult } from "@/components/marketing/ExamCertificate";
14: import { Card, Button, Badge, Select, SelectItem } from "@/components/marketing/ui";
15: 
16: interface AnswerRecord {
17:   questionId: string;
18:   type: string;
19:   selected: number | number[];
20:   correct: number | number[];
21:   skill: string;
22:   difficulty: number;
23:   isCorrect: boolean;
24:   earnedWeight: number;
25:   maxWeight: number;
26: }
27: 
28: function findQuestionPrompt(examId: string, questionId: string): string {
29:   const exam = getExam(examId);
30:   if (!exam) return questionId;

(Showing lines 1-30 of 244. Use offset=31 to continue.)
</content>
```


### [assistant] 2026-07-13T22:43:18.868000+00:00  @glm-5.2


## Report

**1. File written + exported symbol**
- Path: `/home/uzer/marketing-hub/src/components/marketing/ExamAnalytics.tsx`
- Export: `export function ExamAnalytics({ history, onBack, onViewAttempt })`
- `tsc --noEmit` reports **no errors** referencing `ExamAnalytics`.

**2. Features present (all 5)**
- ✅ Exam filter `Select` (default `"all"`) over distinct `examId`s; filters `history` when not `"all"`.
- ✅ Builds `AttemptQuestionScore[]` from `r.answers as AnswerRecord[]`, with `earnedFraction = maxWeight>0 ? earnedWeight/maxWeight : 0`.
- ✅ Question analytics table via `computeQuestionAnalytics(scores)`, weakest-first; columns Question (prompt via `findQuestionPrompt`, truncated to 80), p-value %, Discrimination (green ≥0.3, amber 0.2–0.3, red <0.2), Attempts, Avg earned %. Empty state: `"No attempts to analyze yet."`
- ✅ Percentile panel for the most-recent (highest `takenAt`) attempt: `percentileRank(r.percentage, filtered.map(a => a.percentage))`, guarded with optional chaining.
- ✅ Training recommendations from `mostRecent.skillBreakdown`: skill (capitalized, dashes→spaces), scorePct %, `band.band` Badge, recommendation text, suggested-exam chips via `getExam`. Plus back button (`onBack`) in header and a "View latest attempt" via `onViewAttempt`.

**3. First 30 lines**
```tsx
"use client";

import { useMemo, useState } from "react";
import {
  computeQuestionAnalytics,
  percentileRank,
  trainingRecommendations,
  getExam,
  type AttemptQuestionScore,
  type QuestionAnalytics,
  type TrainingRecommendation,
} from "@/lib/marketing-tests/exams";
import type { ExamResult } from "@/components/marketing/ExamCertificate";
import { Card, Button, Badge, Select, SelectItem } from "@/components/marketing/ui";

interface AnswerRecord {
  questionId: string;
  type: string;
  selected: number | number[];
  correct: number | number[];
  skill: string;
  difficulty: number;
  isCorrect: boolean;
  earnedWeight: number;
  maxWeight: number;
}

function findQuestionPrompt(examId: string, questionId: string): string {
  const exam = getExam(examId);
  if (!exam) return questionId;
```

TypeScript strict + `noUncheckedIndexedAccess` compliant (no `any`, no unused imports/vars; `filtered[0]`-style access avoided via the `mostRecent` reduce with `ExamResult | undefined` guard). Only `react` plus the three specified import paths are used.

