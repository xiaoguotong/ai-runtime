import { describe, it, expect, afterEach } from "vitest";
import type Database from "better-sqlite3";
import { openDatabase } from "../src/db/database.js";
import {
  ensureMigrationTable,
  getAppliedVersions,
  runMigrations,
  type Migration,
} from "../src/db/migration.js";
import { MigrationError } from "../src/errors/index.js";

const opened: Database.Database[] = [];

function withDb(): Database.Database {
  const db = openDatabase({ filePath: ":memory:" });
  opened.push(db);
  return db;
}

afterEach(() => {
  while (opened.length > 0) {
    opened.pop()?.close();
  }
});

const M1: Migration = {
  version: 1,
  name: "create_notes",
  sql: "CREATE TABLE notes (id TEXT PRIMARY KEY, body TEXT NOT NULL);",
};

const M2: Migration = {
  version: 2,
  name: "add_notes_created_at",
  sql: "ALTER TABLE notes ADD COLUMN created_at INTEGER;",
};

describe("migration runner", () => {
  it("creates the migration table on demand", () => {
    const db = withDb();
    expect(getAppliedVersions(db)).toEqual([]);
    ensureMigrationTable(db);
    const rows = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
    expect(rows).toEqual(expect.arrayContaining([{ name: "schema_migrations" }]));
  });

  it("applies migrations in version order and records them", () => {
    const db = withDb();
    const count = runMigrations(db, [M2, M1]);
    expect(count).toBe(2);
    expect(getAppliedVersions(db)).toEqual([1, 2]);
    const columns = db.prepare("PRAGMA table_info(notes)").all() as Array<{ name: string }>;
    expect(columns.map((c) => c.name)).toContain("created_at");
  });

  it("is idempotent for already applied versions", () => {
    const db = withDb();
    expect(runMigrations(db, [M1])).toBe(1);
    expect(runMigrations(db, [M1])).toBe(0);
    expect(getAppliedVersions(db)).toEqual([1]);
  });

  it("rejects duplicate versions", () => {
    const db = withDb();
    expect(() => runMigrations(db, [M1, { ...M1, name: "dup" }])).toThrow(MigrationError);
  });
});
