"use client";

import { useActionState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileCheck2,
  Sparkles,
  Target,
} from "lucide-react";
import {
  createAssessmentAction,
  type AssessmentFormState,
} from "@/lib/actions/assessments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const initialState: AssessmentFormState = {};

type CourseOption = {
  id: string;
  title: string;
  cover: string;
  status: string;
};

export function AssessmentCreateForm({
  courses,
  preselectedCourseId,
}: {
  courses: CourseOption[];
  preselectedCourseId?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createAssessmentAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-3 text-[12px] text-coral-800">
          {state.error}
        </div>
      )}

      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
            <BookOpen className="h-4 w-4" />
          </span>
          <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
            Assessment basics
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="courseId" className="label">
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              defaultValue={preselectedCourseId ?? courses[0]?.id ?? ""}
              className="input h-11 cursor-pointer"
              required
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.status !== "published" ? "(draft)" : ""}
                </option>
              ))}
            </select>
            {state.fieldErrors?.courseId && (
              <p className="mt-1.5 text-[11px] text-coral-600">
                {state.fieldErrors.courseId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="title" className="label">
              Assessment title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. JavaScript Foundations Check"
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
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What will this assessment check, and how should students prepare?"
              className="input resize-y"
            />
            {state.fieldErrors?.description && (
              <p className="mt-1.5 text-[11px] text-coral-600">
                {state.fieldErrors.description}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="type" className="label">
                Type
              </label>
              <select id="type" name="type" className="input h-11 cursor-pointer">
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration" className="label">
                Time limit (min)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min={5}
                max={180}
                defaultValue={15}
                className="input h-11"
                required
              />
              {state.fieldErrors?.duration && (
                <p className="mt-1.5 text-[11px] text-coral-600">
                  {state.fieldErrors.duration}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="passScore" className="label">
                Pass score (%)
              </label>
              <input
                id="passScore"
                name="passScore"
                type="number"
                min={1}
                max={100}
                defaultValue={70}
                className="input h-11"
                required
              />
              {state.fieldErrors?.passScore && (
                <p className="mt-1.5 text-[11px] text-coral-600">
                  {state.fieldErrors.passScore}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-mist-200 bg-white p-5 sm:flex-row sm:items-center">
        <p className="max-w-md text-[11px] leading-5 text-slate-500">
          The assessment starts as a draft. You will add questions in the
          studio, then publish it for students.
        </p>
        <Button type="submit" size="md" loading={isPending}>
          {isPending ? "Creating…" : "Create assessment"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
