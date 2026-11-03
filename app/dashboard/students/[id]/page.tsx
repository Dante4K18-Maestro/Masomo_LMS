import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Mail,
  Save,
  ShieldOff,
  Target,
  UserCheck,
  UserRound,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import {
  getCertificatesForUser,
  getMyEnrollments,
  getStaffCourses,
  getStudentAttempts,
  getStudentById,
  getStudentStats,
  instructorTeachesStudent,
} from "@/lib/queries";
import {
  updateStudentDetailsAction,
  updateStudentStatusAction,
} from "@/lib/actions/students";
import { StatCard } from "@/components/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { CourseCover } from "@/components/course-cover";
import { EmptyState } from "@/components/empty-state";
import { formatDate, timeAgo } from "@/lib/utils";
import { enrollStudentAction as enrollToCourseAction } from "@/lib/actions/courses";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student profile",
};

export default async function StudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([
    params,
    searchParams,
    requireStaff(),
  ]);
  const student = getStudentById(id);

  if (!student) notFound();
  if (
    user.role === "instructor" &&
    !instructorTeachesStudent(user.id, student.id)
  ) {
    notFound();
  }

  const stats = getStudentStats(student.id);
  const enrollments = getMyEnrollments(student.id);
  const attempts = getStudentAttempts(student.id);
  const certificates = getCertificatesForUser(student.id);
  const staffCourses =
    user.role === "admin"
      ? getStaffCourses(user).filter((course) => course.status !== "archived")
      : [];
  const enrolledIds = new Set(enrollments.map((enrollment) => enrollment.course_id));
  const availableCourses = staffCourses.filter(
    (course) => !enrolledIds.has(course.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/students"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Student directory
        </Link>
        {user.role === "admin" && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-[9.5px] font-semibold text-slate-400">
            <ShieldOff className="h-3 w-3" />
            Administrator view
          </span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white shadow-lift sm:p-8">
        <div className="absolute inset-0 bg-grid-dark bg-[size:40px_40px] opacity-25" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar
              name={student.name}
              color={student.avatar_color}
              size="xl"
              className="ring-4 ring-white/10"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="dark">Student</Badge>
                <StatusBadge status={student.status} />
              </div>
              <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-[-0.035em] sm:text-[34px]">
                {student.name}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                <Mail className="h-3 w-3" />
                {student.email}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {student.headline ?? "BrighterFuture learner"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                Joined
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-white">
                {formatDate(student.created_at)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                Certificates
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-lime-300">
                {certificates.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {query.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Student details saved.
        </div>
      )}
      {query.error === "name" && (
        <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          <AlertCircle className="h-4 w-4" />
          Enter a name with at least two characters.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          tone="blue"
          hint={`${stats.completedCourses} completed`}
        />
        <StatCard
          label="Lessons complete"
          value={stats.lessonsCompleted}
          icon={CheckCircle2}
          tone="lime"
          hint="Lifetime progress"
        />
        <StatCard
          label="Average score"
          value={stats.assessmentAttempts > 0 ? `${stats.averageScore}%` : "—"}
          icon={Target}
          tone="violet"
          hint={`${stats.assessmentAttempts} attempts`}
        />
        <StatCard
          label="Certificates"
          value={stats.certificates}
          icon={Award}
          tone="amber"
          hint={`${stats.passedAssessments} assessments passed`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <div className="min-w-0 space-y-5">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                  Course progress
                </h2>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  Every enrollment, with the current completion state.
                </p>
              </div>
              <Badge tone="neutral">{enrollments.length} courses</Badge>
            </div>

            {enrollments.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  icon={BookOpen}
                  title="Not enrolled in a course yet"
                  description="Use the enrollment panel to add this student to a course, or invite them to browse the catalog."
                  className="py-9"
                />
              </div>
            ) : (
              <div className="divide-y divide-mist-100">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <CourseCover
                      cover={enrollment.course.cover}
                      category={enrollment.course.category}
                      compact
                      className="h-11 w-11 shrink-0 rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="block max-w-[300px] truncate text-[12px] font-bold text-ink-900 hover:text-electric-600"
                      >
                        {enrollment.course.title}
                      </Link>
                      <p className="mt-0.5 text-[9px] text-slate-400">
                        {enrollment.completed_lessons} of{" "}
                        {enrollment.lesson_count} lessons · enrolled{" "}
                        {formatDate(enrollment.enrolled_at, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="w-[130px]">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
                        <span>{enrollment.progress}%</span>
                        {enrollment.completed_at ? (
                          <span className="text-emerald-600">Complete</span>
                        ) : (
                          <span>In progress</span>
                        )}
                      </div>
                      <ProgressBar
                        value={enrollment.progress}
                        size="sm"
                        className="mt-1.5"
                        barClassName={
                          enrollment.progress === 100
                            ? "bg-emerald-500"
                            : undefined
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                  Assessment history
                </h2>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  Submitted attempts and their graded results.
                </p>
              </div>
              <ClipboardList className="h-4 w-4 text-slate-400" />
            </div>

            {attempts.length === 0 ? (
              <div className="p-5 text-center sm:p-6">
                <p className="rounded-xl border border-dashed border-mist-200 px-5 py-7 text-[10.5px] text-slate-400">
                  No assessment attempts yet. Once this student submits a
                  checkpoint, the result will appear here.
                </p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table min-w-[620px]">
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
                    {attempts.map((attempt) => {
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
                          <td className="text-[10.5px]">
                            {attempt.course_title}
                          </td>
                          <td>
                            <span className="font-display text-[14px] font-semibold text-ink-900">
                              {score}%
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
                            })}{" "}
                            · {timeAgo(attempt.submitted_at)}
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
            )}
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                  Certificates
                </h2>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  Verified proof of course completion.
                </p>
              </div>
              <GraduationCap className="h-4 w-4 text-slate-400" />
            </div>

            {certificates.length === 0 ? (
              <div className="p-5 sm:p-6">
                <p className="rounded-xl border border-dashed border-mist-200 px-5 py-7 text-center text-[10.5px] text-slate-400">
                  No certificates issued yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                {certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="rounded-xl border border-mist-200 bg-mist-50/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-100 text-lime-800">
                        <Award className="h-4 w-4" />
                      </span>
                      <Badge tone="green">Verified</Badge>
                    </div>
                    <p className="mt-2 text-[11.5px] font-bold text-ink-900">
                      {certificate.course_title}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] text-slate-400">
                      {certificate.code}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[9px] text-slate-400">
                      <CalendarDays className="h-2.5 w-2.5" />
                      Issued {formatDate(certificate.issued_at)}
                    </p>
                    <Link
                      href={`/verify/${certificate.code}`}
                      className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-electric-600 hover:text-electric-700"
                    >
                      View public record
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          {user.role === "admin" ? (
            <>
              <section className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-display text-[14px] font-semibold text-ink-950">
                      Profile details
                    </h2>
                    <p className="text-[9px] text-slate-400">
                      Only administrators can edit these.
                    </p>
                  </div>
                </div>
                <form action={updateStudentDetailsAction} className="space-y-3 p-5">
                  <input type="hidden" name="userId" value={student.id} />
                  <div>
                    <label htmlFor="student-profile-name" className="label text-[11px]">
                      Name
                    </label>
                    <input
                      id="student-profile-name"
                      name="name"
                      defaultValue={student.name}
                      className="input h-10 text-[12px]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="student-headline" className="label text-[11px]">
                      Headline
                    </label>
                    <input
                      id="student-headline"
                      name="headline"
                      defaultValue={student.headline ?? ""}
                      className="input h-10 text-[12px]"
                      placeholder="e.g. Aspiring cloud engineer"
                    />
                  </div>
                  <div>
                    <label className="label text-[11px]">Email</label>
                    <p className="rounded-lg border border-mist-200 bg-mist-50 px-3 py-2.5 text-[11px] text-slate-500">
                      {student.email}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "primary",
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save profile
                  </button>
                </form>
              </section>

              <section className="card p-5">
                <h2 className="font-display text-[14px] font-semibold text-ink-950">
                  Account status
                </h2>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  Suspending an account immediately blocks sign-in. Their
                  progress and results are preserved.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge status={student.status} />
                  <span className="text-[9px] text-slate-400">
                    {student.status === "active"
                      ? "Can sign in"
                      : "Access blocked"}
                  </span>
                </div>
                <form action={updateStudentStatusAction} className="mt-3">
                  <input type="hidden" name="userId" value={student.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={student.status === "active" ? "suspended" : "active"}
                  />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant:
                        student.status === "active" ? "danger" : "outline",
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    {student.status === "active" ? (
                      <>
                        <ShieldOff className="h-3.5 w-3.5" />
                        Suspend account
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        Reactivate account
                      </>
                    )}
                  </button>
                </form>
              </section>

              <section className="card p-5">
                <h2 className="font-display text-[14px] font-semibold text-ink-950">
                  Enroll in a course
                </h2>
                {availableCourses.length === 0 ? (
                  <p className="mt-2 text-[10px] leading-4 text-slate-400">
                    This student is already enrolled in every available course.
                  </p>
                ) : (
                  <form action={enrollToCourseAction} className="mt-3 space-y-2.5">
                    <input type="hidden" name="userId" value={student.id} />
                    <select
                      name="courseId"
                      className="input h-10 cursor-pointer text-[11px]"
                      aria-label="Course to enroll in"
                      required
                    >
                      {availableCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                          {course.status !== "published" ? " (draft)" : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className={buttonStyles({
                        variant: "accent",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      Enroll student
                    </button>
                  </form>
                )}
              </section>
            </>
          ) : (
            <section className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
              <p className="text-[11px] font-bold text-ink-950">
                Instructor access
              </p>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">
                You can review progress for students enrolled in your courses.
                Profile edits, account status, and enrollment changes are handled
                by administrators.
              </p>
            </section>
          )}

          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold text-ink-950">Activity pulse</p>
            <div className="mt-3 space-y-2 text-[10px]">
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Lessons complete</span>
                <span className="font-semibold text-ink-800">
                  {stats.lessonsCompleted}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Assessments passed</span>
                <span className="font-semibold text-ink-800">
                  {stats.passedAssessments}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Courses completed</span>
                <span className="font-semibold text-ink-800">
                  {stats.completedCourses}
                </span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
