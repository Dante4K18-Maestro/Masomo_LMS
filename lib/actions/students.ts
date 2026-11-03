"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { hashPassword, requireRole } from "@/lib/auth";
import { getCourseById } from "@/lib/queries";

export type StudentFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createStudentAction(
  _prevState: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  await requireRole(["admin"]);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) fieldErrors.name = "Enter the student's full name.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    fieldErrors.password = "Include uppercase, lowercase, and a number.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return { fieldErrors: { email: "A user with this email already exists." } };
  }

  const colors = ["lime", "electric", "coral", "violet", "amber", "sky", "emerald"];
  const userId = `usr_${crypto.randomUUID()}`;

  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, avatar_color, headline, status)
     VALUES (?, ?, ?, ?, 'student', ?, 'New BrighterFuture learner', 'active')`,
  ).run(
    userId,
    name,
    email,
    await hashPassword(password),
    colors[Math.floor(Math.random() * colors.length)],
  );

  if (courseId) {
    const course = getCourseById(courseId);
    if (course) {
      db.prepare(
        `INSERT OR IGNORE INTO enrollments (id, user_id, course_id)
         VALUES (?, ?, ?)`,
      ).run(`enr_${crypto.randomUUID()}`, userId, courseId);
    }
  }

  revalidatePath("/dashboard/students");
  revalidatePath("/dashboard");
  return {
    success: `${name} has been added. Share the temporary password securely — it will not be shown again.`,
  };
}

export async function updateStudentStatusAction(formData: FormData) {
  await requireRole(["admin"]);
  const userId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["active", "suspended"].includes(status)) return;
  getDb()
    .prepare("UPDATE users SET status = ? WHERE id = ? AND role = 'student'")
    .run(status, userId);
  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${userId}`);
}

export async function updateStudentDetailsAction(formData: FormData) {
  await requireRole(["admin"]);
  const userId = String(formData.get("userId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  if (name.length < 2) redirect(`/dashboard/students/${userId}?error=name`);
  getDb()
    .prepare("UPDATE users SET name = ?, headline = ? WHERE id = ? AND role = 'student'")
    .run(name, headline || null, userId);
  revalidatePath(`/dashboard/students/${userId}`);
  revalidatePath("/dashboard/students");
  redirect(`/dashboard/students/${userId}?saved=1`);
}
