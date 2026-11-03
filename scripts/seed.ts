import { getDb } from "../lib/db";
import { seedDatabase } from "../lib/seed";

const db = getDb();

const before = db.prepare("SELECT COUNT(*) AS count FROM users").get() as {
  count: number;
};

if (before.count > 0) {
  console.log(
    `Database already contains ${before.count} users; nothing to seed. Run "npm run db:reset" to rebuild it from scratch.`,
  );
} else {
  seedDatabase(db);
}

const counts = db
  .prepare(
    `SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM lessons) AS lessons,
      (SELECT COUNT(*) FROM assessments) AS assessments,
      (SELECT COUNT(*) FROM enrollments) AS enrollments,
      (SELECT COUNT(*) FROM attempts) AS attempts,
      (SELECT COUNT(*) FROM certificates) AS certificates`,
  )
  .get() as Record<string, number>;

console.log("Seed data summary:");
for (const [label, value] of Object.entries(counts)) {
  console.log(`  ${label}: ${value}`);
}

console.log("\nDemo accounts:");
console.log("  Admin       admin@brighterfuture.dev      / Admin123!");
console.log("  Instructor  instructor@brighterfuture.dev / Teach123!");
console.log("  Student     student@brighterfuture.dev    / Student123!");
