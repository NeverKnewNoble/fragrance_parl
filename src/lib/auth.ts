"use server";

import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  auth,
} from "@/auth";
import { db } from "@/db";
import { users, userRole } from "@/db/schema";
import { hashPassword } from "@/lib/password";

class AuthHelperError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthHelperError";
    this.code = code;
  }
}

// !! Sign in with email + password (Credentials provider)
export async function signIn(email: string, password: string) {
  const normalizedEmail = String(email).trim().toLowerCase();
  try {
    await nextAuthSignIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        throw new AuthHelperError(
          "Invalid email or password.",
          "invalid_credentials"
        );
      }
      throw new AuthHelperError(error.message, error.type ?? "auth_error");
    }
    throw error;
  }

  const session = await auth();
  return { user: session?.user ?? null, session };
}

// !! Sign up: create user, hash password, create role row, then auto-sign-in
export async function signUp(email: string, password: string, name?: string) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = name?.trim() || null;

  if (password.length < 8) {
    throw new AuthHelperError(
      "Password must be at least 8 characters.",
      "weak_password"
    );
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    throw new AuthHelperError(
      "An account with that email already exists.",
      "user_already_registered"
    );
  }

  const passwordHash = await hashPassword(password);

  const [created] = await db
    .insert(users)
    .values({
      email: normalizedEmail,
      name: trimmedName,
      passwordHash,
    })
    .returning();

  await db
    .insert(userRole)
    .values({ userId: created.id, role: "user" })
    .onConflictDoNothing();

  try {
    await nextAuthSignIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new AuthHelperError(error.message, error.type ?? "auth_error");
    }
    throw error;
  }

  const session = await auth();
  return { user: session?.user ?? null, session };
}

// !! Sign out
export async function signOut() {
  await nextAuthSignOut({ redirect: false });
}

// !! Get current authenticated user (server-side)
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// !! Server-only alias kept for callsite compat
export async function getServerUser() {
  const session = await auth();
  return session?.user ?? null;
}

// !! Trigger Google OAuth flow (server action — issues a redirect)
export async function signInWithGoogle(redirectTo: string = "/") {
  await nextAuthSignIn("google", { redirectTo });
}

// !! Update password for the currently signed-in user
export async function updatePassword(newPassword: string) {
  if (newPassword.length < 8) {
    throw new AuthHelperError(
      "Password must be at least 8 characters.",
      "weak_password"
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthHelperError("Not authenticated.", "not_authenticated");
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, session.user.id));

  return { user: session.user };
}

// !! Send a password-reset email.
// Email delivery is not configured in this migration — wire SMTP/Resend later.
// See docs/migration-setup.md for next steps.
export async function resetPassword(email: string) {
  console.warn(
    "[auth] resetPassword called — email delivery is not configured. " +
      "See docs/migration-setup.md to wire an email provider."
  );
  return { ok: true, email };
}

// !! Resend signup confirmation. Same caveat as resetPassword.
export async function resendConfirmationEmail(email: string) {
  console.warn(
    "[auth] resendConfirmationEmail called — email delivery is not configured."
  );
  return { ok: true, email };
}

// !! Update display name on the current user's profile
export async function updateProfileName(name: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthHelperError("Not authenticated.", "not_authenticated");
  }
  const trimmed = name.trim();
  await db
    .update(users)
    .set({ name: trimmed.length ? trimmed : null })
    .where(eq(users.id, session.user.id));
}

// !! Check if a user has admin role
export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const [row] = await db
    .select({ role: userRole.role })
    .from(userRole)
    .where(eq(userRole.userId, session.user.id))
    .limit(1);
  return row?.role === "admin";
}
