"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCourseById, getEnrollment, getLessonById } from "@/lib/queries";
import { issueCertificateIfEligible } from "@/lib/access";

export async function enrollAction(formData: FormData) {
  const user = await requireUser();
  const courseId = String(formData.get("courseId") ?? "");
  const course = getCourseById(courseId);

  if (!course || course.status !== "published") {
    redirect("/courses?error=unavailable");
  }
  if (user.role !== "student") {
    redirect(`/courses/${course.slug}`);
  }

  const db = getDb();
  db.prepare(
    `INSERT OR IGNORE INTO enrollments (id, user_id, course_id)
     VALUES (?, ?, ?)`,
  ).run(`enr_${crypto.randomUUID()}`, user.id, courseId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/learning");
  revalidatePath(`/courses/${course.slug}`);
  redirect(`/dashboard/learning/${course.slug}?enrolled=1`);
}

export async function toggleLessonAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "student") redirect("/dashboard");

  const lessonId = String(formData.get("lessonId") ?? "");
  const nextLessonId = String(formData.get("nextLessonId") ?? "");
  const lesson = getLessonById(lessonId);
  if (!lesson) redirect("/dashboard/learning");

  const enrollment = getEnrollment(user.id, lesson.course_id);
  if (!enrollment) redirect(`/courses/${lesson.course_slug}?error=enroll`);

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?")
    .get(user.id, lessonId) as { id: string } | undefined;

  if (existing) {
    db.prepare("DELETE FROM lesson_progress WHERE id = ?").run(existing.id);
  } else {
    db.prepare(
      "INSERT OR IGNORE INTO lesson_progress (id, user_id, lesson_id) VALUES (?, ?, ?)",
    ).run(`lpr_${crypto.randomUUID()}`, user.id, lessonId);
  }

  const counts = db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = ?) AS total,
        (SELECT COUNT(*) FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          JOIN modules m ON m.id = l.module_id
          WHERE lp.user_id = ? AND m.course_id = ?) AS completed`,
    )
    .get(lesson.course_id, user.id, lesson.course_id) as {
    total: number;
    completed: number;
  };

  const complete = counts.total > 0 && counts.completed >= counts.total;
  db.prepare(
    `UPDATE enrollments SET completed_at = ?
     WHERE user_id = ? AND course_id = ?`,
  ).run(complete ? new Date().toISOString() : null, user.id, lesson.course_id);

  if (!existing) {
    await issueCertificateIfEligible(user.id, lesson.course_id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/learning");
  revalidatePath("/dashboard/certificates");
  revalidatePath(`/dashboard/learning/${lesson.course_slug}`);
  revalidatePath(`/courses/${lesson.course_slug}`);

  if (!existing && nextLessonId) {
    redirect(`/dashboard/learning/${lesson.course_slug}?lesson=${nextLessonId}&completed=1`);
  }
  redirect(`/dashboard/learning/${lesson.course_slug}?lesson=${lessonId}&updated=1`);
}
