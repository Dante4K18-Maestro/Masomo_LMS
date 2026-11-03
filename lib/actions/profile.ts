"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { AVATAR_STYLES } from "@/lib/utils";

export type ProfileState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const color = String(formData.get("avatarColor") ?? user.avatar_color);
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (headline.length > 100) fieldErrors.headline = "Keep your headline under 100 characters.";
  if (bio.length > 400) fieldErrors.bio = "Keep your bio under 400 characters.";
  if (!AVATAR_STYLES[color]) fieldErrors.avatarColor = "Choose a valid avatar color.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  getDb()
    .prepare("UPDATE users SET name = ?, headline = ?, bio = ?, avatar_color = ? WHERE id = ?")
    .run(name, headline || null, bio || null, color, user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/profile");
  return { success: "Your profile has been updated." };
}

export async function changePasswordAction(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const fieldErrors: Record<string, string> = {};

  if (!currentPassword) fieldErrors.currentPassword = "Enter your current password.";
  if (newPassword.length < 8) fieldErrors.newPassword = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    fieldErrors.newPassword = "Include uppercase, lowercase, and a number.";
  }
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const db = getDb();
  const row = db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(user.id) as { password_hash: string } | undefined;
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return { fieldErrors: { currentPassword: "That password is not correct." } };
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    await hashPassword(newPassword),
    user.id,
  );

  return { success: "Password updated. Keep it somewhere safe." };
}
