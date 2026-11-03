import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileCheck2,
  PlusCircle,
  Sparkles,
  Target,
  Timer,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getAssessmentsForUser,
  getStaffStats,
  getStudentStats,
  getUserAttempts,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CourseCover } from "@/components/course-cover";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/ui/progress";

export const metadata = {
  title: "Assessments",
};

export default async function AssessmentsPage() {
  const user = await requireUser();

  if (user.role === "student") {
    const [assessments, stats, attempts] = await Promise.all([
      getAssessmentsForUser(user),
      getStudentStats(user.id),
      getUserAttempts(user.id),
    ]);

    const pending = assessments.filter((assessment) => !assessment.best_passed);
    const passed = assessments.filter((assessment) => assessment.best_passed);
    const nextAssessment = pending[0] ?? assessments[0];

    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Assessments"
          title="Prove what you know"
          description="Every assessment is a checkpoint, not a final judgement. Review the feedback, revisit the lesson, and try again."
        />

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Ready to take"
            value={pending.length}
            icon={FileCheck2}
            tone="blue"
            hint="Across your courses"
          />
          <StatCard
            label="Passed"
            value={passed.length}
            icon={CheckCircle2}
            tone="green"
            hint="Checkpoints cleared"
          />
          <StatCard
            label="Average score"
            value={stats.assessmentAttempts > 0 ? `${stats.averageScore}%` : "—"}
            icon={Target}
            tone="violet"
            hint={`${stats.assessmentAttempts} attempt${stats.assessmentAttempts === 1 ? "" : "s"}`}
          />
          <StatCard
            label="Certificates"
            value={stats.certificates}
            icon={Award}
            tone="amber"
            hint="Earned so far"
          />
        </div>

        {nextAssessment && (
          <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white shadow-lift sm:p-7">
            <div className="absolute inset-0 bg-grid-dark bg-[size:38px_38px] opacity-25" />
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-electric-500/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-300 text-ink-950">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                    {pending.length > 0 ? "Your next checkpoint" : "Revisit a checkpoint"}
                  </p>
                  <h2 className="mt-1.5 font-display text-[22px] font-semibold tracking-tight">
                    {nextAssessment.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {nextAssessment.course_title} · {nextAssessment.question_count}{" "}
                    questions · {nextAssessment.duration_minutes} minutes ·{" "}
                    {nextAssessment.pass_score}% to pass
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/assessments/${nextAssessment.id}`}
                className={buttonStyles({
                  variant: "accent",
                  size: "md",
                  className: "shrink-0",
                })}
              >
                {nextAssessment.best_passed ? "Review result" : "Open assessment"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {assessments.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No assessments available yet"
            description="Assessments unlock when you enroll in a course that includes a published checkpoint."
            action={
              <Link href="/courses" className={buttonStyles({ variant: "electric" })}>
                Explore courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
            className="bg-white"
          />
        ) : (
          <>
            {pending.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                      Ready to take
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      No deadline pressure. Start when you can focus.
                    </p>
                  </div>
                  <Badge tone="blue">{pending.length} waiting</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {pending.map((assessment) => (
                    <AssessmentCard key={assessment.id} assessment={assessment} />
                  ))}
                </div>
              </section>
            )}

            {passed.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                      Passed checkpoints
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Strong work. You can retake any assessment to sharpen your score.
                    </p>
                  </div>
                  <Badge tone="green">{passed.length} passed</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {passed.map((assessment) => (
                    <AssessmentCard key={assessment.id} assessment={assessment} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {attempts.length > 0 && (
          <section className="card overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                    Attempt history
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Every submission, with the score you achieved.
                  </p>
                </div>
                <BarChart3 className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Course</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Submitted</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 10).map((attempt) => {
                    const score =
                      attempt.max_score && attempt.max_score > 0
                        ? Math.round(
                            ((attempt.score ?? 0) / attempt.max_score) * 100,
                          )
                        : 0;
                    return (
                      <tr key={attempt.id}>
                        <td className="font-semibold text-ink-900">
                          {attempt.assessment_title}
                        </td>
                        <td>{attempt.course_title}</td>
                        <td className="font-semibold">{score}%</td>
                        <td>
                          <StatusBadge status={attempt.passed ? "passed" : "failed"} />
                        </td>
                        <td className="text-[11px]">
                          {attempt.submitted_at
                            ? new Date(attempt.submitted_at).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" },
                              )
                            : "—"}
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/assessments/${attempt.assessment_id}/results/${attempt.id}`}
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
          </section>
        )}
      </div>
    );
  }

  const [assessments, stats] = await Promise.all([
    getAssessmentsForUser(user),
    getStaffStats(user),
  ]);
  const totalAttempts = assessments.reduce(
    (sum, assessment) => sum + (assessment.attempt_count ?? 0),
    0,
  );
  const published = assessments.filter(
    (assessment) => assessment.status === "published",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assessments"
        title="Checkpoints, managed"
        description="Build assessments, publish them when the curriculum is ready, and review every submission in one place."
        action={
          <Link
            href="/dashboard/assessments/new"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <PlusCircle className="h-4 w-4" />
            New assessment
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Assessments"
          value={assessments.length}
          icon={ClipboardList}
          tone="blue"
          hint={`${published.length} published`}
        />
        <StatCard
          label="Submissions"
          value={totalAttempts}
          icon={Users}
          tone="lime"
          hint="Across all checkpoints"
        />
        <StatCard
          label="Average score"
          value={stats.averageScore > 0 ? `${stats.averageScore}%` : "—"}
          icon={Target}
          tone="violet"
          hint="Submitted attempts"
        />
        <StatCard
          label="Course completion"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          tone="green"
          hint={`${stats.completedEnrollments} learners finished`}
        />
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No assessments yet"
          description="Create a quiz or exam for one of your courses. Add questions, publish it, and students can start immediately."
          action={
            <Link
              href="/dashboard/assessments/new"
              className={buttonStyles({ variant: "primary" })}
            >
              Create your first assessment
            </Link>
          }
          className="bg-white"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 sm:p-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                All assessments
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Draft, publish, and monitor completion.
              </p>
            </div>
            <Badge tone="neutral">{assessments.length} total</Badge>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Course</th>
                  <th>Questions</th>
                  <th>Submissions</th>
                  <th>Avg score</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id}>
                    <td>
                      <p className="text-[12px] font-bold text-ink-900">
                        {assessment.title}
                      </p>
                      <p className="mt-0.5 text-[9.5px] uppercase tracking-wider text-slate-400">
                        {assessment.type}
                      </p>
                    </td>
                    <td className="max-w-[190px] truncate text-[11px]">
                      {assessment.course_title}
                    </td>
                    <td>{assessment.question_count ?? 0}</td>
                    <td>{assessment.attempt_count ?? 0}</td>
                    <td>
                      {(assessment.avg_score ?? 0) > 0
                        ? `${assessment.avg_score}%`
                        : "—"}
                    </td>
                    <td>
                      <StatusBadge status={assessment.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/assessments/${assessment.id}/edit`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                        >
                          Edit
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AssessmentCard({
  assessment,
}: {
  assessment: Awaited<ReturnType<typeof getAssessmentsForUser>>[number];
}) {
  const passed = Boolean(assessment.best_passed);
  const score = assessment.best_score ?? assessment.avg_score ?? 0;

  return (
    <Link
      href={`/dashboard/assessments/${assessment.id}`}
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <CourseCover
            cover={assessment.course_cover ?? "ocean"}
            category={assessment.course_title ?? "Course"}
            compact
            className="h-9 w-9 rounded-lg"
          />
          <div className="min-w-0">
            <p className="max-w-[180px] truncate text-[10px] font-bold text-ink-900">
              {assessment.course_title}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
              <Clock3 className="h-2.5 w-2.5" />
              {assessment.duration_minutes} min
              <span>·</span>
              {assessment.question_count} questions
            </p>
          </div>
        </div>
        <Badge tone={assessment.type === "exam" ? "violet" : "blue"}>
          {assessment.type}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-ink-950 group-hover:text-electric-600">
          {assessment.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-5 text-slate-500">
          {assessment.description}
        </p>

        <div className="mt-5">
          {passed ? (
            <div className="rounded-xl bg-emerald-50 px-3.5 py-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Passed
                </span>
                <span className="font-display text-lg font-semibold text-emerald-800">
                  {score}%
                </span>
              </div>
              <ProgressBar
                value={score}
                size="sm"
                className="mt-2 bg-emerald-100"
                barClassName="bg-emerald-500"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3.5 py-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-500">
                  {assessment.attempt_count
                    ? `${assessment.attempt_count} attempt${
                        assessment.attempt_count === 1 ? "" : "s"
                      }`
                    : "Not attempted"}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  {assessment.pass_score}% required to pass
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600">
                {assessment.attempt_count ? "Retry" : "Start"}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
