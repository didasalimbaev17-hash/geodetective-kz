"use server";

import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/server/auth/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Error codes (not translated text). Frontend translates them via i18n.
export type AuthErrorCode =
  | "supabase_not_configured"
  | "missing_credentials"
  | "missing_fields"
  | "password_too_short"
  | "signin_failed"
  | "signup_failed"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "rate_limit"
  | "email_already_used";

export type AuthResult =
  | { ok: true; needsEmailConfirm?: boolean }
  | { ok: false; errorCode: AuthErrorCode; errorDetail?: string };

/**
 * Map Supabase auth error messages to user-facing error codes.
 * Supabase returns English messages; we translate them to our i18n codes.
 */
function mapSupabaseAuthError(message: string): AuthErrorCode {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid email or password")) {
    return "invalid_credentials";
  }
  if (m.includes("email not confirmed")) {
    return "email_not_confirmed";
  }
  if (m.includes("rate limit") || m.includes("too many requests")) {
    return "rate_limit";
  }
  if (m.includes("already registered") || m.includes("user already")) {
    return "email_already_used";
  }
  return "signin_failed";
}

export async function signInAction(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, errorCode: "supabase_not_configured" };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, errorCode: "missing_credentials" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const code = mapSupabaseAuthError(error.message);
      return { ok: false, errorCode: code };
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[signInAction]", err);
    return { ok: false, errorCode: "signin_failed" };
  }
}

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, errorCode: "supabase_not_configured" };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const role = String(formData.get("role") ?? "student") as
    | "student"
    | "teacher";
  const gradeRaw = String(formData.get("grade") ?? "");
  const grade: "10" | "11" | null =
    role === "student" && (gradeRaw === "10" || gradeRaw === "11")
      ? gradeRaw
      : null;

  if (!email || !password || !fullName) {
    return { ok: false, errorCode: "missing_fields" };
  }

  if (password.length < 6) {
    return { ok: false, errorCode: "password_too_short" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, grade },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      const code = mapSupabaseAuthError(error.message);
      // For signup we prefer email_already_used; fallback to generic signup_failed
      const finalCode: AuthErrorCode =
        code === "email_already_used" || code === "rate_limit"
          ? code
          : "signup_failed";
      return { ok: false, errorCode: finalCode };
    }

    // Profile is created automatically by the DB trigger `handle_new_user`.
    // The trigger reads only full_name + role; grade is not in its scope, so
    // we explicitly UPDATE the profile here when we have a session.
    if (data.session && grade && data.user) {
      try {
        await supabase
          .from("profiles")
          .update({ grade })
          .eq("id", data.user.id);
      } catch (updateErr) {
        console.error("[signUpAction] grade update failed", updateErr);
      }
    }

    if (!data.session) {
      return { ok: true, needsEmailConfirm: true };
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[signUpAction]", err);
    return { ok: false, errorCode: "signup_failed" };
  }
}

export async function setGradeAction(
  grade: "10" | "11"
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "supabase_not_configured" };
  }
  if (grade !== "10" && grade !== "11") {
    return { ok: false, error: "invalid_grade" };
  }
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "not_authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ grade })
      .eq("id", user.id);

    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("[setGradeAction]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[signOutAction]", err);
  }
  revalidatePath("/", "layout");
  redirect("/");
}
