# Database Schema

Engine: **SQLite 3** (`data/agencies.db`). The schema is generated from `data/agencies.json`
by `build_db.py`. All tables use an integer `id` primary key unless noted.

## Tables

### `sources`
Provenance for every ranking we scraped.

| column         | type    | notes                                   |
|----------------|---------|-----------------------------------------|
| id             | TEXT PK | stable slug, e.g. `designrush`          |
| url            | TEXT    | source URL                              |
| title          | TEXT    | page title                              |
| publisher      | TEXT    | site / brand that published it          |
| publish_date   | TEXT    | YYYY-MM-DD or null                      |
| scraped_at     | TEXT    | ISO timestamp of scrape                 |
| status         | TEXT    | `scraped` / `failed` / `partial`        |
| notes          | TEXT    | free text                               |

### `agencies`
Core entity. One row per agency.

| column                | type    | notes                                                        |
|-----------------------|---------|--------------------------------------------------------------|
| id                    | INTEGER | autoincrement                                                |
| name                  | TEXT    | official name                                                |
| slug                  | TEXT    | url-safe unique key                                          |
| category              | TEXT    | `network`, `independent`, `specialist`, `in-house`           |
| hq                    | TEXT    | headquarters city/region                                     |
| country               | TEXT    | HQ country                                                   |
| founded               | INTEGER | year founded (null if unknown)                               |
| employees_min         | INTEGER | lower bound estimate (null)                                  |
| employees_max         | INTEGER | upper bound estimate (null)                                  |
| website               | TEXT    | primary URL                                                  |
| description           | TEXT    | short blurb                                                  |
| has_proprietary_tools | INTEGER | 1/0/ null (unknown)                                          |
| proprietary_tools     | TEXT    | JSON array of owned tool names                               |
| uses_open_source      | INTEGER | 1/0/ null (unknown)                                          |
| open_source_stack     | TEXT    | JSON array of open-source tools used                         |
| rating                | REAL    | published client rating (null)                               |
| min_project_cost      | TEXT    | minimum engagement cost (null)                               |
| notes                 | TEXT    | free text                                                    |

### `agency_services`
| column      | type | notes                         |
|-------------|------|-------------------------------|
| id          | INTEGER |                             |
| agency_id   | INTEGER | FK -> agencies.id          |
| service     | TEXT | e.g. `Paid Search`, `SEO`     |

### `agency_clients`
| column      | type | notes                         |
|-------------|------|-------------------------------|
| id          | INTEGER |                             |
| agency_id   | INTEGER | FK -> agencies.id          |
| client      | TEXT | notable client name            |

### `agency_industries`
| column      | type | notes                         |
|-------------|------|-------------------------------|
| id          | INTEGER |                             |
| agency_id   | INTEGER | FK -> agencies.id          |
| industry    | TEXT | vertical served                |

### `tools`
Tool-level fact table (proprietary + commercial + open-source).

| column      | type | notes                                           |
|-------------|------|-------------------------------------------------|
| id          | INTEGER |                                               |
| agency_id   | INTEGER | FK -> agencies.id                            |
| tool_name   | TEXT | name of the tool                               |
| tool_type   | TEXT | `proprietary` / `commercial` / `open-source`    |
| category    | TEXT | `analytics`, `paid-media`, `seo`, `bi`, ...     |
| url         | TEXT | tool homepage (null)                            |

### `agency_sources`
Link table: which agency appeared in which source, and its rank there.

| column      | type | notes                              |
|-------------|------|------------------------------------|
| id          | INTEGER |                                  |
| agency_id   | INTEGER | FK -> agencies.id               |
| source_id   | TEXT    | FK -> sources.id                |
| rank_in_source | INTEGER | position in that list (null)  |
| notes       | TEXT |                                    |

## Views

### `v_proprietary`
Agencies (`name`, `proprietary_tools`) where `has_proprietary_tools = 1`.

### `v_open_source`
Agencies (`name`, `open_source_stack`) where `uses_open_source = 1`.
