import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Archive,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Layers3,
  ListChecks,
  Pencil,
  Plus,
  PlusCircle,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { requireCourseManager } from "@/lib/access";
import { getStaffOptions, parseList } from "@/lib/queries";
import {
  getAssessmentsForCourse,
  getCourseCurriculum,
  getCourseEnrollments,
} from "@/lib/queries";
import {
  addLessonAction,
  addModuleAction,
  deleteCourseAction,
  deleteLessonAction,
  deleteModuleAction,
  updateCourseAction,
  updateCourseStatusAction,
  updateModuleAction,
} from "@/lib/actions/courses";
import { PageHeader } from "@/components/page-header";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { CourseForm } from "@/components/course-form";
import { EmptyState } from "@/components/empty-state";
import { ConfirmForm } from "@/components/confirm-form";
import { formatDate, formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Course studio",
};

const lessonIcons = {
  reading: BookOpen,
  video: Video,
  lab: FlaskConical,
} as const;

const lessonKindLabels = {
  reading: "Reading",
  video: "Video",
  lab: "Lab",
} as const;

export default async function CourseEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string;
    status?: string;
    module?: string;
    lesson?: string;
    error?: string;
  }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { user, course } = await requireCourseManager(id);

  const curriculum = getCourseCurriculum(course.id);
  const assessments = getAssessmentsForCourse(course.id);
  const enrollments = getCourseEnrollments(course.id);
  const completed = enrollments.filter((item) => item.completed_at).length;
  const instructors = getStaffOptions().filter(
    (instructor) => user.role === "admin" || instructor.id === course.instructor_id,
  );
  const lessonCount = curriculum.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );
  const publishedAssessments = assessments.filter(
    (assessment) => assessment.status === "published",
  ).length;
  const outcomes = parseList(course.outcomes);
  const requirements = parseList(course.requirements);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/courses"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[10px] font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Course studio
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Link>
          <Link
            href={`/dashboard/courses/${course.id}/students`}
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <Users className="h-3.5 w-3.5" />
            Students
          </Link>
        </div>
      </div>

      <PageHeader
        eyebrow={`${course.category} · ${course.level}`}
        title={course.title}
        description={course.subtitle}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={course.status} />
            <Badge tone="neutral">
              <Clock3 className="h-3 w-3" />
              {course.duration_hours}h
            </Badge>
            <Badge tone="blue">
              <Users className="h-3 w-3" />
              {course.student_count ?? 0} learners
            </Badge>
          </div>
        }
      />

      {query.created && (
        <div className="flex items-start gap-2 rounded-xl border border-electric-200 bg-electric-50 px-4 py-3 text-[11px] leading-5 text-electric-900">
          <SparkleIcon />
          <p>
            Course created. Add modules and lessons below, then publish when the
            learning path is ready for students.
          </p>
        </div>
      )}
      {query.status === "updated" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Course status updated.
        </div>
      )}
      {query.module === "added" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Module added to the curriculum.
        </div>
      )}
      {query.module === "deleted" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Module removed.
        </div>
      )}
      {query.lesson === "deleted" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[11px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Lesson removed.
        </div>
      )}
      {query.error === "no-lessons" && (
        <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          <AlertCircle className="h-4 w-4" />
          Add at least one lesson before publishing this course.
        </div>
      )}
      {query.error === "has-enrollments" && (
        <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          <AlertCircle className="h-4 w-4" />
          This course has enrolled students and cannot be deleted. Archive it
          instead to keep their records intact.
        </div>
      )}
      {(query.error === "module" || query.error === "lesson") && (
        <div className="flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-2.5 text-[11px] text-coral-800">
          <AlertCircle className="h-4 w-4" />
          Check the title and duration, then try again.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Modules",
            value: curriculum.length,
            icon: Layers3,
            hint: "Curriculum sections",
          },
          {
            label: "Lessons",
            value: lessonCount,
            icon: BookOpen,
            hint: `${formatDuration(
              curriculum.reduce(
                (sum, module) =>
                  sum +
                  module.lessons.reduce(
                    (lessonSum, lesson) => lessonSum + lesson.duration_minutes,
                    0,
                  ),
                0,
              ),
            )} of content`,
          },
          {
            label: "Enrollments",
            value: enrollments.length,
            icon: GraduationCap,
            hint: `${completed} completed`,
          },
          {
            label: "Assessments",
            value: assessments.length,
            icon: FileCheck2,
            hint: `${publishedAssessments} published`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-mist-200 bg-white p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-semibold text-slate-500">
                {item.label}
              </p>
              <item.icon className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="mt-2 font-display text-[25px] font-semibold leading-none tracking-[-0.04em] text-ink-950">
              {item.value}
            </p>
            <p className="mt-2 text-[9px] text-slate-400">{item.hint}</p>
          </div>
        ))}
      </div>

      <CourseForm
        action={updateCourseAction}
        mode="edit"
        isAdmin={user.role === "admin"}
        instructors={instructors}
        course={{
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          category: course.category,
          level: course.level,
          duration_hours: course.duration_hours,
          cover: course.cover,
          outcomes,
          requirements,
          instructor_id: course.instructor_id,
        }}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
        <div className="min-w-0 space-y-5">
          <section className="card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-mist-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                  Curriculum
                </h2>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  {curriculum.length} modules · {lessonCount} lessons. Students
                  move through this order.
                </p>
              </div>
              <details className="group relative">
                <summary
                  className={buttonStyles({
                    variant: "outline",
                    size: "sm",
                    className: "cursor-pointer list-none",
                  })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add module
                </summary>
                <div className="mt-3 rounded-xl border border-mist-200 bg-mist-50 p-4">
                  <form action={addModuleAction} className="space-y-3">
                    <input type="hidden" name="courseId" value={course.id} />
                    <div>
                      <label htmlFor="module-title" className="label text-[11px]">
                        Module title
                      </label>
                      <input
                        id="module-title"
                        name="title"
                        className="input h-9 text-[12px]"
                        placeholder="e.g. Building the API layer"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="module-summary" className="label text-[11px]">
                        Summary
                      </label>
                      <textarea
                        id="module-summary"
                        name="summary"
                        rows={2}
                        className="input resize-y text-[12px]"
                        placeholder="What is this module about?"
                      />
                    </div>
                    <button
                      type="submit"
                      className={buttonStyles({
                        variant: "primary",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      Add module
                    </button>
                  </form>
                </div>
              </details>
            </div>

            {curriculum.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  icon={Layers3}
                  title="No modules yet"
                  description="Start with the first module, then add focused lessons. A clear sequence is the heart of a good course."
                  className="py-9"
                />
              </div>
            ) : (
              <div className="divide-y divide-mist-100">
                {curriculum.map((module, moduleIndex) => (
                  <div key={module.id} className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-950 font-mono text-[10px] font-bold text-lime-300">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-[15px] font-semibold text-ink-950">
                              {module.title}
                            </h3>
                            <p className="mt-0.5 text-[10.5px] leading-4 text-slate-400">
                              {module.summary ||
                                `${module.lessons.length} lesson${
                                  module.lessons.length === 1 ? "" : "s"
                                }`}
                            </p>
                          </div>
                          <Badge tone="neutral">
                            {module.lessons.length} lessons
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          {module.lessons.map((lesson) => {
                            const Icon =
                              lessonIcons[lesson.kind] ?? BookOpen;
                            return (
                              <div
                                key={lesson.id}
                                className="group flex items-center gap-2.5 rounded-lg border border-mist-100 bg-mist-50/50 px-3 py-2"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[11px] font-semibold text-ink-800">
                                    {lesson.title}
                                  </p>
                                  <p className="mt-0.5 text-[8.5px] text-slate-400">
                                    {lessonKindLabels[lesson.kind] ??
                                      lesson.kind}{" "}
                                    · {lesson.duration_minutes} min
                                  </p>
                                </div>
                                <Link
                                  href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                                  className="focus-ring inline-flex items-center gap-1 rounded px-1.5 py-1 text-[9px] font-bold text-electric-600 hover:bg-electric-50"
                                >
                                  <Pencil className="h-2.5 w-2.5" />
                                  Edit
                                </Link>
                                <ConfirmForm
                                  action={deleteLessonAction}
                                  message={`Delete "${lesson.title}"? This also removes any student progress for the lesson.`}
                                  hiddenFields={{
                                    lessonId: lesson.id,
                                    courseId: course.id,
                                  }}
                                  className="px-1.5 py-1 [&_svg]:h-2.5 [&_svg]:w-2.5"
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                </ConfirmForm>
                              </div>
                            );
                          })}
                        </div>

                        <details className="group mt-2">
                          <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px] font-semibold text-electric-600 hover:bg-electric-50">
                            <Plus className="h-3 w-3" />
                            Add lesson
                          </summary>
                          <form
                            action={addLessonAction}
                            className="mt-2 grid gap-2 rounded-xl border border-mist-200 bg-white p-3 sm:grid-cols-[1fr_120px_90px_auto] sm:items-end"
                          >
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="moduleId" value={module.id} />
                            <div>
                              <label
                                htmlFor={`lesson-title-${module.id}`}
                                className="label text-[10px]"
                              >
                                Lesson title
                              </label>
                              <input
                                id={`lesson-title-${module.id}`}
                                name="title"
                                className="input h-9 text-[11px]"
                                placeholder="e.g. Routes and controllers"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`lesson-kind-${module.id}`}
                                className="label text-[10px]"
                              >
                                Type
                              </label>
                              <select
                                id={`lesson-kind-${module.id}`}
                                name="kind"
                                className="input h-9 cursor-pointer text-[11px]"
                              >
                                <option value="reading">Reading</option>
                                <option value="video">Video</option>
                                <option value="lab">Lab</option>
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor={`lesson-duration-${module.id}`}
                                className="label text-[10px]"
                              >
                                Minutes
                              </label>
                              <input
                                id={`lesson-duration-${module.id}`}
                                name="duration"
                                type="number"
                                min={1}
                                max={240}
                                defaultValue={15}
                                className="input h-9 text-[11px]"
                              />
                            </div>
                            <button
                              type="submit"
                              className={buttonStyles({
                                variant: "primary",
                                size: "sm",
                                className: "h-9",
                              })}
                            >
                              Create lesson
                            </button>
                          </form>
                        </details>

                        <div className="mt-2 flex items-center gap-2 border-t border-mist-100 pt-2">
                          <details className="group">
                            <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-1 rounded px-1.5 py-1 text-[9px] font-semibold text-slate-400 hover:text-ink-900">
                              <Pencil className="h-2.5 w-2.5" />
                              Edit module
                            </summary>
                            <form
                              action={updateModuleAction}
                              className="mt-2 space-y-2 rounded-xl border border-mist-200 bg-mist-50 p-3"
                            >
                              <input
                                type="hidden"
                                name="courseId"
                                value={course.id}
                              />
                              <input
                                type="hidden"
                                name="moduleId"
                                value={module.id}
                              />
                              <input
                                name="title"
                                defaultValue={module.title}
                                className="input h-9 text-[11px]"
                                aria-label="Module title"
                                required
                              />
                              <textarea
                                name="summary"
                                defaultValue={module.summary ?? ""}
                                rows={2}
                                className="input resize-y text-[11px]"
                                placeholder="Module summary"
                                aria-label="Module summary"
                              />
                              <button
                                type="submit"
                                className={buttonStyles({
                                  variant: "outline",
                                  size: "sm",
                                })}
                              >
                                Save module
                              </button>
                            </form>
                          </details>
                          <ConfirmForm
                            action={deleteModuleAction}
                            message={`Delete "${module.title}" and its ${module.lessons.length} lesson${
                              module.lessons.length === 1 ? "" : "s"
                            }?`}
                            hiddenFields={{
                              moduleId: module.id,
                              courseId: course.id,
                            }}
                            className="px-1.5 py-1 [&_svg]:h-2.5 [&_svg]:w-2.5"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                            Delete module
                          </ConfirmForm>
                        </div>
                      </div>
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
                  Assessments
                </h2>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  Checkpoints that verify the skills this course teaches.
                </p>
              </div>
              <Link
                href={`/dashboard/assessments/new?courseId=${course.id}`}
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                New
              </Link>
            </div>

            {assessments.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  icon={FileCheck2}
                  title="No assessments yet"
                  description="Add a quiz or exam to turn this curriculum into measurable capability."
                  action={
                    <Link
                      href={`/dashboard/assessments/new?courseId=${course.id}`}
                      className={buttonStyles({ variant: "primary", size: "sm" })}
                    >
                      Create an assessment
                    </Link>
                  }
                  className="py-8"
                />
              </div>
            ) : (
              <div className="divide-y divide-mist-100">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
                      <FileCheck2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-bold text-ink-900">
                        {assessment.title}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-400">
                        {assessment.type} · {assessment.question_count} questions ·{" "}
                        {assessment.duration_minutes} min ·{" "}
                        {assessment.attempt_count ?? 0} submissions
                      </p>
                    </div>
                    <StatusBadge status={assessment.status} />
                    <Link
                      href={`/dashboard/assessments/${assessment.id}/edit`}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
                    >
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <section className="card overflow-hidden">
            <div className="border-b border-mist-100 bg-ink-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                  Visibility
                </p>
                <StatusBadge status={course.status} />
              </div>
              <p className="mt-3 font-display text-[17px] font-semibold leading-snug">
                {course.status === "published"
                  ? "Open for enrollment"
                  : course.status === "draft"
                    ? "Private draft"
                    : "Archived course"}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-5 text-slate-400">
                {course.status === "published"
                  ? "Learners can discover this course in the catalog and enroll."
                  : course.status === "draft"
                    ? "Only you and administrators can preview this course."
                    : "Hidden from the catalog. Existing learner records are preserved."}
              </p>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-xl bg-mist-50 p-3.5">
                <p className="text-[10px] font-semibold text-slate-500">
                  Publish checklist
                </p>
                <div className="mt-2 space-y-1.5">
                  <span className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
                        lessonCount > 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-mist-200 text-slate-400"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    At least one lesson
                  </span>
                  <span className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
                        outcomes.length > 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-mist-200 text-slate-400"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    Learning outcomes
                  </span>
                  <span className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
                        assessments.length > 0
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-mist-200 text-slate-400"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    Assessment checkpoint{" "}
                    <span className="text-slate-300">(optional)</span>
                  </span>
                </div>
              </div>

              {course.status !== "published" && (
                <form action={updateCourseStatusAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="status" value="published" />
                  <button
                    type="submit"
                    disabled={lessonCount === 0}
                    className={buttonStyles({
                      variant: "accent",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Publish course
                  </button>
                </form>
              )}
              {course.status === "published" && (
                <form action={updateCourseStatusAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="status" value="draft" />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "outline",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    Unpublish to draft
                  </button>
                </form>
              )}
              {course.status !== "archived" && (
                <form action={updateCourseStatusAction}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input type="hidden" name="status" value="archived" />
                  <button
                    type="submit"
                    className={buttonStyles({
                      variant: "ghost",
                      size: "md",
                      className: "w-full",
                    })}
                  >
                    <Archive className="h-4 w-4" />
                    Archive course
                  </button>
                </form>
              )}
              {course.status === "archived" && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-4 text-amber-800">
                  Archived courses keep their students, progress, and
                  certificates. Restore to draft to continue editing in public.
                </p>
              )}
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[14px] font-semibold text-ink-950">
                Course pulse
              </h2>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
                <BarChart3 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-mist-50 p-3">
                <p className="font-display text-xl font-semibold text-ink-950">
                  {enrollments.length}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">Enrolled</p>
              </div>
              <div className="rounded-xl bg-mist-50 p-3">
                <p className="font-display text-xl font-semibold text-ink-950">
                  {enrollments.length > 0
                    ? Math.round((completed / enrollments.length) * 100)
                    : 0}
                  %
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">Completion</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 border-t border-mist-100 pt-3 text-[9.5px] text-slate-400">
              <p className="flex items-center justify-between">
                <span>Created</span>
                <span className="font-semibold text-slate-600">
                  {formatDate(course.created_at)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Updated</span>
                <span className="font-semibold text-slate-600">
                  {formatDate(course.updated_at)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Instructor</span>
                <span className="max-w-[150px] truncate font-semibold text-slate-600">
                  {course.instructor_name}
                </span>
              </p>
            </div>
            <Link
              href={`/dashboard/courses/${course.id}/students`}
              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-electric-600 hover:text-electric-700"
            >
              Manage students
              <ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          <section className="rounded-2xl border border-coral-200 bg-coral-50/60 p-4">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-coral-800">
              <Trash2 className="h-3.5 w-3.5" />
              Delete course
            </p>
            <p className="mt-1 text-[10px] leading-4 text-coral-700/80">
              {enrollments.length > 0
                ? `This course has ${enrollments.length} enrolled student${
                    enrollments.length === 1 ? "" : "s"
                  }. Archive it instead to preserve their progress.`
                : "This permanently removes the course, curriculum, and assessments. This cannot be undone."}
            </p>
            {enrollments.length === 0 ? (
              <ConfirmForm
                action={deleteCourseAction}
                message="Delete this course, its modules, lessons, and assessments?"
                className="mt-3 w-full"
                hiddenFields={{ courseId: course.id }}
              >
                <Trash2 className="h-3 w-3" />
                Delete permanently
              </ConfirmForm>
            ) : (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1.5 text-[9px] font-semibold text-coral-700">
                <AlertCircle className="h-3 w-3" />
                Deletion locked while students are enrolled
              </span>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-electric-500 text-white">
      <Check className="h-2.5 w-2.5" strokeWidth={3} />
    </span>
  );
}
