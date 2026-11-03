import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getActiveAttempt,
  getAssessmentById,
  getEnrollment,
  getQuestionsForAssessment,
} from "@/lib/queries";
import { AssessmentRunner } from "./assessment-runner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assessment in progress",
};

export default async function TakeAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);
  if (user.role !== "student") redirect("/dashboard/assessments");

  const assessment = getAssessmentById(id);
  if (!assessment || assessment.status !== "published") notFound();

  const enrollment = getEnrollment(user.id, assessment.course_id);
  if (!enrollment) redirect(`/courses/${assessment.course_slug}?error=enroll`);

  const attempt = getActiveAttempt(user.id, assessment.id);
  if (!attempt) redirect(`/dashboard/assessments/${assessment.id}`);

  const questions = getQuestionsForAssessment(assessment.id, false);
  if (questions.length === 0) {
    redirect(`/dashboard/assessments/${assessment.id}`);
  }

  const startedAt = new Date(attempt.started_at).getTime();
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const remainingSeconds = Math.max(
    0,
    assessment.duration_minutes * 60 - elapsedSeconds,
  );

  return (
    <AssessmentRunner
      assessmentId={assessment.id}
      title={assessment.title}
      courseTitle={assessment.course_title ?? ""}
      remainingSeconds={remainingSeconds}
      questions={questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        points: question.points,
        type: question.type,
        options: question.options.map((option) => ({
          id: option.id,
          label: option.label,
        })),
      }))}
    />
  );
}
