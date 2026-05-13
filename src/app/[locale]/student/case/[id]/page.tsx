import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getScenarioById } from "@/data/cases";
import { GameContainer } from "@/components/game/GameContainer";

const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUserProfile();
  // Allow anonymous play in demo mode (no Supabase configured yet)
  if (!user && isSupabaseConfigured) redirect("/auth/login");

  const scenario = getScenarioById(id);
  if (!scenario) notFound();

  return <GameContainer scenario={scenario} />;
}
