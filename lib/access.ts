import "server-only";
import { redirect } from "next/navigation";
import { requireStaff, requireUser } from "@/lib/auth";
import { getCourseById } from "@/lib/queries";
import { getDb } from "@/lib/db";
import { randomCode } from "@/lib/utils";
import type { Course, PublicUser } from "@/lib/types";

export function canManageCourse(user: PublicUser, course: Course) {
  return user.role === "admin" || course.instructor_id === user.id;
}

export async function requireCourseManager(courseId: string) {
  const user = await requireStaff();
  const course = getCourseById(courseId);
  if (!course || !canManageCourse(user, course)) {
    redirect("/dashboard/courses?error=not-found");
  }
  return { user, course };
}

export async function requireStudentForCourse(courseId: string) {
  const user = await requireUser();
  if (user.role !== "student") redirect("/dashboard");
  return user;
}

export function canViewStudent(user: PublicUser, studentId: string) {
  return user.role === "admin" || user.id === studentId;
}

export async function issueCertificateIfEligible(userId: string, courseId: string) {
  const db = getDb();

  const lessonStats = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = ?) AS total,
        (SELECT COUNT(*) FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          JOIN modules m ON m.id = l.module_id
          WHERE lp.user_id = ? AND m.course_id = ?) AS completed`,
    )
    .get(courseId, userId, courseId) as { total: number; completed: number };

  if (lessonStats.total === 0 || lessonStats.completed < lessonStats.total) {
    return null;
  }

  const assessments = db
    .prepare(
      "SELECT id FROM assessments WHERE course_id = ? AND status = 'published'",
    )
    .all(courseId) as { id: string }[];

  for (const assessment of assessments) {
    const passed = db
      .prepare(
        "SELECT 1 FROM attempts WHERE assessment_id = ? AND user_id = ? AND status = 'submitted' AND passed = 1 LIMIT 1",
      )
      .get(assessment.id, userId);
    if (!passed) return null;
  }

  const existing = db
    .prepare("SELECT code FROM certificates WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as { code: string } | undefined;
  if (existing) return existing.code;

  let code = randomCode("BF");
  let guard = 0;
  while (
    db.prepare("SELECT 1 FROM certificates WHERE code = ?").get(code) &&
    guard < 10
  ) {
    code = randomCode("BF");
    guard += 1;
  }

  db.prepare(
    `INSERT INTO certificates (id, user_id, course_id, code)
     VALUES (?, ?, ?, ?)`,
  ).run(`cert_${crypto.randomUUID()}`, userId, courseId, code);

  return code;
}

export function getCourseAssessmentProgress(userId: string, courseId: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT a.id, a.title,
        (SELECT COUNT(*) FROM attempts at
          WHERE at.assessment_id = a.id AND at.user_id = ? AND at.status = 'submitted') AS attempt_count,
        (SELECT MAX(at.passed) FROM attempts at
          WHERE at.assessment_id = a.id AND at.user_id = ? AND at.status = 'submitted') AS passed
       FROM assessments a
       WHERE a.course_id = ? AND a.status = 'published'
       ORDER BY a.created_at`,
    )
    .all(userId, userId, courseId) as {
    id: string;
    title: string;
    attempt_count: number;
    passed: number | null;
  }[];
}
