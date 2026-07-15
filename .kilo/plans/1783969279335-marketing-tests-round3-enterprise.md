# Marketing Tests — Round 3 Enterprise Expansion (Plan)

> Status: **READY TO EXECUTE**
> Target: `/home/uzer/marketing-hub`
> Pre-req: Round 1 + Round 2 already shipped (verified below).

## Current State (Verified)

- `src/lib/marketing-tests/exams.ts` — 2594 lines. Types/helpers on lines 1-165. `EXAMS` array on lines 167-2590 (12 exams, 148 questions). `getExam` on lines 2592-2594. Round 3 code NOT yet applied.
- `src/components/marketing/MarketingTests.tsx` — 1091 lines. `Phase` at line 22 (picker/running/results/history/compare). `AnswerRecord` at 24. `MarketingTests()` at 118. `ExamPicker` 615. `HistoryView` 744. `ResultView` 832.
- `src/components/marketing/ExamCertificate.tsx` — exports canonical `ExamResult` (no `questionTimings`, `fullscreenExits`, `answers: unknown[]`).
- `src/components/marketing/RecruiterCompare.tsx` — exports `RecruiterCompare`.
- `src/components/marketing/ui.tsx` — exports `Card, Button, Input, Textarea, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectItem, Slider`.
- tsconfig: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` — all ON.
- `jspdf` ^2.5.2 is already a dependency (in package.json).

## What This Plan Adds

1. **Proctoring**: per-question timer, option shuffling (anti-cheat), fullscreen mode, copy/paste/right-click block.
2. **Analytics**: question-level p-value/discrimination index, percentile benchmark, training recommendations.
3. **Custom exams**: recruiter-built exams from the question pool with filters and presets.
4. **Certificate verification**: public portal to verify `MKT-XXXXXXXX` cert IDs against history.
5. **PDF export**: jsPDF-generated certificate for passing candidates.

## Execution Order

### Wave 1 — `src/lib/marketing-tests/exams.ts` (pure TS, no React)

**Edit A** — insert after `certificateId` (line 165), before `export const EXAMS`:

```ts
// ── Option & question shuffling (anti-cheat: randomize option order) ──

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

export function unshuffleAnswer(
  selected: number | number[],
  indexMap: number[],
): number | number[] {
  if (Array.isArray(selected)) return selected.map((s) => indexMap[s] ?? s);
  return indexMap[selected] ?? selected;
}
```

**Edit B** — append after `getExam` at end of file:

```ts
// ── Custom exam builder ──

export interface CustomExamSpec {
  title: string; description: string; passingScore: number; durationMinutes: number;
  domains?: string[]; levels?: Array<"associate" | "professional" | "expert">;
  difficulties?: Difficulty[]; skills?: string[]; ids?: string[];
  maxQuestions?: number; seed?: number;
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
  return { id, title: spec.title, domain, description: spec.description,
    durationMinutes: spec.durationMinutes, passingScore: spec.passingScore,
    level, questions: chosen };
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
  attemptId: string; questionId: string; examId: string;
  earnedFraction: number; isCorrect: boolean; weightedPercentage: number;
}

export interface QuestionAnalytics {
  questionId: string; examId: string;
  pValue: number; discriminationIndex: number;
  attempts: number; avgEarnedFraction: number;
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
    if (s < score) below++; else if (s === score) equal++;
  }
  return Math.round(((below + 0.5 * equal) / allScores.length) * 100);
}

// ── Training recommendations ──

export interface TrainingRecommendation {
  skill: string; scorePct: number; band: SkillBand;
  recommendation: string; suggestedExams: string[];
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
  valid: boolean; certificateId: string;
  examId?: string; examTitle?: string; candidate?: string;
  percentage?: number; band?: string; passed?: boolean; takenAt?: number;
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
      return { valid: true, certificateId: id, examId: a.examId, examTitle: a.examTitle,
        candidate: a.candidate, percentage: a.percentage, band: a.band,
        passed: a.passed, takenAt: a.takenAt };
    }
  }
  return { valid: false, certificateId: normalized };
}
```

**New exports**: `shuffleOptions`, `unshuffleAnswer`, `CustomExamSpec`, `buildCustomExam`, `allSkills`, `allDomains`, `AttemptQuestionScore`, `QuestionAnalytics`, `computeQuestionAnalytics`, `percentileRank`, `TrainingRecommendation`, `trainingRecommendations`, `VerifiedCertificate`, `verifyCertificate`.

**Constraints**: do not touch `EXAMS` array. `noUncheckedIndexedAccess` — use `!` on indexed accesses (`idx[i]!`, `pool[i]!`, `spec.levels[0]!`).

---

### Wave 2 — Three New Files (parallel, no conflicts)

#### File A: `src/components/marketing/ExamAnalytics.tsx`
- Props: `{ history: ExamResult[]; onBack: () => void; onViewAttempt: (a: ExamResult) => void }`
- Imports: `type ExamResult` from ExamCertificate; from exams: `EXAMS, getExam, computeQuestionAnalytics, percentileRank, trainingRecommendations, bandFor, isMultiSelect, isNumeric, type Question, type AttemptQuestionScore, type QuestionAnalytics, type TrainingRecommendation`.
- UI: `Card, Button, Badge, Select, SelectItem`.
- Features:
  1. Exam filter (`Select`) of distinct examIds in history + "All".
  2. Build `AttemptQuestionScore[]` from filtered history: for each attempt, for each `AnswerRecord` (cast from `result.answers as AnswerRecord[]`), push `{ attemptId, questionId, examId, earnedFraction: ar.earnedWeight / ar.maxWeight, isCorrect: ar.isCorrect, weightedPercentage: r.percentage }`.
  3. `computeQuestionAnalytics(scores)` → table (weakest discrimination first): prompt (via `getExam` → find question), p-value, discrimination, attempts, avg earned %. Color discrimination: green ≥0.3, amber 0.2-0.3, red <0.2.
  4. Percentile panel: most recent attempt's `percentage` vs all filtered attempts' `percentage` values via `percentileRank`.
  5. Training recs: `trainingRecommendations(r.skillBreakdown)` → list (skill, pct, band badge, recommendation, suggested exam chips).
- Constraints: `"use client"`, strict, no `any`, no unused, react + allowed imports only.

#### File B: `src/components/marketing/CustomExamBuilder.tsx`
- Props: `{ onStart: (exam: Exam) => void; onBack: () => void }`
- Imports: from exams `EXAMS, buildCustomExam, allSkills, allDomains, type Exam, type CustomExamSpec, type Difficulty`. From ui `Card, Button, Badge, Input, Textarea, Select, SelectItem, Slider`.
- Features:
  1. Form: title (Input), description (Textarea), passingScore (Slider 50-95, default 75), durationMinutes (Input number, default 15), maxQuestions (Slider 5-30, default 10).
  2. Filters: domains (checkboxes from `allDomains`), levels (associate/professional/expert), difficulties (1/2/3), skills (checkboxes from `allSkills`). Styled button-toggles.
  3. Live preview: `buildCustomExam(spec).questions.length` → match count.
  4. "Save preset" → localStorage key `marketing-hub:custom-exam-presets` (JSON array of specs). "Start exam" → `buildCustomExam(spec)` then `onStart(exam)`.
  5. Saved presets list: title, match count, "Load", "Start", "Delete".
- Constraints: `"use client"`, strict, no `any`, localStorage allowed.

#### File C: `src/components/marketing/CertificateVerify.tsx`
- Props: `{ history: ExamResult[] }`
- Imports: from exams `verifyCertificate, type VerifiedCertificate`. From ui `Card, Button, Badge, Input`.
- Features:
  1. `Input` for cert ID + "Verify" button.
  2. `verifyCertificate(input, history.map(a => ({...})))` → render result: valid → green card with details + "Verified ✓" badge; invalid → red "Certificate not found".
  3. Recent valid cert IDs from history as clickable chips.
- Constraints: `"use client"`, strict, no `any`.

---

### Wave 3 — Upgrade `src/components/marketing/MarketingTests.tsx`

Sequential (single agent, owns the file). Add 5 features while preserving all existing behavior.

**Edit A — add per-question timing + option shuffling state:**
- Add `questionTimingsRef` (mirrors `Record<string, number>`), `optionShuffleRef` (`Map<string, { options: string[]; indexMap: number[] }>`), `fullscreenExitsRef`, `fullscreenExitsState`, `qStartRef` (timestamp when current question became active).
- `useEffect` during `running`: accumulate `Date.now() - qStartRef.current` into `questionTimingsRef.current[q.id]` every 500ms (or on question change + before submit).
- On `startExam`: for each question call `shuffleOptions(q)` and store in `optionShuffleRef`. Render shuffled options. In `computeResult`, call `unshuffleAnswer(selected, indexMap)` before scoring.

**Edit B — fullscreen proctor mode:**
- On `startExam`: `document.documentElement.requestFullscreen?.()` inside try/catch (continue silently if denied).
- `fullscreenchange` listener: if `!document.fullscreenElement` during running, increment `fullscreenExitsRef.current` and `fullscreenExitsState`.
- Show "Exit fullscreen to continue" warning when exits > 0.

**Edit C — copy/paste/right-click block:**
- During `running`, `document.addEventListener('copy', e => e.preventDefault())` (and `paste`, `cut`, `contextmenu`). Cleanup on phase change.

**Edit D — jsPDF certificate export:**
- Add `"Export PDF"` button on results (passed only). Import `jsPDF` from `"jspdf"`.
- Generate one-page PDF with: title, candidate, exam, band, percentage, date, cert ID (`certificateId(...)`), signature line. `doc.save(`certificate-${candidate}.pdf`)`.

**Edit E — wire 3 new phases:**
- Extend `type Phase` to `"picker" | "running" | "results" | "history" | "compare" | "analytics" | "builder" | "verify"`.
- Add imports for `ExamAnalytics`, `CustomExamBuilder`, `CertificateVerify`.
- Picker buttons: "Analytics", "Custom Exam Builder", "Verify Certificate".
- Render:
  - `"analytics"` → `<ExamAnalytics history={history} onBack={() => setPhase("picker")} onViewAttempt={(a) => { setViewingHistory(a); setPhase("results"); }} />`
  - `"builder"` → `<CustomExamBuilder onStart={(exam) => startExam(exam)} onBack={() => setPhase("picker")} />`
  - `"verify"` → `<CertificateVerify history={history} />`

**Edit F — preserve refs pattern:**
- Add `fullscreenExitsRef`, `questionTimingsRef`, `optionShuffleRef`, `qStartRef` to the mirror-refs block. Reset all in `startExam`/`restart`.
- `computeResult` reads from refs (same pattern as existing timer auto-submit).

---

### Wave 3.5 — Update `src/components/marketing/ExamCertificate.tsx`

Add two optional fields to canonical `ExamResult`:
```ts
questionTimings?: Record<string, number>;
fullscreenExits?: number;
```
In the certificate metadata grid, when present: show "Fullscreen exits: {n}" and "Avg time/question: {xs}".

---

## Validation

1. Typecheck (must be clean for our files):
   ```
   cd /home/uzer/marketing-hub && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "marketing-tests/exams|marketing/ExamCertificate|marketing/RecruiterCompare|marketing/MarketingTests|marketing/ExamAnalytics|marketing/CustomExamBuilder|marketing/CertificateVerify|app/marketing/page" || echo "CLEAN"
   ```
2. Pre-existing errors in `smarketing.ts` and `intent.ts` are unrelated — ignore them.
3. Functional smoke test: `npm run dev`, navigate to `/marketing` → Tests tab, verify picker loads, start an exam, confirm timer, tab-switch counter, submit, verify results show weighted %, skill breakdown, certificate (if passed), history entry.

## File Touch List

| File | Action | Notes |
|---|---|---|
| `src/lib/marketing-tests/exams.ts` | Modify | Wave 1: two inserts (shuffle helpers + analytics/custom/verify exports). EXAMS array untouched. |
| `src/components/marketing/ExamAnalytics.tsx` | Create | Wave 2A |
| `src/components/marketing/CustomExamBuilder.tsx` | Create | Wave 2B |
| `src/components/marketing/CertificateVerify.tsx` | Create | Wave 2C |
| `src/components/marketing/MarketingTests.tsx` | Modify | Wave 3: 6 edits (timing, shuffle, fullscreen, copy-block, PDF, new phases). Preserve all existing behavior. |
| `src/components/marketing/ExamCertificate.tsx` | Modify | Wave 3.5: add 2 optional fields to `ExamResult`. |
| `src/app/marketing/page.tsx` | Unchanged | Tests tab already wired. |

## Constraints & Gotchas

- **`noUncheckedIndexedAccess`**: all indexed accesses (`arr[i]`, `map.get(k)`, `spec.levels[0]`) must be guarded or use `!`.
- **`noUnusedLocals`/`noUnusedParameters`**: every import and local must be used. If `ExamAnalytics` imports `SKILL_BANDS`, it must reference it.
- **Discriminated-union narrowing**: in `MarketingTests` runner and answer review, narrow `q.type` via `isMultiSelect(q)` / `isNumeric(q)` before accessing type-specific fields. The answers state is `Record<string, number | number[]>`.
- **Stale-closure refs**: timer auto-submit must read latest state via refs. Add new refs to the same mirror pattern (`useEffect(() => { ref.current = state; }, [state])`).
- **Canonical `ExamResult`**: lives in `ExamCertificate.tsx`. Other files import it. If you add fields, add them there first, then update consumers.
- **No new dependencies**: `jspdf` is already present. Do not add packages.
- **localStorage**: only in client components. Wrap in `typeof window === "undefined"` guards for SSR safety where appropriate (MarketingTests already does this).
