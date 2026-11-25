import type Database from "better-sqlite3";
import { MigrationError } from "../errors/index.js";

export interface Migration {
  version: number;
  name: string;
  sql: string;
}

const MIGRATIONS_TABLE = "schema_migrations";

export function ensureMigrationTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `);
}

export function getAppliedVersions(db: Database.Database): number[] {
  ensureMigrationTable(db);
  const rows = db
    .prepare(`SELECT version FROM ${MIGRATIONS_TABLE} ORDER BY version ASC`)
    .all() as Array<{ version: number }>;
  return rows.map((row) => row.version);
}

export function runMigrations(db: Database.Database, migrations: readonly Migration[]): number {
  ensureMigrationTable(db);

  const sorted = [...migrations].sort((a, b) => a.version - b.version);
  const seen = new Set<number>();
  for (const migration of sorted) {
    if (seen.has(migration.version)) {
      throw new MigrationError(`重复的 migration 版本: ${migration.version}`);
    }
    seen.add(migration.version);
  }

  const applied = new Set(getAppliedVersions(db));
  let count = 0;

  const apply = db.transaction((migration: Migration) => {
    db.exec(migration.sql);
    db.prepare(
      `INSERT INTO ${MIGRATIONS_TABLE} (version, name, applied_at) VALUES (?, ?, ?)`,
    ).run(migration.version, migration.name, Date.now());
  });

  for (const migration of sorted) {
    if (applied.has(migration.version)) {
      continue;
    }
    try {
      apply(migration);
      count += 1;
    } catch (error) {
      throw new MigrationError(`执行 migration ${migration.version} (${migration.name}) 失败`, error);
    }
  }

  return count;
}
