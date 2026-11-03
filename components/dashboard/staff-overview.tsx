import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Layers3,
  PlusCircle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import {
  getAssessmentPerformance,
  getCourseCompletionForStaff,
  getCoursePerformance,
  getEnrollmentTrend,
  getRecentEnrollments,
  getRoleCounts,
  getStaffStats,
} from "@/lib/queries";
import { formatDate, timeAgo } from "@/lib/utils";
import { StatCard } from "@/components/stat-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { CourseCover } from "@/components/course-cover";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import {
  EnrollmentTrendChart,
  HorizontalMetricBars,
} from "@/components/dashboard-charts";
import { EmptyState } from "@/components/empty-state";

export async function StaffOverview() {
  const user = await requireStaff();
  const [stats, performance, recent, assessments, trend, completions, roles] =
    await Promise.all([
      getStaffStats(user),
      getCoursePerformance(user, 6),
      getRecentEnrollments(user, 5),
      getAssessmentPerformance(user),
      getEnrollmentTrend(user),
      getCourseCompletionForStaff(user),
      user.role === "admin" ? getRoleCounts() : Promise.resolve([]),
    ]);

  const roleMap = Object.fromEntries(roles.map((role) => [role.role, role.count]));
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-electric-600">
            {formatDate(new Date(), {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 font-display text-[30px] font-semibold tracking-[-0.04em] text-ink-950 sm:text-[36px]">
            {user.role === "admin" ? "Platform at a glance" : "Your teaching desk"}
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {user.role === "admin"
              ? `A live view of how ${firstName}'s learning community is growing.`
              : `Welcome back, ${firstName}. Here is what is moving across your courses.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/assessments/new"
            className={buttonStyles({ variant: "outline", size: "md" })}
          >
            <FileCheck2 className="h-4 w-4" />
            New assessment
          </Link>
          <Link
            href="/dashboard/courses/new"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <PlusCircle className="h-4 w-4" />
            Create course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label={user.role === "admin" ? "Total students" : "Your students"}
          value={stats.totalStudents}
          icon={Users}
          tone="blue"
          hint="Active learners"
        />
        <StatCard
          label="Enrollments"
          value={stats.totalEnrollments}
          icon={BookOpen}
          tone="lime"
          hint={`${stats.completedEnrollments} completed`}
        />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          tone="green"
          hint="Across all enrollments"
        />
        <StatCard
          label="Avg assessment score"
          value={stats.averageScore > 0 ? `${stats.averageScore}%` : "—"}
          icon={Target}
          tone="violet"
          hint={`${stats.totalAssessments} assessments`}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Enrollment momentum
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                New learners joining over the last eight weeks.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-5">
            <EnrollmentTrendChart data={trend} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-5 text-white shadow-soft sm:p-6">
          <div className="absolute inset-0 bg-grid-dark bg-[size:28px_28px] opacity-25" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                Community health
              </p>
              <Sparkles className="h-4 w-4 text-lime-300" />
            </div>
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing
                value={stats.completionRate}
                size={82}
                stroke={7}
                labelClassName="text-white"
              />
              <div>
                <p className="text-[12px] font-semibold text-white">
                  Completion rate
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  {stats.completedEnrollments} of {stats.totalEnrollments}{" "}
                  enrollments finished
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="font-display text-lg font-semibold text-white">
                  {stats.totalCourses}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  {stats.publishedCourses} published
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="font-display text-lg font-semibold text-white">
                  {stats.totalAssessments}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  assessments
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/analytics"
              className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[10px] font-bold text-lime-300 hover:text-lime-200"
            >
              Open analytics
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div>
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
              Course performance
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Where learners are engaging — and where they finish.
            </p>
          </div>
          <Link
            href="/dashboard/courses"
            className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
          >
            Manage courses
          </Link>
        </div>

        {performance.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Learners</th>
                  <th>Completion</th>
                  <th>Avg score</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {performance.map((course) => {
                  const rate =
                    course.students > 0
                      ? Math.round((course.completions / course.students) * 100)
                      : 0;
                  return (
                    <tr key={course.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <CourseCover
                            cover={course.cover}
                            category={course.level}
                            compact
                            className="h-9 w-9 shrink-0 rounded-lg"
                          />
                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-[12px] font-bold text-ink-900">
                              {course.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {course.lessons} lessons · {course.level}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-ink-800">
                        {course.students}
                      </td>
                      <td>
                        <div className="flex w-[120px] items-center gap-2">
                          <ProgressBar value={rate} size="sm" />
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
                      <td>
                        <StatusBadge status={course.status} />
                      </td>
                      <td>
                        <Link
                          href={`/dashboard/courses/${course.id}/edit`}
                          className="focus-ring inline-flex items-center gap-1 rounded text-[10px] font-bold text-electric-600 hover:text-electric-700"
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
        ) : (
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <EmptyState
              icon={Layers3}
              title="Your course studio is empty"
              description="Create your first course, add a curriculum, and publish it for learners."
              action={
                <Link
                  href="/dashboard/courses/new"
                  className={buttonStyles({ variant: "primary" })}
                >
                  Create a course
                </Link>
              }
              className="py-10"
            />
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Assessment health
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Average scores across the most active assessments.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
              <BarChart3 className="h-4 w-4" />
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
              <p className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-[11px] text-slate-400">
                Assessment performance appears after the first submission.
              </p>
            )}
          </div>
          <Link
            href="/dashboard/assessments"
            className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold text-electric-600 hover:text-electric-700"
          >
            Review assessments
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Recent enrollments
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Who just joined your learning community.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-50 text-lime-700">
              <Users className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-4 space-y-1">
            {recent.length > 0 ? (
              recent.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-3 rounded-xl px-1 py-2.5"
                >
                  <Avatar
                    name={enrollment.user_name}
                    color={enrollment.user_color}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-ink-900">
                      {enrollment.user_name}
                    </p>
                    <p className="truncate text-[9.5px] text-slate-500">
                      enrolled in {enrollment.course_title}
                    </p>
                  </div>
                  <span className="shrink-0 text-[9px] text-slate-400">
                    {timeAgo(enrollment.enrolled_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-[11px] text-slate-400">
                New enrollments will appear here.
              </p>
            )}
          </div>
          <Link
            href="/dashboard/students"
            className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-electric-600 hover:text-electric-700"
          >
            View all students
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                  Community mix
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Everyone with access to the platform.
                </p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
                <GraduationCap className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Students",
                  value: roleMap.student ?? 0,
                  icon: Users,
                  className: "bg-lime-50 text-lime-800",
                },
                {
                  label: "Instructors",
                  value: roleMap.instructor ?? 0,
                  icon: BookOpen,
                  className: "bg-electric-50 text-electric-700",
                },
                {
                  label: "Admins",
                  value: roleMap.admin ?? 0,
                  icon: ClipboardList,
                  className: "bg-violet-50 text-violet-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl p-4 ${item.className}`}
                >
                  <item.icon className="h-4 w-4 opacity-70" />
                  <p className="mt-3 font-display text-2xl font-semibold">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold opacity-70">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
              Quick actions
            </h2>
            <div className="mt-4 space-y-1.5">
              {[
                {
                  href: "/dashboard/courses/new",
                  label: "Create a new course",
                  icon: PlusCircle,
                },
                {
                  href: "/dashboard/students",
                  label: "Add a student",
                  icon: Users,
                },
                {
                  href: "/dashboard/analytics",
                  label: "Explore analytics",
                  icon: BarChart3,
                },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-slate-600 transition hover:bg-mist-50 hover:text-ink-950"
                >
                  <action.icon className="h-4 w-4 text-slate-400" />
                  {action.label}
                  <ArrowRight className="ml-auto h-3 w-3 text-slate-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
