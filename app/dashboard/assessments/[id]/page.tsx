import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HelpCircle,
  History,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getActiveAttempt,
  getAssessmentById,
  getBestAttempt,
  getEnrollment,
  getUserAttempts,
} from "@/lib/queries";
import { startAttemptAction } from "@/lib/actions/assessments";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { formatDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assessment",
};

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);
  const assessment = getAssessmentById(id);

  if (!assessment) notFound();

  if (user.role !== "student") {
    if (user.role === "admin" || assessment.instructor_id === user.id) {
      redirect(`/dashboard/assessments/${assessment.id}/edit`);
    }
    notFound();
  }

  if (assessment.status !== "published") notFound();

  const enrollment = getEnrollment(user.id, assessment.course_id);
  if (!enrollment) redirect(`/courses/${assessment.course_slug}?error=enroll`);

  const activeAttempt = getActiveAttempt(user.id, assessment.id);
  const bestAttempt = getBestAttempt(user.id, assessment.id);
  const attempts = getUserAttempts(user.id).filter(
    (attempt) => attempt.assessment_id === assessment.id,
  );
  const bestScore =
    bestAttempt && bestAttempt.max_score
      ? Math.round(((bestAttempt.score ?? 0) / bestAttempt.max_score) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
        <Link
          href="/dashboard/assessments"
          className="inline-flex items-center gap-1 hover:text-ink-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Assessments
        </Link>
        <span>/</span>
        <span className="truncate text-slate-600">{assessment.course_title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white shadow-lift sm:p-8">
            <div className="absolute inset-0 bg-grid-dark bg-[size:40px_40px] opacity-25" />
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-electric-500/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={assessment.type === "exam" ? "violet" : "blue"}>
                  {assessment.type}
                </Badge>
                <Badge tone="dark">{assessment.pass_score}% to pass</Badge>
                {bestAttempt?.passed && (
                  <Badge tone="lime">
                    <CheckCircle2 className="h-3 w-3" />
                    Passed
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 max-w-2xl font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[40px]">
                {assessment.title}
              </h1>
              <p className="mt-2 text-[12px] font-medium text-electric-200">
                {assessment.course_title}
              </p>
              <p className="mt-4 max-w-xl text-[13px] leading-6 text-slate-400">
                {assessment.description}
              </p>

              <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.04] py-3">
                {[
                  [String(assessment.question_count ?? 0), "Questions"],
                  [`${assessment.duration_minutes} min`, "Time limit"],
                  [`${assessment.pass_score}%`, "Pass score"],
                ].map(([value, label]) => (
                  <div key={label} className="px-4 text-center">
                    <p className="font-display text-lg font-semibold text-white">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[9px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {bestAttempt?.passed && (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-semibold text-ink-950">
                      You passed this checkpoint
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Best score: {bestScore}% · {formatDate(bestAttempt.submitted_at)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/assessments/${assessment.id}/results/${bestAttempt.id}`}
                  className={buttonStyles({ variant: "outline", size: "md" })}
                >
                  Review answers
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ProgressBar
                value={bestScore}
                size="sm"
                className="mt-4 bg-emerald-100"
                barClassName="bg-emerald-500"
              />
            </div>
          )}

          {activeAttempt && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-200 text-amber-900">
                  <Timer className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-amber-900">
                    You have an attempt in progress
                  </p>
                  <p className="mt-0.5 text-[10px] text-amber-700">
                    Started {timeAgo(activeAttempt.started_at)}. Resume when you
                    are ready — the timer continues.
                  </p>
                </div>
                <Link
                  href={`/dashboard/assessments/${assessment.id}/take`}
                  className={buttonStyles({
                    variant: "primary",
                    size: "sm",
                    className: "shrink-0",
                  })}
                >
                  Resume
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
              How this assessment works
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: FileCheck2,
                  title: "Auto-graded",
                  text: "Every answer is scored the moment you submit.",
                },
                {
                  icon: Clock3,
                  title: "Timed",
                  text: `You have ${assessment.duration_minutes} minutes to complete it.`,
                },
                {
                  icon: RotateCcw,
                  title: "Unlimited retakes",
                  text: "Review your feedback and try again when ready.",
                },
                {
                  icon: ShieldCheck,
                  title: "Private results",
                  text: "Only you and your instructor can see your attempts.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl bg-mist-50/70 p-3.5"
                >
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
                  <div>
                    <p className="text-[11px] font-bold text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {attempts.length > 0 && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-5 sm:p-6">
                <div>
                  <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                    Your attempts
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    A record of every submission.
                  </p>
                </div>
                <History className="h-4 w-4 text-slate-400" />
              </div>
              <div className="divide-y divide-mist-100">
                {attempts.map((attempt, index) => {
                  const score =
                    attempt.max_score && attempt.max_score > 0
                      ? Math.round(
                          ((attempt.score ?? 0) / attempt.max_score) * 100,
                        )
                      : 0;
                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mist-100 font-mono text-[10px] font-bold text-slate-500">
                        {String(attempts.length - index).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-bold text-ink-900">
                            {score}% score
                          </p>
                          <StatusBadge
                            status={attempt.passed ? "passed" : "failed"}
                          />
                        </div>
                        <p className="mt-0.5 text-[9.5px] text-slate-400">
                          {formatDate(attempt.submitted_at)} ·{" "}
                          {attempt.score}/{attempt.max_score} points
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/assessments/${assessment.id}/results/${attempt.id}`}
                        className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
                      >
                        Review
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-lift">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric-50 text-electric-600">
                  <Target className="h-5 w-5" />
                </span>
                <Badge tone="green" dot>
                  Ready
                </Badge>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink-950">
                {activeAttempt
                  ? "Your timer is running"
                  : bestAttempt?.passed
                    ? "Sharpen your score"
                    : "Ready when you are"}
              </h2>
              <p className="mt-2 text-[11.5px] leading-5 text-slate-500">
                {activeAttempt
                  ? "Resume your in-progress attempt. Answers are submitted together at the end."
                  : bestAttempt?.passed
                    ? "Retakes are unlimited. Use the feedback to target the concepts that need another pass."
                    : "Find a quiet moment, read each question carefully, and submit once you have reviewed your answers."}
              </p>

              {(assessment.question_count ?? 0) === 0 ? (
                <div className="mt-5 rounded-xl bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">
                  This assessment has no questions yet. Your instructor is still
                  preparing it.
                </div>
              ) : activeAttempt ? (
                <Link
                  href={`/dashboard/assessments/${assessment.id}/take`}
                  className={buttonStyles({
                    variant: "electric",
                    size: "lg",
                    className: "mt-5 w-full",
                  })}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Resume attempt
                </Link>
              ) : (
                <form action={startAttemptAction} className="mt-5">
                  <input
                    type="hidden"
                    name="assessmentId"
                    value={assessment.id}
                  />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "electric",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    {bestAttempt?.passed ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Retake assessment
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-current" />
                        Start assessment
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-5 space-y-2.5 border-t border-mist-100 pt-5">
                {[
                  { icon: Clock3, text: `${assessment.duration_minutes}-minute limit` },
                  { icon: FileCheck2, text: `${assessment.question_count} questions` },
                  { icon: Target, text: `${assessment.pass_score}% required to pass` },
                  { icon: HelpCircle, text: "Results and answer review after submit" },
                  { icon: Award, text: "Pass all assessments to unlock your certificate" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 text-[10.5px] text-slate-500"
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-mist-100 bg-mist-50/60 px-6 py-4 text-[9.5px] leading-4 text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole className="h-3 w-3 text-emerald-500" />
                Your answers are only visible to you and your instructor.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
