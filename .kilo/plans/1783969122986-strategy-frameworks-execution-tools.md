# Plan: Strategy Frameworks with Execution Tools

## Current state
- 42 strategy frameworks in `src/lib/frameworks.ts` (`STRATEGY_FRAMEWORKS`)
- Rendered as expandable cards on `/strategy/stp` (Strategy Library panel)
- No dedicated `/strategy/frameworks` page
- No execution tools — frameworks are reference-only

## Goal
Add execution tools (scorecards, templates, calculators, decision trees) to strategy frameworks so users can act on them, not just read them. Deliver a standalone `/strategy/frameworks` page.

## Decisions

| Decision | Choice |
|---|---|
| Tool types | `scorecard`, `template`, `calculator`, `decision_tree` |
| Execution UI | Expandable panel inline on the frameworks page (no new route per tool) |
| Compute location | Client-side in tool components (follows `library.ts` Formula pattern) |
| Coverage target | 20 of 42 frameworks get tools; rest show "Reference only" |
| API | None — compute client-side; no server state needed |

## Data model changes

**File:** `src/lib/frameworks.ts`

Extend `StrategyFramework`:
```ts
type StrategyTool = {
  type: "scorecard" | "template" | "calculator" | "decision_tree";
  title: string;
  inputs: Array<{
    id: string;
    label: string;
    type: "select" | "number" | "slider" | "text" | "radio";
    options?: string[];
    min?: number;
    max?: number;
    default?: number | string;
  }>;
  compute?: (inputs: Record<string, any>) => { score?: number; verdict?: string; output?: string };
  scoring?: Array<{ max: number; label: string; color: string }>;
};

type StrategyFramework = {
  ...
  tool?: StrategyTool;
};
```

Add `tool` field to 20 existing frameworks (STP, Positioning Statement, Porter Generic, Blue Ocean, SWOT, Ansoff, BCG, AARRR, 7Ps, 4Ps, Brand Pyramid, Awareness Levels, RFM, NPS, Customer Journey, PESTEL, OKR, Balanced Scorecard, Jobs-to-be-Done, Category Creation).

## New files

| File | Purpose |
|---|---|
| `src/app/strategy/frameworks/page.tsx` | Standalone browsable strategy catalog with execution |
| `src/components/strategy/ScorecardTool.tsx` | Slider/radio inputs + score gauge + verdict |
| `src/components/strategy/TemplateTool.tsx` | Fill-in-the-blank fields + generated output |
| `src/components/strategy/CalculatorTool.tsx` | Number inputs + computed result display |
| `src/components/strategy/DecisionTreeTool.tsx` | Step-by-step yes/no flow with branching |

## Modified files

| File | Change |
|---|---|
| `src/lib/frameworks.ts` | Add `StrategyTool` type, add `tool` to 20 frameworks |
| `src/app/strategy/stp/page.tsx` | Link Strategy Library cards to `/strategy/frameworks` instead of inline expansion |
| `src/components/Sidebar.tsx` | Add `Frameworks` entry under Strategy group |
| `src/app/strategy/page.tsx` | Add Frameworks workbench card (or link to STP if keeping it minimal) |

## Execution tool patterns

### Scorecard (e.g., Positioning Scorecard)
- 5–8 criteria sliders (0–10)
- Compute weighted average → score out of 100
- Show verdict: "Strong / Needs work / Weak" with color
- Example: Positioning Scorecard → clarity, differentiation, proof, relevance, simplicity

### Template (e.g., Positioning Statement Template)
- 4–6 text inputs (target, frame of reference, difference, proof, brand)
- Live preview of the filled template
- Copy-to-clipboard button
- Example: fills the `POSITIONING_TEMPLATE` with user input

### Calculator (e.g., BCG Matrix Calculator)
- 2 number inputs per quadrant (market growth %, relative market share)
- Compute quadrant placement for each of 4 products
- Show visual 2×2 matrix with plotted products
- Example: BCG → star/cash-cow/dog/question-mark classification

### Decision tree (e.g., Market Entry Decision Tree)
- 6–8 yes/no questions with branching
- Each answer advances to next question
- Final verdict with recommended strategy
- Example: "Should we enter this market?" → questions on size, competition, differentiation, etc.

## UI flow

1. User visits `/strategy/frameworks`
2. Sees searchable/filterable grid of all 42+ frameworks
3. Each card shows title, author, category, one-liner
4. Frameworks with tools show an "Execute" badge/button
5. Clicking "Execute" expands the tool inline below the card (or opens a Modal for calculators/decision trees)
6. User fills inputs → sees live result
7. Scorecards show gauge; templates show preview; calculators show result; decision trees show path

## Validation

- `tsc --noEmit` passes for all changed files
- Verify each tool type renders correctly in dev (`npm run dev`)
- Check that frameworks without tools still render as read-only cards
- Verify sidebar navigation to `/strategy/frameworks` works
- Verify STP Strategy Library links redirect correctly

## Out of scope

- Persisting tool results to DB (no `/api/strategy-tools` endpoint needed)
- AI-generated strategy recommendations (keep tools deterministic)
- Mobile-specific tool layouts (use existing responsive patterns)
- Framework CRUD (frameworks are static catalog data)
