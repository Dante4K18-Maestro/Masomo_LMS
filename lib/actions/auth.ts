"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import type { PublicUser } from "@/lib/types";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  if (next.startsWith("/dashboard")) return next;
  return "/dashboard";
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (!password) fieldErrors.password = "Enter your password.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const user = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as (PublicUser & { password_hash: string }) | undefined;

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "The email or password is incorrect. Try the demo accounts below." };
  }

  if (user.status !== "active") {
    return { error: "This account has been suspended. Contact your learning administrator." };
  }

  await createSession(user.id, user.role);
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    fieldErrors.password = "Include uppercase, lowercase, and a number.";
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email) as { id: string } | undefined;

  if (existing) {
    return { fieldErrors: { email: "An account with this email already exists." } };
  }

  const colors = ["lime", "electric", "coral", "violet", "amber", "sky", "emerald"];
  const userId = `usr_${crypto.randomUUID()}`;
  const hash = await hashPassword(password);

  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, avatar_color, headline, status)
     VALUES (?, ?, ?, ?, 'student', ?, ?, 'active')`,
  ).run(
    userId,
    name,
    email,
    hash,
    colors[Math.floor(Math.random() * colors.length)],
    "Learning something new",
  );

  await createSession(userId, "student");
  redirect("/dashboard?welcome=1");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
