import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getAssessmentsForCourse,
  getCompletedLessonIds,
  getCourseBySlug,
  getCourseCurriculum,
  getEnrollment,
  parseList,
} from "@/lib/queries";
import { enrollAction } from "@/lib/actions/learning";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCover } from "@/components/course-cover";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { formatDate, formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

const lessonIcons = {
  reading: BookOpen,
  video: Video,
  lab: FlaskConical,
} as const;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [user, course] = await Promise.all([
    getCurrentUser(),
    getCourseBySlug(slug, true),
  ]);

  if (!course) notFound();

  const canManage =
    user?.role === "admin" || user?.id === course.instructor_id;
  if (course.status !== "published" && !canManage) notFound();

  const curriculum = getCourseCurriculum(course.id);
  const assessments = getAssessmentsForCourse(course.id).filter(
    (assessment) =>
      assessment.status === "published" || Boolean(canManage),
  );
  const enrollment =
    user?.role === "student" ? getEnrollment(user.id, course.id) : undefined;
  const completedLessons =
    user?.role === "student" && enrollment
      ? getCompletedLessonIds(user.id, course.id)
      : new Set<string>();
  const totalLessons = curriculum.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );
  const completedCount = curriculum.reduce(
    (sum, module) =>
      sum + module.lessons.filter((lesson) => completedLessons.has(lesson.id)).length,
    0,
  );
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const nextLesson = curriculum
    .flatMap((module) => module.lessons)
    .find((lesson) => !completedLessons.has(lesson.id));
  const outcomes = parseList(course.outcomes);
  const requirements = parseList(course.requirements);

  return (
    <div className="min-h-screen bg-mist-50">
      <div className="bg-white">
        <SiteHeader signedIn={Boolean(user)} />
      </div>

      {course.status !== "published" && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="container-page flex items-center gap-3 py-2.5 text-[12px] text-amber-900">
            <span className="rounded-full bg-amber-200 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
              {course.status} preview
            </span>
            This course is not visible to learners yet. Preview it, then publish
            when the curriculum is ready.
            <Link
              href={`/dashboard/courses/${course.id}/edit`}
              className="ml-auto hidden font-bold underline underline-offset-2 sm:inline"
            >
              Manage course
            </Link>
          </div>
        </div>
      )}

      <section className="border-b border-mist-200 bg-white">
        <div className="container-page py-8 lg:py-12">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <Link href="/" className="hover:text-ink-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-ink-900">
              Courses
            </Link>
            <span>/</span>
            <span className="truncate text-ink-700">{course.category}</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{course.category}</Badge>
                <Badge tone="neutral">{course.level}</Badge>
                {course.status === "published" ? (
                  <Badge tone="green" dot>
                    Open for enrollment
                  </Badge>
                ) : (
                  <Badge tone="amber">{course.status}</Badge>
                )}
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink-950 sm:text-[50px]">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-500">
                {course.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  {course.duration_hours} hours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  {totalLessons} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  {course.student_count ?? 0} learners
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-slate-400" />
                  {assessments.filter((item) => item.status === "published").length} assessments
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-lime-500" />
                  Certificate included
                </span>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <Avatar
                  name={course.instructor_name ?? "Instructor"}
                  color={course.instructor_color}
                  size="md"
                />
                <div>
                  <p className="text-[12px] font-bold text-ink-950">
                    {course.instructor_name}
                  </p>
                  <p className="text-[10.5px] text-slate-500">
                    {course.instructor_headline}
                  </p>
                </div>
                <span className="mx-1 h-7 w-px bg-mist-200" />
                <p className="text-[10.5px] text-slate-400">
                  Last updated {formatDate(course.updated_at)}
                </p>
              </div>
            </div>

            <CourseCover
              cover={course.cover}
              category={course.category}
              title={course.title}
              className="aspect-[16/10] rounded-3xl shadow-lift"
            />
          </div>
        </div>
      </section>

      <main className="container-page py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                About this course
              </h2>
              <p className="mt-3 whitespace-pre-line text-[14.5px] leading-7 text-slate-600">
                {course.description}
              </p>
            </section>

            {outcomes.length > 0 && (
              <section className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft sm:p-7">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                  What you&apos;ll be able to do
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <p className="text-[13px] leading-6 text-slate-600">{outcome}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                    Curriculum
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-500">
                    {curriculum.length} modules · {totalLessons} lessons ·{" "}
                    {formatDuration(course.duration_hours * 60)} of focused work
                  </p>
                </div>
                <Badge tone="neutral">{course.level}</Badge>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft">
                {curriculum.map((module, moduleIndex) => (
                  <details
                    key={module.id}
                    className="group border-b border-mist-200 last:border-b-0"
                    open={moduleIndex === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 transition hover:bg-mist-50/60 sm:px-6">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-950 font-mono text-[10px] font-bold text-lime-300">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-bold text-ink-950">
                          {module.title}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {module.summary ?? `${module.lessons.length} lessons`}
                        </p>
                      </div>
                      <span className="hidden text-[10px] font-medium text-slate-400 sm:block">
                        {module.lessons.length} lessons
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                    </summary>
                    <div className="bg-mist-50/60 px-4 pb-3 pt-1 sm:px-6">
                      {module.lessons.map((lesson) => {
                        const Icon = lessonIcons[lesson.kind] ?? BookOpen;
                        const done = completedLessons.has(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 border-b border-mist-200/70 py-2.5 last:border-b-0"
                          >
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                                done
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-white text-slate-400"
                              }`}
                            >
                              {done ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Icon className="h-3.5 w-3.5" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-semibold text-ink-800">
                                {lesson.title}
                              </p>
                              <p className="truncate text-[10px] text-slate-400">
                                {lesson.summary}
                              </p>
                            </div>
                            <span className="shrink-0 font-mono text-[9px] text-slate-400">
                              {lesson.kind === "lab" ? "LAB" : `${lesson.duration_minutes}m`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {assessments.filter((item) => item.status === "published").length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                  Assessments
                </h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  Pass every assessment to earn your certificate.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {assessments
                    .filter((item) => item.status === "published")
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft"
                      >
                        <div className="flex items-center justify-between">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-50 text-electric-600">
                            <FileCheck2 className="h-4 w-4" />
                          </span>
                          <Badge tone={assessment.type === "exam" ? "violet" : "blue"}>
                            {assessment.type}
                          </Badge>
                        </div>
                        <p className="mt-3 text-[13px] font-bold text-ink-950">
                          {assessment.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                          {assessment.description}
                        </p>
                        <div className="mt-3 flex gap-3 text-[10px] font-medium text-slate-400">
                          <span>{assessment.question_count} questions</span>
                          <span>·</span>
                          <span>{assessment.duration_minutes} min</span>
                          <span>·</span>
                          <span>{assessment.pass_score}% to pass</span>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Avatar
                  name={course.instructor_name ?? "Instructor"}
                  color={course.instructor_color}
                  size="xl"
                />
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Your instructor
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-950">
                    {course.instructor_name}
                  </h2>
                  <p className="text-[12px] font-medium text-electric-600">
                    {course.instructor_headline}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-6 text-slate-500">
                    {course.instructor_headline
                      ? `Teaches ${course.title.toLowerCase()} with an emphasis on practical judgement, not just syntax. Expect clear feedback, real constraints, and work you can defend.`
                      : "An experienced practitioner focused on helping learners build skills they can use immediately."}
                  </p>
                </div>
              </div>
            </section>

            {requirements.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                  Requirements
                </h2>
                <ul className="mt-3 space-y-2">
                  {requirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex items-start gap-2.5 text-[13px] leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-400" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-lift">
              <div className="p-6">
                {course.status !== "published" ? (
                  <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
                    This is a preview. Publish the course before learners can
                    enroll.
                  </div>
                ) : (
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Full course access
                      </p>
                      <p className="mt-1 font-display text-[28px] font-semibold tracking-[-0.04em] text-ink-950">
                        Free
                      </p>
                    </div>
                    <Badge tone="lime" dot>
                      Included
                    </Badge>
                  </div>
                )}

                {enrollment ? (
                  <div className="mb-5 rounded-xl border border-electric-100 bg-electric-50/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-electric-800">
                        Your progress
                      </p>
                      <span className="font-display text-lg font-semibold text-electric-700">
                        {progress}%
                      </span>
                    </div>
                    <ProgressBar value={progress} className="mt-2" />
                    <p className="mt-2 text-[10px] text-electric-700/70">
                      {completedCount} of {totalLessons} lessons complete
                    </p>
                  </div>
                ) : (
                  <p className="mb-5 text-[12px] leading-6 text-slate-500">
                    Get full access to every lesson, lab, and assessment. Learn
                    at your own pace and earn a verified certificate.
                  </p>
                )}

                {canManage ? (
                  <Link
                    href={`/dashboard/courses/${course.id}/edit`}
                    className={buttonStyles({
                      variant: "primary",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    Manage this course
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : course.status !== "published" ? (
                  <Link
                    href="/courses"
                    className={buttonStyles({
                      variant: "outline",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    Browse published courses
                  </Link>
                ) : enrollment ? (
                  <Link
                    href={`/dashboard/learning/${course.slug}${
                      nextLesson ? `?lesson=${nextLesson.id}` : ""
                    }`}
                    className={buttonStyles({
                      variant: "electric",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    {progress === 100 ? "Review course" : "Continue learning"}
                  </Link>
                ) : user?.role === "student" ? (
                  <form action={enrollAction}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className={buttonStyles({
                        variant: "electric",
                        size: "lg",
                        className: "w-full",
                      })}
                    >
                      Enroll for free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : user ? (
                  <div className="rounded-xl bg-mist-50 p-4 text-center text-[11px] leading-5 text-slate-500">
                    You are signed in as {user.role}. Preview the learner
                    experience by creating a student account.
                  </div>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className={buttonStyles({
                        variant: "electric",
                        size: "lg",
                        className: "w-full",
                      })}
                    >
                      Create an account to enroll
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <p className="mt-3 text-center text-[10px] text-slate-400">
                      Already learning?{" "}
                      <Link
                        href={`/login?next=/courses/${course.slug}`}
                        className="font-semibold text-electric-600 hover:underline"
                      >
                        Log in
                      </Link>
                    </p>
                  </>
                )}

                <div className="mt-6 space-y-3 border-t border-mist-100 pt-5">
                  {[
                    { icon: BookOpen, label: `${totalLessons} focused lessons` },
                    { icon: FlaskConical, label: "Hands-on labs and projects" },
                    { icon: FileCheck2, label: "Auto-graded assessments" },
                    { icon: Award, label: "Verified certificate on completion" },
                    { icon: Clock3, label: "Learn at your own pace" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 text-[11.5px] text-slate-600"
                    >
                      <item.icon className="h-4 w-4 text-slate-400" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-mist-100 bg-mist-50/60 px-6 py-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Verified progress and certificate
                </div>
              </div>
            </div>

            {enrollment && (
              <Link
                href="/dashboard/certificates"
                className="mt-3 flex items-center justify-between rounded-xl border border-mist-200 bg-white px-4 py-3 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-mist-300"
              >
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  View your certificates
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
