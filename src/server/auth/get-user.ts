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
      .select("id, email, role, full_name, locale, xp, level")
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
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.full_name,
      locale: profile.locale,
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
    };
  } catch (err) {
    console.error("[getCurrentUserProfile]", err);
    return null;
  }
}
