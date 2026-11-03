"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  issueCertificateIfEligible,
  requireCourseManager,
} from "@/lib/access";
import {
  getActiveAttempt,
  getAssessmentById,
  getEnrollment,
  getQuestionsForAssessment,
} from "@/lib/queries";

export type AssessmentFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
};

export type AssessmentQuestionInput = {
  prompt: string;
  type: "multiple_choice" | "true_false";
  points: number;
  options: string[];
  correct: number;
};

function assessmentInput(formData: FormData) {
  return {
    courseId: String(formData.get("courseId") ?? ""),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    type: String(formData.get("type") ?? "quiz"),
    duration: Number(formData.get("duration") ?? 15),
    passScore: Number(formData.get("passScore") ?? 70),
  };
}

function validateAssessment(input: ReturnType<typeof assessmentInput>) {
  const errors: Record<string, string> = {};
  if (input.title.length < 4) errors.title = "Use at least 4 characters.";
  if (!["quiz", "exam"].includes(input.type)) errors.type = "Choose quiz or exam.";
  if (!Number.isFinite(input.duration) || input.duration < 5 || input.duration > 180) {
    errors.duration = "Duration must be between 5 and 180 minutes.";
  }
  if (!Number.isFinite(input.passScore) || input.passScore < 1 || input.passScore > 100) {
    errors.passScore = "Pass score must be between 1 and 100.";
  }
  if (input.description.length > 600) {
    errors.description = "Keep the description under 600 characters.";
  }
  return errors;
}

function revalidateAssessmentSurfaces(assessmentId?: string, courseSlug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/assessments");
  if (assessmentId) revalidatePath(`/dashboard/assessments/${assessmentId}`);
  revalidatePath("/dashboard/learning");
  if (courseSlug) revalidatePath(`/courses/${courseSlug}`);
}

export async function createAssessmentAction(
  _prevState: AssessmentFormState,
  formData: FormData,
): Promise<AssessmentFormState> {
  const input = assessmentInput(formData);
  const { user, course } = await requireCourseManager(input.courseId);
  const errors = validateAssessment(input);
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  const id = `asm_${crypto.randomUUID()}`;
  getDb()
    .prepare(
      `INSERT INTO assessments (
        id, course_id, title, description, type, duration_minutes, pass_score,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
    )
    .run(
      id,
      input.courseId,
      input.title,
      input.description,
      input.type,
      Math.round(input.duration),
      Math.round(input.passScore),
      user.id,
    );

  revalidateAssessmentSurfaces(id, course.slug);
  redirect(`/dashboard/assessments/${id}/edit?created=1`);
}

export async function updateAssessmentAction(
  _prevState: AssessmentFormState,
  formData: FormData,
): Promise<AssessmentFormState> {
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const input = assessmentInput(formData);
  const assessment = getAssessmentById(assessmentId);
  if (!assessment) return { error: "Assessment not found." };
  const { course } = await requireCourseManager(assessment.course_id);
  const errors = validateAssessment({ ...input, courseId: assessment.course_id });
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  getDb()
    .prepare(
      `UPDATE assessments SET title = ?, description = ?, type = ?,
        duration_minutes = ?, pass_score = ?,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`,
    )
    .run(
      input.title,
      input.description,
      input.type,
      Math.round(input.duration),
      Math.round(input.passScore),
      assessmentId,
    );

  revalidateAssessmentSurfaces(assessmentId, course.slug);
  return { success: "Assessment details saved." };
}

export async function saveQuestionsAction(
  assessmentId: string,
  questions: AssessmentQuestionInput[],
): Promise<{ success?: string; error?: string }> {
  const assessment = getAssessmentById(assessmentId);
  if (!assessment) return { error: "Assessment not found." };
  const { course } = await requireCourseManager(assessment.course_id);

  const attemptCount = getDb()
    .prepare("SELECT COUNT(*) AS count FROM attempts WHERE assessment_id = ?")
    .get(assessmentId) as { count: number };
  if (attemptCount.count > 0) {
    return {
      error:
        "Questions are locked because students have already started this assessment. Create a new assessment to change them.",
    };
  }

  if (!Array.isArray(questions) || questions.length < 1) {
    return { error: "Add at least one question." };
  }
  if (questions.length > 50) return { error: "Keep assessments to 50 questions or fewer." };

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    if (!question.prompt.trim() || question.prompt.trim().length < 5) {
      return { error: `Question ${index + 1} needs a clearer prompt.` };
    }
    if (!Number.isFinite(question.points) || question.points < 1 || question.points > 100) {
      return { error: `Question ${index + 1} needs points between 1 and 100.` };
    }
    if (!["multiple_choice", "true_false"].includes(question.type)) {
      return { error: `Question ${index + 1} has an invalid type.` };
    }
    if (
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      question.options.some((option) => !option.trim())
    ) {
      return { error: `Question ${index + 1} needs at least two non-empty answers.` };
    }
    if (
      !Number.isInteger(question.correct) ||
      question.correct < 0 ||
      question.correct >= question.options.length
    ) {
      return { error: `Choose the correct answer for question ${index + 1}.` };
    }
  }

  const db = getDb();
  const replace = db.transaction(() => {
    db.prepare("DELETE FROM questions WHERE assessment_id = ?").run(assessmentId);
    const insertQuestion = db.prepare(
      `INSERT INTO questions (id, assessment_id, prompt, type, points, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    const insertOption = db.prepare(
      `INSERT INTO options (id, question_id, label, is_correct, position)
       VALUES (?, ?, ?, ?, ?)`,
    );

    questions.forEach((question, questionIndex) => {
      const questionId = `q_${crypto.randomUUID()}`;
      insertQuestion.run(
        questionId,
        assessmentId,
        question.prompt.trim(),
        question.type,
        Math.round(question.points),
        questionIndex,
      );
      question.options.forEach((option, optionIndex) => {
        insertOption.run(
          `opt_${crypto.randomUUID()}`,
          questionId,
          option.trim(),
          optionIndex === question.correct ? 1 : 0,
          optionIndex,
        );
      });
    });
  });

  replace();
  revalidateAssessmentSurfaces(assessmentId, course.slug);
  return { success: "Questions saved." };
}

export async function updateAssessmentStatusAction(formData: FormData) {
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const status = String(formData.get("status") ?? "");
  const assessment = getAssessmentById(assessmentId);
  if (!assessment) redirect("/dashboard/assessments");
  const { course } = await requireCourseManager(assessment.course_id);

  if (!["draft", "published", "archived"].includes(status)) return;

  if (status === "published") {
    const count = getDb()
      .prepare("SELECT COUNT(*) AS count FROM questions WHERE assessment_id = ?")
      .get(assessmentId) as { count: number };
    if (count.count === 0) {
      redirect(`/dashboard/assessments/${assessmentId}/edit?error=no-questions`);
    }
  }

  getDb()
    .prepare(
      "UPDATE assessments SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
    .run(status, assessmentId);

  revalidateAssessmentSurfaces(assessmentId, course.slug);
  redirect(`/dashboard/assessments/${assessmentId}/edit?status=updated`);
}

export async function deleteAssessmentAction(formData: FormData) {
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const assessment = getAssessmentById(assessmentId);
  if (!assessment) redirect("/dashboard/assessments");
  const { course } = await requireCourseManager(assessment.course_id);

  getDb().prepare("DELETE FROM assessments WHERE id = ?").run(assessmentId);
  revalidateAssessmentSurfaces(undefined, course.slug);
  redirect("/dashboard/assessments?deleted=1");
}

export async function startAttemptAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "student") redirect("/dashboard/assessments");

  const assessmentId = String(formData.get("assessmentId") ?? "");
  const assessment = getAssessmentById(assessmentId);
  if (!assessment || assessment.status !== "published") {
    redirect("/dashboard/assessments?error=unavailable");
  }
  const enrollment = getEnrollment(user.id, assessment.course_id);
  if (!enrollment) {
    redirect(`/courses/${assessment.course_slug}?error=enroll`);
  }

  const db = getDb();
  const active = getActiveAttempt(user.id, assessmentId);
  if (!active) {
    db.prepare(
      `INSERT INTO attempts (id, assessment_id, user_id)
       VALUES (?, ?, ?)`,
    ).run(`att_${crypto.randomUUID()}`, assessmentId, user.id);
  }

  revalidatePath("/dashboard/assessments");
  redirect(`/dashboard/assessments/${assessmentId}/take`);
}

export async function submitAssessmentAction(
  assessmentId: string,
  answers: Record<string, string>,
): Promise<{ attemptId?: string; error?: string }> {
  const user = await requireUser();
  if (user.role !== "student") return { error: "Only students can submit assessments." };

  const assessment = getAssessmentById(assessmentId);
  if (!assessment) return { error: "Assessment not found." };

  const db = getDb();
  const attempt = getActiveAttempt(user.id, assessmentId);
  if (!attempt) {
    const submitted = db
      .prepare(
        `SELECT id FROM attempts WHERE user_id = ? AND assessment_id = ?
         AND status = 'submitted' ORDER BY submitted_at DESC LIMIT 1`,
      )
      .get(user.id, assessmentId) as { id: string } | undefined;
    if (submitted) return { attemptId: submitted.id };
    return { error: "No active attempt was found. Start the assessment again." };
  }

  const questions = getQuestionsForAssessment(assessmentId, true);
  if (questions.length === 0) return { error: "This assessment has no questions." };

  let score = 0;
  let maxScore = 0;
  const graded = questions.map((question) => {
    const selectedOptionId = answers[question.id];
    const selected = question.options.find((option) => option.id === selectedOptionId);
    const correct = question.options.find((option) => option.is_correct === 1);
    const isCorrect = Boolean(selected && correct && selected.id === correct.id);
    maxScore += question.points;
    if (isCorrect) score += question.points;
    return {
      questionId: question.id,
      selectedOptionId: selected?.id ?? null,
      isCorrect,
      points: isCorrect ? question.points : 0,
    };
  });

  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const passed = percent >= assessment.pass_score;

  const submit = db.transaction(() => {
    const insertAnswer = db.prepare(
      `INSERT INTO answers (
        id, attempt_id, question_id, selected_option_id, is_correct, points_awarded
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    );
    graded.forEach((answer) => {
      insertAnswer.run(
        `ans_${crypto.randomUUID()}`,
        attempt.id,
        answer.questionId,
        answer.selectedOptionId,
        answer.isCorrect ? 1 : 0,
        answer.points,
      );
    });

    db.prepare(
      `UPDATE attempts SET status = 'submitted', submitted_at = ?, score = ?,
        max_score = ?, passed = ? WHERE id = ?`,
    ).run(new Date().toISOString(), score, maxScore, passed ? 1 : 0, attempt.id);
  });

  submit();
  await issueCertificateIfEligible(user.id, assessment.course_id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/assessments");
  revalidatePath(`/dashboard/assessments/${assessmentId}`);
  revalidatePath("/dashboard/certificates");
  revalidatePath("/dashboard/learning");
  revalidatePath(`/dashboard/learning/${assessment.course_slug}`);

  return { attemptId: attempt.id };
}
