import { getDb } from "@/lib/db";
import type {
  AnswerDetail,
  Assessment,
  Attempt,
  Certificate,
  Course,
  Enrollment,
  Lesson,
  Module,
  Option,
  PublicUser,
  Question,
  Role,
} from "@/lib/types";

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const COURSE_SELECT = `
  SELECT c.*,
    u.name AS instructor_name,
    u.headline AS instructor_headline,
    u.avatar_color AS instructor_color,
    (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count,
    (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = c.id) AS lesson_count,
    (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS student_count,
    (SELECT COUNT(*) FROM assessments a WHERE a.course_id = c.id AND a.status = 'published') AS assessment_count
  FROM courses c
  JOIN users u ON u.id = c.instructor_id
`;

export function getPublishedCourses(filters?: {
  search?: string;
  category?: string;
  level?: string;
  sort?: string;
}) {
  const db = getDb();
  const where: string[] = ["c.status = 'published'"];
  const params: Record<string, string> = {};

  if (filters?.search) {
    where.push(
      "(LOWER(c.title) LIKE @search OR LOWER(c.subtitle) LIKE @search OR LOWER(c.category) LIKE @search)",
    );
    params.search = `%${filters.search.toLowerCase()}%`;
  }
  if (filters?.category && filters.category !== "All") {
    where.push("c.category = @category");
    params.category = filters.category;
  }
  if (filters?.level && filters.level !== "All") {
    where.push("c.level = @level");
    params.level = filters.level;
  }

  let order = "c.created_at DESC";
  if (filters?.sort === "popular") {
    order = "student_count DESC, c.created_at DESC";
  } else if (filters?.sort === "duration") {
    order = "c.duration_hours ASC";
  } else if (filters?.sort === "title") {
    order = "c.title ASC";
  }

  return db
    .prepare(`${COURSE_SELECT} WHERE ${where.join(" AND ")} ORDER BY ${order}`)
    .all(params) as Course[];
}

export function getCourseCategories() {
  const db = getDb();
  return (
    db
      .prepare(
        "SELECT DISTINCT category FROM courses WHERE status = 'published' ORDER BY category",
      )
      .all() as { category: string }[]
  ).map((row) => row.category);
}

export function getCourseBySlug(slug: string, includeUnpublished = false) {
  const db = getDb();
  const statusClause = includeUnpublished ? "" : "AND c.status = 'published'";
  return db
    .prepare(`${COURSE_SELECT} WHERE c.slug = ? ${statusClause}`)
    .get(slug) as Course | undefined;
}

export function getCourseById(id: string) {
  const db = getDb();
  return db
    .prepare(`${COURSE_SELECT} WHERE c.id = ?`)
    .get(id) as Course | undefined;
}

export function getCourseCurriculum(courseId: string) {
  const db = getDb();
  const modules = db
    .prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY position, id")
    .all(courseId) as Module[];
  const lessons = db
    .prepare(
      `SELECT l.* FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = ?
       ORDER BY m.position, l.position, l.id`,
    )
    .all(courseId) as Lesson[];

  return modules.map((module) => ({
    ...module,
    lessons: lessons.filter((lesson) => lesson.module_id === module.id),
  }));
}

export type CurriculumModule = Module & { lessons: Lesson[] };

export function getLessonById(lessonId: string) {
  return getDb()
    .prepare(
      `SELECT l.*, m.course_id, m.title AS module_title, c.slug AS course_slug,
              c.title AS course_title, c.cover AS course_cover
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id
       WHERE l.id = ?`,
    )
    .get(lessonId) as
    | (Lesson & {
        course_id: string;
        module_title: string;
        course_slug: string;
        course_title: string;
        course_cover: string;
      })
    | undefined;
}

export function getEnrollment(userId: string, courseId: string) {
  return getDb()
    .prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as
    | {
        id: string;
        user_id: string;
        course_id: string;
        enrolled_at: string;
        completed_at: string | null;
      }
    | undefined;
}

export function getCompletedLessonIds(userId: string, courseId: string) {
  const rows = getDb()
    .prepare(
      `SELECT lp.lesson_id FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       JOIN modules m ON m.id = l.module_id
       WHERE lp.user_id = ? AND m.course_id = ?`,
    )
    .all(userId, courseId) as { lesson_id: string }[];
  return new Set(rows.map((row) => row.lesson_id));
}

export function getMyEnrollments(userId: string): Enrollment[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT e.id, e.user_id, e.course_id, e.enrolled_at, e.completed_at,
        c.id AS c_id, c.slug, c.title, c.subtitle, c.description, c.category,
        c.level, c.duration_hours, c.cover, c.status, c.outcomes, c.requirements,
        c.instructor_id, c.created_at, c.updated_at,
        u.name AS instructor_name, u.headline AS instructor_headline,
        u.avatar_color AS instructor_color,
        (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = c.id) AS lesson_count,
        (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count,
        (SELECT COUNT(*) FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          JOIN modules m ON m.id = l.module_id
          WHERE lp.user_id = e.user_id AND m.course_id = c.id) AS completed_lessons,
        (SELECT COUNT(*) FROM assessments a WHERE a.course_id = c.id AND a.status = 'published') AS assessment_count
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = c.instructor_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
    )
    .all(userId) as Record<string, unknown>[];

  return rows.map((row) => {
    const lessonCount = Number(row.lesson_count ?? 0);
    const completedLessons = Number(row.completed_lessons ?? 0);
    return {
      id: String(row.id),
      user_id: String(row.user_id),
      course_id: String(row.course_id),
      enrolled_at: String(row.enrolled_at),
      completed_at: row.completed_at ? String(row.completed_at) : null,
      course: {
        id: String(row.c_id),
        slug: String(row.slug),
        title: String(row.title),
        subtitle: String(row.subtitle),
        description: String(row.description),
        category: String(row.category),
        level: row.level as Course["level"],
        duration_hours: Number(row.duration_hours),
        cover: String(row.cover),
        status: row.status as Course["status"],
        outcomes: String(row.outcomes),
        requirements: String(row.requirements),
        instructor_id: String(row.instructor_id),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        instructor_name: row.instructor_name ? String(row.instructor_name) : undefined,
        instructor_headline: row.instructor_headline
          ? String(row.instructor_headline)
          : null,
        instructor_color: row.instructor_color
          ? String(row.instructor_color)
          : undefined,
        lesson_count: lessonCount,
        module_count: Number(row.module_count ?? 0),
        assessment_count: Number(row.assessment_count ?? 0),
      },
      progress: lessonCount === 0 ? 0 : Math.round((completedLessons / lessonCount) * 100),
      completed_lessons: completedLessons,
      lesson_count: lessonCount,
    };
  });
}

export function getStudentStats(userId: string) {
  const db = getDb();
  const enrollmentStats = db
    .prepare(
      `SELECT
        COUNT(*) AS total_courses,
        SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completed_courses
       FROM enrollments WHERE user_id = ?`,
    )
    .get(userId) as { total_courses: number; completed_courses: number };

  const lessons = db
    .prepare("SELECT COUNT(*) AS count FROM lesson_progress WHERE user_id = ?")
    .get(userId) as { count: number };

  const assessments = db
    .prepare(
      `SELECT
        COUNT(*) AS attempts,
        COALESCE(ROUND(AVG(CAST(score AS REAL) / NULLIF(max_score, 0) * 100)), 0) AS avg_score
       FROM attempts WHERE user_id = ? AND status = 'submitted'`,
    )
    .get(userId) as { attempts: number; avg_score: number };

  const certificates = db
    .prepare("SELECT COUNT(*) AS count FROM certificates WHERE user_id = ?")
    .get(userId) as { count: number };

  const passed = db
    .prepare(
      "SELECT COUNT(*) AS count FROM attempts WHERE user_id = ? AND status = 'submitted' AND passed = 1",
    )
    .get(userId) as { count: number };

  return {
    totalCourses: enrollmentStats.total_courses ?? 0,
    completedCourses: enrollmentStats.completed_courses ?? 0,
    lessonsCompleted: lessons.count,
    assessmentAttempts: assessments.attempts,
    averageScore: Math.round(assessments.avg_score),
    certificates: certificates.count,
    passedAssessments: passed.count,
  };
}

export function getUpcomingAssessments(userId: string, limit = 5) {
  return getDb()
    .prepare(
      `SELECT a.*, c.title AS course_title, c.slug AS course_slug, c.cover AS course_cover,
        (SELECT MAX(CASE WHEN at.passed = 1 THEN 1 ELSE 0 END)
          FROM attempts at WHERE at.assessment_id = a.id AND at.user_id = e.user_id) AS best_passed,
        (SELECT MAX(ROUND(CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100))
          FROM attempts at WHERE at.assessment_id = a.id AND at.user_id = e.user_id AND at.status = 'submitted') AS best_score,
        (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) AS question_count
       FROM assessments a
       JOIN courses c ON c.id = a.course_id
       JOIN enrollments e ON e.course_id = a.course_id AND e.user_id = ?
       WHERE a.status = 'published'
       ORDER BY CASE WHEN best_passed = 1 THEN 1 ELSE 0 END, a.created_at DESC
       LIMIT ?`,
    )
    .all(userId, limit) as (Assessment & {
    best_passed: number | null;
    best_score: number | null;
  })[];
}

export function getWeeklyActivity(userId: string) {
  const db = getDb();
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);

  const lessons = db
    .prepare(
      `SELECT substr(completed_at, 1, 10) AS day, COUNT(*) AS count
       FROM lesson_progress
       WHERE user_id = ? AND completed_at >= ?
       GROUP BY day`,
    )
    .all(userId, start.toISOString()) as { day: string; count: number }[];

  const assessments = db
    .prepare(
      `SELECT substr(submitted_at, 1, 10) AS day, COUNT(*) AS count
       FROM attempts
       WHERE user_id = ? AND status = 'submitted' AND submitted_at >= ?
       GROUP BY day`,
    )
    .all(userId, start.toISOString()) as { day: string; count: number }[];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const day = date.toISOString().slice(0, 10);
    const lessonCount =
      lessons.find((row) => row.day === day)?.count ?? 0;
    const assessmentCount =
      assessments.find((row) => row.day === day)?.count ?? 0;
    return {
      date: day,
      label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      lessons: lessonCount,
      assessments: assessmentCount,
      total: lessonCount + assessmentCount,
    };
  });
}

export function getRecentStudentActivity(userId: string, limit = 6) {
  const db = getDb();
  const lessonActivity = db
    .prepare(
      `SELECT lp.completed_at AS at, 'lesson' AS type, l.title AS title,
        c.title AS context, c.slug AS course_slug
       FROM lesson_progress lp
       JOIN lessons l ON l.id = lp.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id
       WHERE lp.user_id = ?
       ORDER BY lp.completed_at DESC LIMIT ?`,
    )
    .all(userId, limit) as {
    at: string;
    type: string;
    title: string;
    context: string;
    course_slug: string;
  }[];

  const attemptActivity = db
    .prepare(
      `SELECT at.submitted_at AS at, 'assessment' AS type, a.title AS title,
        c.title AS context, c.slug AS course_slug
       FROM attempts at
       JOIN assessments a ON a.id = at.assessment_id
       JOIN courses c ON c.id = a.course_id
       WHERE at.user_id = ? AND at.status = 'submitted'
       ORDER BY at.submitted_at DESC LIMIT ?`,
    )
    .all(userId, limit) as {
    at: string;
    type: string;
    title: string;
    context: string;
    course_slug: string;
  }[];

  return [...lessonActivity, ...attemptActivity]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

export function getAllUsersForStaff(user: PublicUser, search?: string) {
  const db = getDb();
  const params: Record<string, string> = {};
  let courseFilter = "";

  if (user.role === "instructor") {
    courseFilter = `AND EXISTS (
      SELECT 1 FROM enrollments e2
      JOIN courses c2 ON c2.id = e2.course_id
      WHERE e2.user_id = u.id AND c2.instructor_id = @instructorId
    )`;
    params.instructorId = user.id;
  }

  if (search) {
    params.search = `%${search.toLowerCase()}%`;
  }

  const rows = db
    .prepare(
      `SELECT u.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id
          ${user.role === "instructor" ? "AND e.course_id IN (SELECT id FROM courses WHERE instructor_id = @instructorId)" : ""}
        ) AS course_count,
        COALESCE((
          SELECT ROUND(AVG(
            CASE WHEN total_lessons = 0 THEN 0
            ELSE completed_lessons * 100.0 / total_lessons END
          ))
          FROM (
            SELECT e.course_id,
              (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = e.course_id) AS total_lessons,
              (SELECT COUNT(*) FROM lesson_progress lp
                JOIN lessons l ON l.id = lp.lesson_id
                JOIN modules m ON m.id = l.module_id
                WHERE lp.user_id = u.id AND m.course_id = e.course_id) AS completed_lessons
            FROM enrollments e WHERE e.user_id = u.id
          )
        ), 0) AS avg_progress,
        (SELECT COUNT(*) FROM certificates cert WHERE cert.user_id = u.id) AS certificate_count,
        (SELECT MAX(at.submitted_at) FROM attempts at WHERE at.user_id = u.id) AS last_active
       FROM users u
       WHERE u.role = 'student'
       ${search ? "AND (LOWER(u.name) LIKE @search OR LOWER(u.email) LIKE @search)" : ""}
       ${courseFilter}
       ORDER BY u.created_at DESC`,
    )
    .all(params) as (PublicUser & {
    course_count: number;
    avg_progress: number;
    certificate_count: number;
    last_active: string | null;
  })[];

  return rows;
}

export function getStudentById(id: string) {
  return getDb()
    .prepare("SELECT * FROM users WHERE id = ? AND role = 'student'")
    .get(id) as PublicUser | undefined;
}

export function instructorTeachesStudent(instructorId: string, studentId: string) {
  return Boolean(
    getDb()
      .prepare(
        `SELECT 1 FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         WHERE c.instructor_id = ? AND e.user_id = ?
         LIMIT 1`,
      )
      .get(instructorId, studentId),
  );
}

export function getStaffOptions() {
  return getDb()
    .prepare(
      `SELECT id, name, email, role, avatar_color
       FROM users
       WHERE role IN ('admin', 'instructor') AND status = 'active'
       ORDER BY CASE role WHEN 'instructor' THEN 0 ELSE 1 END, name`,
    )
    .all() as {
    id: string;
    name: string;
    email: string;
    role: "admin" | "instructor";
    avatar_color: string;
  }[];
}

export function getStaffStats(user: PublicUser) {
  const db = getDb();
  const isInstructor = user.role === "instructor";
  const courseClause = isInstructor ? "AND c.instructor_id = ?" : "";
  const params = isInstructor ? [user.id] : [];

  const courses = db
    .prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN c.status = 'published' THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN c.status = 'draft' THEN 1 ELSE 0 END) AS draft
       FROM courses c WHERE 1=1 ${courseClause}`,
    )
    .get(...params) as { total: number; published: number; draft: number };

  const enrollmentClause = isInstructor
    ? "WHERE c.instructor_id = ?"
    : "";
  const enrollments = db
    .prepare(
      `SELECT COUNT(e.id) AS total,
        SUM(CASE WHEN e.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completed
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       ${enrollmentClause}`,
    )
    .get(...params) as { total: number; completed: number };

  const studentClause = isInstructor
    ? "JOIN enrollments e ON e.user_id = u.id JOIN courses c ON c.id = e.course_id WHERE u.role = 'student' AND c.instructor_id = ?"
    : "WHERE u.role = 'student'";
  const students = db
    .prepare(`SELECT COUNT(DISTINCT u.id) AS total FROM users u ${studentClause}`)
    .get(...params) as { total: number };

  const assessmentClause = isInstructor ? "AND c.instructor_id = ?" : "";
  const assessments = db
    .prepare(
      `SELECT COUNT(a.id) AS total,
        COALESCE(ROUND(AVG(CASE WHEN at.status = 'submitted' THEN CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100 END)), 0) AS avg_score
       FROM assessments a
       JOIN courses c ON c.id = a.course_id
       LEFT JOIN attempts at ON at.assessment_id = a.id
       WHERE 1=1 ${assessmentClause}`,
    )
    .get(...params) as { total: number; avg_score: number };

  return {
    totalCourses: courses.total ?? 0,
    publishedCourses: courses.published ?? 0,
    draftCourses: courses.draft ?? 0,
    totalEnrollments: enrollments.total ?? 0,
    completedEnrollments: enrollments.completed ?? 0,
    completionRate:
      enrollments.total > 0
        ? Math.round((enrollments.completed / enrollments.total) * 100)
        : 0,
    totalStudents: students.total ?? 0,
    totalAssessments: assessments.total ?? 0,
    averageScore: Math.round(assessments.avg_score ?? 0),
  };
}

export function getStaffCourses(user: PublicUser) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "WHERE c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id] : [];
  return db
    .prepare(
      `${COURSE_SELECT}
       ${filter}
       ORDER BY CASE c.status WHEN 'published' THEN 0 WHEN 'draft' THEN 1 ELSE 2 END,
       c.updated_at DESC`,
    )
    .all(...params) as Course[];
}

export function getCoursePerformance(user: PublicUser, limit = 6) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "AND c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id, limit] : [limit];
  return db
    .prepare(
      `SELECT c.id, c.title, c.cover, c.level, c.status,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS students,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.completed_at IS NOT NULL) AS completions,
        (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = c.id) AS lessons,
        COALESCE((
          SELECT ROUND(AVG(CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100))
          FROM attempts at
          JOIN assessments a ON a.id = at.assessment_id
          WHERE a.course_id = c.id AND at.status = 'submitted'
        ), 0) AS avg_score
       FROM courses c WHERE 1=1 ${filter}
       ORDER BY students DESC LIMIT ?`,
    )
    .all(...params) as {
    id: string;
    title: string;
    cover: string;
    level: string;
    status: string;
    students: number;
    completions: number;
    lessons: number;
    avg_score: number;
  }[];
}

export function getRecentEnrollments(user: PublicUser, limit = 6) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "AND c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id, limit] : [limit];
  return db
    .prepare(
      `SELECT e.id, e.enrolled_at, u.name AS user_name, u.email AS user_email,
        u.avatar_color AS user_color, c.title AS course_title, c.slug AS course_slug,
        c.cover AS course_cover
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       JOIN courses c ON c.id = e.course_id
       WHERE 1=1 ${filter}
       ORDER BY e.enrolled_at DESC LIMIT ?`,
    )
    .all(...params) as {
    id: string;
    enrolled_at: string;
    user_name: string;
    user_email: string;
    user_color: string;
    course_title: string;
    course_slug: string;
    course_cover: string;
  }[];
}

export function getAssessmentsForUser(user: PublicUser) {
  const db = getDb();

  if (user.role === "student") {
    return db
      .prepare(
        `SELECT a.*, c.title AS course_title, c.slug AS course_slug, c.cover AS course_cover,
          (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) AS question_count,
          (SELECT COALESCE(SUM(q.points), 0) FROM questions q WHERE q.assessment_id = a.id) AS total_points,
          (SELECT COUNT(*) FROM attempts at WHERE at.assessment_id = a.id AND at.user_id = e.user_id) AS attempt_count,
          (SELECT MAX(ROUND(CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100)) FROM attempts at WHERE at.assessment_id = a.id AND at.user_id = e.user_id AND at.status = 'submitted') AS avg_score,
          (SELECT MAX(at.passed) FROM attempts at WHERE at.assessment_id = a.id AND at.user_id = e.user_id AND at.status = 'submitted') AS best_passed
         FROM assessments a
         JOIN courses c ON c.id = a.course_id
         JOIN enrollments e ON e.course_id = a.course_id AND e.user_id = ?
         WHERE a.status = 'published'
         ORDER BY CASE WHEN best_passed = 1 THEN 1 ELSE 0 END, a.created_at DESC`,
      )
      .all(user.id) as Assessment[];
  }

  const filter =
    user.role === "instructor" ? "WHERE c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id] : [];
  return db
    .prepare(
      `SELECT a.*, c.title AS course_title, c.slug AS course_slug, c.cover AS course_cover,
        (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) AS question_count,
        (SELECT COALESCE(SUM(q.points), 0) FROM questions q WHERE q.assessment_id = a.id) AS total_points,
        (SELECT COUNT(*) FROM attempts at WHERE at.assessment_id = a.id AND at.status = 'submitted') AS attempt_count,
        (SELECT ROUND(AVG(CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100)) FROM attempts at WHERE at.assessment_id = a.id AND at.status = 'submitted') AS avg_score
       FROM assessments a
       JOIN courses c ON c.id = a.course_id
       ${filter}
       ORDER BY a.created_at DESC`,
    )
    .all(...params) as Assessment[];
}

export function getAssessmentById(id: string) {
  return getDb()
    .prepare(
      `SELECT a.*, c.title AS course_title, c.slug AS course_slug,
        c.cover AS course_cover, c.instructor_id, c.status AS course_status,
        (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) AS question_count,
        (SELECT COALESCE(SUM(q.points), 0) FROM questions q WHERE q.assessment_id = a.id) AS total_points
       FROM assessments a
       JOIN courses c ON c.id = a.course_id
       WHERE a.id = ?`,
    )
    .get(id) as
    | (Assessment & {
        instructor_id: string;
        course_status: string;
      })
    | undefined;
}

export function getQuestionsForAssessment(
  assessmentId: string,
  includeCorrect = false,
): Question[] {
  const db = getDb();
  const questions = db
    .prepare(
      "SELECT * FROM questions WHERE assessment_id = ? ORDER BY position, id",
    )
    .all(assessmentId) as Omit<Question, "options">[];
  const options = db
    .prepare(
      `SELECT o.* FROM options o
       JOIN questions q ON q.id = o.question_id
       WHERE q.assessment_id = ?
       ORDER BY o.position, o.id`,
    )
    .all(assessmentId) as Option[];

  return questions.map((question) => ({
    ...question,
    options: options
      .filter((option) => option.question_id === question.id)
      .map((option) =>
        includeCorrect ? option : { ...option, is_correct: 0 },
      ),
  }));
}

export function getAssessmentAttempts(assessmentId: string) {
  return getDb()
    .prepare(
      `SELECT at.*, u.name AS user_name, u.email AS user_email,
        u.avatar_color AS user_color
       FROM attempts at
       JOIN users u ON u.id = at.user_id
       WHERE at.assessment_id = ? AND at.status = 'submitted'
       ORDER BY at.submitted_at DESC`,
    )
    .all(assessmentId) as Attempt[];
}

export function getAssessmentAttemptCount(assessmentId: string) {
  return (
    getDb()
      .prepare("SELECT COUNT(*) AS count FROM attempts WHERE assessment_id = ?")
      .get(assessmentId) as { count: number }
  ).count;
}

export function getUserAttempts(userId: string) {
  return getDb()
    .prepare(
      `SELECT at.*, a.title AS assessment_title, c.title AS course_title,
        c.slug AS course_slug, c.cover AS course_cover
       FROM attempts at
       JOIN assessments a ON a.id = at.assessment_id
       JOIN courses c ON c.id = a.course_id
       WHERE at.user_id = ? AND at.status = 'submitted'
       ORDER BY at.submitted_at DESC`,
    )
    .all(userId) as Attempt[];
}

export function getAttempt(attemptId: string) {
  return getDb()
    .prepare(
      `SELECT at.*, a.title AS assessment_title, a.pass_score, c.title AS course_title,
        c.slug AS course_slug, u.name AS user_name, u.email AS user_email
       FROM attempts at
       JOIN assessments a ON a.id = at.assessment_id
       JOIN courses c ON c.id = a.course_id
       JOIN users u ON u.id = at.user_id
       WHERE at.id = ?`,
    )
    .get(attemptId) as
    | (Attempt & {
        pass_score: number;
        user_name: string;
        user_email: string;
      })
    | undefined;
}

export function getAttemptAnswers(attemptId: string): AnswerDetail[] {
  const db = getDb();
  const answers = db
    .prepare(
      `SELECT ans.*, q.prompt, q.points
       FROM answers ans
       JOIN questions q ON q.id = ans.question_id
       WHERE ans.attempt_id = ?
       ORDER BY q.position`,
    )
    .all(attemptId) as {
    id: string;
    question_id: string;
    prompt: string;
    points: number;
    points_awarded: number;
    is_correct: number;
    selected_option_id: string | null;
  }[];

  const options = db
    .prepare(
      `SELECT o.* FROM options o
       JOIN questions q ON q.id = o.question_id
       JOIN answers ans ON ans.question_id = q.id
       WHERE ans.attempt_id = ?
       ORDER BY o.position`,
    )
    .all(attemptId) as Option[];

  return answers.map((answer) => {
    const answerOptions = options.filter(
      (option) => option.question_id === answer.question_id,
    );
    return {
      ...answer,
      selected_label:
        answerOptions.find((option) => option.id === answer.selected_option_id)
          ?.label ?? null,
      correct_label:
        answerOptions.find((option) => option.is_correct === 1)?.label ?? null,
      options: answerOptions,
    };
  });
}

export function getAssessmentsForCourse(courseId: string) {
  return getDb()
    .prepare(
      `SELECT a.*,
        (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) AS question_count,
        (SELECT COALESCE(SUM(q.points), 0) FROM questions q WHERE q.assessment_id = a.id) AS total_points,
        (SELECT COUNT(*) FROM attempts at WHERE at.assessment_id = a.id AND at.status = 'submitted') AS attempt_count
       FROM assessments a
       WHERE a.course_id = ?
       ORDER BY a.created_at`,
    )
    .all(courseId) as Assessment[];
}

export function getActiveAttempt(userId: string, assessmentId: string) {
  return getDb()
    .prepare(
      "SELECT * FROM attempts WHERE user_id = ? AND assessment_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1",
    )
    .get(userId, assessmentId) as Attempt | undefined;
}

export function getBestAttempt(userId: string, assessmentId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM attempts WHERE user_id = ? AND assessment_id = ? AND status = 'submitted'
       ORDER BY passed DESC, score DESC, submitted_at DESC LIMIT 1`,
    )
    .get(userId, assessmentId) as Attempt | undefined;
}

export function getCertificatesForUser(userId: string) {
  return getDb()
    .prepare(
      `SELECT cert.*, c.title AS course_title, c.slug AS course_slug,
        c.cover AS course_cover, c.level AS course_level, c.duration_hours,
        u.name AS user_name
       FROM certificates cert
       JOIN courses c ON c.id = cert.course_id
       JOIN users u ON u.id = cert.user_id
       WHERE cert.user_id = ?
       ORDER BY cert.issued_at DESC`,
    )
    .all(userId) as Certificate[];
}

export function getCertificatesForStaff(user: PublicUser, search?: string) {
  const db = getDb();
  const params: Record<string, string> = {};
  const where = ["1 = 1"];

  if (user.role === "instructor") {
    where.push("c.instructor_id = @instructorId");
    params.instructorId = user.id;
  }
  if (search) {
    where.push(
      "(LOWER(u.name) LIKE @search OR LOWER(c.title) LIKE @search OR LOWER(cert.code) LIKE @search)",
    );
    params.search = `%${search.toLowerCase()}%`;
  }

  return db
    .prepare(
      `SELECT cert.*, c.title AS course_title, c.slug AS course_slug,
        c.cover AS course_cover, c.level AS course_level, c.duration_hours,
        u.name AS user_name, u.email AS user_email, u.avatar_color AS user_color
       FROM certificates cert
       JOIN courses c ON c.id = cert.course_id
       JOIN users u ON u.id = cert.user_id
       WHERE ${where.join(" AND ")}
       ORDER BY cert.issued_at DESC`,
    )
    .all(params) as (Certificate & {
    user_email: string;
    user_color: string;
  })[];
}

export function getCertificateByCode(code: string) {
  return getDb()
    .prepare(
      `SELECT cert.*, c.title AS course_title, c.cover AS course_cover,
        c.level AS course_level, c.duration_hours, u.name AS user_name
       FROM certificates cert
       JOIN courses c ON c.id = cert.course_id
       JOIN users u ON u.id = cert.user_id
       WHERE cert.code = ?`,
    )
    .get(code) as Certificate | undefined;
}

export function getCategoriesForStats() {
  return getDb()
    .prepare(
      `SELECT category, COUNT(*) AS course_count,
        (SELECT COUNT(*) FROM enrollments e JOIN courses c2 ON c2.id = e.course_id WHERE c2.category = courses.category) AS enrollment_count
       FROM courses WHERE status = 'published'
       GROUP BY category ORDER BY enrollment_count DESC`,
    )
    .all() as { category: string; course_count: number; enrollment_count: number }[];
}

export function getEnrollmentTrend(user: PublicUser) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "AND c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id] : [];
  const rows = db
    .prepare(
      `SELECT strftime('%Y-%W', e.enrolled_at) AS week,
        MIN(e.enrolled_at) AS first_enrollment, COUNT(*) AS count
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.enrolled_at >= datetime('now', '-56 days') ${filter}
       GROUP BY week ORDER BY week`,
    )
    .all(...params) as { week: string; first_enrollment: string; count: number }[];

  return rows.map((row) => ({
    label: new Date(row.first_enrollment).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count: row.count,
  }));
}

export function getPlatformStats() {
  const db = getDb();
  const courses = db
    .prepare("SELECT COUNT(*) AS count FROM courses WHERE status = 'published'")
    .get() as { count: number };
  const lessons = db
    .prepare(
      `SELECT COUNT(*) AS count FROM lessons l
       JOIN modules m ON m.id = l.module_id
       JOIN courses c ON c.id = m.course_id
       WHERE c.status = 'published'`,
    )
    .get() as { count: number };
  const learners = db
    .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'student'")
    .get() as { count: number };
  const certificates = db
    .prepare("SELECT COUNT(*) AS count FROM certificates")
    .get() as { count: number };
  return {
    courses: courses.count,
    lessons: lessons.count,
    learners: learners.count,
    certificates: certificates.count,
  };
}

export function getRoleCounts() {
  return getDb()
    .prepare("SELECT role, COUNT(*) AS count FROM users GROUP BY role")
    .all() as { role: Role; count: number }[];
}

export function getCourseCompletionForStaff(user: PublicUser) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "AND c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id] : [];
  return db
    .prepare(
      `SELECT c.id, c.title, c.cover,
        COUNT(e.id) AS enrolled,
        SUM(CASE WHEN e.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completed
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id
       WHERE c.status = 'published' ${filter}
       GROUP BY c.id ORDER BY enrolled DESC LIMIT 5`,
    )
    .all(...params) as {
    id: string;
    title: string;
    cover: string;
    enrolled: number;
    completed: number;
  }[];
}

export function getStudentEnrollments(userId: string) {
  return getMyEnrollments(userId);
}

export function getStudentAttempts(userId: string) {
  return getUserAttempts(userId);
}

export function getAllStudentsBasic() {
  return getDb()
    .prepare(
      "SELECT id, name, email, avatar_color FROM users WHERE role = 'student' AND status = 'active' ORDER BY name",
    )
    .all() as {
    id: string;
    name: string;
    email: string;
    avatar_color: string;
  }[];
}

export function getAvailableStudentsForCourse(courseId: string) {
  return getDb()
    .prepare(
      `SELECT id, name, email, avatar_color
       FROM users u
       WHERE u.role = 'student' AND u.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM enrollments e
           WHERE e.user_id = u.id AND e.course_id = ?
         )
       ORDER BY u.name`,
    )
    .all(courseId) as {
    id: string;
    name: string;
    email: string;
    avatar_color: string;
  }[];
}

export function getCourseEnrollments(courseId: string) {
  return getDb()
    .prepare(
      `SELECT e.*, u.name AS user_name, u.email AS user_email,
        u.avatar_color AS user_color, u.status AS user_status,
        (SELECT COUNT(*) FROM modules m JOIN lessons l ON l.module_id = m.id WHERE m.course_id = e.course_id) AS lesson_count,
        (SELECT COUNT(*) FROM lesson_progress lp
          JOIN lessons l ON l.id = lp.lesson_id
          JOIN modules m ON m.id = l.module_id
          WHERE lp.user_id = e.user_id AND m.course_id = e.course_id) AS completed_lessons
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       WHERE e.course_id = ?
       ORDER BY e.enrolled_at DESC`,
    )
    .all(courseId) as {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    completed_at: string | null;
    user_name: string;
    user_email: string;
    user_color: string;
    user_status: string;
    lesson_count: number;
    completed_lessons: number;
  }[];
}

export function getAssessmentPerformance(user: PublicUser) {
  const db = getDb();
  const filter =
    user.role === "instructor" ? "AND c.instructor_id = ?" : "";
  const params = user.role === "instructor" ? [user.id] : [];
  return db
    .prepare(
      `SELECT a.title, c.title AS course_title,
        COUNT(at.id) AS attempts,
        ROUND(AVG(CAST(at.score AS REAL) / NULLIF(at.max_score, 0) * 100)) AS avg_score,
        SUM(CASE WHEN at.passed = 1 THEN 1 ELSE 0 END) AS passed
       FROM assessments a
       JOIN courses c ON c.id = a.course_id
       LEFT JOIN attempts at ON at.assessment_id = a.id AND at.status = 'submitted'
       WHERE 1=1 ${filter}
       GROUP BY a.id ORDER BY attempts DESC LIMIT 5`,
    )
    .all(...params) as {
    title: string;
    course_title: string;
    attempts: number;
    avg_score: number | null;
    passed: number | null;
  }[];
}
