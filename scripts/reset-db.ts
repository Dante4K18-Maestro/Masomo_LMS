import fs from "node:fs";
import path from "node:path";
import { getDb } from "../lib/db";

const dbPath =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "brighterfuture.db");

for (const suffix of ["", "-shm", "-wal"]) {
  const file = `${dbPath}${suffix}`;
  if (fs.existsSync(file)) {
    fs.rmSync(file);
    console.log(`Removed ${path.relative(process.cwd(), file)}`);
  }
}

// lib/db only opens a connection inside getDb(), so the files above are gone
// by the time the schema is recreated and the seed runs.
const db = getDb();
const counts = db
  .prepare(
    `SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM assessments) AS assessments,
      (SELECT COUNT(*) FROM enrollments) AS enrollments`,
  )
  .get() as {
  users: number;
  courses: number;
  assessments: number;
  enrollments: number;
};

console.log(`Database reset at ${dbPath}`);
console.log(
  `Seeded ${counts.users} users, ${counts.courses} courses, ${counts.assessments} assessments, ${counts.enrollments} enrollments.`,
);
