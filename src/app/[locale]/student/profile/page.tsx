import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { xpForLevel } from "@/lib/utils";
import { Trophy, Sparkles, LogOut } from "lucide-react";

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

  const xpToNext = xpForLevel(user.level + 1);
  const xpProgress = Math.min(100, Math.round((user.xp / xpToNext) * 100));

  return (
    <div className="container max-w-3xl py-10">
      <Card className="detective-card mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-1">
                {user.fullName ?? user.email.split("@")[0]}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2" variant="outline">
                {user.role === "student"
                  ? t("auth.roleStudent")
                  : t("auth.roleTeacher")}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-5xl font-display font-bold gradient-text">
                {user.level}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t("dashboard.currentLevel")}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                XP
              </span>
              <span className="font-mono">
                {user.xp} / {xpToNext}
              </span>
            </div>
            <Progress value={xpProgress} />
          </div>
        </CardContent>
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
