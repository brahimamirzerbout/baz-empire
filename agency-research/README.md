# Agency Research Database

A documented, queryable database of the world's top **marketing agencies** — with a focus on
**performance marketing agencies**, their **proprietary tools**, and **open-source tooling usage**.

Built by scraping 10 published "top agencies" rankings (2026) and normalizing the data into a
SQLite database plus CSV / JSON / Markdown exports.

## Project layout

```
agency-research/
├── README.md                 # this file
├── build_db.py               # single source of truth: regenerates everything from data/agencies.json
├── data/
│   ├── agencies.json         # master dataset (sources + agencies + attributes)
│   ├── agencies.db           # SQLite database (generated)
│   ├── agencies.csv          # flat agency export (generated)
│   ├── agencies.json.export  # re-exported normalized JSON (generated)
│   └── tools.csv             # tool-level export (generated)
├── docs/
│   ├── SCHEMA.md             # database schema reference
│   ├── METHODOLOGY.md        # how data was collected + limitations
│   ├── SOURCES.md            # the 10 scraped sources
│   ├── PERFORMANCE_AGENCIES.md
│   ├── PROPRIETARY_TOOLS.md
│   └── OPEN_SOURCE.md
├── per-agency/               # one Markdown file per agency (generated)
└── sources/                  # raw scraped text per source (generated)
```

## How to regenerate

```bash
cd agency-research
python3 build_db.py
```

Outputs: `agencies.db`, `agencies.csv`, `tools.csv`, `agencies.json.export`,
`per-agency/*.md`, and the consolidated `docs/*.md` index pages.

## Quick query examples

```bash
# Agencies that own proprietary tools
python3 -c "import sqlite3;c=sqlite3.connect('data/agencies.db');print([r[0] for r in c.execute(\"SELECT name FROM agencies WHERE has_proprietary_tools=1 ORDER BY name\")])"

# Count agencies per category
python3 -c "import sqlite3;c=sqlite3.connect('data/agencies.db');[print(r) for r in c.execute('SELECT category,COUNT(*) FROM agencies GROUP BY category')]"
```

## Current snapshot (generated 2026-07-15)

| Metric | Value |
|--------|-------|
| Agencies | **141** |
| - independent | 108 |
| - network (holding companies / group agencies) | 17 |
| - specialist (mobile, B2B, fintech, influencer…) | 16 |
| Sources scraped | 8 full + 1 partial + 1 failed (DesignRush 403 → partial via PR; Ranktracker 403 → list not recoverable) |
| Agencies with proprietary tools | **35** (47 proprietary tools recorded) |
| Agencies flagged using open source | 4 (14 open-source tools recorded) |
| Agencies with a client rating | 86 |
| Agency↔source rank links | 161 |
| Per-agency Markdown files | 141 |

> Honest limitation: open-source usage is only recorded where a source or prior
> knowledge clearly indicated it (engineering-led shops). `null` is far more common
> than `false` and does **not** mean "does not use open source."

## Data freshness

Scraped: 2026-07-15. Rankings reflect each publisher's 2026 lists. See `docs/SOURCES.md`.
