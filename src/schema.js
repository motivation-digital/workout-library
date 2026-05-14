let schemaReady = false;

export async function ensureSchema(db) {
  if (schemaReady) return;

  // academy_content is owned by kajabi-migration; this ensures it exists locally
  // and has the image_url column added in LCE-10000184
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS academy_content (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id       TEXT NOT NULL UNIQUE,
      category_id   TEXT NOT NULL DEFAULT '',
      chapter_order INTEGER NOT NULL DEFAULT 0,
      level         TEXT NOT NULL DEFAULT '',
      title         TEXT NOT NULL,
      body          TEXT NOT NULL DEFAULT '[]',
      wistia_id     TEXT,
      duration_min  INTEGER,
      downloads     TEXT,
      source_url    TEXT NOT NULL DEFAULT '',
      image_url     TEXT,
      status        TEXT DEFAULT 'active',
      created_at    TEXT DEFAULT (datetime('now')),
      updated_at    TEXT DEFAULT (datetime('now'))
    )
  `).run();

  try {
    await db.prepare('ALTER TABLE academy_content ADD COLUMN image_url TEXT').run();
  } catch (e) { /* column already exists */ }

  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_ac_order ON academy_content(chapter_order)'
  ).run();

  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_ac_level ON academy_content(level)'
  ).run();

  schemaReady = true;
}
