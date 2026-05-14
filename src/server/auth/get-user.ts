import {
  createSupabaseServerClient,
  getSessionUser,
  isSupabaseConfigured,
} from "./supabase-server";

export type CurrentUser = {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
  fullName: string | null;
  locale: string;
  xp: number;
  level: number;
  grade: "10" | "11" | null;
} | null;

/**
 * Returns the currently signed-in user with profile data.
 * Returns null if not signed in OR if Supabase isn't configured.
 */
export async function getCurrentUserProfile(): Promise<CurrentUser> {
  if (!isSupabaseConfigured()) return null;

  try {
    const authUser = await getSessionUser();
    if (!authUser) return null;

    const supabase = await createSupabaseServerClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, role, full_name, locale, xp, level, grade")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!profile) {
      return {
        id: authUser.id,
        email: authUser.email ?? "",
        role: "student",
        fullName: null,
        locale: "kk",
        xp: 0,
        level: 1,
        grade: null,
      };
    }

    const gradeRaw = profile.grade as string | null;
    const grade: "10" | "11" | null =
      gradeRaw === "10" || gradeRaw === "11" ? gradeRaw : null;

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.full_name,
      locale: profile.locale,
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
      grade,
    };
  } catch (err) {
    console.error("[getCurrentUserProfile]", err);
    return null;
  }
}
