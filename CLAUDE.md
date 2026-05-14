# workout-library

Serves the DreamBody Club workout library — HTML page renderer, filterable dashboard, and JSON API for workout data.

Deploys to: workout-library CF worker (wl.dreambody.club/*)
Lifecycle repo: https://github.com/motivation-digital/lifecycle

## ⛔ Must not change

- `workout_library` table schema — used by aicoach worker via JOIN on `image_url`; any column rename/drop breaks the JOIN
- `/api/recommend` response shape (`{ workout: row | null }`) — called by launchpad-dashboard; changing it breaks the dashboard recommendation widget
- `/api/workouts` and `/api/workout/:kajabi_post_id` response shapes — consumed by external clients; trace all consumers before changing
- CORS allowlist (`d.dreambody.club`, `dreambody.club`, `www.dreambody.club`, `wl.dreambody.club`) — do not add wildcard or remove origins without audit
- `DB_CONTENT` binding name — referenced in all D1 queries; renaming breaks the worker entirely

## Current state

Live as of 2026-05-14 (LCE-10000186). CNAME + zone route active at wl.dreambody.club/*. 589 active workout rows in `workout_library` table in dbc-content D1. API-based deploy (GitHub Actions → CF API PUT with keep_bindings:true).

## Endpoints

| Method | Path | Purpose | Auth |
| --- | --- | --- | --- |
| GET | / | HTML dashboard — sidebar nav + filter panel + card grid | None |
| GET | /workouts | Alias for / | None |
| GET | /:kajabi_post_id | HTML lesson page — Wistia embed + metadata chips | None |
| GET | /api/recommend | { workout: row \| null } — random workout, optional ?category= | None |
| GET | /api/workouts | { workouts: [], count: n } — paginated list, optional ?category=&limit=&offset= | None |
| GET | /api/workout/:kajabi_post_id | { ...row } — single workout by Kajabi post ID | None |
| GET | /health | { ok: true, rows: n } — active row count | None |
| OPTIONS | * | CORS preflight | None |

## D1 bindings

| Binding | Database | Access |
| --- | --- | --- |
| DB_CONTENT | dbc-content (80145bdd-402d-45af-b76b-26591281a095) | read/write |

## Rules (inline — full rules in lifecycle)

- Rule 1: Confirm repo first. `pwd` and `git remote -v` before anything.
- Rule 2: Read before touching. Check CLAUDE.md and current main.
- Rule 9: Trace all consumers before removing any parameter, endpoint, or field.
- Rule 14: Every session is referenced by its ClickUp task ID (e.g. `LCE-10000040`).
