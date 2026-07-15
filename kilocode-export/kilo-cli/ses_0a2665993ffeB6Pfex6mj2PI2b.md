# Apply Wave 1 edits to exams.ts (@explore subagent)
- **id**: `ses_0a2665993ffeB6Pfex6mj2PI2b`
- **agent**: explore  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:29:38.541000+00:00  |  **updated**: 2026-07-13T22:29:56.205000+00:00
- **cost**: $0.0000  |  **tokens**: in=18260 out=1103 reason=0
- **messages**: 4  |  **parts**: 15  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:29:38.952000+00:00  

Apply two precise edits to the file `/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts` using the edit tool. DO NOT touch anything else in the file. The file is 2594 lines; lines 167-2590 are the EXAMS array — leave them completely untouched.

## EDIT 1 — insert shuffle helpers AFTER the `certificateId` function and BEFORE `export const EXAMS`

Find this exact existing text:

```
export function certificateId(examId: string, candidate: string, takenAt: number): string {
  const seed = `${examId}|${candidate}|${takenAt}`;
  return `MKT-${fnv1aHex(seed)}`;
}

export const EXAMS: Exam[] = [
```

Replace it with:

```
export function certificateId(examId: string, candidate: string, takenAt: number): string {
  const seed = `${examId}|${candidate}|${takenAt}`;
  return `MKT-${fnv1aHex(seed)}`;
}

// ── Option & question shuffling (anti-cheat: randomize option order) ──

// Returns a new options array + indexMap[newIdx] = originalIdx, so the caller
// can translate the candidate's selected newIdx back to the original correct
// index. For numeric questions (options: []) returns identity.
export function shuffleOptions(
  q: Question,
  rng: () => number = Math.random,
): { options: string[]; indexMap: number[] } {
  if (q.type === "numeric") return { options: [], indexMap: [] };
  const orig = q.options;
  const idx = orig.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = idx[i]!; idx[i] = idx[j]!; idx[j] = tmp;
  }
  const indexMap = idx;
  const options = idx.map((i) => orig[i]!);
  return { options, indexMap };
}

// Given a shuffled indexMap and the candidate's selected new index/indices,
// translate back to ORIGINAL indices. For multiselect, maps the array.
export function unshuffleAnswer(
  selected: number | number[],
  indexMap: number[],
): number | number[] {
  if (Array.isArray(selected)) return selected.map((s) => indexMap[s] ?? s);
  return indexMap[selected] ?? selected;
}

export const EXAMS: Exam[] = [
```

## EDIT 2 — append a big block of new exports AFTER the final `getExam` function at the end of the file

Find this exact existing text at the very end of the file:

```
export function getExam(id: string): Exam | undefined {
  return EXAMS.find((e) => e.id === id);
}
```

Replace it with:

```
export function getExam(id: string): Exam | undefined {
  return EXAMS.find((e) => e.id === id);
}

// ── Custom exam builder ──

export interface CustomExamSpec {
  title: string;
  description: string;
  passingScore: number;
  durationMinutes: number;
  domains?: string[];
  levels?: Array<"associate" | "professional" | "expert">;
  difficulties?: Difficulty[];
  skills?: string[];
  ids?: string[];
  maxQuestions?: number;
  seed?: number;
}

// Seeded RNG (mulberry32) for deterministic custom-exam selection.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
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
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i]!; pool[i] = pool[j]!; pool[j] = tmp;
  }
  const max = spec.maxQuestions != null ? spec.maxQuestions : pool.length;
  const chosen = pool.slice(0, Math.min(max, pool.length));
  const id = `custom-${fnv1aHex(spec.title + JSON.stringify(spec))}`;
  const domain = chosen.length > 0
    ? (EXAMS.find((e) => e.questions.includes(chosen[0]!))?.domain ?? "Custom")
    : "Custom";
  const level: Exam["level"] =
    spec.levels && spec.levels.length === 1 ? spec.levels[0]! : "professional";
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

// ── Per-question analytics + discrimination index ──

export interface AttemptQuestionScore {
  attemptId: string;
  questionId: string;
  examId: string;
  earnedFraction: number;
  isCorrect: boolean;
  weightedPercentage: number;
}

export interface QuestionAnalytics {
  questionId: string;
  examId: string;
  pValue: number;
  discriminationIndex: number;
  attempts: number;
  avgEarnedFraction: number;
}

// Classic item analysis: p-value (difficulty) + discrimination index
// (top 27% minus bottom 27% correct rate). Returns weakest items first.
export function computeQuestionAnalytics(
  scores: AttemptQuestionScore[],
): QuestionAnalytics[] {
  if (scores.length === 0) return [];

  // Rank attempts by their overall weightedPercentage.
  const attemptPct = new Map<string, number>();
  for (const s of scores) {
    const prev = attemptPct.get(s.attemptId);
    if (prev === undefined || s.weightedPercentage > prev) {
      attemptPct.set(s.attemptId, s.weightedPercentage);
    }
  }
  const ranked = Array.from(attemptPct.entries()).sort((a, b) => a[1] - b[1]);
  const n = ranked.length;
  const third = Math.max(1, Math.floor(n / 3));
  const bottomIds = new Set(ranked.slice(0, third).map((r) => r[0]));
  const topIds = new Set(ranked.slice(n - third).map((r) => r[0]));

  // group rows by question
  const byQ = new Map<string, AttemptQuestionScore[]>();
  for (const s of scores) {
    const arr = byQ.get(s.questionId);
    if (arr) arr.push(s); else byQ.set(s.questionId, [s]);
  }

  const out: QuestionAnalytics[] = [];
  for (const [questionId, rows] of byQ) {
    const attempts = rows.length;
    const correctCount = rows.filter((r) => r.isCorrect).length;
    const pValue = attempts > 0 ? correctCount / attempts : 0;
    const avgEarnedFraction =
      attempts > 0 ? rows.reduce((sum, r) => sum + r.earnedFraction, 0) / attempts : 0;

    let topCorrect = 0;
    let topN = 0;
    let bottomCorrect = 0;
    let bottomN = 0;
    for (const r of rows) {
      if (topIds.has(r.attemptId)) {
        topN++;
        if (r.isCorrect) topCorrect++;
      } else if (bottomIds.has(r.attemptId)) {
        bottomN++;
        if (r.isCorrect) bottomCorrect++;
      }
    }
    const topRate = topN > 0 ? topCorrect / topN : 0;
    const bottomRate = bottomN > 0 ? bottomCorrect / bottomN : 0;
    const discriminationIndex = topRate - bottomRate;
    const examId = rows[0]?.examId ?? "";
    out.push({
      questionId,
      examId,
      pValue,
      discriminationIndex,
      attempts,
      avgEarnedFraction,
    });
  }
  // weakest discrimination first (most useful for review)
  return out.sort((a, b) => a.discriminationIndex - b.discriminationIndex);
}

// ── Percentile benchmark ──

export function percentileRank(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;
  let below = 0;
  let equal = 0;
  for (const s of allScores) {
    if (s < score) below++;
    else if (s === score) equal++;
  }
  return Math.round(((below + 0.5 * equal) / allScores.length) * 100);
}

// ── Training recommendations ──

export interface TrainingRecommendation {
  skill: string;
  scorePct: number;
  band: SkillBand;
  recommendation: string;
  suggestedExams: string[];
}

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
    if (data.pct >= 85) {
      recommendation = "Maintain — mastery demonstrated; consider mentoring others.";
    } else if (data.pct >= 70) {
      recommendation = "Solid — review 1-2 weak spots and apply in a live project.";
    } else if (data.pct >= 50) {
      recommendation = "Develop — take a focused course and practice on real campaigns.";
    } else {
      recommendation = "Priority gap — foundational study needed before client-facing work.";
    }
    recs.push({ skill, scorePct: data.pct, band, recommendation, suggestedExams });
  }
  return recs.sort((a, b) => a.scorePct - b.scorePct);
}

// ── Certificate verification ──

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

## After both edits
1. Read back the inserted shuffle helpers block (around the `certificateId` area) to confirm it's there.
2. Read back the tail of the file to confirm `verifyCertificate` is the last export.
3. Confirm the EXAMS array (lines ~167-2590 originally) is intact and unchanged — spot check by grepping for `id: "fundamentals"` and `id: "compliance-privacy"` still present.

## Report back
- Confirm both edits applied.
- Confirm the EXAMS array is untouched (both spot-check ids present).
- List the new exported symbols now present.
- Report the final total line count of the file.

### [assistant] 2026-07-13T22:29:39.203000+00:00  @glm-5.2


> _reasoning_: Let me start by reading the file to understand its structure, particularly the areas I need to edit.

I'll start by reading the relevant sections of the file to verify the exact text matches before making edits.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts",
  "offset": 150,
  "limit": 25
}
```
```output
<path>/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts</path>
<type>file</type>
<content>
150: // FNV-1a 32-bit → 8 hex chars. Deterministic for identical inputs.
151: function fnv1aHex(input: string): string {
152:   let hash = 0x811c9dc5;
153:   for (let i = 0; i < input.length; i++) {
154:     hash ^= input.charCodeAt(i);
155:     // FNV prime multiplication, keep within 32-bit unsigned.
156:     hash = Math.imul(hash, 0x01000193) >>> 0;
157:   }
158:   const hex = (hash >>> 0).toString(16);
159:   return hex.padStart(8, "0").slice(0, 8);
160: }
161: 
162: export function certificateId(examId: string, candidate: string, takenAt: number): string {
163:   const seed = `${examId}|${candidate}|${takenAt}`;
164:   return `MKT-${fnv1aHex(seed)}`;
165: }
166: 
167: export const EXAMS: Exam[] = [
168:   {
169:     id: "fundamentals",
170:     title: "Digital Marketing Fundamentals",
171:     domain: "Fundamentals",
172:     description:
173:       "Core channels, owned/earned/paid media, the measurement loop, and the customer funnel. Foundational knowledge every professional must own.",
174:     durationMinutes: 12,

(Showing lines 150-174 of 2594. Use offset=175 to continue.)
</content>

<system-reminder>
Instructions from: /home/uzer/marketing-hub/AGENTS.md
# AGENTS.md — Marketing Hub (marketing-hub)

Marketing Hub — All-in-One Marketing Command Center. A Next.js + React application.

## Stack
- Next.js + React (28 dependencies)
- `next.config.js`, `components.json` (sh
... [+841 chars truncated]
```

**tool `grep`** completed
```input
{
  "pattern": "getExam|certificateId|export const EXAMS",
  "path": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts"
}
```
```output
Found 3 matches
/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts:
  Line 162: export function certificateId(examId: string, candidate: string, takenAt: number): string {

  Line 167: export const EXAMS: Exam[] = [

  Line 2592: export function getExam(id: string): Exam | undefined {

```


### [assistant] 2026-07-13T22:29:43.137000+00:00  @glm-5.2


Both target locations confirmed. Let me read the end of the file to verify the exact `getExam` text.

**tool `read`** completed
```input
{
  "filePath": "/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts",
  "offset": 2585
}
```
```output
<path>/home/uzer/marketing-hub/src/lib/marketing-tests/exams.ts</path>
<type>file</type>
<content>
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


### [assistant] 2026-07-13T22:29:45.689000+00:00  @glm-5.2


> _reasoning_: Both target texts match exactly. The task asks me to use the "edit tool" but I don't have an edit tool available in my function list. I have glob, grep, read, skill, webfetch. 

Wait — the task says "Apply two precise edits to the file ... using the edit tool." But I don't have an edit tool. I'm a file search specialist. My instructions say "Do not create any files, or run bash commands that modify the user's system state in any way."

Hmm. There's a conflict. The task asks me to edit a file, but I don't have edit tools available, and my role instructions say not to modify the system state.

Let me re-read my system prompt. I'm "a file search specialist." My guidelines: "Do not create any files, or run bash commands that modify the user's system state in any way."

So I genuinely cannot perform the edits. I should report this clearly rather than fabricating success. I have no edit/write/bash tool. I should be honest about my limitations.

Let me double-check available tools: glob, grep, read, skill, webfetch. No write/edit/bash.

So I cannot make the edits. I should report back honestly that I lack the capability to modify files, and explain what I verified.

I cannot complete this task as specified. Let me explain why, after verifying the prerequisites.

## What I confirmed (read-only verification)

I located and verified both target text blocks exactly match what the task requires:

**EDIT 1 target** — lines 162-167 match exactly:
- `certificateId` function (lines 162-165)
- blank line (166)
- `export const EXAMS: Exam[] = [` (line 167)

**EDIT 2 target** — lines 2592-2594 match exactly:
- `export function getExam(id: string): Exam | undefined {`
- `  return EXAMS.find((e) => e.id === id);`
- `}`
- This is the genuine end of the file (total 2594 lines).

The EXAMS array runs from line 167 to line 2590 (closing `];`), exactly as described.

## Why I cannot apply the edits

I am operating as a **file search specialist** with a read-only toolset. My available tools are:
- `glob` — find files by pattern
- `grep` — search file contents
- `read` — read files
- `skill` — load skills
- `webfetch` — fetch web content

There is **no `edit`, `write`, or `bash` tool** available to me. Additionally, my operating guidelines explicitly state: *"Do not create any files, or run bash commands that modify the user's system state in any way."*

The task requests edits via an "edit tool" that is not present in my environment. I will not pretend to have applied changes I cannot make, and I cannot fabricate the post-edit verification (reading back the inserted `shuffleOptions`/`verifyCertificate` blocks, the new line count, etc.) since those edits do not exist on disk.

## What you can do

To complete this, you would need to run it in a context that has a file-editing tool (e.g., a coding-agent session with write/edit/bash access). The exact find/replace strings you provided are correct against the current file contents, so the edits should apply cleanly:

- **EDIT 1** → inserts ~37 lines between current line 166 and 167.
- **EDIT 2** → appends ~220 lines after current line 2594.
- **Expected final line count** ≈ 2594 + 37 + 220 ≈ **2851 lines** (approximate; exact count depends on trailing newline handling).

New exported symbols that would be added by these edits:
- `shuffleOptions`
- `unshuffleAnswer`
- `CustomExamSpec` (interface)
- `buildCustomExam`
- `allSkills`
- `allDomains`
- `AttemptQuestionScore` (interface)
- `QuestionAnalytics` (interface)
- `computeQuestionAnalytics`
- `percentileRank`
- `TrainingRecommendation` (interface)
- `trainingRecommendations`
- `VerifiedCertificate` (interface)
- `verifyCertificate`

If you re-run this request in a session with edit capabilities, I can apply both edits and perform the post-edit verification you described.

