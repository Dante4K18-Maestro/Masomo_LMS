import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import {
  getAllUsersForStaff,
  getStaffCourses,
  getStaffStats,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { formatDate, timeAgo } from "@/lib/utils";
import { NewStudentForm } from "./new-student-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Students",
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [user, query] = await Promise.all([requireStaff(), searchParams]);
  const search = query.q?.trim() ?? "";
  const students = getAllUsersForStaff(user, search);
  const stats = getStaffStats(user);
  const courses = getStaffCourses(user);

  const active = students.filter((student) => student.status === "active").length;
  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + (student.avg_progress ?? 0), 0) /
            students.length,
        )
      : 0;
  const certificates = students.reduce(
    (sum, student) => sum + (student.certificate_count ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title={user.role === "admin" ? "Student directory" : "Your learners"}
        description={
          user.role === "admin"
            ? "A complete view of everyone learning on BrighterFuture. Search, review progress, and manage accounts."
            : "Everyone enrolled in your courses, with the signals that tell you who needs support."
        }
        action={
          <Badge tone="blue">
            <Users className="h-3 w-3" />
            {students.length} student{students.length === 1 ? "" : "s"}
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label={user.role === "admin" ? "All students" : "Your students"}
          value={students.length}
          icon={Users}
          tone="blue"
          hint={`${active} active`}
        />
        <StatCard
          label="Average progress"
          value={`${averageProgress}%`}
          icon={TrendingUp}
          tone="lime"
          hint="Across enrolled courses"
        />
        <StatCard
          label="Certificates"
          value={certificates}
          icon={Award}
          tone="amber"
          hint="Issued to these learners"
        />
        <StatCard
          label="Enrollments"
          value={stats.totalEnrollments}
          icon={BookOpen}
          tone="violet"
          hint={`${stats.completedEnrollments} completed`}
        />
      </div>

      <div className="card p-4 sm:p-5">
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search students</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search by name or email…"
              className="input h-10 pl-10"
            />
          </label>
          <button
            type="submit"
            className={buttonStyles({ variant: "electric", size: "sm", className: "h-10" })}
          >
            Search
          </button>
          {search && (
            <Link
              href="/dashboard/students"
              className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold text-slate-400 hover:text-ink-900"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Link>
          )}
        </form>
      </div>

      <div
        className={
          user.role === "admin"
            ? "grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start"
            : "space-y-5"
        }
      >
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                {search ? "Search results" : "All students"}
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                {search
                  ? `${students.length} match${students.length === 1 ? "" : "es"} for “${search}”`
                  : "A snapshot of learning activity and account health."}
              </p>
            </div>
            {user.role === "admin" && (
              <a
                href="#add-student"
                className={buttonStyles({
                  variant: "outline",
                  size: "sm",
                  className: "xl:hidden",
                })}
              >
                Add student
              </a>
            )}
          </div>

          {students.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Users}
                title={search ? "No students match that search" : "No students yet"}
                description={
                  search
                    ? "Try a different name or email, or clear the search to see the full directory."
                    : user.role === "admin"
                      ? "Add your first student using the form, or they can create their own account from the registration page."
                      : "Students appear here when they enroll in one of your courses."
                }
                action={
                  search ? (
                    <Link
                      href="/dashboard/students"
                      className={buttonStyles({ variant: "primary", size: "sm" })}
                    >
                      Clear search
                    </Link>
                  ) : undefined
                }
                className="py-10"
              />
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table min-w-[760px]">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Courses</th>
                    <th>Progress</th>
                    <th>Certificates</th>
                    <th>Last active</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="flex min-w-[200px] items-center gap-2.5">
                          <Avatar
                            name={student.name}
                            color={student.avatar_color}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/students/${student.id}`}
                              className="block max-w-[180px] truncate text-[11.5px] font-bold text-ink-900 hover:text-electric-600"
                            >
                              {student.name}
                            </Link>
                            <p className="truncate text-[9px] text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-ink-800">
                        {student.course_count ?? 0}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-ink-800">
                            {student.avg_progress ?? 0}%
                          </span>
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-mist-100">
                            <span
                              className="block h-full rounded-full bg-electric-500"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, student.avg_progress ?? 0),
                                )}%`,
                              }}
                            />
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Award className="h-3 w-3 text-amber-500" />
                          {student.certificate_count ?? 0}
                        </span>
                      </td>
                      <td className="text-[10px]">
                        {student.last_active ? (
                          <span title={formatDate(student.last_active)}>
                            {timeAgo(student.last_active)}
                          </span>
                        ) : (
                          "No activity"
                        )}
                      </td>
                      <td>
                        <StatusBadge status={student.status} />
                      </td>
                      <td>
                        <Link
                          href={`/dashboard/students/${student.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                        >
                          View
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {user.role === "admin" ? (
          <aside id="add-student" className="xl:sticky xl:top-[92px]">
            <NewStudentForm
              courseOptions={courses.map((course) => ({
                id: course.id,
                title: course.title,
                status: course.status,
              }))}
            />
          </aside>
        ) : (
          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold text-ink-950">
              Instructor access
            </p>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              You can see and support students enrolled in your courses. Account
              creation and status changes are handled by platform administrators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
