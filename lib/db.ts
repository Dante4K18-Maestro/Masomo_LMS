import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "@/lib/schema";
import { seedDatabase } from "@/lib/seed";

const globalForDb = globalThis as unknown as {
  __brighterFutureDb?: Database.Database;
};

function createDatabase() {
  const dbPath =
    process.env.DATABASE_PATH ??
    path.join(process.cwd(), "data", "brighterfuture.db");

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  const userCount = db
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get() as { count: number };

  if (userCount.count === 0) {
    seedDatabase(db);
  }

  return db;
}

export function getDb() {
  if (!globalForDb.__brighterFutureDb) {
    globalForDb.__brighterFutureDb = createDatabase();
  }
  return globalForDb.__brighterFutureDb;
}

export type Db = ReturnType<typeof getDb>;
