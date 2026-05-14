import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, LogOut, GraduationCap } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  return (
    <div className="container max-w-3xl py-10">
      <Card className="detective-card mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="mb-1">
                {user.fullName ?? user.email.split("@")[0]}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {user.role === "student"
                    ? t("auth.roleStudent")
                    : t("auth.roleTeacher")}
                </Badge>
                {user.role === "student" && user.grade && (
                  <Badge variant="outline" className="gap-1">
                    <GraduationCap className="size-3" />
                    {user.grade === "10"
                      ? t("auth.grade10")
                      : t("auth.grade11")}
                  </Badge>
                )}
              </div>
            </div>
            {user.role === "student" && (
              <div className="text-right">
                <div className="text-4xl font-display font-bold gradient-text font-numeric">
                  {user.xp}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                  <Sparkles className="size-3 text-primary" />
                  XP
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            {t("dashboard.recentBadges")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {locale === "ru"
              ? "Завершите первый кейс, чтобы получить бейдж."
              : "Бірінші кейсіңізді аяқтап белгі алыңыз."}
          </p>
        </CardContent>
      </Card>

      <form action={signOutAction} className="mt-8">
        <Button type="submit" variant="outline" className="gap-2">
          <LogOut className="size-4" />
          {t("common.logout")}
        </Button>
      </form>
    </div>
  );
}
