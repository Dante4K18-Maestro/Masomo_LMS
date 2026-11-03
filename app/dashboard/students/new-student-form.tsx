"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  createStudentAction,
  type StudentFormState,
} from "@/lib/actions/students";
import { Button } from "@/components/ui/button";

const initialState: StudentFormState = {};

const courses = [
  { id: "", title: "No course yet" },
];

export function NewStudentForm({
  courseOptions,
}: {
  courseOptions: { id: string; title: string; status: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    createStudentAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setPassword("");
    }
  }, [state.success]);

  function generatePassword() {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const symbols = "!@#$%";
    const all = upper + lower + digits + symbols;
    const random = (source: string) => {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return source[values[0] % source.length];
    };
    const required = [
      random(upper),
      random(lower),
      random(lower),
      random(digits),
      random(symbols),
    ];
    while (required.length < 12) required.push(random(all));
    const shuffled = required
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry) => entry.value)
      .join("");
    setPassword(shuffled);
    setShowPassword(true);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-mist-100 bg-ink-950 p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-lime-300">
            Admin action
          </p>
          <UserPlus className="h-4 w-4 text-lime-300" />
        </div>
        <p className="mt-3 font-display text-[17px] font-semibold">
          Add a student
        </p>
        <p className="mt-1 text-[10.5px] leading-5 text-slate-400">
          Create an account and, optionally, enroll them in a course right away.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-3.5 p-5">
        {state.error && (
          <div className="rounded-lg border border-coral-200 bg-coral-50 px-3 py-2 text-[10.5px] text-coral-800">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] leading-4 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {state.success}
          </div>
        )}

        <div>
          <label htmlFor="student-name" className="label text-[11px]">
            Full name
          </label>
          <input
            id="student-name"
            name="name"
            className="input h-10 text-[12px]"
            placeholder="e.g. Alex Rivera"
            autoComplete="off"
            required
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-[10px] text-coral-600">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="student-email" className="label text-[11px]">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="student-email"
              name="email"
              type="email"
              className="input h-10 pl-8 text-[12px]"
              placeholder="alex@example.com"
              autoComplete="off"
              required
            />
          </div>
          {state.fieldErrors?.email && (
            <p className="mt-1 text-[10px] text-coral-600">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="student-password" className="label text-[11px]">
              Temporary password
            </label>
            <button
              type="button"
              onClick={generatePassword}
              className="focus-ring mb-1.5 inline-flex items-center gap-1 rounded text-[9px] font-bold text-electric-600 hover:text-electric-700"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Generate
            </button>
          </div>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="student-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="input h-10 pl-8 pr-8 text-[12px]"
              placeholder="Upper, lower & number"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="focus-ring absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-slate-400 hover:bg-mist-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p className="mt-1 text-[10px] text-coral-600">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="student-course" className="label text-[11px]">
            Start in a course (optional)
          </label>
          <select
            id="student-course"
            name="courseId"
            className="input h-10 cursor-pointer text-[11px]"
            defaultValue=""
          >
            {courseOptions.length === 0
              ? courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))
              : courseOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                    {course.status !== "published" ? " (draft)" : ""}
                  </option>
                ))}
          </select>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="md"
          loading={isPending}
          className="w-full"
        >
          {!isPending && <UserPlus className="h-4 w-4" />}
          {isPending ? "Creating…" : "Create student"}
        </Button>
        <p className="text-center text-[9px] leading-4 text-slate-400">
          The temporary password is shown only once. Share it securely and ask
          the student to change it in Settings.
        </p>
      </form>
    </div>
  );
}
