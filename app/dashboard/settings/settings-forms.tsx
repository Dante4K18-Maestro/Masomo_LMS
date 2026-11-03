"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { PublicUser } from "@/lib/types";
import {
  changePasswordAction,
  updateProfileAction,
  type ProfileState,
} from "@/lib/actions/profile";
import { AVATAR_STYLES, cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const initialState: ProfileState = {};

const colorLabels: Record<string, string> = {
  lime: "Lime",
  electric: "Electric",
  coral: "Coral",
  violet: "Violet",
  amber: "Amber",
  sky: "Sky",
  emerald: "Emerald",
};

const passwordChecks = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /[0-9]/.test(value) },
];

function Feedback({ state }: { state: ProfileState }) {
  return (
    <>
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 text-[12px] leading-5 text-coral-800"
        >
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] leading-5 text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.success}
        </div>
      )}
    </>
  );
}

export function SettingsForms({ user }: { user: PublicUser }) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.avatar_color || "electric");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (passwordState.success) {
      passwordFormRef.current?.reset();
      setNewPassword("");
    }
  }, [passwordState.success]);

  const strength = passwordChecks.filter((check) => check.test(newPassword)).length;

  return (
    <div className="space-y-5">
      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric-50 text-electric-600">
            <UserRound className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
              Public profile
            </h2>
            <p className="text-[10px] text-slate-400">
              This is how you appear across courses, rosters, and certificates.
            </p>
          </div>
        </div>

        <form action={profileAction} className="space-y-5 p-5 sm:p-6">
          <Feedback state={profileState} />

          <div className="flex flex-col gap-5 rounded-2xl border border-mist-200 bg-mist-50/60 p-4 sm:flex-row sm:items-center">
            <Avatar
              name={name || user.name}
              color={color}
              size="xl"
              className="ring-4 ring-white"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[17px] font-semibold tracking-tight text-ink-950">
                {name || user.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold capitalize text-slate-600">
                  <Sparkles className="h-3 w-3 text-electric-500" />
                  {user.role}
                </span>
                <span className="text-[10px] text-slate-400">
                  Avatar updates live
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="settings-name" className="label">
                Full name
              </label>
              <input
                id="settings-name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="input h-11"
                required
              />
              {profileState.fieldErrors?.name && (
                <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                  {profileState.fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="settings-headline" className="label">
                Headline
              </label>
              <input
                id="settings-headline"
                name="headline"
                type="text"
                defaultValue={user.headline ?? ""}
                placeholder="e.g. Cloud engineer in training"
                maxLength={100}
                className="input h-11"
              />
              {profileState.fieldErrors?.headline && (
                <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                  {profileState.fieldErrors.headline}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="settings-bio" className="label">
              Bio
            </label>
            <textarea
              id="settings-bio"
              name="bio"
              rows={4}
              defaultValue={user.bio ?? ""}
              placeholder="A short note about what you are learning, teaching, or building."
              maxLength={400}
              className="input resize-y"
            />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="text-[10px] text-slate-400">
                Keep it short and useful. 400 characters max.
              </p>
              {profileState.fieldErrors?.bio && (
                <p className="text-[11px] font-medium text-coral-600">
                  {profileState.fieldErrors.bio}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-slate-400" />
              <span className="label mb-0">Avatar color</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {Object.entries(AVATAR_STYLES).map(([value, className]) => {
                const selected = color === value;
                return (
                  <label
                    key={value}
                    className="focus-within:ring-2 focus-within:ring-electric-400 focus-within:ring-offset-2 cursor-pointer rounded-xl"
                  >
                    <input
                      type="radio"
                      name="avatarColor"
                      value={value}
                      checked={selected}
                      onChange={() => setColor(value)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "relative flex h-14 flex-col items-center justify-center gap-1.5 rounded-xl border bg-white transition",
                        selected
                          ? "border-ink-950 shadow-sm"
                          : "border-mist-200 hover:border-mist-300",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold",
                          className,
                        )}
                        aria-hidden="true"
                      >
                        {name
                          ? name
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0]?.toUpperCase())
                              .join("")
                          : "BF"}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500">
                        {colorLabels[value] ?? value}
                      </span>
                      {selected && (
                        <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-ink-950 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            {profileState.fieldErrors?.avatarColor && (
              <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                {profileState.fieldErrors.avatarColor}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse items-stretch gap-2.5 border-t border-mist-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-4 text-slate-400">
              Your email address is managed by your administrator.
            </p>
            <Button
              type="submit"
              size="md"
              loading={profilePending}
              className="shrink-0"
            >
              {!profilePending && <Save className="h-4 w-4" />}
              {profilePending ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-mist-100 px-5 py-4 sm:px-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
            <KeyRound className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-[16px] font-semibold tracking-tight text-ink-950">
              Password & security
            </h2>
            <p className="text-[10px] text-slate-400">
              Use a unique password you do not reuse anywhere else.
            </p>
          </div>
        </div>

        <form
          ref={passwordFormRef}
          action={passwordAction}
          className="space-y-5 p-5 sm:p-6"
        >
          <Feedback state={passwordState} />

          <div>
            <label htmlFor="current-password" className="label">
              Current password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="current-password"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your current password"
                className="input h-11 pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="focus-ring absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-mist-100 hover:text-slate-700"
                aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordState.fieldErrors?.currentPassword && (
              <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                {passwordState.fieldErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="new-password" className="label">
                New password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="input h-11"
                required
              />
              {passwordState.fieldErrors?.newPassword && (
                <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                  {passwordState.fieldErrors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="label">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat the new password"
                className="input h-11"
                required
              />
              {passwordState.fieldErrors?.confirmPassword && (
                <p className="mt-1.5 text-[11px] font-medium text-coral-600">
                  {passwordState.fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-mist-200 bg-mist-50/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Password strength
              </p>
              <span className="text-[10px] font-semibold text-slate-500">
                {strength}/4
              </span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {passwordChecks.map((check, index) => (
                <span
                  key={check.label}
                  className={cn(
                    "h-1.5 rounded-full transition-colors",
                    index < strength
                      ? strength >= 4
                        ? "bg-emerald-500"
                        : "bg-lime-400"
                      : "bg-mist-200",
                  )}
                />
              ))}
            </div>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {passwordChecks.map((check) => {
                const met = check.test(newPassword);
                return (
                  <li
                    key={check.label}
                    className={cn(
                      "flex items-center gap-1.5 text-[10.5px]",
                      met ? "text-emerald-700" : "text-slate-400",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-3.5 w-3.5 place-items-center rounded-full",
                        met ? "bg-emerald-100" : "bg-mist-100",
                      )}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    {check.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col-reverse items-stretch gap-2.5 border-t border-mist-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-[10px] leading-4 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Sessions stay signed in for 7 days on this device.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={passwordPending}
              className="shrink-0"
            >
              {passwordPending ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
