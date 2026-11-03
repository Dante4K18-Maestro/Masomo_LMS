"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { registerAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: AuthState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const rules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "A number", met: /[0-9]/.test(password) },
  ];

  return (
    <div>
      <p className="eyebrow text-electric-600">Create your account</p>
      <h1 className="mt-2 font-display text-[34px] font-semibold tracking-[-0.04em] text-ink-950">
        Start building your future.
      </h1>
      <p className="mt-2 text-[13px] leading-6 text-slate-500">
        Free to join. Pick a course, learn at your pace, and earn verified
        certificates as you grow.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        {state.error && (
          <div
            role="alert"
            className="rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-3 text-[12px] leading-5 text-coral-800"
          >
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Maya Chen"
              aria-invalid={Boolean(state.fieldErrors?.name)}
              className="input h-11 pl-10"
              required
            />
          </div>
          {state.fieldErrors?.name && (
            <p className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className="input h-11 pl-10"
              required
            />
          </div>
          {state.fieldErrors?.email && (
            <p className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              aria-describedby="password-rules"
              className="input h-11 pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="focus-ring absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-mist-100 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div id="password-rules" className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
            {rules.map((rule) => (
              <span
                key={rule.label}
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-medium transition",
                  rule.met ? "text-emerald-600" : "text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "grid h-3.5 w-3.5 place-items-center rounded-full border",
                    rule.met
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-mist-300",
                  )}
                >
                  {rule.met && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {rule.label}
              </span>
            ))}
          </div>
          {state.fieldErrors?.password && (
            <p className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Type it once more"
              aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
              className="input h-11 pl-10"
              required
            />
          </div>
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-[11px] leading-5 text-slate-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-3.5 w-3.5 rounded border-mist-300 text-electric-500 focus:ring-electric-200"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-semibold text-ink-800 underline-offset-2 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-ink-800 underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <Button type="submit" size="lg" loading={isPending} className="w-full">
          {isPending ? "Creating account…" : "Create free account"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12px] text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-electric-600 underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
