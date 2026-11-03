"use client";

import { useActionState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Layers3,
  Palette,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { CourseFormState } from "@/lib/actions/courses";
import { COURSE_COVERS, COURSE_LEVELS, IT_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: CourseFormState = {};

export function CourseForm({
  action,
  mode,
  course,
  instructors,
  isAdmin,
}: {
  action: (
    state: CourseFormState,
    formData: FormData,
  ) => Promise<CourseFormState>;
  mode: "create" | "edit";
  course?: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    duration_hours: number;
    cover: string;
    outcomes: string[];
    requirements: string[];
    instructor_id: string;
  };
  instructors: {
    id: string;
    name: string;
    role: "admin" | "instructor";
    email: string;
  }[];
  isAdmin: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {course && <input type="hidden" name="courseId" value={course.id} />}

      {state.error && (
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-[12px] text-coral-800">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.success}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-5">
          <section className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Course identity
                </h2>
                <p className="text-[10px] text-slate-400">
                  A clear promise helps the right learners find you.
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <label htmlFor="title" className="label">
                  Course title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={course?.title}
                  placeholder="e.g. Modern JavaScript Foundations"
                  className="input h-11"
                  required
                />
                {state.fieldErrors?.title && (
                  <p className="mt-1.5 text-[11px] text-coral-600">
                    {state.fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subtitle" className="label">
                  Subtitle
                </label>
                <input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  defaultValue={course?.subtitle}
                  placeholder="One sentence that captures the transformation."
                  className="input h-11"
                  required
                />
                {state.fieldErrors?.subtitle && (
                  <p className="mt-1.5 text-[11px] text-coral-600">
                    {state.fieldErrors.subtitle}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Full description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  defaultValue={course?.description}
                  placeholder="What will students learn, build, and be able to do? Write for a curious person deciding where to invest their time."
                  className="input resize-y"
                  required
                />
                {state.fieldErrors?.description && (
                  <p className="mt-1.5 text-[11px] text-coral-600">
                    {state.fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="category" className="label">
                    IT category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={course?.category ?? IT_CATEGORIES[0]}
                    className="input h-11 cursor-pointer"
                  >
                    {IT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors?.category && (
                    <p className="mt-1.5 text-[11px] text-coral-600">
                      {state.fieldErrors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="level" className="label">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    defaultValue={course?.level ?? "Beginner"}
                    className="input h-11 cursor-pointer"
                  >
                    {COURSE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors?.level && (
                    <p className="mt-1.5 text-[11px] text-coral-600">
                      {state.fieldErrors.level}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="duration" className="label">
                    Duration (hours)
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min={1}
                    max={200}
                    defaultValue={course?.duration_hours ?? 12}
                    className="input h-11"
                    required
                  />
                  {state.fieldErrors?.duration && (
                    <p className="mt-1.5 text-[11px] text-coral-600">
                      {state.fieldErrors.duration}
                    </p>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div>
                  <label htmlFor="instructorId" className="label">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="h-3.5 w-3.5 text-slate-400" />
                      Instructor
                    </span>
                  </label>
                  <select
                    id="instructorId"
                    name="instructorId"
                    defaultValue={course?.instructor_id ?? instructors[0]?.id}
                    className="input h-11 cursor-pointer"
                  >
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ·{" "}
                        {instructor.role === "instructor"
                          ? "Instructor"
                          : "Administrator"}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors?.instructorId && (
                    <p className="mt-1.5 text-[11px] text-coral-600">
                      {state.fieldErrors.instructorId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-50 text-lime-700">
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Outcomes & requirements
                </h2>
                <p className="text-[10px] text-slate-400">
                  One item per line. Keep each outcome concrete and testable.
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label htmlFor="outcomes" className="label">
                  Learning outcomes
                </label>
                <textarea
                  id="outcomes"
                  name="outcomes"
                  rows={8}
                  defaultValue={course?.outcomes.join("\n")}
                  placeholder={
                    "Build accessible interfaces with modern React\nDesign and query a relational data model\nDebug a production issue with confidence"
                  }
                  className="input resize-y font-mono text-[12px] leading-6"
                  required
                />
                {state.fieldErrors?.outcomes && (
                  <p className="mt-1.5 text-[11px] text-coral-600">
                    {state.fieldErrors.outcomes}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="requirements" className="label">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={8}
                  defaultValue={course?.requirements.join("\n")}
                  placeholder={
                    "Comfort using a code editor\nA laptop with Node.js installed\nCuriosity and consistent practice"
                  }
                  className="input resize-y font-mono text-[12px] leading-6"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <section className="card p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
                <Palette className="h-4 w-4" />
              </span>
              <h2 className="font-display text-[15px] font-semibold text-ink-950">
                Cover theme
              </h2>
            </div>
            <p className="mt-2 text-[10.5px] leading-5 text-slate-500">
              Every course cover is generated from a theme — no stock images,
              just a consistent visual language.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {COURSE_COVERS.map((cover) => (
                <label
                  key={cover.value}
                  className="focus-within:ring-2 focus-within:ring-electric-400 focus-within:ring-offset-2 cursor-pointer rounded-xl"
                >
                  <input
                    type="radio"
                    name="cover"
                    value={cover.value}
                    defaultChecked={
                      course ? course.cover === cover.value : cover.value === "ocean"
                    }
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "relative block h-16 overflow-hidden rounded-xl bg-gradient-to-br ring-offset-2 transition",
                      cover.gradient,
                      "peer-checked:ring-2 peer-checked:ring-ink-950",
                    )}
                  >
                    <span className="absolute inset-0 bg-grid-dark bg-[size:16px_16px] opacity-50" />
                    <span className="absolute bottom-1.5 left-2 font-mono text-[8px] font-semibold uppercase tracking-wider text-white/85">
                      {cover.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {state.fieldErrors?.cover && (
              <p className="mt-2 text-[11px] text-coral-600">
                {state.fieldErrors.cover}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-mist-200 bg-ink-950 p-5 text-white shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                Studio notes
              </p>
              <Sparkles className="h-4 w-4 text-lime-300" />
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "Strong subtitles name the learner and the outcome.",
                "Outcomes should describe work, not just topics.",
                "You can save a draft at any time.",
                "Publishing requires at least one lesson.",
              ].map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2 text-[10.5px] leading-4 text-slate-400"
                >
                  <Layers3 className="mt-0.5 h-3 w-3 shrink-0 text-lime-300" />
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-mist-200 bg-white p-4">
            <p className="text-[10px] leading-4 text-slate-400">
              {mode === "create"
                ? "The course starts as a draft. Add curriculum next."
                : "Changes take effect immediately."}
            </p>
            <Button type="submit" size="md" loading={isPending} className="shrink-0">
              {isPending
                ? "Saving…"
                : mode === "create"
                  ? "Create course"
                  : "Save changes"}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}
