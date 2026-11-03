"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  GripVertical,
  ListChecks,
  LockKeyhole,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  saveQuestionsAction,
  type AssessmentQuestionInput,
} from "@/lib/actions/assessments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BuilderQuestion = AssessmentQuestionInput & { key: string };

function newQuestion(index: number): BuilderQuestion {
  return {
    key: `new-${Date.now()}-${index}`,
    prompt: "",
    type: "multiple_choice",
    points: 10,
    options: ["", "", ""],
    correct: 0,
  };
}

function normalise(
  questions: AssessmentQuestionInput[],
): BuilderQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    options: question.options.length > 0 ? question.options : ["", ""],
    key: `question-${index}-${question.prompt.slice(0, 12)}`,
  }));
}

export function QuestionBuilder({
  assessmentId,
  initialQuestions,
  locked,
  attemptCount,
}: {
  assessmentId: string;
  initialQuestions: AssessmentQuestionInput[];
  locked: boolean;
  attemptCount: number;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<BuilderQuestion[]>(() =>
    normalise(initialQuestions),
  );
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalPoints = useMemo(
    () => questions.reduce((sum, question) => sum + (question.points || 0), 0),
    [questions],
  );

  function updateQuestion(
    index: number,
    patch: Partial<BuilderQuestion>,
  ) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question,
      ),
    );
    setSuccess(null);
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question;
        return {
          ...question,
          options: question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex ? value : option,
          ),
        };
      }),
    );
    setSuccess(null);
  }

  function addOption(questionIndex: number) {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex
          ? { ...question, options: [...question.options, ""] }
          : question,
      ),
    );
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex || question.options.length <= 2) {
          return question;
        }
        const options = question.options.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex,
        );
        let correct = question.correct;
        if (optionIndex === question.correct) correct = 0;
        else if (optionIndex < question.correct) correct -= 1;
        return { ...question, options, correct };
      }),
    );
  }

  function setType(questionIndex: number, type: "multiple_choice" | "true_false") {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question;
        if (type === "true_false") {
          return {
            ...question,
            type,
            options: ["True", "False"],
            correct: question.correct === 1 ? 1 : 0,
          };
        }
        return {
          ...question,
          type,
          options:
            question.options.length >= 2 ? question.options : ["", "", ""],
          correct: 0,
        };
      }),
    );
  }

  function addQuestion() {
    setQuestions((current) => [...current, newQuestion(current.length)]);
    setSuccess(null);
  }

  function removeQuestion(questionIndex: number) {
    setQuestions((current) =>
      current.filter((_, index) => index !== questionIndex),
    );
    setSuccess(null);
  }

  function moveQuestion(questionIndex: number, direction: -1 | 1) {
    setQuestions((current) => {
      const target = questionIndex + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[questionIndex], next[target]] = [next[target], next[questionIndex]];
      return next;
    });
    setSuccess(null);
  }

  function toggleCollapsed(key: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: AssessmentQuestionInput[] = questions.map((question) => ({
        prompt: question.prompt,
        type: question.type,
        points: Number(question.points),
        options: question.options,
        correct: question.correct,
      }));
      const result = await saveQuestionsAction(assessmentId, payload);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(result.success ?? "Questions saved.");
      router.refresh();
    } catch {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-mist-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
            <ListChecks className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
              Question builder
            </h2>
            <p className="text-[10px] text-slate-400">
              {questions.length} question{questions.length === 1 ? "" : "s"} ·{" "}
              {totalPoints} point{totalPoints === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {locked ? (
          <Badge tone="amber">
            <LockKeyhole className="h-3 w-3" />
            Locked after {attemptCount} attempt{attemptCount === 1 ? "" : "s"}
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="h-3.5 w-3.5" />
              Add question
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={saving}
              onClick={save}
              disabled={questions.length === 0}
            >
              {!saving && <Save className="h-3.5 w-3.5" />}
              Save questions
            </Button>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {locked && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-[11px] leading-5 text-amber-900">
            Students have already started this assessment, so the question set is
            locked to protect their results. You can still edit the title,
            timing, and pass mark. Create a new assessment to use a different
            question set.
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-3 text-[11px] leading-5 text-coral-800">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-coral-500 hover:text-coral-700"
              aria-label="Dismiss error"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[11px] text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </div>
        )}

        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-mist-300 px-5 py-10 text-center">
            <ListChecks className="mx-auto h-7 w-7 text-slate-300" />
            <p className="mt-3 text-[12px] font-semibold text-ink-800">
              No questions yet
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Add your first question to bring this assessment to life.
            </p>
            {!locked && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="mt-4"
              >
                <Plus className="h-3.5 w-3.5" />
                Add question
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, questionIndex) => {
              const isCollapsed = collapsed.has(question.key);
              return (
                <div
                  key={question.key}
                  className="overflow-hidden rounded-xl border border-mist-200 bg-white"
                >
                  <div className="flex items-center gap-2 border-b border-mist-100 bg-mist-50/60 px-3.5 py-2.5">
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink-950 font-mono text-[9px] font-bold text-lime-300">
                      {String(questionIndex + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(question.key)}
                      className="min-w-0 flex-1 truncate text-left text-[11.5px] font-semibold text-ink-800"
                    >
                      {question.prompt.trim() ||
                        `Question ${questionIndex + 1}`}
                    </button>
                    <span className="hidden text-[9px] font-medium text-slate-400 sm:inline">
                      {question.points} pts
                    </span>
                    {!locked && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveQuestion(questionIndex, -1)}
                          disabled={questionIndex === 0}
                          className="focus-ring grid h-6 w-6 place-items-center rounded text-slate-400 transition hover:bg-white hover:text-ink-800 disabled:opacity-30"
                          aria-label="Move question up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(questionIndex, 1)}
                          disabled={questionIndex === questions.length - 1}
                          className="focus-ring grid h-6 w-6 place-items-center rounded text-slate-400 transition hover:bg-white hover:text-ink-800 disabled:opacity-30"
                          aria-label="Move question down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="focus-ring grid h-6 w-6 place-items-center rounded text-slate-400 transition hover:bg-coral-50 hover:text-coral-600"
                          aria-label="Delete question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(question.key)}
                      className="focus-ring grid h-6 w-6 place-items-center rounded text-slate-400 hover:bg-white hover:text-ink-800"
                      aria-label={isCollapsed ? "Expand question" : "Collapse question"}
                    >
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition",
                          isCollapsed && "-rotate-90",
                        )}
                      />
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-4 p-4">
                      <div>
                        <label
                          htmlFor={`prompt-${question.key}`}
                          className="label"
                        >
                          Prompt
                        </label>
                        <textarea
                          id={`prompt-${question.key}`}
                          value={question.prompt}
                          onChange={(event) =>
                            updateQuestion(questionIndex, {
                              prompt: event.target.value,
                            })
                          }
                          rows={2}
                          disabled={locked}
                          className="input resize-y text-[13px]"
                          placeholder="Ask a clear, specific question…"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`type-${question.key}`}
                            className="label"
                          >
                            Answer type
                          </label>
                          <select
                            id={`type-${question.key}`}
                            value={question.type}
                            disabled={locked}
                            onChange={(event) =>
                              setType(
                                questionIndex,
                                event.target.value as
                                  | "multiple_choice"
                                  | "true_false",
                              )
                            }
                            className="input h-10 cursor-pointer text-[12px]"
                          >
                            <option value="multiple_choice">
                              Multiple choice
                            </option>
                            <option value="true_false">True / false</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor={`points-${question.key}`}
                            className="label"
                          >
                            Points
                          </label>
                          <input
                            id={`points-${question.key}`}
                            type="number"
                            min={1}
                            max={100}
                            value={question.points}
                            disabled={locked}
                            onChange={(event) =>
                              updateQuestion(questionIndex, {
                                points: Number(event.target.value),
                              })
                            }
                            className="input h-10 text-[12px]"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="label">Answers</p>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const correct = question.correct === optionIndex;
                            return (
                              <div
                                key={`${question.key}-option-${optionIndex}`}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition",
                                  correct
                                    ? "border-emerald-300 bg-emerald-50/60"
                                    : "border-mist-200 bg-white",
                                )}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuestion(questionIndex, {
                                      correct: optionIndex,
                                    })
                                  }
                                  disabled={locked}
                                  className={cn(
                                    "focus-ring grid h-5 w-5 shrink-0 place-items-center rounded-full border transition",
                                    correct
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-mist-300 bg-white text-transparent hover:border-emerald-300",
                                  )}
                                  aria-label={`Mark answer ${optionIndex + 1} correct`}
                                >
                                  <Check className="h-3 w-3" strokeWidth={3} />
                                </button>
                                <input
                                  value={option}
                                  onChange={(event) =>
                                    updateOption(
                                      questionIndex,
                                      optionIndex,
                                      event.target.value,
                                    )
                                  }
                                  disabled={locked}
                                  className="h-8 min-w-0 flex-1 bg-transparent text-[12px] text-ink-800 outline-none placeholder:text-slate-400"
                                  placeholder={`Answer ${optionIndex + 1}`}
                                  aria-label={`Answer ${optionIndex + 1}`}
                                  readOnly={question.type === "true_false"}
                                />
                                {!locked &&
                                  question.type === "multiple_choice" &&
                                  question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeOption(questionIndex, optionIndex)
                                      }
                                      className="focus-ring grid h-5 w-5 place-items-center rounded text-slate-300 transition hover:bg-coral-50 hover:text-coral-500"
                                      aria-label="Remove answer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                              </div>
                            );
                          })}
                        </div>

                        {!locked && question.type === "multiple_choice" && (
                          <button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px] font-semibold text-electric-600 transition hover:bg-electric-50"
                          >
                            <CirclePlus className="h-3 w-3" />
                            Add another answer
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!locked && questions.length > 0 && (
        <div className="flex flex-col items-start justify-between gap-3 border-t border-mist-100 bg-mist-50/50 px-5 py-3.5 sm:flex-row sm:items-center sm:px-6">
          <p className="text-[10px] text-slate-400">
            Saving replaces the complete question set for this assessment.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
            >
              <Plus className="h-3.5 w-3.5" />
              Add question
            </Button>
            <Button
              type="button"
              size="sm"
              loading={saving}
              onClick={save}
            >
              {!saving && <Save className="h-3.5 w-3.5" />}
              Save questions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
