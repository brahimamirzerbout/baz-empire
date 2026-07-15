# Extend exams.ts with proctoring/analytics helpers (@general subagent)
- **id**: `ses_0a26748afffeR6Y30Ici1ObXVv`
- **agent**: general  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:28:37.330000+00:00  |  **updated**: 2026-07-13T22:29:01.812000+00:00
- **cost**: $0.0000  |  **tokens**: in=20108 out=1858 reason=0
- **messages**: 3  |  **parts**: 11  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:28:37.940000+00:00  

You are EXTENDING (not rewriting) a TypeScript data file in a Next.js marketing-hub project. This is round 3 of a "push to the limit" expansion of a recruiting-grade marketing-exams feature.

## File to edit
`/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts`

The file is 2594 lines. Lines 1-165 are the type contract + helpers. Lines 167-2590 are the `EXAMS` array (12 exams, 148 questions — DO NOT TOUCH THIS ARRAY). Lines 2592-2594 are `getExam`.

## DO NOT
- Do NOT modify the `EXAMS` array or any existing question/exam.
- Do NOT modify existing exported interfaces/types/functions (`QuestionType`, `Difficulty`, `MCQQuestion`, `TrueFalseQuestion`, `MultiSelectQuestion`, `NumericQuestion`, `Question`, `Exam`, `SkillBand`, `SKILL_BANDS`, `bandFor`, `DIFFICULTY_WEIGHT`, `examMaxWeight`, `isMultiSelect`, `isNumeric`, `AttemptSummary`, `ATTEMPT_CSV_HEADER`, `attemptToCsvRow`, `certificateId`, `getExam`).
- Do NOT add React/next/DOM imports or use `window`/`localStorage`. Pure TS only.
- No `any`. Must compile under `tsc --strict` with `noUnusedLocals`/`noUnusedParameters`.

## What to ADD — insert these new exports

### A) Insert a new block IMMEDIATELY AFTER line 165 (after `certificateId`, before `export const EXAMS`) — option/answer shuffle helpers:

```ts
// ── Option & question shuffling (anti-cheat: randomize option order) ──

// Returns a new options array + a mapping from newIdx -> originalIdx,
// so the caller can translate the candidate's selected newIdx back to the
// original correct index. For numeric questions (options: []) returns identity.
export function shuffleOptions(q: Question, rng: () => number = Math.random): { options: string[]; indexMap: number[] } {
  if (q.type === "numeric") return { options: [], indexMap: [] };
  const orig = q.options;
  const idx = orig.map((_, i) => i);
  // Fisher-Yates with provided rng
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = idx[i]!; idx[i] = idx[j]!; idx[j] = tmp;
  }
  // indexMap[newIdx] = originalIdx
  const indexMap = idx;
  const options = idx.map((i) => orig[i]!);
  return { options, indexMap };
}

// Given a shuffled indexMap and the candidate's selected new index/indices,
// translate back to ORIGINAL indices. For multiselect, maps the array.
export function unshuffleAnswer(selected: number | number[], indexMap: number[]): number | number[] {
  if (Array.isArray(selected)) return selected.map((s) => indexMap[s] ?? s);
  return indexMap[selected] ?? selected;
}
```

### B) Insert AFTER `getExam` (at end of file) — these new exports:

```ts
// ── Custom exam builder ──
// A custom exam is assembled from the existing question pool by domain/difficulty/ids.

export interface CustomExamSpec {
  title: string;
  description: string;
  passingScore: number;
  durationMinutes: number;
  // Choose any combination of filters; all present filters are AND-ed.
  domains?: string[];          // subset of Exam.domain
  levels?: Array<"associate" | "professional" | "expert">;
  difficulties?: Difficulty[];
  skills?: string[];           // subset of Question.skill
  ids?: string[];              // explicit question ids (highest priority)
  maxQuestions?: number;       // cap; defaults to all matching
  seed?: number;               // deterministic shuffle seed for reproducible selection
}

// Seeded RNG (mulberry32) for deterministic selection.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildCustomExam(spec: CustomExamSpec): Exam {
  const pool: Question[] = [];
  for (const exam of EXAMS) {
    for (const q of exam.questions) {
      if (spec.domains && !spec.domains.includes(exam.domain)) continue;
      if (spec.levels && !spec.levels.includes(exam.level)) continue;
      if (spec.difficulties && !spec.difficulties.includes(q.difficulty)) continue;
      if (spec.skills && !spec.skills.includes(q.skill)) continue;
      if (spec.ids && !spec.ids.includes(q.id)) continue;
      pool.push(q);
    }
  }
  const rng = spec.seed != null ? mulberry32(spec.seed) : Math.random;
  // shuffle pool deterministically
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i]!; pool[i] = pool[j]!; pool[j] = tmp;
  }
  const max = spec.maxQuestions != null ? spec.maxQuestions : pool.length;
  const chosen = pool.slice(0, Math.min(max, pool.length));
  const id = `custom-${fnv1aHex(spec.title + JSON.stringify(spec))}`;
  // infer domain from the first chosen question's exam domain, else "Custom"
  const domain = chosen.length > 0
    ? (EXAMS.find((e) => e.questions.includes(chosen[0]!))?.domain ?? "Custom")
    : "Custom";
  const level: Exam["level"] = spec.levels && spec.levels.length === 1 ? spec.levels[0] : "professional";
  return {
    id,
    title: spec.title,
    domain,
    description: spec.description,
    durationMinutes: spec.durationMinutes,
    passingScore: spec.passingScore,
    level,
    questions: chosen,
  };
}

// All distinct skills across the question pool (for the builder UI).
export function allSkills(): string[] {
  const set = new Set<string>();
  for (const exam of EXAMS) for (const q of exam.questions) set.add(q.skill);
  return Array.from(set).sort();
}

// All distinct domains across EXAMS.
export function allDomains(): string[] {
  return Array.from(new Set(EXAMS.map((e) => e.domain))).sort();
}

// ── Per-question analytics + difficulty/discrimination index ──

export interface QuestionAnalytics {
  questionId: string;
  examId: string;
  // p-value: fraction of attempts that got this question (fully) correct.
  pValue: number;
  // discrimination index: (correctRate in top scorers) − (correctRate in bottom scorers).
  // Range [-1, 1]; >0.3 is good, <0.2 is weak, <0 is a red flag.
  discriminationIndex: number;
  attempts: number;
  avgEarnedFraction: number;   // weighted by partial credit, [0,1]
}

// Each attempt's per-question correctness. The caller passes a normalized view
// so this function stays pure (no React/DOM).
export interface AttemptQuestionScore {
  questionId: string;
  earnedFraction: number;  // [0,1] partial credit earned
  isCorrect: boolean;
  weightedPercentage: number; // the attempt's overall weighted %
}

export function computeQuestionAnalytics(scores: AttemptQuestionScore[]): QuestionAnalytics[] {
  if (scores.length === 0) return [];
  // group by question
  const byQ = new Map<string, AttemptQuestionScore[]>();
  for (const s of scores) {
    const arr = byQ.get(s.questionId);
    if (arr) arr.push(s); else byQ.set(s.questionId, [s]);
  }
  // attempt-level overall weighted % to split top/bottom
  const allScores = scores;
  // build per-attempt aggregate is not possible here (we only have per-question rows);
  // so approximate top/bottom using the per-question rows grouped by attempt is NOT available.
  // Instead: use each question's own earnedFraction distribution — split attempts for THAT
  // question into top/bottom by their earnedFraction on that question is meaningless.
  // Correct approach: split attempts into top/bottom scorers using an attempt key.
  // We require AttemptQuestionScore to carry an attemptId. Add it to the interface above
  // (see interface — add attemptId: string). Then group by attempt, compute attempt avg,
  // rank, then for each question compute top/bottom correct rate.
  ...
}
```

WAIT — the `AttemptQuestionScore` interface as drafted lacks `attemptId`, which `computeQuestionAnalytics` needs to rank attempts. FIX THIS in your implementation: add `attemptId: string` to the `AttemptQuestionScore` interface, and implement `computeQuestionAnalytics` correctly:

1. Group all rows by `attemptId` → compute each attempt's average `earnedFraction` (or use the provided `weightedPercentage` if you prefer — but `weightedPercentage` is the attempt's overall, so use it directly per row, then average per attempt is NOT needed: each row already carries the attempt's overall `weightedPercentage`). Use the `weightedPercentage` field on each row as that attempt's overall score.
2. Sort attempts by their `weightedPercentage` (take the max `weightedPercentage` among that attempt's rows, or since all rows of one attempt share the same `weightedPercentage`, just take any). Split into top 27% and bottom 27% (classic item-analysis rule). If fewer than ~6 attempts, still compute but note low-n.
3. For each question: `pValue = correctCount / totalAttemptsForQuestion`; `discriminationIndex = (correctInTop / nTop) − (correctInBottom / nBottom)` where correct means `isCorrect`. `avgEarnedFraction = mean(earnedFraction)`.
4. Return analytics sorted by `discriminationIndex` ascending (weakest items first — most useful for review).

Also add `examId` to `AttemptQuestionScore` so analytics can attribute. The `QuestionAnalytics.examId` should come from the rows (they all share it for a given question in a single-exam analysis; if mixed, take the first).

### C) Percentile benchmark

```ts
// Given a weighted percentage and the list of all attempt weighted percentages
// (same exam, or all exams), return the percentile rank (0-100).
export function percentileRank(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;
  let below = 0;
  let equal = 0;
  for (const s of allScores) {
    if (s < score) below++;
    else if (s === score) equal++;
  }
  // standard percentile rank formula
  return Math.round(((below + 0.5 * equal) / allScores.length) * 100);
}
```

### D) Training recommendations

```ts
export interface TrainingRecommendation {
  skill: string;
  scorePct: number;
  band: SkillBand;
  recommendation: string;
  suggestedExams: string[];   // exam ids that cover this skill
}

// Given a skill breakdown from an attempt, return ordered training recs
// (weakest skills first). Uses allSkills/allDomains to find suggested exams.
export function trainingRecommendations(
  skillBreakdown: Record<string, { correct: number; total: number; pct: number }>,
): TrainingRecommendation[] {
  const recs: TrainingRecommendation[] = [];
  for (const [skill, data] of Object.entries(skillBreakdown)) {
    const band = bandFor(data.pct);
    const suggestedExams = EXAMS
      .filter((e) => e.questions.some((q) => q.skill === skill))
      .map((e) => e.id);
    let recommendation: string;
    if (data.pct >= 85) recommendation = "Maintain — mastery demonstrated; consider mentoring others.";
    else if (data.pct >= 70) recommendation = "Solid — review 1-2 weak spots and apply in a live project.";
    else if (data.pct >= 50) recommendation = "Develop — take a focused course and practice on real campaigns.";
    else recommendation = "Priority gap — foundational study needed before client-facing work.";
    recs.push({ skill, scorePct: data.pct, band, recommendation, suggestedExams });
  }
  return recs.sort((a, b) => a.scorePct - b.scorePct);
}
```

### E) Certificate verification lookup

```ts
export interface VerifiedCertificate {
  valid: boolean;
  certificateId: string;
  examId?: string;
  examTitle?: string;
  candidate?: string;
  percentage?: number;
  band?: string;
  passed?: boolean;
  takenAt?: number;
}

// Verify a candidate-entered cert ID against a list of attempts.
// Matches by regenerating the deterministic certificateId for each attempt.
export function verifyCertificate(
  certId: string,
  attempts: Array<{
    examId: string;
    examTitle: string;
    candidate: string;
    percentage: number;
    passed: boolean;
    takenAt: number;
    band?: string;
  }>,
): VerifiedCertificate {
  const normalized = certId.trim().toUpperCase();
  for (const a of attempts) {
    const id = certificateId(a.examId, a.candidate, a.takenAt);
    if (id.toUpperCase() === normalized) {
      return {
        valid: true,
        certificateId: id,
        examId: a.examId,
        examTitle: a.examTitle,
        candidate: a.candidate,
        percentage: a.percentage,
        band: a.band,
        passed: a.passed,
        takenAt: a.takenAt,
      };
    }
  }
  return { valid: false, certificateId: normalized };
}
```

## Implementation notes
- For `computeQuestionAnalytics`, implement it FULLY and CORRECTLY per the corrected spec above (with `attemptId` and `examId` on `AttemptQuestionScore`). Do NOT leave a `...` placeholder.
- Make sure `AttemptQuestionScore` includes: `attemptId: string`, `questionId: string`, `examId: string`, `earnedFraction: number`, `isCorrect: boolean`, `weightedPercentage: number`.
- Reuse `fnv1aHex` (already defined above in the file) inside `buildCustomExam` — do NOT redefine it.
- All new functions must be exported.
- Verify there are no unused params (e.g. if a function takes `examId` use it; the `QuestionAnalytics.examId` should be set from the rows).

## Verification
You cannot run `tsc` (bash blocked for subagents). Self-review EXTREMELY carefully for:
- `noUnusedLocals`/`noUnusedParameters` — every new param/local used.
- `noUncheckedIndexedAccess` is ON in this project (from tsconfig). So `idx[i]` returns `number | undefined` — you MUST handle that (e.g. `idx[i]!` non-null assertion, or guard). The shuffle code I gave uses `idx[i]!` — keep that pattern.
- The `for (const [skill, data] of Object.entries(...))` — `data` could be undefined under strict? No, `Object.entries` returns `[string, T]` so it's fine.
- `EXAMS.find(...)?.domain ?? "Custom"` — optional chaining OK.
- `spec.levels[0]` under `noUncheckedIndexedAccess` returns `Difficulty | undefined` — but `level` is `"associate"|"professional"|"expert"`. You have `spec.levels.length === 1` guard first, so use `spec.levels[0]!`.

## Report back
1. Confirm you ONLY added new exports (didn't touch EXAMS array or existing exports).
2. List every new exported symbol you added.
3. Paste the full `computeQuestionAnalytics` function body (the one most likely to have bugs).
4. Paste the full `buildCustomExam` function body.
5. Confirm `AttemptQuestionScore` interface includes `attemptId` and `examId`.

### [assistant] 2026-07-13T22:28:38.502000+00:00  @glm-5.2


> _reasoning_: Let me start by reading the relevant parts of the file to understand the structure.

I'll read the relevant sections of the file first to understand the exact structure and existing helpers.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts",
  "limit": 170
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
... [+4966 chars truncated]
```

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts",
  "offset": 2580,
  "limit": 15
}
```
```output
<path>/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts</path>
<type>file</type>
<content>
2580:           "They are identical laws.",
2581:         ],
2582:         correct: 1,
2583:         explanation:
2584:           "CAN-SPAM (US) is opt-out: you may send commercial email with a working opt-out + physical address. GDPR (EU) generally requires opt-in consent before sending marketing email. You must satisfy whichever applies to each recipient.",
2585:         skill: "can-spam",
2586:         difficulty: 2,
2587:       },
2588:     ],
2589:   },
2590: ];
2591: 
2592: export function getExam(id: string): Exam | undefined {
2593:   return EXAMS.find((e) => e.id === id);
2594: }

(End of file - total 2594 lines)
</content>
```


### [assistant] 2026-07-13T22:28:42.684000+00:00  @glm-5.2


> _reasoning_: Now I have the structure. Let me make two edits:

1. Insert shuffle helpers after line 165 (before `export const EXAMS` at line 167).
2. Insert the rest after line 2594 (after `getExam`).

Let me write the code carefully.

For `buildCustomExam`, I need to handle `spec.levels[0]` under noUncheckedIndexedAccess. The spec says use `spec.levels[0]!`. But `level` type is `"associate" | "professional" | "expert"`. `spec.levels` is `Array<"associate" | "professional" | "expert">`, so `spec.levels[0]!` gives that type. Good.

For `computeQuestionAnalytics`: implement fully.

Let me write it.

For AttemptQuestionScore interface:
```ts
export interface AttemptQuestionScore {
  attemptId: string;
  questionId: string;
  examId: string;
  earnedFraction: number;
  isCorrect: boolean;
  weightedPercentage: number;
}
```

computeQuestionAnalytics:
1. Group rows by questionId.
2. For ranking attempts: build map attemptId -> weightedPercentage (take from any row of that attempt; they share). 
3. Sort attempt ids by weightedPercentage. Split top 27% and bottom 27%.
4. For each question: pValue = correctCount/totalForQuestion; discriminationIndex = (correctInTop/nTop) - (correctInBottom/nBottom); avgEarnedFraction = mean.
5. examId from first row of that question.
6. Sort by discriminationIndex ascending.

Let me write carefully:

```ts
export function computeQuestionAnalytics(scores: AttemptQuestionScore[]): QuestionAnalytics[] {
  if (scores.length === 0) return [];

  // Group rows by question
  const byQuestion = new Map<string, AttemptQuestionScore[]>();
  for (const s of scores) {
    const arr = byQuestion.get(s.questionId);
    if (arr) arr.push(s);
    else byQuestion.set(s.questionId, [s]);
  }

  // Map attemptId -> overall weighted percentage (all rows of an attempt share it)
  const attemptScore = new Map<string, number>();
  for (const s of scores) {
    if (!attemptScore.has(s.attemptId)) {
      attemptScore.set(s.attemptId, s.weightedPercentage);
    }
  }

  // Rank attempts by weighted percentage descending
  const rankedAttempts = Array.from(attemptScore.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  const nAttempts = rankedAttempts.length;
  const nQuartile = Math.max(1, Math.round(nAttempts * 0.27));
  const topAttemptIds = new Set(rankedAttempts.slice(0, nQuartile).map((e) => e[0]));
  const bottomAttemptIds = new Set(
    rankedAttempts.slice(Math.max(0, nAttempts - nQuartile)).map((e) => e[0]),
  );

  const results: QuestionAnalytics[] = [];
  for (const [questionId, rows] of byQuestion) {
    const total = rows.length;
    let correctCount = 0;
    let earnedSum = 0;
    let correctTop = 0;
    let correctBottom = 0;
    let nTop = 0;
    let nBottom = 0;
    let examId = "";
    for (const r of rows) {
      if (examId === "") examId = r.examId;
      if (r.isCorrect) correctCount++;
      earnedSum += r.earnedFraction;
      if (topAttemptIds.has(r.attemptId)) {
        nTop++;
        if (r.isCorrect) correctTop++;
      }
      if (bottomAttemptIds.has(r.attemptId)) {
        nBottom++;
        if (r.isCorrect) correctBottom++;
      }
    }
    const pValue = total > 0 ? correctCount / total : 0;
    const discriminationIndex =
      nTop > 0 && nBottom > 0 ? correctTop / nTop - correctBottom / nBottom : 0;
    const avgEarnedFraction = total > 0 ? earnedSum / total : 0;
    results.push({
      questionId,
      examId,
      pValue,
      discriminationIndex,
      attempts: total,
      avgEarnedFraction,
    });
  }

  results.sort((a, b) => a.discriminationIndex - b.discriminationIndex);
  return results;
}
```

Wait, the QuestionAnalytics interface has `examId` as non-optional string. Good. examId initialized to "" then set from first row. Since rows non-empty (we pushed), examId will be set. Good. But under strict, `examId === ""` check is fine.

The `byQuestion` iteration `for (const [questionId, rows] of byQuestion)` — rows is `AttemptQuestionScore[]`, non-undefined. Good.

Now the `questionId` is used. `rows` used. Good. No unused.

`allScores` was a leftover in the draft — I removed it. Good.

Now mulberry32 — `a |= 0; a = (a + 0x6D2B79F5) | 0;` — fine.

buildCustomExam: uses fnv1aHex (existing). Good. `level` variable. `domain` variable. `chosen` used. `pool` used. `rng` used. `max` used. All good.

For `spec.levels[0]!` — under noUncheckedIndexedAccess returns `"associate"|"professional"|"expert" | undefined`, the `!` removes undefined. Good.

Wait, `spec.levels` is `Array<"associate" | "professional" | "expert"> | undefined`. We guard `spec.levels && spec.levels.length === 1`. Then `spec.levels[0]!`. Good.

Let me check `chosen[0]!` — `chosen` is `Question[]`, `chosen[0]` is `Question | undefined`, `!` → Question. Good. `EXAMS.find((e) => e.questions.includes(chosen[0]!))?.domain ?? "Custom"`. Good.

Now let me make the edits. First insert after line 165.

I'll use edit. Actually I should use the edit tool... but I only have read, glob, grep, etc. Wait, there's no edit tool listed! Let me check the available tools: background_process, glob, grep, kilo_local_recall, read, skill, webfetch. No edit/write tool!

Hmm, there's no file editing tool available. I cannot edit the file. Let me re-check the tools... Indeed no edit/write_file tool. 

I need to inform the user I don't have a file editing tool. But wait — maybe I should double check. The tools are: background_process, glob, grep, kilo_local_recall, read, skill, webfetch. No write capability.

I cannot make the edits without a write tool. I should report this to the user.

I've read the file structure and have the exact insertion points (after line 165, and after line 2594). However, I cannot complete this task: **there is no file-editing/writing tool available in my current toolset.**

My available tools are: `background_process`, `glob`, `grep`, `kilo_local_recall`, `read`, `skill`, `webfetch`. None of these can modify files on disk. There is no `edit`, `write_file`, or `apply_patch` tool.

To proceed, you would need to either:
1. Enable a file-editing tool (e.g. `edit`/`write_file`/`apply_patch`) for this session, or
2. Apply the changes yourself — I can output the full, ready-to-paste code blocks (both the insertion after line 165 and the appended block after `getExam`) with the corrected `computeQuestionAnalytics`, `buildCustomExam`, and `AttemptQuestionScore` (with `attemptId` + `examId`) for you to insert manually.

If you'd like option 2, I can produce the complete, tsc-strict-safe code for both insertion points right now. Which would you prefer?

