import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  FileCheck2,
  Flame,
  GraduationCap,
  History,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getCertificatesForUser,
  getCompletedLessonIds,
  getCourseCurriculum,
  getMyEnrollments,
  getPublishedCourses,
  getRecentStudentActivity,
  getStudentStats,
  getUpcomingAssessments,
  getWeeklyActivity,
} from "@/lib/queries";
import { getGreeting, formatDate, timeAgo } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { CourseCover } from "@/components/course-cover";
import { StatCard } from "@/components/stat-card";
import { WeeklyActivityChart } from "@/components/dashboard-charts";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";

export async function StudentOverview({ welcome }: { welcome?: boolean }) {
  const user = await requireUser();
  const [enrollments, stats, upcoming, weekly, activity, certificates] =
    await Promise.all([
      getMyEnrollments(user.id),
      getStudentStats(user.id),
      getUpcomingAssessments(user.id, 4),
      getWeeklyActivity(user.id),
      getRecentStudentActivity(user.id, 5),
      getCertificatesForUser(user.id),
    ]);

  const active =
    enrollments.find((enrollment) => enrollment.progress < 100) ??
    enrollments[0] ??
    null;
  const curriculum = active ? getCourseCurriculum(active.course_id) : [];
  const completedLessons =
    active && user.role === "student"
      ? getCompletedLessonIds(user.id, active.course_id)
      : new Set<string>();
  const allLessons = curriculum.flatMap((module) =>
    module.lessons.map((lesson) => ({ lesson, module })),
  );
  const nextEntry = allLessons.find(
    ({ lesson }) => !completedLessons.has(lesson.id),
  );

  const enrolledIds = new Set(enrollments.map((enrollment) => enrollment.course_id));
  const catalog = getPublishedCourses({ sort: "popular" });
  const recommended = catalog
    .filter((course) => !enrolledIds.has(course.id))
    .slice(0, 3);

  const pendingAssessments = upcoming.filter((assessment) => !assessment.best_passed);
  const displayAssessments = (
    pendingAssessments.length > 0 ? pendingAssessments : upcoming
  ).slice(0, 3);
  const latestCertificate = certificates[0];

  return (
    <div className="space-y-6">
      {welcome && (
        <div className="flex items-center gap-3 rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-[12px] text-lime-900">
          <Sparkles className="h-4 w-4 shrink-0" />
          Welcome to BrighterFuture! Your account is ready. Choose a course to
          begin your first lesson.
        </div>
      )}

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
            {getGreeting()}, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {stats.lessonsCompleted > 0
              ? `You've completed ${stats.lessonsCompleted} lesson${
                  stats.lessonsCompleted === 1 ? "" : "s"
                } and built real momentum. Keep going.`
              : "Your next skill is one focused session away."}
          </p>
        </div>
        <Link
          href="/courses"
          className={buttonStyles({ variant: "outline", size: "md" })}
        >
          <BookOpen className="h-4 w-4" />
          Browse catalog
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Courses in progress"
          value={stats.totalCourses}
          icon={BookOpen}
          tone="blue"
          hint={`${stats.completedCourses} completed`}
        />
        <StatCard
          label="Lessons completed"
          value={stats.lessonsCompleted}
          icon={Check}
          tone="lime"
          hint="Every lesson counts"
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
          icon={GraduationCap}
          tone="amber"
          hint="Verified proof"
        />
      </div>

      {active ? (
        <div className="relative overflow-hidden rounded-2xl bg-ink-950 text-white shadow-lift">
          <div className="absolute inset-0 bg-grid-dark bg-[size:40px_40px] opacity-25" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-electric-500/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1fr_310px]">
            <div className="p-6 sm:p-7 lg:p-8">
              <div className="flex items-center gap-2">
                <Badge tone="lime" dot>
                  Continue learning
                </Badge>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">
                  {active.course.category}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl font-display text-[26px] font-semibold leading-tight tracking-[-0.035em] sm:text-[31px]">
                {active.course.title}
              </h2>
              <p className="mt-2 max-w-lg text-[12px] leading-6 text-slate-400">
                {nextEntry
                  ? `Up next: ${nextEntry.lesson.title} · ${nextEntry.module.title}`
                  : "Every lesson is complete. Finish your assessments to earn the certificate."}
              </p>

              <div className="mt-6 max-w-lg">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="font-medium text-slate-400">
                    {active.completed_lessons} of {active.lesson_count} lessons
                  </span>
                  <span className="font-bold text-lime-300">{active.progress}%</span>
                </div>
                <ProgressBar
                  value={active.progress}
                  barClassName="bg-lime-300"
                  className="bg-white/10"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/dashboard/learning/${active.course.slug}${
                    nextEntry ? `?lesson=${nextEntry.lesson.id}` : ""
                  }`}
                  className={buttonStyles({
                    variant: "accent",
                    size: "md",
                  })}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {nextEntry ? "Resume lesson" : "Review course"}
                </Link>
                <Link
                  href={`/courses/${active.course.slug}`}
                  className={buttonStyles({ variant: "dark", size: "md" })}
                >
                  Course details
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <CourseCover
                cover={active.course.cover}
                category={active.course.category}
                title={active.course.title}
                className="absolute inset-0 h-full w-full rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/20 to-transparent" />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Your first course is waiting"
          description="Choose a path in web development, data, security, cloud, or product design. Every course starts with a focused first lesson."
          action={
            <Link href="/courses" className={buttonStyles({ variant: "electric" })}>
              Explore courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="bg-white"
        />
      )}

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Your learning rhythm
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                A small, honest view of the last seven days.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-50 text-lime-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4">
            <WeeklyActivityChart data={weekly} />
          </div>
        </div>

        <div className="card flex flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Next assessments
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Prove what you know, when ready.
              </p>
            </div>
            <Link
              href="/dashboard/assessments"
              className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 flex-1 space-y-2.5">
            {displayAssessments.length > 0 ? (
              displayAssessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/dashboard/assessments/${assessment.id}`}
                  className="focus-ring group flex items-center gap-3 rounded-xl border border-mist-100 bg-mist-50/50 p-3 transition hover:border-mist-200 hover:bg-white"
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      assessment.best_passed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-white text-electric-600"
                    }`}
                  >
                    {assessment.best_passed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <FileCheck2 className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-ink-900">
                      {assessment.title}
                    </p>
                    <p className="mt-0.5 truncate text-[9.5px] text-slate-500">
                      {assessment.course_title} · {assessment.question_count} questions
                    </p>
                  </div>
                  {assessment.best_passed ? (
                    <Badge tone="green" className="shrink-0">
                      {assessment.best_score}%
                    </Badge>
                  ) : (
                    <span className="shrink-0 text-[9px] font-bold text-electric-600">
                      Start
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-mist-200 p-6 text-center">
                <p className="text-[11px] font-semibold text-ink-800">
                  No assessments yet
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Enroll in a course to unlock its checkpoints.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-electric-50/70 px-3 py-2.5">
            <Flame className="h-3.5 w-3.5 text-electric-600" />
            <p className="text-[10px] leading-4 text-electric-800">
              Retakes are unlimited. Aim for understanding, not perfection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                Recent activity
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Every step is logged so you can see the journey.
              </p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-mist-100 text-slate-500">
              <History className="h-4 w-4" />
            </span>
          </div>

          {activity.length > 0 ? (
            <div className="mt-5 space-y-0">
              {activity.map((item, index) => (
                <div key={`${item.at}-${index}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                        item.type === "lesson"
                          ? "bg-electric-50 text-electric-600"
                          : "bg-lime-50 text-lime-700"
                      }`}
                    >
                      {item.type === "lesson" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <FileCheck2 className="h-3.5 w-3.5" />
                      )}
                    </span>
                    {index < activity.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-mist-200" />
                    )}
                  </div>
                  <div className={`min-w-0 flex-1 ${index < activity.length - 1 ? "pb-4" : ""}`}>
                    <p className="text-[11px] font-semibold leading-5 text-ink-800">
                      {item.type === "lesson" ? "Completed" : "Submitted"}{" "}
                      <span className="font-bold">{item.title}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[9.5px] text-slate-400">
                      <span>{item.context}</span>
                      <span>·</span>
                      <span>{timeAgo(item.at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-mist-200 p-6 text-center text-[11px] text-slate-400">
              Complete a lesson and your activity will appear here.
            </div>
          )}
        </div>

        <div className="space-y-5">
          {latestCertificate ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 to-electric-800 p-5 text-white shadow-soft">
              <div className="absolute inset-0 bg-grid-dark bg-[size:24px_24px] opacity-30" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                    Latest certificate
                  </span>
                  <Award className="h-5 w-5 text-lime-300" />
                </div>
                <p className="mt-4 font-display text-[18px] font-semibold leading-snug">
                  {latestCertificate.course_title}
                </p>
                <p className="mt-1 font-mono text-[9px] text-electric-200">
                  {latestCertificate.code}
                </p>
                <Link
                  href="/dashboard/certificates"
                  className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-lime-300 hover:text-lime-200"
                >
                  View certificate
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-ink-950">
                    Certificates you can verify
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Complete a course and pass every assessment.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/certificates"
                className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold text-electric-600 hover:text-electric-700"
              >
                See certificate requirements
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} color={user.avatar_color} size="md" />
              <div>
                <p className="text-[12px] font-bold text-ink-950">Your profile</p>
                <p className="text-[10px] text-slate-500">{user.headline}</p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-ink-900"
            >
              Update your details
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-[20px] font-semibold tracking-tight text-ink-950">
                Recommended next
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Complementary skills that broaden your direction.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              Browse all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
