import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import {
  getAllUsersForStaff,
  getAssessmentPerformance,
  getCourseCompletionForStaff,
  getCoursePerformance,
  getEnrollmentTrend,
  getRoleCounts,
  getStaffStats,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { CourseCover } from "@/components/course-cover";
import { EmptyState } from "@/components/empty-state";
import {
  EnrollmentTrendChart,
  HorizontalMetricBars,
} from "@/components/dashboard-charts";
import { buttonStyles } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const user = await requireStaff();
  const [stats, performance, trend, completions, assessments, students, roles] =
    await Promise.all([
      getStaffStats(user),
      getCoursePerformance(user, 10),
      getEnrollmentTrend(user),
      getCourseCompletionForStaff(user),
      getAssessmentPerformance(user),
      Promise.resolve(getAllUsersForStaff(user)),
      user.role === "admin" ? getRoleCounts() : Promise.resolve([]),
    ]);

  const topStudents = [...students]
    .sort(
      (a, b) =>
        (b.avg_progress ?? 0) - (a.avg_progress ?? 0) ||
        (b.certificate_count ?? 0) - (a.certificate_count ?? 0),
    )
    .slice(0, 5);
  const activeStudents = students.filter((student) => student.status === "active");
  const totalCertificates = students.reduce(
    (sum, student) => sum + (student.certificate_count ?? 0),
    0,
  );
  const roleMap = Object.fromEntries(roles.map((role) => [role.role, role.count]));
  const totalAttempts = assessments.reduce(
    (sum, assessment) => sum + (assessment.attempts ?? 0),
    0,
  );
  const weightedAverage =
    performance.length > 0
      ? Math.round(
          performance.reduce(
            (sum, course) => sum + course.avg_score * course.students,
            0,
          ) / Math.max(1, performance.reduce((sum, course) => sum + course.students, 0)),
        )
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title={user.role === "admin" ? "The learning signal" : "Teaching outcomes"}
        description="Completion, assessment performance, and the learners who are moving fastest — all in one honest view."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/courses"
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Courses
            </Link>
            <Link
              href="/dashboard/students"
              className={buttonStyles({ variant: "primary", size: "sm" })}
            >
              <Users className="h-3.5 w-3.5" />
              Students
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={stats.totalStudents}
          icon={Users}
          tone="blue"
          hint={`${activeStudents.length} active in view`}
        />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          tone="green"
          hint={`${stats.completedEnrollments} of ${stats.totalEnrollments}`}
        />
        <StatCard
          label="Average score"
          value={weightedAverage > 0 ? `${weightedAverage}%` : "—"}
          icon={Target}
          tone="violet"
          hint={`${totalAttempts} submissions`}
        />
        <StatCard
          label="Certificates"
          value={totalCertificates}
          icon={Award}
          tone="amber"
          hint="Issued to your learners"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Enrollment momentum
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                New enrollments across the last eight weeks.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            <EnrollmentTrendChart data={trend} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-mist-100 pt-4 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-electric-500" />
              Weekly enrollments
            </span>
            <span>
              {trend.reduce((sum, item) => sum + item.count, 0)} new during this
              window
            </span>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-ink-950 p-5 text-white shadow-soft sm:p-6">
          <div className="absolute inset-0 bg-grid-dark bg-[size:28px_28px] opacity-25" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                Delivery health
              </p>
              <Gauge className="h-4 w-4 text-lime-300" />
            </div>
            <p className="mt-4 font-display text-[36px] font-semibold leading-none tracking-[-0.04em]">
              {stats.completionRate}%
            </p>
            <p className="mt-1 text-[10.5px] text-slate-400">
              of enrollments reach the finish line
            </p>
            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[9px]">
                  <span className="text-slate-400">Course completion</span>
                  <span className="font-semibold text-white">
                    {stats.completedEnrollments}/{stats.totalEnrollments}
                  </span>
                </div>
                <ProgressBar
                  value={stats.completionRate}
                  size="sm"
                  className="bg-white/10"
                  barClassName="bg-lime-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="font-display text-lg font-semibold">
                    {stats.publishedCourses}
                  </p>
                  <p className="text-[9px] text-slate-400">Published courses</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="font-display text-lg font-semibold">
                    {stats.totalAssessments}
                  </p>
                  <p className="text-[9px] text-slate-400">Assessments</p>
                </div>
              </div>
            </div>
            <p className="mt-auto pt-5 text-[9px] leading-4 text-slate-500">
              Completion is calculated per course enrollment. Learners are marked
              complete after finishing every lesson.
            </p>
          </div>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-mist-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
              Course performance
            </h2>
            <p className="mt-0.5 text-[10.5px] text-slate-400">
              Engagement, completion, and assessment scores by course.
            </p>
          </div>
          <Badge tone="neutral">{performance.length} courses</Badge>
        </div>

        {performance.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon={BarChart3}
              title="Performance appears after enrollment"
              description="Publish a course and invite students to begin. This table will show completion and scores as the data arrives."
              className="py-9"
            />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table min-w-[820px]">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Learners</th>
                  <th>Completion</th>
                  <th>Avg score</th>
                  <th>Lessons</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {performance.map((course) => {
                  const rate =
                    course.students > 0
                      ? Math.round(
                          (course.completions / course.students) * 100,
                        )
                      : 0;
                  return (
                    <tr key={course.id}>
                      <td>
                        <div className="flex min-w-[240px] items-center gap-3">
                          <CourseCover
                            cover={course.cover}
                            category={course.level}
                            compact
                            className="h-9 w-9 shrink-0 rounded-lg"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[230px] truncate text-[11.5px] font-bold text-ink-900">
                              {course.title}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {course.level}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-ink-800">
                        {course.students}
                      </td>
                      <td>
                        <div className="flex w-[130px] items-center gap-2">
                          <ProgressBar
                            value={rate}
                            size="sm"
                            barClassName={
                              rate >= 70 ? "bg-emerald-500" : undefined
                            }
                          />
                          <span className="w-8 text-[10px] font-semibold text-slate-500">
                            {rate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-[11px] font-semibold text-ink-800">
                          {course.avg_score > 0 ? `${course.avg_score}%` : "—"}
                        </span>
                      </td>
                      <td className="text-[10px]">{course.lessons}</td>
                      <td>
                        <StatusBadge status={course.status} />
                      </td>
                      <td>
                        <Link
                          href={`/dashboard/courses/${course.id}/edit`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                        >
                          Open
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
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Completion by course
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                The published courses closest to full completion.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            {completions.length > 0 ? (
              <div className="space-y-5">
                {completions.map((course) => {
                  const rate =
                    course.enrolled > 0
                      ? Math.round((course.completed / course.enrolled) * 100)
                      : 0;
                  return (
                    <div key={course.id}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <p className="truncate text-[11px] font-semibold text-ink-800">
                          {course.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-bold text-slate-500">
                          {course.completed}/{course.enrolled} · {rate}%
                        </span>
                      </div>
                      <ProgressBar
                        value={rate}
                        size="sm"
                        barClassName={
                          rate >= 70
                            ? "bg-emerald-500"
                            : rate >= 40
                              ? "bg-electric-500"
                              : "bg-amber-400"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-[10.5px] text-slate-400">
                Published courses with enrollments will appear here.
              </p>
            )}
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Assessment performance
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                Average scores across the busiest checkpoints.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            {assessments.length > 0 ? (
              <HorizontalMetricBars
                data={assessments.map((assessment) => ({
                  label: assessment.title,
                  value: assessment.avg_score ?? 0,
                  caption:
                    assessment.attempts > 0
                      ? `${assessment.avg_score ?? 0}% · ${assessment.attempts} attempts`
                      : "No attempts",
                }))}
                color="violet"
              />
            ) : (
              <p className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-[10.5px] text-slate-400">
                Assessment data appears after the first submission.
              </p>
            )}
          </div>
          <Link
            href="/dashboard/assessments"
            className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold text-electric-600 hover:text-electric-700"
          >
            Manage assessments
            <ArrowRight className="h-3 w-3" />
          </Link>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Learners to watch
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                The strongest progress signals across your active roster.
              </p>
            </div>
            <Link
              href="/dashboard/students"
              className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              All students
            </Link>
          </div>
          {topStudents.length === 0 ? (
            <div className="p-5 text-center text-[10.5px] text-slate-400 sm:p-6">
              Student activity will appear here.
            </div>
          ) : (
            <div className="divide-y divide-mist-100">
              {topStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
                >
                  <span className="font-mono text-[9px] font-bold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Avatar
                    name={student.name}
                    color={student.avatar_color}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="block truncate text-[11px] font-bold text-ink-900 hover:text-electric-600"
                    >
                      {student.name}
                    </Link>
                    <p className="truncate text-[9px] text-slate-400">
                      {student.course_count} course
                      {student.course_count === 1 ? "" : "s"} ·{" "}
                      {student.certificate_count} certificate
                      {student.certificate_count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="hidden w-28 sm:block">
                    <ProgressBar
                      value={student.avg_progress ?? 0}
                      size="sm"
                    />
                  </div>
                  <span className="w-9 text-right text-[10px] font-bold text-ink-800">
                    {student.avg_progress ?? 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
              {user.role === "admin" ? "Community mix" : "Teaching summary"}
            </h2>
            <GraduationCap className="h-4 w-4 text-slate-400" />
          </div>
          {user.role === "admin" ? (
            <>
              <div className="mt-4 space-y-2">
                {[
                  {
                    label: "Students",
                    value: roleMap.student ?? 0,
                    className: "bg-lime-50 text-lime-900",
                  },
                  {
                    label: "Instructors",
                    value: roleMap.instructor ?? 0,
                    className: "bg-electric-50 text-electric-800",
                  },
                  {
                    label: "Administrators",
                    value: roleMap.admin ?? 0,
                    className: "bg-violet-50 text-violet-800",
                  },
                ].map((role) => (
                  <div
                    key={role.label}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-3 ${role.className}`}
                  >
                    <span className="text-[10.5px] font-semibold">
                      {role.label}
                    </span>
                    <span className="font-display text-lg font-semibold">
                      {role.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[9.5px] leading-4 text-slate-400">
                Every role has access to the same learning catalog, with
                workspace tools tailored to their responsibilities.
              </p>
            </>
          ) : (
            <div className="mt-4 space-y-3">
              {[
                ["Active students", stats.totalStudents],
                ["Published courses", stats.publishedCourses],
                ["Draft courses", stats.draftCourses],
                ["Assessments", stats.totalAssessments],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between rounded-xl bg-mist-50 px-3.5 py-2.5"
                >
                  <span className="text-[10.5px] text-slate-500">{label}</span>
                  <span className="text-[11px] font-bold text-ink-900">
                    {value}
                  </span>
                </div>
              ))}
              <Link
                href="/dashboard/courses/new"
                className={buttonStyles({
                  variant: "primary",
                  size: "sm",
                  className: "mt-1 w-full",
                })}
              >
                Create a course
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
