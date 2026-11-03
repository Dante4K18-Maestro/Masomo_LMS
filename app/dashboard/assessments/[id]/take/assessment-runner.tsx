"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  Send,
  ShieldCheck,
  Timer,
  X,
} from "lucide-react";
import { submitAssessmentAction } from "@/lib/actions/assessments";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type RunnerQuestion = {
  id: string;
  prompt: string;
  points: number;
  type: "multiple_choice" | "true_false";
  options: { id: string; label: string }[];
};

export function AssessmentRunner({
  assessmentId,
  title,
  courseTitle,
  questions,
  remainingSeconds,
}: {
  assessmentId: string;
  title: string;
  courseTitle: string;
  questions: RunnerQuestion[];
  remainingSeconds: number;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [remaining, setRemaining] = useState(Math.max(0, remainingSeconds));
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const answeredCount = Object.keys(answers).length;
  const question = questions[current];
  const progress = (answeredCount / questions.length) * 100;

  const submit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      setAutoSubmitting(auto);
      setError(null);
      try {
        const result = await submitAssessmentAction(
          assessmentId,
          answersRef.current,
        );
        if (result.error) {
          setError(result.error);
          submittedRef.current = false;
          setSubmitting(false);
          setAutoSubmitting(false);
          return;
        }
        router.push(
          `/dashboard/assessments/${assessmentId}/results/${result.attemptId}`,
        );
        router.refresh();
      } catch {
        setError("Something went wrong while submitting. Please try again.");
        submittedRef.current = false;
        setSubmitting(false);
        setAutoSubmitting(false);
        setShowConfirm(true);
      }
    },
    [assessmentId, router],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          if (!submittedRef.current) {
            void submit(true);
          }
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submit]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!submittedRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const urgent = remaining <= 60;

  const selectAnswer = (optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: optionId,
    }));
  };

  const toggleFlag = () => {
    setFlagged((currentFlags) => {
      const next = new Set(currentFlags);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  };

  const flaggedCount = useMemo(() => flagged.size, [flagged]);

  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col gap-3 border-b border-mist-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mist-200 bg-white text-slate-500 transition hover:border-mist-300 hover:text-ink-900"
            aria-label="Back to assessment details"
            disabled={submitting}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {courseTitle}
            </p>
            <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink-950">
              {title}
            </h1>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2.5 self-start rounded-xl border px-3.5 py-2 sm:self-auto",
            urgent
              ? "border-coral-200 bg-coral-50 text-coral-700"
              : "border-mist-200 bg-white text-ink-800",
          )}
          role="timer"
          aria-live={urgent ? "polite" : "off"}
        >
          <Timer className={cn("h-4 w-4", urgent && "animate-pulse")} />
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-wider opacity-60">
              Time remaining
            </p>
            <p className="font-mono text-[15px] font-bold leading-tight">
              {timeLabel}
            </p>
          </div>
        </div>
      </div>

      {autoSubmitting && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900">
          <Loader2 className="h-4 w-4 animate-spin" />
          Time is up. Submitting your answers…
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-[12px] text-coral-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-coral-500 hover:text-coral-700"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-soft">
          <div className="border-b border-mist-100 px-5 py-4 sm:px-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  QUESTION {String(current + 1).padStart(2, "0")} /{" "}
                  {String(questions.length).padStart(2, "0")}
                </span>
                <Badge tone="neutral">{question.points} pts</Badge>
              </div>
              <button
                type="button"
                onClick={toggleFlag}
                className={cn(
                  "focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold transition",
                  flagged.has(question.id)
                    ? "bg-amber-50 text-amber-700"
                    : "text-slate-400 hover:bg-mist-50 hover:text-slate-600",
                )}
              >
                <Flag
                  className={cn(
                    "h-3 w-3",
                    flagged.has(question.id) && "fill-amber-400 text-amber-500",
                  )}
                />
                {flagged.has(question.id) ? "Flagged" : "Flag for review"}
              </button>
            </div>
            <ProgressBar
              value={progress}
              size="sm"
              className="mt-3 bg-mist-100"
              barClassName="bg-lime-400"
              label="Questions answered"
            />
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <h2 className="font-display text-[23px] font-semibold leading-snug tracking-[-0.025em] text-ink-950 sm:text-[27px]">
              {question.prompt}
            </h2>
            <p className="mt-2 text-[11px] text-slate-400">
              Select one answer, then use Next to continue.
            </p>

            <div className="mt-6 space-y-2.5" role="radiogroup" aria-label="Answer options">
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "group flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition",
                      selected
                        ? "border-electric-400 bg-electric-50/60 ring-2 ring-electric-100"
                        : "border-mist-200 bg-white hover:border-mist-300 hover:bg-mist-50/60",
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={selected}
                      onChange={() => selectAnswer(option.id)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold transition",
                        selected
                          ? "border-electric-500 bg-electric-500 text-white"
                          : "border-mist-300 bg-white text-slate-400 group-hover:border-mist-400",
                      )}
                    >
                      {selected ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span
                      className={cn(
                        "pt-0.5 text-[13px] leading-6",
                        selected ? "font-semibold text-ink-900" : "text-slate-600",
                      )}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-mist-100 bg-mist-50/50 px-5 py-4 sm:px-7">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
              disabled={current === 0}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] text-slate-400 sm:inline">
                {answeredCount} of {questions.length} answered
              </span>
              {current < questions.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    setCurrent((value) =>
                      Math.min(questions.length - 1, value + 1),
                    )
                  }
                >
                  Next question
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={() => setShowConfirm(true)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Review & submit
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-ink-950">
                Question navigator
              </p>
              <span className="font-mono text-[9px] text-slate-400">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {questions.map((item, index) => {
                const answered = Boolean(answers[item.id]);
                const isFlagged = flagged.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "focus-ring relative grid aspect-square place-items-center rounded-lg border text-[10px] font-bold transition",
                      index === current
                        ? "border-ink-950 bg-ink-950 text-white"
                        : answered
                          ? "border-electric-200 bg-electric-50 text-electric-700 hover:border-electric-300"
                          : "border-mist-200 bg-white text-slate-400 hover:border-mist-300",
                    )}
                    aria-label={`Go to question ${index + 1}${
                      answered ? ", answered" : ", unanswered"
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-mist-100 pt-4 text-[9px] text-slate-400">
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-electric-400" />
                Answered
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Flagged for review
              </p>
            </div>

            <Button
              type="button"
              variant="accent"
              className="mt-4 w-full"
              onClick={() => setShowConfirm(true)}
            >
              <Send className="h-4 w-4" />
              Submit assessment
            </Button>
          </div>

          <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-soft">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-[9.5px] leading-4 text-slate-500">
                Your answers stay private. If you run out of time, the
                assessment submits automatically.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-950/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-mist-100 p-5">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Before you submit
                </p>
                <h2
                  id="submit-title"
                  className="mt-1 font-display text-xl font-semibold tracking-tight text-ink-950"
                >
                  Ready to finish?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="focus-ring grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-mist-100 hover:text-slate-700"
                aria-label="Close"
                disabled={submitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-mist-50 p-3 text-center">
                  <p className="font-display text-xl font-semibold text-ink-950">
                    {answeredCount}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">Answered</p>
                </div>
                <div className="rounded-xl bg-mist-50 p-3 text-center">
                  <p className="font-display text-xl font-semibold text-ink-950">
                    {questions.length - answeredCount}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-500">Unanswered</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-center">
                  <p className="font-display text-xl font-semibold text-amber-700">
                    {flaggedCount}
                  </p>
                  <p className="mt-0.5 text-[9px] text-amber-600">Flagged</p>
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                Unanswered questions are marked incorrect. You can retake the
                assessment later, but this attempt cannot be reopened after
                submission.
              </p>
              {error && (
                <p className="mt-3 rounded-lg bg-coral-50 p-2.5 text-[10px] text-coral-700">
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2 border-t border-mist-100 bg-mist-50/60 p-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                Keep reviewing
              </Button>
              <Button
                type="button"
                variant="electric"
                className="flex-1"
                onClick={() => void submit(false)}
                loading={submitting}
              >
                <CheckCircle2 className="h-4 w-4" />
                {submitting ? "Submitting…" : "Submit now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
