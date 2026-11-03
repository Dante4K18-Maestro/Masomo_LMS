"use client";

import { useActionState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock3,
  Target,
} from "lucide-react";
import {
  updateAssessmentAction,
  type AssessmentFormState,
} from "@/lib/actions/assessments";
import { Button } from "@/components/ui/button";

const initialState: AssessmentFormState = {};

export function AssessmentEditForm({
  assessment,
}: {
  assessment: {
    id: string;
    title: string;
    description: string;
    type: "quiz" | "exam" | "assignment";
    duration_minutes: number;
    pass_score: number;
  };
}) {
  const [state, formAction, isPending] = useActionState(
    updateAssessmentAction,
    initialState,
  );

  return (
    <form action={formAction} className="card overflow-hidden">
      <input type="hidden" name="assessmentId" value={assessment.id} />

      <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
          <FileText className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
            Assessment details
          </h2>
          <p className="text-[10px] text-slate-400">
            The information students see before they begin.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {state.error && (
          <div className="rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-3 text-[12px] text-coral-800">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[12px] text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {state.success}
          </div>
        )}

        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={assessment.title}
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
            rows={4}
            defaultValue={assessment.description}
            className="input resize-y"
            placeholder="What will this check, and how should students prepare?"
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
            <select
              id="type"
              name="type"
              defaultValue={assessment.type}
              className="input h-11 cursor-pointer"
            >
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="label">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                Time limit (min)
              </span>
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min={5}
              max={180}
              defaultValue={assessment.duration_minutes}
              className="input h-11"
            />
            {state.fieldErrors?.duration && (
              <p className="mt-1.5 text-[11px] text-coral-600">
                {state.fieldErrors.duration}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="passScore" className="label">
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-slate-400" />
                Pass score (%)
              </span>
            </label>
            <input
              id="passScore"
              name="passScore"
              type="number"
              min={1}
              max={100}
              defaultValue={assessment.pass_score}
              className="input h-11"
            />
            {state.fieldErrors?.passScore && (
              <p className="mt-1.5 text-[11px] text-coral-600">
                {state.fieldErrors.passScore}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-mist-100 bg-mist-50/50 px-5 py-3.5 sm:px-6">
        <Button type="submit" size="md" loading={isPending}>
          Save details
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
