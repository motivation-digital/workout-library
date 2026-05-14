let schemaReady = false;

export async function ensureSchema(db) {
  if (schemaReady) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS workout_library (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    kajabi_post_id      TEXT NOT NULL UNIQUE,
    kajabi_category_id  TEXT NOT NULL DEFAULT '',
    category            TEXT NOT NULL DEFAULT '',
    title               TEXT NOT NULL,
    description         TEXT,
    filter_tags         TEXT,
    image_url           TEXT,
    wistia_id           TEXT,
    duration_min        INTEGER,
    kajabi_url          TEXT NOT NULL DEFAULT '',
    position            INTEGER DEFAULT 0,
    status              TEXT DEFAULT 'active',
    scraped_at          TEXT,
    created_at          TEXT DEFAULT (datetime('now')),
    updated_at          TEXT DEFAULT (datetime('now'))
  )`).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_wl_cat   ON workout_library(category, status)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_wl_stat  ON workout_library(status)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_wl_wist  ON workout_library(wistia_id)').run();
  schemaReady = true;
}
