"use server";

import { createSupabaseServerClient } from "@/server/auth/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthResult =
  | { ok: true; needsEmailConfirm?: boolean }
  | { ok: false; error: string };

export async function signInAction(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email мен құпиясөзді толтырыңыз" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const role = String(formData.get("role") ?? "student") as
    | "student"
    | "teacher";

  if (!email || !password || !fullName) {
    return { ok: false, error: "Барлық өрістерді толтырыңыз" };
  }

  if (password.length < 6) {
    return { ok: false, error: "Құпиясөз кемінде 6 таңбадан тұруы керек" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) return { ok: false, error: error.message };

  // Create profile row (RLS will allow because user is auth'd via session)
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
      locale: "kk",
    });
  }

  if (!data.session) {
    // Email confirmation required
    return { ok: true, needsEmailConfirm: true };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
