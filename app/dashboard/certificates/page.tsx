import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getAssessmentsForCourse,
  getBestAttempt,
  getCertificatesForStaff,
  getCertificatesForUser,
  getMyEnrollments,
  getStudentStats,
} from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CourseCover } from "@/components/course-cover";
import { EmptyState } from "@/components/empty-state";
import { ProgressBar } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certificates",
};

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [user, query] = await Promise.all([requireUser(), searchParams]);

  if (user.role === "student") {
    const [certificates, stats, enrollments] = await Promise.all([
      getCertificatesForUser(user.id),
      getStudentStats(user.id),
      getMyEnrollments(user.id),
    ]);

    const certificateByCourse = new Map(
      certificates.map((certificate) => [certificate.course_id, certificate]),
    );
    const enrollmentRequirements = enrollments.map((enrollment) => {
      const assessments = getAssessmentsForCourse(
        enrollment.course_id,
      ).filter((assessment) => assessment.status === "published");
      const passed = assessments.filter(
        (assessment) => getBestAttempt(user.id, assessment.id)?.passed,
      ).length;
      return {
        enrollment,
        assessments: assessments.length,
        passed,
        hasCertificate: certificateByCourse.has(enrollment.course_id),
      };
    });
    const nextUp =
      enrollmentRequirements.find(
        (item) =>
          !item.hasCertificate &&
          item.enrollment.progress === 100 &&
          item.passed < item.assessments,
      ) ??
      enrollmentRequirements.find(
        (item) => !item.hasCertificate,
      ) ??
      null;
    const nextCertificate = nextUp
      ? certificateByCourse.get(nextUp.enrollment.course_id)
      : undefined;

    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Certificates"
          title="Proof of the work"
          description="Every certificate carries a unique code anyone can verify. Finish the lessons, pass the checkpoints, and make your progress visible."
          action={
            <Link
              href="/courses"
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              <BookOpen className="h-4 w-4" />
              Browse courses
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Certificates"
            value={certificates.length}
            icon={GraduationCap}
            tone="amber"
            hint="Earned so far"
          />
          <StatCard
            label="Courses complete"
            value={stats.completedCourses}
            icon={CheckCircle2}
            tone="green"
            hint={`${stats.totalCourses} enrolled`}
          />
          <StatCard
            label="Assessments passed"
            value={stats.passedAssessments}
            icon={Target}
            tone="violet"
            hint={`${stats.assessmentAttempts} attempts`}
          />
          <StatCard
            label="Lessons complete"
            value={stats.lessonsCompleted}
            icon={BookOpen}
            tone="blue"
            hint="Across all courses"
          />
        </div>

        {nextUp && nextCertificate ? null : nextUp ? (
          <section className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white shadow-lift sm:p-7">
            <div className="absolute inset-0 bg-grid-dark bg-[size:38px_38px] opacity-25" />
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-300 text-ink-950">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                    Your next certificate
                  </p>
                  <h2 className="mt-1.5 font-display text-[22px] font-semibold tracking-tight">
                    {nextUp.enrollment.course.title}
                  </h2>
                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    {nextUp.enrollment.progress < 100
                      ? `${nextUp.enrollment.lesson_count - nextUp.enrollment.completed_lessons} lesson${
                          nextUp.enrollment.lesson_count -
                            nextUp.enrollment.completed_lessons ===
                          1
                            ? ""
                            : "s"
                        } left · ${nextUp.passed}/${nextUp.assessments} assessments passed`
                      : `${nextUp.passed}/${nextUp.assessments} assessments passed — the certificate unlocks when every checkpoint is cleared.`}
                  </p>
                </div>
              </div>
              <Link
                href={
                  nextUp.enrollment.progress < 100
                    ? `/dashboard/learning/${nextUp.enrollment.course.slug}`
                    : `/dashboard/assessments`
                }
                className={buttonStyles({
                  variant: "accent",
                  size: "md",
                  className: "shrink-0",
                })}
              >
                {nextUp.enrollment.progress < 100
                  ? "Continue course"
                  : "Take assessments"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : null}

        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates yet — but you are on the path"
            description="A certificate is issued automatically when you complete every lesson and pass all published assessments in a course."
            action={
              <Link
                href="/dashboard/learning"
                className={buttonStyles({ variant: "electric" })}
              >
                Go to my learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
            className="bg-white"
          />
        ) : (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                  Earned certificates
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Share the verification link anywhere your work needs proof.
                </p>
              </div>
              <Badge tone="green" dot>
                Verified
              </Badge>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {certificates.map((certificate) => (
                <article
                  key={certificate.id}
                  className="group relative overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft transition hover:shadow-lift"
                >
                  <div className="relative overflow-hidden bg-ink-950 p-6 text-white">
                    <div className="absolute inset-0 bg-grid-dark bg-[size:26px_26px] opacity-30" />
                    <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-electric-500/20 blur-3xl" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[8.5px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                          <BadgeCheck className="h-3 w-3" />
                          Certificate of completion
                        </span>
                        <Award className="h-6 w-6 text-lime-300" />
                      </div>
                      <p className="mt-5 font-mono text-[8.5px] uppercase tracking-[0.18em] text-slate-500">
                        This certifies that
                      </p>
                      <p className="mt-1 font-display text-[24px] font-semibold tracking-tight text-white">
                        {user.name}
                      </p>
                      <p className="mt-3 font-mono text-[8.5px] uppercase tracking-[0.18em] text-slate-500">
                        has completed
                      </p>
                      <p className="mt-1 max-w-sm font-display text-[17px] font-semibold leading-snug text-white">
                        {certificate.course_title}
                      </p>
                      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-slate-500">
                            Certificate code
                          </p>
                          <p className="mt-1 font-mono text-[11px] font-bold text-lime-300">
                            {certificate.code}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] uppercase tracking-wider text-slate-500">
                            Issued
                          </p>
                          <p className="mt-1 text-[10px] font-semibold text-white">
                            {formatDate(certificate.issued_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <CourseCover
                        cover={certificate.course_cover ?? "ocean"}
                        category={certificate.course_level ?? "Course"}
                        compact
                        className="h-8 w-8 rounded-lg"
                      />
                      <span>
                        {certificate.course_level} ·{" "}
                        {certificate.duration_hours} hours
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/verify/${certificate.code}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                      >
                        Verify
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/courses/${certificate.course_slug ?? ""}`}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-ink-900"
                      >
                        Course
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime-50 text-lime-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink-950">
                How certificates are issued
              </p>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500">
                Complete all lessons and pass every published assessment in a
                course. BrighterFuture issues the certificate automatically, with
                a unique public verification code. Retakes are unlimited, so a
                missed checkpoint never closes the door.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const search = query.q?.trim() ?? "";
  const certificates = getCertificatesForStaff(user, search);
  const coursesRepresented = new Set(
    certificates.map((certificate) => certificate.course_id),
  ).size;
  const learners = new Set(
    certificates.map((certificate) => certificate.user_id),
  ).size;
  const latest = certificates[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Certificates"
        title="Verified outcomes"
        description="Every certificate issued to learners in your courses, with a public verification record."
        action={
          <Link
            href="/verify"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify a code
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Certificates"
          value={certificates.length}
          icon={Award}
          tone="amber"
          hint="In your courses"
        />
        <StatCard
          label="Learners"
          value={learners}
          icon={GraduationCap}
          tone="blue"
          hint="Celebrated"
        />
        <StatCard
          label="Courses"
          value={coursesRepresented}
          icon={BookOpen}
          tone="lime"
          hint="Producing certificates"
        />
        <StatCard
          label="Latest issue"
          value={latest ? formatDate(latest.issued_at, { month: "short", day: "numeric" }) : "—"}
          icon={BadgeCheck}
          tone="violet"
          hint={latest?.course_title ?? "No certificates yet"}
        />
      </div>

      <div className="card p-4 sm:p-5">
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search certificates</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search by learner, course, or certificate code…"
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
              href="/dashboard/certificates"
              className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold text-slate-400 hover:text-ink-900"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Link>
          )}
        </form>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title={search ? "No certificates match" : "No certificates issued yet"}
          description={
            search
              ? "Try another name, course, or code."
              : "Certificates appear automatically when a learner finishes every lesson and passes every published assessment in one of your courses."
          }
          action={
            search ? (
              <Link
                href="/dashboard/certificates"
                className={buttonStyles({ variant: "primary" })}
              >
                Clear search
              </Link>
            ) : undefined
          }
          className="bg-white"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Issued certificates
              </h2>
              <p className="mt-0.5 text-[10.5px] text-slate-400">
                Every record is public and independently verifiable.
              </p>
            </div>
            <Badge tone="green" dot>
              {certificates.length} verified
            </Badge>
          </div>
          <div className="table-wrap">
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Course</th>
                  <th>Certificate code</th>
                  <th>Issued</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id}>
                    <td>
                      <div className="flex min-w-[190px] items-center gap-2.5">
                        <Avatar
                          name={certificate.user_name ?? "Learner"}
                          color={certificate.user_color}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/students/${certificate.user_id}`}
                            className="block max-w-[170px] truncate text-[11.5px] font-bold text-ink-900 hover:text-electric-600"
                          >
                            {certificate.user_name}
                          </Link>
                          <p className="truncate text-[9px] text-slate-400">
                            {certificate.user_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <CourseCover
                          cover={certificate.course_cover ?? "ocean"}
                          category={certificate.course_level ?? "Course"}
                          compact
                          className="h-8 w-8 shrink-0 rounded-lg"
                        />
                        <span className="max-w-[220px] truncate text-[10.5px] font-semibold text-slate-600">
                          {certificate.course_title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="rounded-md bg-mist-100 px-2 py-1 font-mono text-[9.5px] font-semibold text-slate-600">
                        {certificate.code}
                      </span>
                    </td>
                    <td className="text-[10px]">
                      {formatDate(certificate.issued_at)}
                    </td>
                    <td>
                      <Link
                        href={`/verify/${certificate.code}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                      >
                        Verify
                        <ExternalLink className="h-3 w-3" />
                      </Link>
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
