import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  FileCheck2,
  RotateCcw,
  Target,
  X,
  XCircle,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getAssessmentById,
  getAttempt,
  getAttemptAnswers,
  getEnrollment,
} from "@/lib/queries";
import { startAttemptAction } from "@/lib/actions/assessments";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assessment result",
};

export default async function AssessmentResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const [{ id, attemptId }, user] = await Promise.all([params, requireUser()]);
  const attempt = getAttempt(attemptId);

  if (!attempt || attempt.assessment_id !== id) notFound();

  const staffManager =
    user.role === "admin" ||
    (user.role === "instructor" && attempt && user.id === attempt.user_id);

  const assessment = getAssessmentById(attempt.assessment_id);
  if (!assessment) notFound();

  const canAccess =
    attempt.user_id === user.id ||
    user.role === "admin" ||
    (user.role === "instructor" && assessment.instructor_id === user.id);

  if (!canAccess) notFound();

  if (attempt.status === "in_progress") {
    if (attempt.user_id === user.id) {
      redirect(`/dashboard/assessments/${attempt.assessment_id}/take`);
    }
    redirect(`/dashboard/assessments/${attempt.assessment_id}/edit`);
  }

  const answers = getAttemptAnswers(attempt.id);
  const score =
    attempt.max_score && attempt.max_score > 0
      ? Math.round(((attempt.score ?? 0) / attempt.max_score) * 100)
      : 0;
  const passed = Boolean(attempt.passed);
  const correctCount = answers.filter((answer) => answer.is_correct).length;
  const isOwnAttempt = attempt.user_id === user.id;
  const enrollment = getEnrollment(user.id, assessment.course_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={
            isOwnAttempt
              ? "/dashboard/assessments"
              : `/dashboard/assessments/${assessment.id}/edit`
          }
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isOwnAttempt ? "All assessments" : "Back to assessment studio"}
        </Link>
        {!isOwnAttempt && (
          <Badge tone="violet">
            Viewing {attempt.user_name}&apos;s submission
          </Badge>
        )}
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border p-6 shadow-soft sm:p-8 ${
          passed
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-white"
            : "border-coral-200 bg-gradient-to-br from-coral-50/70 via-white to-white"
        }`}
      >
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <ProgressRing
                value={score}
                size={104}
                stroke={8}
                labelClassName="text-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-4 border-white ${
                  passed
                    ? "bg-emerald-500 text-white"
                    : "bg-coral-500 text-white"
                }`}
              >
                {passed ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <X className="h-4 w-4" strokeWidth={3} />
                )}
              </span>
            </div>
            <div>
              <Badge tone={passed ? "green" : "red"}>
                {passed ? "Passed" : "Not passed yet"}
              </Badge>
              <h1 className="mt-2 font-display text-[27px] font-semibold leading-tight tracking-[-0.035em] text-ink-950 sm:text-[34px]">
                {passed ? "Strong work." : "Useful feedback."}
              </h1>
              <p className="mt-1 text-[12px] text-slate-500">
                {attempt.assessment_title} · {attempt.course_title}
              </p>
              {!isOwnAttempt && (
                <p className="mt-1 text-[10px] text-slate-400">
                  Submitted by {attempt.user_name} ({attempt.user_email})
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOwnAttempt && passed && (
              <Link
                href="/dashboard/certificates"
                className={buttonStyles({ variant: "outline", size: "md" })}
              >
                <Award className="h-4 w-4" />
                Certificates
              </Link>
            )}
            {isOwnAttempt && enrollment && (
              <Link
                href={`/dashboard/learning/${attempt.course_slug}`}
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                Back to course
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {!isOwnAttempt && (
              <Link
                href={`/dashboard/assessments/${assessment.id}/edit`}
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                Assessment studio
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
          {[
            {
              label: "Score",
              value: `${attempt.score} / ${attempt.max_score}`,
              icon: Target,
            },
            {
              label: "Correct",
              value: `${correctCount} of ${answers.length}`,
              icon: FileCheck2,
            },
            {
              label: "Pass mark",
              value: `${assessment.pass_score}%`,
              icon: CheckCircle2,
            },
            {
              label: "Submitted",
              value: formatDate(attempt.submitted_at, {
                month: "short",
                day: "numeric",
              }),
              icon: Clock3,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur"
            >
              <stat.icon className="h-3.5 w-3.5 text-slate-400" />
              <p className="mt-2 text-[13px] font-bold text-ink-900">
                {stat.value}
              </p>
              <p className="text-[9px] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {!passed && isOwnAttempt && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-200 text-amber-900">
              <RotateCcw className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[12px] font-bold text-amber-900">
                You need {assessment.pass_score}% to pass
              </p>
              <p className="mt-0.5 text-[10.5px] leading-4 text-amber-700">
                Review the explanations below, revisit the related lessons, and
                try again when ready. There is no attempt limit.
              </p>
            </div>
          </div>
          <form action={startAttemptAction} className="shrink-0">
            <input type="hidden" name="assessmentId" value={assessment.id} />
            <button
              type="submit"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              <RotateCcw className="h-4 w-4" />
              Retake assessment
            </button>
          </form>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
              Answer review
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              See what you chose and which answer was correct.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Correct
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-coral-500" />
              Your answer
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div
              key={answer.id}
              className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft"
            >
              <div className="flex items-start gap-3 border-b border-mist-100 px-5 py-4 sm:px-6">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    answer.is_correct
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-coral-50 text-coral-600"
                  }`}
                >
                  {answer.is_correct ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <X className="h-4 w-4" strokeWidth={2.5} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] font-bold text-slate-400">
                      QUESTION {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge tone={answer.is_correct ? "green" : "red"}>
                      {answer.points_awarded} / {answer.points} pts
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold leading-6 text-ink-900">
                    {answer.prompt}
                  </p>
                </div>
              </div>
              <div className="space-y-2 px-5 py-4 sm:px-6">
                {answer.options.map((option) => {
                  const selected = option.id === answer.selected_option_id;
                  const isCorrect = option.is_correct === 1;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/60"
                          : selected
                            ? "border-coral-200 bg-coral-50/60"
                            : "border-mist-100 bg-mist-50/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                          isCorrect
                            ? "border-emerald-400 bg-emerald-500 text-white"
                            : selected
                              ? "border-coral-400 bg-coral-500 text-white"
                              : "border-mist-300 bg-white text-slate-300"
                        }`}
                      >
                        {isCorrect ? (
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        ) : selected ? (
                          <X className="h-2.5 w-2.5" strokeWidth={3} />
                        ) : (
                          <Circle className="h-1.5 w-1.5 fill-current" />
                        )}
                      </span>
                      <span
                        className={`text-[12px] leading-5 ${
                          isCorrect
                            ? "font-semibold text-emerald-900"
                            : selected
                              ? "font-semibold text-coral-900"
                              : "text-slate-500"
                        }`}
                      >
                        {option.label}
                        {isCorrect && (
                          <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                            Correct answer
                          </span>
                        )}
                        {selected && !isCorrect && (
                          <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-coral-500">
                            Your answer
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                {!answer.selected_option_id && (
                  <p className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600">
                    <XCircle className="h-3.5 w-3.5" />
                    You did not answer this question.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOwnAttempt && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist-200 bg-white p-5">
          <p className="text-[11px] text-slate-500">
            Retakes are unlimited. Aim for understanding, not perfection.
          </p>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/assessments/${assessment.id}`}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Assessment overview
            </Link>
            <form action={startAttemptAction}>
              <input type="hidden" name="assessmentId" value={assessment.id} />
              <button
                type="submit"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retake
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
