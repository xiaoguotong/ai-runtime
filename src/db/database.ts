import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { DatabaseError } from "../errors/index.js";

export interface DatabaseOptions {
  filePath: string;
  foreignKeys?: boolean;
  journalMode?: "DELETE" | "WAL" | "TRUNCATE" | "PERSIST" | "MEMORY";
  busyTimeoutMs?: number;
}

export function openDatabase(options: DatabaseOptions): Database.Database {
  const { filePath, foreignKeys = true, journalMode = "WAL", busyTimeoutMs = 5000 } = options;

  if (filePath !== ":memory:") {
    const dir = path.dirname(filePath);
    if (dir && dir !== ".") {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        throw new DatabaseError(`无法创建数据库目录: ${dir}`, error);
      }
    }
  }

  let db: Database.Database;
  try {
    db = new Database(filePath);
  } catch (error) {
    throw new DatabaseError(`无法打开 SQLite 数据库: ${filePath}`, error);
  }

  try {
    db.pragma(`journal_mode = ${journalMode}`);
    db.pragma(`foreign_keys = ${foreignKeys ? "ON" : "OFF"}`);
    db.pragma(`busy_timeout = ${busyTimeoutMs}`);
  } catch (error) {
    db.close();
    throw new DatabaseError("初始化 SQLite pragma 失败", error);
  }

  return db;
}
