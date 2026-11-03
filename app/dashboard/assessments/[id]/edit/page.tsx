import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Archive,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  ListChecks,
  Send,
  Sparkles,
  Target,
  Trash2,
  Users,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import {
  getAssessmentAttemptCount,
  getAssessmentAttempts,
  getAssessmentById,
  getQuestionsForAssessment,
} from "@/lib/queries";
import {
  deleteAssessmentAction,
  updateAssessmentStatusAction,
} from "@/lib/actions/assessments";
import { PageHeader } from "@/components/page-header";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/empty-state";
import { ConfirmForm } from "@/components/confirm-form";
import { formatDate } from "@/lib/utils";
import { AssessmentEditForm } from "./assessment-edit-form";
import { QuestionBuilder } from "./question-builder";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assessment studio",
};

export default async function EditAssessmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; status?: string; error?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([
    params,
    searchParams,
    requireStaff(),
  ]);
  const assessment = getAssessmentById(id);
  if (!assessment) notFound();

  if (user.role !== "admin" && assessment.instructor_id !== user.id) {
    redirect("/dashboard/assessments?error=forbidden");
  }

  const questions = getQuestionsForAssessment(assessment.id, true);
  const attempts = getAssessmentAttempts(assessment.id);
  const attemptCount = getAssessmentAttemptCount(assessment.id);
  const correctIndexByQuestion = new Map(
    questions.map((question) => [
      question.id,
      question.options.findIndex((option) => option.is_correct === 1),
    ]),
  );
  const totalAttempts = attempts.length;
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, attempt) =>
              sum +
              (attempt.max_score && attempt.max_score > 0
                ? ((attempt.score ?? 0) / attempt.max_score) * 100
                : 0),
            0,
          ) / attempts.length,
        )
      : 0;
  const passRate =
    attempts.length > 0
      ? Math.round(
          (attempts.filter((attempt) => attempt.passed).length / attempts.length) *
            100,
        )
      : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/assessments"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All assessments
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${assessment.course_slug}`}
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            <Eye className="h-3.5 w-3.5" />
            View course
          </Link>
          <Link
            href={`/dashboard/assessments/new?courseId=${assessment.course_id}`}
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            New assessment
          </Link>
        </div>
      </div>

      <PageHeader
        eyebrow={`${assessment.course_title} · ${assessment.type}`}
        title={assessment.title}
        description="Manage the details, question set, publishing state, and every student submission."
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={assessment.status} />
            <Badge tone="neutral">
              <Clock3 className="h-3 w-3" />
              {assessment.duration_minutes} min
            </Badge>
            <Badge tone="violet">
              <Target className="h-3 w-3" />
              {assessment.pass_score}% pass
            </Badge>
          </div>
        }
      />

      {query.created && (
        <div className="flex items-start gap-2 rounded-xl border border-electric-200 bg-electric-50 px-4 py-3 text-[11px] leading-5 text-electric-900">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-electric-600" />
          <p>
            Assessment created. Add the questions below, save them, and publish
            when you are ready for students to begin.
          </p>
        </div>
      )}
      {query.status === "updated" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Publishing status updated.
        </div>
      )}
      {query.error === "no-questions" && (
        <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          <AlertCircle className="h-4 w-4" />
          Add and save at least one question before publishing.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
        <div className="min-w-0 space-y-5">
          <AssessmentEditForm
            assessment={{
              id: assessment.id,
              title: assessment.title,
              description: assessment.description,
              type: assessment.type,
              duration_minutes: assessment.duration_minutes,
              pass_score: assessment.pass_score,
            }}
          />

          <QuestionBuilder
            assessmentId={assessment.id}
            locked={attemptCount > 0}
            attemptCount={attemptCount}
            initialQuestions={questions.map((question) => ({
              prompt: question.prompt,
              type: question.type,
              points: question.points,
              options: question.options.map((option) => option.label),
              correct: correctIndexByQuestion.get(question.id) ?? 0,
            }))}
          />

          <div className="card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-mist-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Submissions
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {totalAttempts} submitted attempt{totalAttempts === 1 ? "" : "s"}
                  {totalAttempts > 0
                    ? ` · ${averageScore}% average · ${passRate}% pass rate`
                    : ""}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-mist-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                <Users className="h-3 w-3" />
                {new Set(attempts.map((attempt) => attempt.user_id)).size} learners
              </span>
            </div>

            {attempts.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  icon={Send}
                  title="No submissions yet"
                  description={
                    assessment.status === "published"
                      ? "Students will appear here as soon as they submit an attempt."
                      : "Publish this assessment when your questions are ready, and submissions will arrive here."
                  }
                  className="py-9"
                />
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Result</th>
                      <th>Submitted</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.slice(0, 20).map((attempt) => {
                      const score =
                        attempt.max_score && attempt.max_score > 0
                          ? Math.round(
                              ((attempt.score ?? 0) / attempt.max_score) * 100,
                            )
                          : 0;
                      return (
                        <tr key={attempt.id}>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                name={attempt.user_name ?? "Student"}
                                color={attempt.user_color}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-[11.5px] font-bold text-ink-900">
                                  {attempt.user_name}
                                </p>
                                <p className="truncate text-[9px] text-slate-400">
                                  {attempt.user_email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-display text-[15px] font-semibold text-ink-900">
                              {score}%
                            </span>
                            <span className="ml-1.5 text-[9px] text-slate-400">
                              {attempt.score}/{attempt.max_score}
                            </span>
                          </td>
                          <td>
                            <StatusBadge
                              status={attempt.passed ? "passed" : "failed"}
                            />
                          </td>
                          <td className="text-[10px]">
                            {formatDate(attempt.submitted_at, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <Link
                              href={`/dashboard/assessments/${assessment.id}/results/${attempt.id}`}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                            >
                              Review
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <div className="card overflow-hidden">
            <div className="border-b border-mist-100 bg-ink-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                  Publishing
                </p>
                <StatusBadge status={assessment.status} />
              </div>
              <p className="mt-3 font-display text-[17px] font-semibold leading-snug">
                {assessment.status === "published"
                  ? "Live for enrolled students"
                  : assessment.status === "draft"
                    ? "Draft — only you can see it"
                    : "Archived — hidden from students"}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-5 text-slate-400">
                {assessment.status === "published"
                  ? "Students enrolled in this course can start or retake the assessment."
                  : "Review the questions and learning objectives before making it available."}
              </p>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3.5 py-2.5">
                <span className="inline-flex items-center gap-2 text-[10.5px] font-medium text-slate-500">
                  <ListChecks className="h-3.5 w-3.5 text-slate-400" />
                  Questions
                </span>
                <span className="text-[11px] font-bold text-ink-900">
                  {assessment.question_count ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3.5 py-2.5">
                <span className="inline-flex items-center gap-2 text-[10.5px] font-medium text-slate-500">
                  <Award className="h-3.5 w-3.5 text-slate-400" />
                  Total points
                </span>
                <span className="text-[11px] font-bold text-ink-900">
                  {assessment.total_points ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3.5 py-2.5">
                <span className="inline-flex items-center gap-2 text-[10.5px] font-medium text-slate-500">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  Course
                </span>
                <span className="max-w-[160px] truncate text-[10.5px] font-bold text-ink-900">
                  {assessment.course_title}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-mist-100 p-5">
              {assessment.status !== "published" && (
                <form action={updateAssessmentStatusAction}>
                  <input
                    type="hidden"
                    name="assessmentId"
                    value={assessment.id}
                  />
                  <input type="hidden" name="status" value="published" />
                  <button
                    type="submit"
                    disabled={(assessment.question_count ?? 0) === 0}
                    className={buttonStyles({
                      variant: "accent",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Publish assessment
                  </button>
                </form>
              )}
              {assessment.status === "published" && (
                <form action={updateAssessmentStatusAction}>
                  <input
                    type="hidden"
                    name="assessmentId"
                    value={assessment.id}
                  />
                  <input type="hidden" name="status" value="draft" />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "outline",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    Move back to draft
                  </button>
                </form>
              )}
              {assessment.status !== "archived" && (
                <form action={updateAssessmentStatusAction}>
                  <input
                    type="hidden"
                    name="assessmentId"
                    value={assessment.id}
                  />
                  <input type="hidden" name="status" value="archived" />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "ghost",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    <Archive className="h-4 w-4" />
                    Archive assessment
                  </button>
                </form>
              )}
              {assessment.status === "archived" && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-800">
                  Archived assessments stay in the gradebook but are hidden from
                  students.
                </p>
              )}
              {(assessment.question_count ?? 0) === 0 && (
                <p className="text-[9.5px] leading-4 text-slate-400">
                  Add at least one saved question before publishing.
                </p>
              )}
            </div>
          </div>

          {attempts.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[14px] font-semibold text-ink-950">
                  Performance
                </h2>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
                  <BarChart3 className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-mist-50 p-3">
                  <p className="font-display text-xl font-semibold text-ink-950">
                    {averageScore}%
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-400">Avg. score</p>
                </div>
                <div className="rounded-xl bg-mist-50 p-3">
                  <p className="font-display text-xl font-semibold text-ink-950">
                    {passRate}%
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-400">Pass rate</p>
                </div>
              </div>
              <p className="mt-3 text-[9.5px] leading-4 text-slate-400">
                Based on {attempts.length} submitted attempt
                {attempts.length === 1 ? "" : "s"}.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-coral-200 bg-coral-50/60 p-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coral-800">
              <Trash2 className="h-3.5 w-3.5" />
              Delete assessment
            </p>
            <p className="mt-1 text-[10px] leading-4 text-coral-700/80">
              This permanently removes the questions and{" "}
              {totalAttempts > 0 ? `${totalAttempts} submissions` : "all results"}.
              This cannot be undone.
            </p>
            <ConfirmForm
              action={deleteAssessmentAction}
              message={
                totalAttempts > 0
                  ? "This assessment has student submissions. Deleting it will erase their results permanently."
                  : "Delete this assessment and all of its questions?"
              }
              className="mt-3 w-full"
              hiddenFields={{ assessmentId: assessment.id }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete permanently
            </ConfirmForm>
          </div>
        </aside>
      </div>
    </div>
  );
}
