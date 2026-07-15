# Methodology

## Objective
Build a documented, queryable database of the world's top marketing agencies, focused on
performance marketing, their proprietary tools, and open-source tooling usage.

## Data collection
Data was collected on **2026-07-15** by scraping 10 published "top agencies" rankings for 2026
(see `SOURCES.md`). Each source was fetched, parsed for agency entries, and the entities were
normalized into a single dataset (`data/agencies.json`).

## Normalization rules
- One row per agency; duplicate entries across sources are merged via a link table
  (`agency_sources`) that records the agency's rank in each list.
- `category` ∈ {network, independent, specialist, in-house}.
- `has_proprietary_tools` is `true` only when the agency is documented to own/operate its own
  named technology. `false` means it runs on commercial / native platforms. `null` = unknown.
- `uses_open_source` follows the same convention for open-source data/analytics tooling.
- Tools are categorized as `proprietary`, `commercial`, or `open-source`.

## Known limitations
- Publishers' rankings are subjective and vary by metric (creative, media, revenue, ROI).
- Many agencies do not publicly disclose internal tooling, so `null` is common and does not
  imply "does not use".
- Open-source usage is largely inferred for engineering-led shops; items marked are best-effort.
- WebFetch returns summarized page content; very long lists may be truncated and supplemented
  with the conversation's prior knowledge of these agencies.
- No financials, headcount, or client lists are guaranteed complete.

## Reproducibility
Everything is regenerated from `data/agencies.json` via `build_db.py`. To add a source: append it
to `sources`, add any new agencies / `source_ranks`, then re-run the script.
