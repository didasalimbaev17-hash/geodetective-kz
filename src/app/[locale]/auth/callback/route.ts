import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/server/auth/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student/dashboard";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/`);
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (err) {
      console.error("[auth/callback]", err);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`);
}
