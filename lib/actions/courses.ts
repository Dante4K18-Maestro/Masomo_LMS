"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireCourseManager } from "@/lib/access";
import { requireStaff } from "@/lib/auth";
import { getCourseById } from "@/lib/queries";
import { COURSE_COVERS, COURSE_LEVELS, IT_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export type CourseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
};

function courseInputFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    level: String(formData.get("level") ?? ""),
    duration: Number(formData.get("duration") ?? 0),
    cover: String(formData.get("cover") ?? "ocean"),
    outcomes: String(formData.get("outcomes") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    requirements: String(formData.get("requirements") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  };
}

function validateCourse(input: ReturnType<typeof courseInputFromForm>) {
  const fieldErrors: Record<string, string> = {};
  if (input.title.length < 4) fieldErrors.title = "Use at least 4 characters.";
  if (input.title.length > 100) fieldErrors.title = "Keep the title under 100 characters.";
  if (input.subtitle.length < 12) fieldErrors.subtitle = "Write a subtitle of at least 12 characters.";
  if (input.description.length < 60) fieldErrors.description = "Write at least 60 characters so students know what to expect.";
  if (!IT_CATEGORIES.includes(input.category as (typeof IT_CATEGORIES)[number])) {
    fieldErrors.category = "Choose an IT category.";
  }
  if (!COURSE_LEVELS.includes(input.level as (typeof COURSE_LEVELS)[number])) {
    fieldErrors.level = "Choose a level.";
  }
  if (!Number.isFinite(input.duration) || input.duration < 1 || input.duration > 200) {
    fieldErrors.duration = "Enter a duration between 1 and 200 hours.";
  }
  if (!COURSE_COVERS.some((cover) => cover.value === input.cover)) {
    fieldErrors.cover = "Choose a cover theme.";
  }
  if (input.outcomes.length < 2) {
    fieldErrors.outcomes = "Add at least two learning outcomes, one per line.";
  }
  return fieldErrors;
}

function uniqueSlug(title: string, currentId?: string) {
  const db = getDb();
  const base = slugify(title) || "course";
  let slug = base;
  let counter = 2;

  while (true) {
    const existing = db
      .prepare("SELECT id FROM courses WHERE slug = ?")
      .get(slug) as { id: string } | undefined;
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

function revalidateCourseSurfaces(slug?: string) {
  revalidatePath("/");
  revalidatePath("/courses");
  if (slug) revalidatePath(`/courses/${slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/learning");
  revalidatePath("/dashboard/analytics");
}

export async function createCourseAction(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const user = await requireStaff();
  const input = courseInputFromForm(formData);
  const fieldErrors = validateCourse(input);

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const db = getDb();
  const id = `crs_${crypto.randomUUID()}`;
  const slug = uniqueSlug(input.title);
  const instructorId =
    user.role === "admin"
      ? String(formData.get("instructorId") ?? user.id)
      : user.id;

  const instructor = db
    .prepare("SELECT id FROM users WHERE id = ? AND role IN ('instructor', 'admin')")
    .get(instructorId);
  if (!instructor) {
    return { fieldErrors: { instructorId: "Choose a valid instructor." } };
  }

  db.prepare(
    `INSERT INTO courses (
      id, slug, title, subtitle, description, category, level, duration_hours,
      cover, status, outcomes, requirements, instructor_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)`,
  ).run(
    id,
    slug,
    input.title,
    input.subtitle,
    input.description,
    input.category,
    input.level,
    input.duration,
    input.cover,
    JSON.stringify(input.outcomes),
    JSON.stringify(input.requirements),
    instructorId,
  );

  revalidateCourseSurfaces(slug);
  redirect(`/dashboard/courses/${id}/edit?created=1`);
}

export async function updateCourseAction(
  _prevState: CourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  const courseId = String(formData.get("courseId") ?? "");
  const { course } = await requireCourseManager(courseId);
  const input = courseInputFromForm(formData);
  const fieldErrors = validateCourse(input);

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const db = getDb();
  const slug = uniqueSlug(input.title, courseId);
  const user = await requireStaff();
  let instructorId = course.instructor_id;

  if (user.role === "admin") {
    instructorId = String(formData.get("instructorId") ?? course.instructor_id);
    const instructor = db
      .prepare("SELECT id FROM users WHERE id = ? AND role IN ('instructor', 'admin')")
      .get(instructorId);
    if (!instructor) {
      return { fieldErrors: { instructorId: "Choose a valid instructor." } };
    }
  }

  db.prepare(
    `UPDATE courses SET
      slug = ?, title = ?, subtitle = ?, description = ?, category = ?,
      level = ?, duration_hours = ?, cover = ?, outcomes = ?, requirements = ?,
      instructor_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
     WHERE id = ?`,
  ).run(
    slug,
    input.title,
    input.subtitle,
    input.description,
    input.category,
    input.level,
    input.duration,
    input.cover,
    JSON.stringify(input.outcomes),
    JSON.stringify(input.requirements),
    instructorId,
    courseId,
  );

  revalidateCourseSurfaces(slug);
  if (course.slug !== slug) revalidatePath(`/courses/${course.slug}`);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  return { success: "Course details saved." };
}

export async function updateCourseStatusAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const { course } = await requireCourseManager(courseId);

  if (!["draft", "published", "archived"].includes(status)) return;

  if (status === "published") {
    const lessonCount = getDb()
      .prepare(
        `SELECT COUNT(*) AS count FROM lessons l
         JOIN modules m ON m.id = l.module_id WHERE m.course_id = ?`,
      )
      .get(courseId) as { count: number };
    if (lessonCount.count === 0) {
      redirect(`/dashboard/courses/${courseId}/edit?error=no-lessons`);
    }
  }

  getDb()
    .prepare(
      "UPDATE courses SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
    .run(status, courseId);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/edit?status=updated`);
}

export async function deleteCourseAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const user = await requireStaff();
  const course = getCourseById(courseId);
  if (!course) redirect("/dashboard/courses");
  if (user.role !== "admin" && course.instructor_id !== user.id) {
    redirect("/dashboard/courses?error=forbidden");
  }

  const enrollmentCount = getDb()
    .prepare("SELECT COUNT(*) AS count FROM enrollments WHERE course_id = ?")
    .get(courseId) as { count: number };

  if (enrollmentCount.count > 0) {
    redirect(`/dashboard/courses/${courseId}/edit?error=has-enrollments`);
  }

  getDb().prepare("DELETE FROM courses WHERE id = ?").run(courseId);
  revalidateCourseSurfaces(course.slug);
  redirect("/dashboard/courses?deleted=1");
}

export async function addModuleAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const { course } = await requireCourseManager(courseId);
  if (title.length < 3) redirect(`/dashboard/courses/${courseId}/edit?error=module`);

  const db = getDb();
  const max = db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max FROM modules WHERE course_id = ?")
    .get(courseId) as { max: number };
  db.prepare(
    "INSERT INTO modules (id, course_id, title, summary, position) VALUES (?, ?, ?, ?, ?)",
  ).run(`mod_${crypto.randomUUID()}`, courseId, title, summary || null, max.max + 1);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/edit?module=added`);
}

export async function updateModuleAction(formData: FormData) {
  const moduleId = String(formData.get("moduleId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const { course } = await requireCourseManager(courseId);
  if (title.length < 3) redirect(`/dashboard/courses/${courseId}/edit?error=module`);

  getDb()
    .prepare("UPDATE modules SET title = ?, summary = ? WHERE id = ? AND course_id = ?")
    .run(title, summary || null, moduleId, courseId);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
}

export async function deleteModuleAction(formData: FormData) {
  const moduleId = String(formData.get("moduleId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const { course } = await requireCourseManager(courseId);
  getDb()
    .prepare("DELETE FROM modules WHERE id = ? AND course_id = ?")
    .run(moduleId, courseId);
  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  redirect(`/dashboard/courses/${courseId}/edit?module=deleted`);
}

export async function addLessonAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const kind = String(formData.get("kind") ?? "reading");
  const duration = Number(formData.get("duration") ?? 15);
  const { course } = await requireCourseManager(courseId);

  if (title.length < 3) redirect(`/dashboard/courses/${courseId}/edit?error=lesson`);
  if (!["reading", "video", "lab"].includes(kind)) return;
  if (!Number.isFinite(duration) || duration < 1 || duration > 240) return;

  const db = getDb();
  const module = db
    .prepare("SELECT id FROM modules WHERE id = ? AND course_id = ?")
    .get(moduleId, courseId);
  if (!module) return;

  const max = db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max FROM lessons WHERE module_id = ?")
    .get(moduleId) as { max: number };
  const lessonId = `les_${crypto.randomUUID()}`;

  db.prepare(
    `INSERT INTO lessons (id, module_id, title, summary, content, kind, duration_minutes, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    lessonId,
    moduleId,
    title,
    "Add a short summary for this lesson.",
    `## ${title}\n\nStart writing the lesson content here. Use Markdown to add headings, lists, code blocks, and callouts.\n\n> Tip: keep each lesson focused on one useful idea.`,
    kind,
    Math.round(duration),
    max.max + 1,
  );

  revalidateCourseSurfaces(course.slug);
  redirect(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
}

export type LessonFormState = {
  error?: string;
  success?: string;
};

export async function updateLessonAction(
  _prevState: LessonFormState,
  formData: FormData,
): Promise<LessonFormState> {
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const kind = String(formData.get("kind") ?? "reading");
  const duration = Number(formData.get("duration") ?? 15);
  const { course } = await requireCourseManager(courseId);

  if (title.length < 3) return { error: "Give the lesson a title of at least 3 characters." };
  if (content.length < 20) return { error: "Add at least 20 characters of lesson content." };
  if (!["reading", "video", "lab"].includes(kind)) return { error: "Choose a valid lesson type." };
  if (!Number.isFinite(duration) || duration < 1 || duration > 240) {
    return { error: "Duration must be between 1 and 240 minutes." };
  }

  const db = getDb();
  const lesson = db
    .prepare(
      `SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id
       WHERE l.id = ? AND m.course_id = ?`,
    )
    .get(lessonId, courseId);
  if (!lesson) return { error: "Lesson not found." };

  db.prepare(
    `UPDATE lessons SET title = ?, summary = ?, content = ?, kind = ?, duration_minutes = ?
     WHERE id = ?`,
  ).run(title, summary || null, content, kind, Math.round(duration), lessonId);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/edit`);
  revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
  return { success: "Lesson saved." };
}

export async function deleteLessonAction(formData: FormData) {
  const lessonId = String(formData.get("lessonId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const { course } = await requireCourseManager(courseId);

  getDb()
    .prepare(
      `DELETE FROM lessons WHERE id = ? AND module_id IN
       (SELECT id FROM modules WHERE course_id = ?)`,
    )
    .run(lessonId, courseId);

  revalidateCourseSurfaces(course.slug);
  redirect(`/dashboard/courses/${courseId}/edit?lesson=deleted`);
}

export async function enrollStudentAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const { course } = await requireCourseManager(courseId);
  const db = getDb();

  const student = db
    .prepare("SELECT id FROM users WHERE id = ? AND role = 'student' AND status = 'active'")
    .get(userId);
  if (!student) return;

  db.prepare(
    `INSERT OR IGNORE INTO enrollments (id, user_id, course_id)
     VALUES (?, ?, ?)`,
  ).run(`enr_${crypto.randomUUID()}`, userId, courseId);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/students`);
  revalidatePath(`/dashboard/students`);
}

export async function unenrollStudentAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const { course } = await requireCourseManager(courseId);

  getDb()
    .prepare("DELETE FROM enrollments WHERE course_id = ? AND user_id = ?")
    .run(courseId, userId);

  revalidateCourseSurfaces(course.slug);
  revalidatePath(`/dashboard/courses/${courseId}/students`);
  revalidatePath(`/dashboard/students`);
}
