import { describe, it, expect, afterEach } from "vitest";
import type Database from "better-sqlite3";
import { openDatabase } from "../src/db/database.js";
import { DatabaseError } from "../src/errors/index.js";

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

describe("openDatabase", () => {
  it("opens an in-memory database and applies pragmas", () => {
    const db = withDb();
    expect(db.pragma("foreign_keys", { simple: true })).toBe(1);
    expect(db.pragma("busy_timeout", { simple: true })).toBe(5000);
    expect(db.pragma("journal_mode", { simple: true })).toBe("memory");
  });

  it("creates parent directories for a file-backed database", () => {
    const filePath = "./data/test-init.db";
    const db = openDatabase({ filePath });
    opened.push(db);
    expect(db.open).toBe(true);
  });

  it("throws DatabaseError when the path is invalid", () => {
    expect(() => openDatabase({ filePath: "/nonexistent/root/path/runtime.db" })).toThrow(
      DatabaseError,
    );
  });
});
