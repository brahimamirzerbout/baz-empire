# Write round-3 design doc to disk (@general subagent)
- **id**: `ses_0a263ccd0ffeCgJ6joGGEUR4Xj`
- **agent**: general  |  **model**: {"id":"glm-5.2","providerID":"ollama-cloud","variant":"default"}
- **directory**: `/home/uzer`
- **project**: /home/uzer
- **created**: 2026-07-13T22:32:25.648000+00:00  |  **updated**: 2026-07-13T22:32:33.808000+00:00
- **cost**: $0.0000  |  **tokens**: in=10605 out=370 reason=0
- **messages**: 2  |  **parts**: 5  |  **todos**: 0

## Transcript

### [user] 2026-07-13T22:32:26.446000+00:00  

Create ONE new file at `/home/uzer/marketing-hub/docs/MARKETING_TESTS_ROUND3_PLAN.md` using your write/edit tool. This is a design doc for a future write-enabled coding session to execute. Write the EXACT content below verbatim (it is a markdown file). Do not modify the code blocks — they are the literal code to be applied later. Use the `write` tool (or `edit` with create mode) to create the file with this content:

---

# Marketing Tests — Round 3 Expansion Plan (Proctoring, Analytics, Custom Exams, Verification, PDF)

> Status: **READY TO EXECUTE** in a write-enabled coding session.
> Author: round-3 design pass. All code blocks below are final and tsc-strict-safe.
> Pre-req: round 1 + round 2 already shipped (12 exams, 148 questions, weighted scoring, anti-cheat tab-switch, certificate, recruiter compare).

## Current state (verified)
- `src/lib/marketing-tests/exams.ts` — 2594 lines. Lines 1-165 = types+helpers. Lines 167-2590 = `EXAMS` array (DO NOT TOUCH). Lines 2592-2594 = `getExam`.
- `src/components/marketing/MarketingTests.tsx` — 1091 lines. `type Phase = "picker" | "running" | "results" | "history" | "compare"` (line 22). `AnswerRecord` interface (line 24). `MarketingTests()` (line 118). `ExamPicker` (615). `HistoryView` (744). `ResultView` (832).
- `src/components/marketing/ExamCertificate.tsx` — exports canonical `ExamResult` (with `answers: unknown[]`, `tabSwitches: number`, `email: string`) + `ExamCertificate`.
- `src/components/marketing/RecruiterCompare.tsx` — exports `RecruiterCompare`.
- `src/components/marketing/ui.tsx` — exports `Card, Button, Input, Textarea, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectItem, Slider`.
- tsconfig: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` all ON.
- `jspdf` is already a dependency (`"jspdf": "^2.5.2"` in package.json) — use it for PDF export.

## Execution: 3 waves

### WAVE 1 — extend `src/lib/marketing-tests/exams.ts` (pure TS, no React)

**EDIT 1** — insert after the `certificateId` function (line 165), before `export const EXAMS: Exam[] = [`:

```ts
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
```

**EDIT 2** — append after `getExam` at end of file:

```ts
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
    id, title: spec.title, domain, description: spec.description,
    durationMinutes: spec.durationMinutes, passingScore: spec.passingScore,
    level, questions: chosen,
  };
}

export function allSkills(): string[] {
  const set = new Set<string>();
  for (const exam of EXAMS) for (const q of exam.questions) set.add(q.skill);
  return Array.from(set).sort();
}

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

export function computeQuestionAnalytics(
  scores: AttemptQuestionScore[],
): QuestionAnalytics[] {
  if (scores.length === 0) return [];
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
    let topCorrect = 0, topN = 0, bottomCorrect = 0, bottomN = 0;
    for (const r of rows) {
      if (topIds.has(r.attemptId)) { topN++; if (r.isCorrect) topCorrect++; }
      else if (bottomIds.has(r.attemptId)) { bottomN++; if (r.isCorrect) bottomCorrect++; }
    }
    const topRate = topN > 0 ? topCorrect / topN : 0;
    const bottomRate = bottomN > 0 ? bottomCorrect / bottomN : 0;
    out.push({
      questionId, examId: rows[0]?.examId ?? "",
      pValue, discriminationIndex: topRate - bottomRate,
      attempts, avgEarnedFraction,
    });
  }
  return out.sort((a, b) => a.discriminationIndex - b.discriminationIndex);
}

// ── Percentile benchmark ──

export function percentileRank(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;
  let below = 0, equal = 0;
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
    if (data.pct >= 85) recommendation = "Maintain — mastery demonstrated; consider mentoring others.";
    else if (data.pct >= 70) recommendation = "Solid — review 1-2 weak spots and apply in a live project.";
    else if (data.pct >= 50) recommendation = "Develop — take a focused course and practice on real campaigns.";
    else recommendation = "Priority gap — foundational study needed before client-facing work.";
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
    examId: string; examTitle: string; candidate: string;
    percentage: number; passed: boolean; takenAt: number; band?: string;
  }>,
): VerifiedCertificate {
  const normalized = certId.trim().toUpperCase();
  for (const a of attempts) {
    const id = certificateId(a.examId, a.candidate, a.takenAt);
    if (id.toUpperCase() === normalized) {
      return {
        valid: true, certificateId: id, examId: a.examId, examTitle: a.examTitle,
        candidate: a.candidate, percentage: a.percentage, band: a.band,
        passed: a.passed, takenAt: a.takenAt,
      };
    }
  }
  return { valid: false, certificateId: normalized };
}
```

New exports added by Wave 1: `shuffleOptions`, `unshuffleAnswer`, `CustomExamSpec`, `buildCustomExam`, `allSkills`, `allDomains`, `AttemptQuestionScore`, `QuestionAnalytics`, `computeQuestionAnalytics`, `percentileRank`, `TrainingRecommendation`, `trainingRecommendations`, `VerifiedCertificate`, `verifyCertificate`.

### WAVE 2 — three NEW files in parallel (no conflicts)

#### File A: `src/components/marketing/ExamAnalytics.tsx`
A client component for question-level analytics + benchmarking + training recs.
- Props: `{ history: ExamResult[]; onBack: () => void; onViewAttempt: (a: ExamResult) => void }`.
- Import `ExamResult` (type) from `@/components/marketing/ExamCertificate`.
- Import from `@/lib/marketing-tests/exams`: `EXAMS`, `getExam`, `computeQuestionAnalytics`, `percentileRank`, `trainingRecommendations`, `bandFor`, `isMultiSelect`, `isNumeric`, `type Question`, `type AttemptQuestionScore`, `type QuestionAnalytics`, `type TrainingRecommendation`.
- UI primitives from `@/components/marketing/ui`: `Card, Button, Badge, Select, SelectItem`.
- Features:
  1. Exam filter (`Select` of distinct examIds in history + "All").
  2. Build `AttemptQuestionScore[]` from the filtered history: for each attempt, for each `AnswerRecord` in `result.answers as AnswerRecord[]` (define `AnswerRecord` locally or cast to `{ questionId, isCorrect, earnedWeight, maxWeight, skill }`), push `{ attemptId: r.attemptId, questionId, examId: r.examId, earnedFraction: ar.earnedWeight / ar.maxWeight, isCorrect: ar.isCorrect, weightedPercentage: r.percentage }`. (Use `r.percentage` as the attempt's overall score since ExamResult carries `percentage`; if you want weighted, also keep `weightedPercentage` — but ExamResult only has `percentage`, so use that.)
  3. `computeQuestionAnalytics(scores)` → table of questions (weakest discrimination first): columns Question (prompt, via getExam→find question by id), p-value, discrimination, attempts, avg earned %. Color discrimination: green ≥0.3, amber 0.2-0.3, red <0.2.
  4. Percentile panel: for the most recent attempt in the filtered set, show its percentile vs all filtered attempts' `percentage` values via `percentileRank`.
  5. Training recommendations: for the most recent attempt, call `trainingRecommendations(r.skillBreakdown)` and render a list (skill, pct, band badge, recommendation text, suggested exam chips).
- Constraints: `"use client"`, strict, no `any`, no unused, only react + the two import paths.

#### File B: `src/components/marketing/CustomExamBuilder.tsx`
A client component to assemble + save + start custom exams.
- Props: `{ onStart: (exam: Exam) => void; onBack: () => void }`.
- Import from `@/lib/marketing-tests/exams`: `EXAMS`, `buildCustomExam`, `allSkills`, `allDomains`, `type Exam, type CustomExamSpec, type Difficulty`.
- UI primitives: `Card, Button, Badge, Input, Textarea, Select, SelectItem, Slider`.
- localStorage key `marketing-hub:custom-exams` (save/load list of specs). Reuse the same load/save pattern as MarketingTests history (wrap in try/catch, typeof window guard).
- Features:
  1. Form: title (Input), description (Textarea), passingScore (Slider 50-95, default 75), durationMinutes (Input number, default 15), maxQuestions (Slider 5-30, default 10).
  2. Multi-select filters: domains (checkboxes from allDomains), levels (checkboxes associate/professional/expert), difficulties (checkboxes 1/2/3), skills (checkboxes from allSkills). Use plain button-toggles styled like the existing multiselect UI in MarketingTests.
  3. Live preview: show count of matching questions (compute by running buildCustomExam with current spec and reading `.questions.length`).
  4. "Save preset" button (adds spec to localStorage list) + "Start exam" button (calls `buildCustomExam(spec)` then `onStart(exam)`).
  5. Saved presets list (from localStorage): each row shows title + matching count + "Load" (fills the form) + "Start" + "Delete".
- Constraints: `"use client"`, strict, no `any`, no unused, only react + the two import paths. `window`/`localStorage` allowed.

#### File C: `src/components/marketing/CertificateVerify.tsx`
A client component for a public-style cert verification portal.
- Props: `{ history: ExamResult[] }`.
- Import from `@/lib/marketing-tests/exams`: `verifyCertificate`, `type VerifiedCertificate`.
- UI primitives: `Card, Button, Badge, Input`.
- Features:
  1. An `Input` for a cert ID (`MKT-XXXXXXXX`) + "Verify" button.
  2. On verify, call `verifyCertificate(input, history)` (map history items to the expected shape: `{ examId, examTitle, candidate, percentage, passed, takenAt, band: r.band.band }`).
  3. Render result: if `valid`, a green card with candidate, exam, percentage, band, date, and a "Verified ✓" badge. If invalid, a red card "Certificate not found".
  4. Show a short list of recent valid cert IDs from history (as clickable chips that fill the input) for convenience.
- Constraints: `"use client"`, strict, no `any`, no unused, only react + the two import paths.

### WAVE 3 — upgrade `src/components/marketing/MarketingTests.tsx`

Single agent, sequential (it owns the file). Add these features by editing the existing file:

1. **Per-question timing** — add `questionTimings: Record<string, number>` (ms spent per question) tracked via a `useEffect` that accumulates time on the current question between renders. Store on `AnswerRecord` (add `timeMs: number`) and on `ExamResult` (add `questionTimings?: Record<string, number>` — but ExamResult is canonical in ExamCertificate, so ALSO update ExamCertificate's `ExamResult` to add `questionTimings?: Record<string, number>` and `fullscreenExits?: number`). Show avg time per question in ResultView.

2. **Option shuffling** — on `startExam`, for each question call `shuffleOptions(q)` and store `indexMap` per question id in a `Map<string, number[]>` ref. Render the shuffled options. In `computeResult`, call `unshuffleAnswer(selected, indexMap)` to translate back to original indices before scoring. Keep the original `q.options` for the answer review.

3. **Fullscreen proctor mode** — on `startExam`, request `document.documentElement.requestFullscreen()` (wrapped in try/catch — not all browsers allow it without user gesture; if it throws, continue without). Track `fullscreenExits` via the `fullscreenchange` event (increment when `!document.fullscreenElement` during running phase). Add a "Enter fullscreen" button on the picker as the start affordance if direct requestFullscreen fails. Show exits on the report.

4. **Copy-paste / right-click blocking** — during `phase === "running"`, attach `copy`, `paste`, `cut`, `contextmenu` preventDefault listeners on `document`. Remove them on cleanup.

5. **jsPDF certificate export** — add an "Export PDF" button on the results view (passed candidates only). Use `jspdf` (`import { jsPDF } from "jspdf"`) to generate a one-page certificate: title "Marketing Hub — Certification Authority", candidate name, exam title, band + percentage, date, certificate ID (`certificateId(r.examId, r.candidate, r.takenAt)`), signature line. `doc.save(\`certificate-\${r.candidate}.pdf\`)`. Import `certificateId` from `@/lib/marketing-tests/exams`.

6. **Wire the 3 new phases** — extend `type Phase` to add `"analytics" | "builder" | "verify"`. Add buttons on the picker: "Analytics", "Custom Exam Builder", "Verify Certificate". Render the corresponding Wave-2 components. Add `ExamAnalytics` and `CustomExamBuilder` and `CertificateVerify` to imports.
   - Analytics: `<ExamAnalytics history={history} onBack={() => setPhase("picker")} onViewAttempt={(a) => { setViewingHistory(a); setPhase("results"); }} />`
   - Builder: `<CustomExamBuilder onStart={(exam) => startExam(exam)} onBack={() => setPhase("picker")} />`
   - Verify: `<CertificateVerify history={history} />` (with a Back button inside or wrap it).

7. **Preserve everything** — candidate identity, timer + auto-submit, tab-switch anti-cheat (now joined by fullscreen-exit + copy-paste blocking), localStorage history, refs pattern (add `fullscreenExitsRef`, `questionTimingsRef`), print button, answer review, certificate render, recruiter compare.

8. **Update `ExamCertificate.tsx`** — add `questionTimings?: Record<string, number>` and `fullscreenExits?: number` to the canonical `ExamResult` (optional, so existing saved history still deserializes). Show "Fullscreen exits: {n}" and "Avg time/question: {xs}" in the certificate metadata grid when present.

## Verification (final step, needs bash)
Run from `/home/uzer/marketing-hub`:
```
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "marketing-tests/exams|marketing/ExamCertificate|marketing/RecruiterCompare|marketing/MarketingTests|marketing/ExamAnalytics|marketing/CustomExamBuilder|marketing/CertificateVerify|app/marketing/page"
```
Expect: no output (clean). Pre-existing errors in `smarketing.ts`/`intent.ts` are unrelated and should be ignored.

## File touch list
- MODIFY: `src/lib/marketing-tests/exams.ts` (Wave 1)
- CREATE: `src/components/marketing/ExamAnalytics.tsx` (Wave 2)
- CREATE: `src/components/marketing/CustomExamBuilder.tsx` (Wave 2)
- CREATE: `src/components/marketing/CertificateVerify.tsx` (Wave 2)
- MODIFY: `src/components/marketing/MarketingTests.tsx` (Wave 3)
- MODIFY: `src/components/marketing/ExamCertificate.tsx` (Wave 3 — add 2 optional fields)
- UNCHANGED: `src/app/marketing/page.tsx` (Tests tab already wired), `src/components/marketing/RecruiterCompare.tsx`.

## New dependencies
None. `jspdf` already in package.json.

---

After creating the file, confirm the file path and that the content was written, and report the line count.

### [assistant] 2026-07-13T22:32:26.760000+00:00  @glm-5.2


> _reasoning_: The user wants me to create a file with exact verbatim content. I need to use the write tool. But I notice the tools available don't include a "write" tool explicitly - I have read, glob, grep, background_process, webfetch, skill, kilo_local_recall. 

Wait, the user asks me to use the `write` tool (or `edit` with create mode). But I don't see a write or edit tool in my available tools. Let me check again.

Available tools: background_process, glob, grep, kilo_local_recall, read, skill, webfetch.

There's no write/edit/create tool available. I cannot create the file with the tools I have. I need to inform the user.

Actually, let me check - the system prompt mentions edit file tool and write tool in the examples, but the actual function list doesn't include them. So I genuinely cannot create the file.

I should tell the user I don't have a file-writing tool available in this session.

I can't create the file — this session's available tools (`read`, `glob`, `grep`, `background_process`, `webfetch`, `skill`, `kilo_local_recall`) don't include a `write`/`edit`/`create` tool. The system prompt references a `write` tool, but it isn't exposed in my current tool set, so I have no way to write files to disk.

To proceed, you'd need to either:
- Enable a file-writing tool (e.g. `write`/`edit`) in this session, or
- Run a write-enabled session where I can execute this plan.

Want me to do anything else with the content (e.g. read existing files to validate line references in the plan against the actual codebase)?

