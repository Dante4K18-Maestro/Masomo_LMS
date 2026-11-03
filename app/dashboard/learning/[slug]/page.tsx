import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  FileCheck2,
  FlaskConical,
  Lock,
  Play,
  Sparkles,
  Video,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getAssessmentsForCourse,
  getBestAttempt,
  getCertificatesForUser,
  getCompletedLessonIds,
  getCourseBySlug,
  getCourseCurriculum,
  getEnrollment,
} from "@/lib/queries";
import { toggleLessonAction } from "@/lib/actions/learning";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Markdown } from "@/components/markdown";
import { formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Course player",
};

const kindMeta = {
  reading: { label: "Reading", icon: BookOpen },
  video: { label: "Video lesson", icon: Video },
  lab: { label: "Hands-on lab", icon: FlaskConical },
} as const;

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string; completed?: string }>;
}) {
  const [{ slug }, query, user] = await Promise.all([
    params,
    searchParams,
    requireUser(),
  ]);

  if (user.role !== "student") redirect("/dashboard/courses");

  const course = getCourseBySlug(slug);
  if (!course) redirect("/dashboard/learning");

  const enrollment = getEnrollment(user.id, course.id);
  if (!enrollment) redirect(`/courses/${course.slug}?error=enroll`);

  const curriculum = getCourseCurriculum(course.id);
  const completedLessons = getCompletedLessonIds(user.id, course.id);
  const lessons = curriculum.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })),
  );
  const totalLessons = lessons.length;
  const completedCount = lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (totalLessons === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-mist-300 bg-white p-10 text-center">
        <h1 className="font-display text-xl font-semibold text-ink-950">
          This course has no lessons yet
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Check back soon. The instructor is still building the curriculum.
        </p>
        <Link
          href="/dashboard/learning"
          className={buttonStyles({ variant: "primary", className: "mt-5" })}
        >
          Back to my learning
        </Link>
      </div>
    );
  }

  const requested = lessons.find((lesson) => lesson.id === query.lesson);
  const current =
    requested ??
    lessons.find((lesson) => !completedLessons.has(lesson.id)) ??
    lessons[0];
  const currentIndex = lessons.findIndex((lesson) => lesson.id === current.id);
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isComplete = completedLessons.has(current.id);
  const kind = kindMeta[current.kind] ?? kindMeta.reading;
  const KindIcon = kind.icon;
  const assessments = getAssessmentsForCourse(course.id).filter(
    (assessment) => assessment.status === "published",
  );
  const certificate = getCertificatesForUser(user.id).find(
    (item) => item.course_id === course.id,
  );
  const assessmentStatus = assessments.map((assessment) => ({
    assessment,
    best: getBestAttempt(user.id, assessment.id),
  }));
  const passedAllAssessments =
    assessments.length === 0 ||
    assessments.every((assessment) => getBestAttempt(user.id, assessment.id)?.passed);
  const courseFinished = completedCount === totalLessons;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/learning"
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mist-200 bg-white text-slate-500 transition hover:border-mist-300 hover:text-ink-900"
            aria-label="Back to my learning"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {course.category}
            </p>
            <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink-950 sm:text-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-mist-200 bg-white px-3.5 py-2 shadow-sm">
          <div className="text-right">
            <p className="text-[9px] font-semibold text-slate-400">Course progress</p>
            <p className="text-[11px] font-bold text-ink-900">
              {completedCount} / {totalLessons} lessons
            </p>
          </div>
          <div className="w-24">
            <ProgressBar
              value={progress}
              size="sm"
              barClassName={progress === 100 ? "bg-emerald-500" : undefined}
            />
          </div>
          <span className="font-display text-sm font-semibold text-electric-600">
            {progress}%
          </span>
        </div>
      </div>

      {query.completed === "1" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Lesson complete. Progress saved — keep the momentum going.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-[92px] xl:self-start">
          <details open className="group overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft">
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-mist-100 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="text-[12px] font-bold text-ink-950">Course contents</p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  {curriculum.length} modules · {totalLessons} lessons
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180 xl:hidden" />
            </summary>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto p-3">
              {curriculum.map((module, moduleIndex) => (
                <div key={module.id} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <span className="font-mono text-[9px] font-bold text-slate-300">
                      {String(moduleIndex + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      {module.title}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {module.lessons.map((lesson) => {
                      const active = lesson.id === current.id;
                      const done = completedLessons.has(lesson.id);
                      const LessonIcon =
                        kindMeta[lesson.kind]?.icon ?? BookOpen;
                      return (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/learning/${course.slug}?lesson=${lesson.id}`}
                          className={`focus-ring flex items-start gap-2.5 rounded-lg px-2 py-2 transition ${
                            active
                              ? "bg-electric-50 text-electric-800"
                              : "text-slate-600 hover:bg-mist-50"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="mt-0.5 shrink-0">
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : active ? (
                              <Play className="h-3.5 w-3.5 fill-electric-500 text-electric-500" />
                            ) : (
                              <LessonIcon className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[10.5px] font-semibold leading-4 ${
                                active ? "text-electric-800" : "text-slate-700"
                              }`}
                            >
                              {lesson.title}
                            </span>
                            <span className="mt-0.5 block text-[8.5px] text-slate-400">
                              {lesson.kind === "lab" ? "Lab" : `${lesson.duration_minutes} min`}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-mist-100 bg-mist-50/60 px-5 py-4">
              <div className="flex items-center justify-between text-[9px] font-semibold text-slate-500">
                <span>Course complete</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} size="sm" className="mt-2" />
              <Link
                href={`/courses/${course.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold text-electric-600 hover:text-electric-700"
              >
                Course overview
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </details>
        </aside>

        <div className="min-w-0 space-y-5">
          <article className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft">
            <header className="border-b border-mist-100 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={current.kind === "lab" ? "violet" : "blue"}>
                  <KindIcon className="h-3 w-3" />
                  {kind.label}
                </Badge>
                <span className="text-[10px] font-medium text-slate-400">
                  Lesson {currentIndex + 1} of {lessons.length}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Clock3 className="h-3 w-3" />
                  {formatDuration(current.duration_minutes)}
                </span>
                {isComplete && (
                  <Badge tone="green">
                    <Check className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight tracking-[-0.04em] text-ink-950 sm:text-[38px]">
                {current.title}
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
                {current.summary}
              </p>
            </header>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <Markdown content={current.content} />
            </div>

            <footer className="border-t border-mist-100 bg-mist-50/50 px-5 py-4 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {previous ? (
                    <Link
                      href={`/dashboard/learning/${course.slug}?lesson=${previous.id}`}
                      className={buttonStyles({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isComplete ? (
                    <>
                      <form action={toggleLessonAction}>
                        <input type="hidden" name="lessonId" value={current.id} />
                        <button
                          type="submit"
                          className={buttonStyles({
                            variant: "ghost",
                            size: "sm",
                          })}
                        >
                          Mark incomplete
                        </button>
                      </form>
                      {next ? (
                        <Link
                          href={`/dashboard/learning/${course.slug}?lesson=${next.id}`}
                          className={buttonStyles({
                            variant: "primary",
                            size: "sm",
                          })}
                        >
                          Next lesson
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : assessments.length > 0 ? (
                        <Link
                          href={`/dashboard/assessments/${assessments[0].id}`}
                          className={buttonStyles({
                            variant: "electric",
                            size: "sm",
                          })}
                        >
                          <FileCheck2 className="h-3.5 w-3.5" />
                          Take an assessment
                        </Link>
                      ) : null}
                    </>
                  ) : (
                    <form action={toggleLessonAction}>
                      <input type="hidden" name="lessonId" value={current.id} />
                      {next && (
                        <input type="hidden" name="nextLessonId" value={next.id} />
                      )}
                      <button
                        type="submit"
                        className={buttonStyles({
                          variant: "accent",
                          size: "md",
                        })}
                      >
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        {next ? "Complete & continue" : "Mark lesson complete"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </footer>
          </article>

          {courseFinished && (
            <div
              className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 ${
                certificate
                  ? "border-lime-200 bg-gradient-to-br from-lime-50 to-white"
                  : "border-mist-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                      certificate
                        ? "bg-lime-200 text-lime-900"
                        : "bg-electric-50 text-electric-600"
                    }`}
                  >
                    {certificate ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-semibold text-ink-950">
                      {certificate
                        ? "Your certificate is ready"
                        : "All lessons complete"}
                    </p>
                    <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-500">
                      {certificate
                        ? `Certificate ${certificate.code} has been issued. View and share it from your certificates page.`
                        : passedAllAssessments
                          ? "You have met every requirement. Your certificate will be issued shortly."
                          : "Pass every published assessment to unlock your verified certificate."}
                    </p>
                  </div>
                </div>
                {certificate ? (
                  <Link
                    href="/dashboard/certificates"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                      className: "shrink-0",
                    })}
                  >
                    View certificate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  assessments.length > 0 && (
                    <Link
                      href={`/dashboard/assessments/${assessments[0].id}`}
                      className={buttonStyles({
                        variant: "electric",
                        size: "md",
                        className: "shrink-0",
                      })}
                    >
                      Go to assessment
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          {assessments.length > 0 && (
            <section className="card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                    Course checkpoints
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {courseFinished
                      ? "Finish every checkpoint to complete the course."
                      : "You can take these whenever you feel ready."}
                  </p>
                </div>
                <FileCheck2 className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-4 space-y-2">
                {assessmentStatus.map(({ assessment, best }) => (
                  <Link
                    key={assessment.id}
                    href={`/dashboard/assessments/${assessment.id}`}
                    className="focus-ring flex items-center gap-3 rounded-xl border border-mist-100 bg-mist-50/40 px-3.5 py-3 transition hover:border-mist-200 hover:bg-white"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        best?.passed
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-white text-electric-600"
                      }`}
                    >
                      {best?.passed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <FileCheck2 className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-ink-900">
                        {assessment.title}
                      </p>
                      <p className="mt-0.5 text-[9.5px] text-slate-400">
                        {assessment.question_count} questions ·{" "}
                        {assessment.duration_minutes} minutes ·{" "}
                        {assessment.pass_score}% to pass
                      </p>
                    </div>
                    {best ? (
                      <Badge tone={best.passed ? "green" : "amber"}>
                        {Math.round(((best.score ?? 0) / (best.max_score ?? 1)) * 100)}%
                      </Badge>
                    ) : (
                      <span className="text-[9px] font-bold text-electric-600">
                        Open
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
