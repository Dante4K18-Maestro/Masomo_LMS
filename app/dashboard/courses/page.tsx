import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Layers3,
  PlusCircle,
  Search,
  Users,
  X,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { getStaffCourses, getStaffStats } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CourseCover } from "@/components/course-cover";
import { EmptyState } from "@/components/empty-state";
import { cn, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Courses",
};

export default async function StaffCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const [user, query] = await Promise.all([requireStaff(), searchParams]);
  const courses = getStaffCourses(user);
  const stats = getStaffStats(user);
  const search = query.q?.trim().toLowerCase() ?? "";
  const status = query.status ?? "all";

  const filtered = courses.filter((course) => {
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search) ||
      course.category.toLowerCase().includes(search) ||
      (course.instructor_name ?? "").toLowerCase().includes(search);
    const matchesStatus = status === "all" || course.status === status;
    return matchesSearch && matchesStatus;
  });

  const published = courses.filter((course) => course.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Course studio"
        title={user.role === "admin" ? "Every course, in one studio" : "Your teaching library"}
        description="Shape the curriculum, keep the learning experience sharp, and see how your courses are landing."
        action={
          <Link
            href="/dashboard/courses/new"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <PlusCircle className="h-4 w-4" />
            New course
          </Link>
        }
      />

      {query.deleted && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Course deleted.
        </div>
      )}
      {query.error === "forbidden" && (
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          You do not have permission to manage that course.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Total courses"
          value={courses.length}
          icon={BookOpen}
          tone="blue"
          hint={`${published} published`}
        />
        <StatCard
          label="Drafts"
          value={courses.filter((course) => course.status === "draft").length}
          icon={Layers3}
          tone="amber"
          hint="Work in progress"
        />
        <StatCard
          label="Students"
          value={stats.totalStudents}
          icon={Users}
          tone="lime"
          hint={`${stats.totalEnrollments} enrollments`}
        />
        <StatCard
          label="Completion rate"
          value={`${stats.completionRate}%`}
          icon={CheckCircle2}
          tone="green"
          hint={`${stats.completedEnrollments} completed`}
        />
      </div>

      <div className="card p-4 sm:p-5">
        <form
          method="get"
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search courses</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query.q}
              placeholder="Search by title, category, or instructor…"
              className="input h-10 pl-10"
            />
          </label>
          <div className="flex items-center gap-2">
            {[
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Drafts" },
              { value: "archived", label: "Archived" },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  "focus-within:ring-2 focus-within:ring-electric-300 cursor-pointer rounded-lg border px-3 py-2 text-[10.5px] font-semibold transition",
                  status === option.value
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-mist-200 bg-white text-slate-500 hover:border-mist-300 hover:text-ink-900",
                )}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  defaultChecked={status === option.value}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
            <button
              type="submit"
              className={buttonStyles({
                variant: "electric",
                size: "sm",
                className: "h-9",
              })}
            >
              Filter
            </button>
            {(search || status !== "all") && (
              <Link
                href="/dashboard/courses"
                className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-mist-200 bg-white text-slate-400 hover:text-ink-900"
                aria-label="Clear filters"
              >
                <X className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </form>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={courses.length === 0 ? "Your studio is empty" : "No courses match"}
          description={
            courses.length === 0
              ? "Create your first IT course. Add modules and lessons, then publish when the learning path is ready."
              : "Try a different search term or status filter to find the course you need."
          }
          action={
            <Link
              href={courses.length === 0 ? "/dashboard/courses/new" : "/dashboard/courses"}
              className={buttonStyles({ variant: "primary" })}
            >
              {courses.length === 0 ? "Create a course" : "Clear filters"}
            </Link>
          }
          className="bg-white"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Course library
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                {filtered.length} course{filtered.length === 1 ? "" : "s"} visible
              </p>
            </div>
            <Badge tone="neutral">{courses.length} total</Badge>
          </div>

          <div className="table-wrap">
            <table className="data-table min-w-[880px]">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Learners</th>
                  <th>Curriculum</th>
                  <th>Assessments</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="flex min-w-[250px] items-center gap-3">
                        <CourseCover
                          cover={course.cover}
                          category={course.category}
                          compact
                          className="h-11 w-11 shrink-0 rounded-xl"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/courses/${course.id}/edit`}
                            className="block max-w-[260px] truncate text-[12px] font-bold text-ink-900 hover:text-electric-600"
                          >
                            {course.title}
                          </Link>
                          <p className="mt-0.5 truncate text-[9.5px] text-slate-400">
                            {course.category} · {course.level}
                          </p>
                          {user.role === "admin" && (
                            <p className="mt-0.5 truncate text-[9px] text-slate-400">
                              {course.instructor_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-800">
                        <Users className="h-3 w-3 text-slate-400" />
                        {course.student_count ?? 0}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Layers3 className="h-3 w-3 text-slate-400" />
                        {course.module_count ?? 0} modules ·{" "}
                        {course.lesson_count ?? 0} lessons
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <FileCheck2 className="h-3 w-3 text-slate-400" />
                        {course.assessment_count ?? 0} published
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="text-[10px]">
                      {formatDate(course.updated_at, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/courses/${course.id}/edit`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                        >
                          Studio
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                        <Link
                          href={`/dashboard/courses/${course.id}/students`}
                          className="text-[10px] font-semibold text-slate-400 hover:text-ink-900"
                        >
                          Students
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
