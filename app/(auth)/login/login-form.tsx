"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: AuthState = {};

const demoAccounts = [
  {
    role: "Student",
    email: "student@brighterfuture.dev",
    password: "Student123!",
    icon: GraduationCap,
    className: "bg-lime-50 text-lime-800 border-lime-200",
  },
  {
    role: "Instructor",
    email: "instructor@brighterfuture.dev",
    password: "Teach123!",
    icon: Sparkles,
    className: "bg-electric-50 text-electric-700 border-electric-200",
  },
  {
    role: "Admin",
    email: "admin@brighterfuture.dev",
    password: "Admin123!",
    icon: ShieldCheck,
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
];

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <p className="eyebrow text-electric-600">Welcome back</p>
      <h1 className="mt-2 font-display text-[34px] font-semibold tracking-[-0.04em] text-ink-950">
        Pick up where you left off.
      </h1>
      <p className="mt-2 text-[13px] leading-6 text-slate-500">
        Log in to continue learning, teaching, or managing your platform.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        {state.error && (
          <div
            role="alert"
            className="rounded-xl border border-coral-200 bg-coral-50 px-3.5 py-3 text-[12px] leading-5 text-coral-800"
          >
            {state.error}
          </div>
        )}

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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
              className="input h-11 pl-10"
              required
            />
          </div>
          {state.fieldErrors?.email && (
            <p id="email-error" className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">
              Password
            </label>
            <span className="mb-1.5 text-[10px] font-semibold text-slate-400">
              Forgot? Use a demo account below.
            </span>
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              aria-describedby={
                state.fieldErrors?.password ? "password-error" : undefined
              }
              className="input h-11 pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="focus-ring absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-mist-100 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {state.fieldErrors?.password && (
            <p id="password-error" className="mt-1.5 text-[11px] font-medium text-coral-600">
              {state.fieldErrors.password}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" loading={isPending} className="w-full">
          {isPending ? "Signing in…" : "Log in"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-mist-200" />
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Try a demo account
        </span>
        <span className="h-px flex-1 bg-mist-200" />
      </div>

      <div className="grid gap-2">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <button
              key={account.role}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
              className={cn(
                "focus-ring group flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition hover:shadow-sm",
                account.className,
              )}
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/80">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-[11px] font-bold">{account.role}</span>
                <span className="block text-[10px] opacity-70">{account.email}</span>
              </span>
              <span className="font-mono text-[9px] font-semibold opacity-0 transition group-hover:opacity-70">
                FILL →
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[9px] text-slate-400">
        Click a demo role to fill the form. Password is filled automatically.
      </p>

      <p className="mt-7 text-center text-[12px] text-slate-500">
        New to BrighterFuture?{" "}
        <Link
          href="/register"
          className="font-bold text-electric-600 underline-offset-2 hover:underline"
        >
          Create a free account
        </Link>
      </p>
    </div>
  );
}
