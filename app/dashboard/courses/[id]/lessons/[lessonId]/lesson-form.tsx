"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FlaskConical,
  PencilLine,
  Save,
  Video,
} from "lucide-react";
import {
  updateLessonAction,
  type LessonFormState,
} from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

const initialState: LessonFormState = {};

const kinds = [
  { value: "reading", label: "Reading", icon: BookOpen },
  { value: "video", label: "Video", icon: Video },
  { value: "lab", label: "Lab", icon: FlaskConical },
] as const;

export function LessonForm({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    kind: "reading" | "video" | "lab";
    duration_minutes: number;
  };
}) {
  const [state, formAction, isPending] = useActionState(
    updateLessonAction,
    initialState,
  );
  const [kind, setKind] = useState(lesson.kind);
  const [content, setContent] = useState(lesson.content);

  return (
    <form action={formAction}>
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lesson.id} />
      <input type="hidden" name="kind" value={kind} />

      {state.error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-[12px] text-coral-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.success}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px] xl:items-start">
        <div className="min-w-0 space-y-5">
          <section className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
                <PencilLine className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Lesson details
                </h2>
                <p className="text-[10px] text-slate-400">
                  Set the title, format, and the summary students see first.
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <label htmlFor="title" className="label">
                  Lesson title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={lesson.title}
                  className="input h-11"
                  required
                />
              </div>

              <div>
                <label htmlFor="summary" className="label">
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={2}
                  defaultValue={lesson.summary ?? ""}
                  placeholder="One or two sentences that set up the lesson."
                  className="input resize-y"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                <div>
                  <p className="label">Format</p>
                  <div className="grid grid-cols-3 gap-2">
                    {kinds.map((item) => {
                      const Icon = item.icon;
                      const active = kind === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setKind(item.value)}
                          className={cn(
                            "focus-ring flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10.5px] font-semibold transition",
                            active
                              ? "border-ink-950 bg-ink-950 text-white"
                              : "border-mist-200 bg-white text-slate-500 hover:border-mist-300 hover:text-ink-900",
                          )}
                          aria-pressed={active}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label htmlFor="duration" className="label">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      Minutes
                    </span>
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min={1}
                    max={240}
                    defaultValue={lesson.duration_minutes}
                    className="input h-11"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-mist-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
                  Lesson content
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Markdown supported: headings, lists, tables, code blocks, and
                  callouts.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start rounded-lg bg-mist-100 px-2.5 py-1 font-mono text-[9px] font-semibold text-slate-500">
                <PencilLine className="h-3 w-3" />
                MARKDOWN
              </span>
            </div>

            <div className="grid lg:grid-cols-2">
              <div className="border-b border-mist-100 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 border-b border-mist-100 bg-mist-50/60 px-4 py-2">
                  <PencilLine className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Write
                  </span>
                </div>
                <textarea
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={28}
                  className="min-h-[520px] w-full resize-y border-0 bg-white px-5 py-4 font-mono text-[12px] leading-6 text-ink-800 outline-none placeholder:text-slate-400 focus:ring-0"
                  placeholder={"## Lesson heading\n\nStart writing here…\n\n- A key idea\n- Another idea\n\n> A useful callout."}
                  required
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 border-b border-mist-100 bg-mist-50/60 px-4 py-2">
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Preview
                  </span>
                </div>
                <div className="max-h-[560px] overflow-y-auto px-5 py-4 sm:px-6">
                  {content.trim() ? (
                    <Markdown content={content} />
                  ) : (
                    <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-mist-200 text-center">
                      <div>
                        <BookOpen className="mx-auto h-6 w-6 text-slate-300" />
                        <p className="mt-2 text-[11px] text-slate-400">
                          Your formatted lesson will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px]">
          <section className="rounded-2xl border border-mist-200 bg-ink-950 p-5 text-white shadow-soft">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
              Writing notes
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Lead with the problem, not the syntax.",
                "Keep one lesson focused on one useful idea.",
                "Use a lab when students need to practise.",
                "End with a clear takeaway or next step.",
              ].map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2 text-[10.5px] leading-4 text-slate-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lime-300" />
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-[14px] font-semibold text-ink-950">
              Lesson snapshot
            </h2>
            <div className="mt-3 space-y-2 text-[10px]">
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Words</span>
                <span className="font-semibold text-ink-800">
                  {content.trim()
                    ? content.trim().split(/\s+/).length.toLocaleString()
                    : 0}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Format</span>
                <span className="font-semibold capitalize text-ink-800">
                  {kind}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Characters</span>
                <span className="font-semibold text-ink-800">
                  {content.length.toLocaleString()}
                </span>
              </p>
            </div>
          </section>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-mist-200 bg-white p-4">
            <p className="text-[10px] leading-4 text-slate-400">
              Saving updates the live lesson immediately.
            </p>
            <Button type="submit" size="md" loading={isPending} className="shrink-0">
              {!isPending && <Save className="h-4 w-4" />}
              {isPending ? "Saving…" : "Save lesson"}
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}
