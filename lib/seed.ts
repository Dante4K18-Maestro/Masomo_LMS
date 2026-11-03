import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { seedCourses, seedUsers } from "@/lib/seed-data";

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(days: number, hours = 10) {
  const date = new Date(Date.now() - days * DAY);
  date.setUTCHours(hours, 0, 0, 0);
  return date.toISOString();
}

function keyFromId(id: string) {
  return id.replace(/^(crs|asm)_/, "");
}

type EnrollmentSeed = {
  id: string;
  userId: string;
  courseId: string;
  enrolledDaysAgo: number;
  completedLessons: number;
  completedDaysAgo?: number;
  progressDaysAgo?: number[];
};

const enrollments: EnrollmentSeed[] = [
  {
    id: "enr_maya_fullstack",
    userId: "usr_maya",
    courseId: "crs_fullstack",
    enrolledDaysAgo: 26,
    completedLessons: 9,
    progressDaysAgo: [21, 19, 16, 12, 8, 6, 4, 2, 1],
  },
  {
    id: "enr_maya_python",
    userId: "usr_maya",
    courseId: "crs_python",
    enrolledDaysAgo: 12,
    completedLessons: 2,
    progressDaysAgo: [6, 3],
  },
  {
    id: "enr_maya_cyber",
    userId: "usr_maya",
    courseId: "crs_cyber",
    enrolledDaysAgo: 58,
    completedLessons: 9,
    completedDaysAgo: 21,
    progressDaysAgo: [50, 47, 43, 38, 33, 28, 25, 23, 21],
  },
  {
    id: "enr_leo_fullstack",
    userId: "usr_leo",
    courseId: "crs_fullstack",
    enrolledDaysAgo: 42,
    completedLessons: 12,
    completedDaysAgo: 7,
    progressDaysAgo: [38, 35, 33, 30, 27, 24, 20, 17, 14, 11, 9, 7],
  },
  {
    id: "enr_leo_cloud",
    userId: "usr_leo",
    courseId: "crs_cloud",
    enrolledDaysAgo: 28,
    completedLessons: 3,
    progressDaysAgo: [22, 14, 6],
  },
  {
    id: "enr_priya_python",
    userId: "usr_priya",
    courseId: "crs_python",
    enrolledDaysAgo: 64,
    completedLessons: 9,
    completedDaysAgo: 31,
    progressDaysAgo: [60, 55, 51, 47, 43, 40, 37, 34, 31],
  },
  {
    id: "enr_priya_ml",
    userId: "usr_priya",
    courseId: "crs_ml",
    enrolledDaysAgo: 22,
    completedLessons: 4,
    progressDaysAgo: [17, 13, 9, 5],
  },
  {
    id: "enr_priya_cloud",
    userId: "usr_priya",
    courseId: "crs_cloud",
    enrolledDaysAgo: 14,
    completedLessons: 1,
    progressDaysAgo: [4],
  },
  {
    id: "enr_noah_cloud",
    userId: "usr_noah",
    courseId: "crs_cloud",
    enrolledDaysAgo: 19,
    completedLessons: 7,
    progressDaysAgo: [17, 15, 12, 10, 8, 5, 2],
  },
  {
    id: "enr_noah_cyber",
    userId: "usr_noah",
    courseId: "crs_cyber",
    enrolledDaysAgo: 11,
    completedLessons: 5,
    progressDaysAgo: [9, 7, 5, 3, 1],
  },
  {
    id: "enr_sara_frontend",
    userId: "usr_sara",
    courseId: "crs_frontend",
    enrolledDaysAgo: 38,
    completedLessons: 9,
    completedDaysAgo: 16,
    progressDaysAgo: [34, 31, 28, 25, 22, 20, 18, 17, 16],
  },
  {
    id: "enr_sara_fullstack",
    userId: "usr_sara",
    courseId: "crs_fullstack",
    enrolledDaysAgo: 18,
    completedLessons: 6,
    progressDaysAgo: [14, 11, 8, 5, 3, 1],
  },
  {
    id: "enr_tom_ml",
    userId: "usr_tom",
    courseId: "crs_ml",
    enrolledDaysAgo: 46,
    completedLessons: 9,
    completedDaysAgo: 29,
    progressDaysAgo: [42, 39, 36, 34, 33, 32, 31, 30, 29],
  },
  {
    id: "enr_tom_python",
    userId: "usr_tom",
    courseId: "crs_python",
    enrolledDaysAgo: 10,
    completedLessons: 5,
    progressDaysAgo: [7, 5, 4, 2, 1],
  },
  {
    id: "enr_jen_cloud",
    userId: "usr_jen",
    courseId: "crs_cloud",
    enrolledDaysAgo: 8,
    completedLessons: 2,
    progressDaysAgo: [5, 2],
  },
];

type AttemptSeed = {
  id: string;
  userId: string;
  assessmentId: string;
  submittedDaysAgo: number;
  correctCount: number;
  totalQuestions: number;
};

const attempts: AttemptSeed[] = [
  {
    id: "att_maya_cyber",
    userId: "usr_maya",
    assessmentId: "asm_cyber",
    submittedDaysAgo: 20,
    correctCount: 4,
    totalQuestions: 5,
  },
  {
    id: "att_maya_fullstack",
    userId: "usr_maya",
    assessmentId: "asm_fullstack",
    submittedDaysAgo: 5,
    correctCount: 3,
    totalQuestions: 5,
  },
  {
    id: "att_leo_fullstack",
    userId: "usr_leo",
    assessmentId: "asm_fullstack",
    submittedDaysAgo: 6,
    correctCount: 2,
    totalQuestions: 5,
  },
  {
    id: "att_priya_python",
    userId: "usr_priya",
    assessmentId: "asm_python",
    submittedDaysAgo: 30,
    correctCount: 4,
    totalQuestions: 5,
  },
  {
    id: "att_noah_cyber",
    userId: "usr_noah",
    assessmentId: "asm_cyber",
    submittedDaysAgo: 2,
    correctCount: 3,
    totalQuestions: 5,
  },
  {
    id: "att_sara_frontend",
    userId: "usr_sara",
    assessmentId: "asm_ux",
    submittedDaysAgo: 15,
    correctCount: 4,
    totalQuestions: 5,
  },
  {
    id: "att_tom_ml",
    userId: "usr_tom",
    assessmentId: "asm_ml",
    submittedDaysAgo: 28,
    correctCount: 5,
    totalQuestions: 5,
  },
];

const certificates = [
  {
    id: "cert_maya_cyber",
    userId: "usr_maya",
    courseId: "crs_cyber",
    code: "BF-CYBER-8F2K",
    daysAgo: 18,
  },
  {
    id: "cert_priya_python",
    userId: "usr_priya",
    courseId: "crs_python",
    code: "BF-DATA-4M7Q",
    daysAgo: 27,
  },
  {
    id: "cert_sara_frontend",
    userId: "usr_sara",
    courseId: "crs_frontend",
    code: "BF-UX-9T3L",
    daysAgo: 14,
  },
  {
    id: "cert_tom_ml",
    userId: "usr_tom",
    courseId: "crs_ml",
    code: "BF-ML-6R1X",
    daysAgo: 25,
  },
];

export function seedDatabase(db: Database.Database) {
  const hasUsers = db.prepare("SELECT COUNT(*) AS count FROM users").get() as {
    count: number;
  };
  if (hasUsers.count > 0) return;

  const passwordHashes = new Map<string, string>();
  const hashPassword = (password: string) => {
    const existing = passwordHashes.get(password);
    if (existing) return existing;
    const hash = bcrypt.hashSync(password, 10);
    passwordHashes.set(password, hash);
    return hash;
  };

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, avatar_color, headline, bio, status, created_at)
    VALUES (@id, @name, @email, @passwordHash, @role, @color, @headline, @bio, @status, @createdAt)
  `);

  const insertCourse = db.prepare(`
    INSERT INTO courses (
      id, slug, title, subtitle, description, category, level, duration_hours,
      cover, status, outcomes, requirements, instructor_id, created_at, updated_at
    ) VALUES (
      @id, @slug, @title, @subtitle, @description, @category, @level, @duration,
      @cover, @status, @outcomes, @requirements, @instructorId, @createdAt, @updatedAt
    )
  `);

  const insertModule = db.prepare(`
    INSERT INTO modules (id, course_id, title, summary, position)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, module_id, title, summary, content, kind, duration_minutes, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAssessment = db.prepare(`
    INSERT INTO assessments (
      id, course_id, title, description, type, duration_minutes, pass_score,
      status, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQuestion = db.prepare(`
    INSERT INTO questions (id, assessment_id, prompt, type, points, position)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertOption = db.prepare(`
    INSERT INTO options (id, question_id, label, is_correct, position)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertEnrollment = db.prepare(`
    INSERT INTO enrollments (id, user_id, course_id, enrolled_at, completed_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertProgress = db.prepare(`
    INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at)
    VALUES (?, ?, ?, ?)
  `);

  const insertAttempt = db.prepare(`
    INSERT INTO attempts (
      id, assessment_id, user_id, started_at, submitted_at, score, max_score, passed, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
  `);

  const insertAnswer = db.prepare(`
    INSERT INTO answers (
      id, attempt_id, question_id, selected_option_id, is_correct, points_awarded
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertCertificate = db.prepare(`
    INSERT INTO certificates (id, user_id, course_id, code, issued_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const courseLessonIds = new Map<string, string[]>();
  const assessmentQuestions = new Map<
    string,
    { id: string; points: number; correctOptionId: string; wrongOptionId: string }[]
  >();

  const run = db.transaction(() => {
    for (const user of seedUsers) {
      insertUser.run({
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: hashPassword(user.password),
        role: user.role,
        color: user.color,
        headline: user.headline,
        bio: user.bio ?? null,
        status: user.status ?? "active",
        createdAt: daysAgo(90),
      });
    }

    seedCourses.forEach((course, courseIndex) => {
      const key = keyFromId(course.id);
      const createdAt = daysAgo(75 - courseIndex * 4);

      insertCourse.run({
        id: course.id,
        slug: course.slug,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        cover: course.cover,
        status: course.status,
        outcomes: JSON.stringify(course.outcomes),
        requirements: JSON.stringify(course.requirements),
        instructorId: course.instructorId,
        createdAt,
        updatedAt: daysAgo(10 - courseIndex),
      });

      const lessonIds: string[] = [];

      course.modules.forEach((module, moduleIndex) => {
        const moduleId = `mod_${key}_${moduleIndex + 1}`;
        insertModule.run(
          moduleId,
          course.id,
          module.title,
          module.summary,
          moduleIndex,
        );

        module.lessons.forEach((lesson, lessonIndex) => {
          const lessonId = `les_${key}_${moduleIndex + 1}_${lessonIndex + 1}`;
          lessonIds.push(lessonId);
          insertLesson.run(
            lessonId,
            moduleId,
            lesson.title,
            lesson.summary,
            lesson.content,
            lesson.kind,
            lesson.duration,
            lessonIndex,
          );
        });
      });

      courseLessonIds.set(course.id, lessonIds);

      course.assessments.forEach((assessment, assessmentIndex) => {
        insertAssessment.run(
          assessment.id,
          course.id,
          assessment.title,
          assessment.description,
          assessment.type,
          assessment.duration,
          assessment.passScore,
          assessment.status,
          course.instructorId,
          createdAt,
          daysAgo(8),
        );

        const qKey = keyFromId(assessment.id);
        assessment.questions.forEach((question, questionIndex) => {
          const questionId = `q_${qKey}_${questionIndex + 1}`;
          insertQuestion.run(
            questionId,
            assessment.id,
            question.prompt,
            question.type ?? "multiple_choice",
            question.points ?? 10,
            questionIndex,
          );

          question.options.forEach((option, optionIndex) => {
            const optionId = `opt_${qKey}_${questionIndex + 1}_${String.fromCharCode(97 + optionIndex)}`;
            insertOption.run(
              optionId,
              questionId,
              option,
              optionIndex === question.correct ? 1 : 0,
              optionIndex,
            );

            if (!assessmentQuestions.has(assessment.id)) {
              assessmentQuestions.set(assessment.id, []);
            }

            const entry = assessmentQuestions.get(assessment.id)!;
            if (!entry[questionIndex]) {
              entry[questionIndex] = {
                id: questionId,
                points: question.points ?? 10,
                correctOptionId: "",
                wrongOptionId: "",
              };
            }
            if (optionIndex === question.correct) {
              entry[questionIndex].correctOptionId = optionId;
            } else if (!entry[questionIndex].wrongOptionId) {
              entry[questionIndex].wrongOptionId = optionId;
            }
          });
        });
      });
    });

    for (const enrollment of enrollments) {
      const lessonIds = courseLessonIds.get(enrollment.courseId) ?? [];
      const completed = lessonIds.slice(0, enrollment.completedLessons);
      const progressDays = enrollment.progressDaysAgo ?? [];

      insertEnrollment.run(
        enrollment.id,
        enrollment.userId,
        enrollment.courseId,
        daysAgo(enrollment.enrolledDaysAgo),
        enrollment.completedDaysAgo
          ? daysAgo(enrollment.completedDaysAgo)
          : null,
      );

      completed.forEach((lessonId, index) => {
        const offset = progressDays[index] ?? enrollment.enrolledDaysAgo - index;
        insertProgress.run(
          `lpr_${enrollment.id}_${index + 1}`,
          enrollment.userId,
          lessonId,
          daysAgo(Math.max(0, offset)),
        );
      });
    }

    for (const attempt of attempts) {
      const questionData = assessmentQuestions.get(attempt.assessmentId) ?? [];
      const maxScore = questionData.reduce((sum, q) => sum + q.points, 0);
      const score = questionData
        .slice(0, attempt.correctCount)
        .reduce((sum, q) => sum + q.points, 0);
      const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
      const submitted = daysAgo(attempt.submittedDaysAgo);

      insertAttempt.run(
        attempt.id,
        attempt.assessmentId,
        attempt.userId,
        daysAgo(attempt.submittedDaysAgo, 9),
        submitted,
        score,
        maxScore,
        percent >= 70 ? 1 : 0,
      );

      questionData.forEach((question, index) => {
        const isCorrect = index < attempt.correctCount;
        insertAnswer.run(
          `ans_${attempt.id}_${index + 1}`,
          attempt.id,
          question.id,
          isCorrect ? question.correctOptionId : question.wrongOptionId,
          isCorrect ? 1 : 0,
          isCorrect ? question.points : 0,
        );
      });
    }

    for (const certificate of certificates) {
      insertCertificate.run(
        certificate.id,
        certificate.userId,
        certificate.courseId,
        certificate.code,
        daysAgo(certificate.daysAgo),
      );
    }
  });

  run();
}
