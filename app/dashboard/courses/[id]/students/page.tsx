import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";
import { requireCourseManager } from "@/lib/access";
import {
  getAvailableStudentsForCourse,
  getCourseEnrollments,
} from "@/lib/queries";
import { enrollStudentAction, unenrollStudentAction } from "@/lib/actions/courses";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { ConfirmForm } from "@/components/confirm-form";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Course students",
};

export default async function CourseStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { course } = await requireCourseManager(id);
  const enrollments = getCourseEnrollments(course.id);
  const available = getAvailableStudentsForCourse(course.id);
  const completed = enrollments.filter((enrollment) => enrollment.completed_at);
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, enrollment) =>
              sum +
              (enrollment.lesson_count > 0
                ? (enrollment.completed_lessons / enrollment.lesson_count) * 100
                : 0),
            0,
          ) / enrollments.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/courses/${course.id}/edit`}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to course studio
        </Link>
        <Link
          href={`/dashboard/assessments/new?courseId=${course.id}`}
          className={buttonStyles({ variant: "outline", size: "sm" })}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Add assessment
        </Link>
      </div>

      <PageHeader
        eyebrow="Course students"
        title={course.title}
        description="Enroll learners, monitor progress, and step in when someone needs support."
        action={
          <Badge tone="blue">
            <Users className="h-3 w-3" />
            {enrollments.length} enrolled
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Enrolled"
          value={enrollments.length}
          icon={Users}
          tone="blue"
          hint="Active roster"
        />
        <StatCard
          label="Average progress"
          value={`${averageProgress}%`}
          icon={ArrowRight}
          tone="lime"
          hint="Across the course"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon={CheckCircle2}
          tone="green"
          hint="Finished every lesson"
        />
        <StatCard
          label="Available to add"
          value={available.length}
          icon={UserPlus}
          tone="violet"
          hint="Active students"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Course roster
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                Progress is calculated from completed lessons.
              </p>
            </div>
            <Badge tone="neutral">{enrollments.length} learners</Badge>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                icon={Users}
                title="No students enrolled yet"
                description="Use the enrollment panel to add active students. They will see this course in their learning dashboard immediately."
                className="py-9"
              />
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Progress</th>
                      <th>Completed</th>
                      <th>Status</th>
                      <th>Enrolled</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => {
                      const progress =
                        enrollment.lesson_count > 0
                          ? Math.round(
                              (enrollment.completed_lessons /
                                enrollment.lesson_count) *
                                100,
                            )
                          : 0;
                      return (
                        <tr key={enrollment.id}>
                          <td>
                            <div className="flex min-w-[190px] items-center gap-2.5">
                              <Avatar
                                name={enrollment.user_name}
                                color={enrollment.user_color}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <Link
                                  href={`/dashboard/students/${enrollment.user_id}`}
                                  className="block max-w-[180px] truncate text-[11.5px] font-bold text-ink-900 hover:text-electric-600"
                                >
                                  {enrollment.user_name}
                                </Link>
                                <p className="flex items-center gap-1 truncate text-[9px] text-slate-400">
                                  <Mail className="h-2.5 w-2.5" />
                                  {enrollment.user_email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex w-[130px] items-center gap-2">
                              <ProgressBar
                                value={progress}
                                size="sm"
                                barClassName={
                                  progress === 100 ? "bg-emerald-500" : undefined
                                }
                              />
                              <span className="w-8 shrink-0 text-[10px] font-semibold text-slate-500">
                                {progress}%
                              </span>
                            </div>
                            <p className="mt-1 text-[8.5px] text-slate-400">
                              {enrollment.completed_lessons} of{" "}
                              {enrollment.lesson_count} lessons
                            </p>
                          </td>
                          <td>
                            {enrollment.completed_at ? (
                              <Badge tone="green">
                                <CheckCircle2 className="h-3 w-3" />
                                Complete
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                In progress
                              </span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={enrollment.user_status} />
                          </td>
                          <td className="text-[10px]">
                            {formatDate(enrollment.enrolled_at, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <ConfirmForm
                              action={unenrollStudentAction}
                              message={`Remove ${enrollment.user_name} from this course? Their lesson progress for the course will also be removed.`}
                              hiddenFields={{
                                courseId: course.id,
                                userId: enrollment.user_id,
                              }}
                              className="px-1.5 py-1"
                            >
                              Remove
                            </ConfirmForm>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-mist-100 bg-mist-50/60 px-5 py-3 text-[9.5px] text-slate-400 sm:px-6">
                Average progress across the roster:{" "}
                <span className="font-semibold text-slate-600">
                  {averageProgress}%
                </span>
                . Completed courses:{" "}
                <span className="font-semibold text-slate-600">
                  {completed.length}
                </span>
                .
              </div>
            </>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <div className="card overflow-hidden">
            <div className="border-b border-mist-100 bg-ink-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                  Enrollment
                </p>
                <UserPlus className="h-4 w-4 text-lime-300" />
              </div>
              <p className="mt-3 font-display text-[17px] font-semibold">
                Add a learner
              </p>
              <p className="mt-1 text-[10.5px] leading-5 text-slate-400">
                New students are enrolled immediately and can start the first
                lesson from their dashboard.
              </p>
            </div>

            <div className="p-5">
              {available.length === 0 ? (
                <p className="rounded-xl border border-dashed border-mist-200 px-3 py-4 text-center text-[10px] leading-4 text-slate-400">
                  Every active student is already enrolled, or there are no
                  active students available.
                </p>
              ) : (
                <form action={enrollStudentAction} className="space-y-3">
                  <input type="hidden" name="courseId" value={course.id} />
                  <div>
                    <label htmlFor="userId" className="label text-[11px]">
                      Student
                    </label>
                    <select
                      id="userId"
                      name="userId"
                      className="input h-10 cursor-pointer text-[11px]"
                      required
                    >
                      {available.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} · {student.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "accent",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    <UserPlus className="h-4 w-4" />
                    Enroll student
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold text-ink-950">Good to know</p>
            <ul className="mt-3 space-y-2">
              {[
                "Enrollment is restricted to active student accounts.",
                "Removing a student also removes their lesson progress for this course.",
                "Assessment attempts remain in the gradebook for audit purposes.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[10px] leading-4 text-slate-500"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/students"
              className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              Open student directory
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
