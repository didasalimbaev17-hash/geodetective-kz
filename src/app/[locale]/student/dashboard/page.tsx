import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { getAllScenarios, getScenarioMeta } from "@/data/cases";
import { getLocalizedText, xpForLevel } from "@/lib/utils";
import { ArrowRight, Clock, Star, Trophy, Sparkles, Flame } from "lucide-react";

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const realUser = await getCurrentUserProfile();
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (!realUser && isSupabaseConfigured) redirect("/auth/login");

  // Demo profile when running without Supabase (e.g. fresh clone)
  const user = realUser ?? {
    id: "demo",
    email: "demo@geodetective.kz",
    role: "student" as const,
    fullName: "Demo Қолданушы",
    locale: "kk",
    xp: 0,
    level: 1,
  };

  const scenarios = getAllScenarios().map(getScenarioMeta);
  const xpToNext = xpForLevel(user.level + 1);
  const xpProgress = Math.min(100, Math.round((user.xp / xpToNext) * 100));

  return (
    <div className="container py-10">
      {/* WELCOME + STATS */}
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {t("dashboard.welcome")},{" "}
          <span className="gradient-text">
            {user.fullName ?? user.email.split("@")[0]}
          </span>
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.yourProgress")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          icon={Trophy}
          label={t("dashboard.currentLevel")}
          value={user.level}
          tone="primary"
        />
        <StatCard
          icon={Sparkles}
          label={t("dashboard.totalXP")}
          value={`${user.xp} / ${xpToNext}`}
          tone="secondary"
          progress={xpProgress}
        />
        <StatCard
          icon={Flame}
          label={t("dashboard.casesAvailable")}
          value={scenarios.length}
          tone="warning"
        />
        <StatCard
          icon={Star}
          label={t("dashboard.completedCases")}
          value={0}
          tone="success"
        />
      </div>

      {/* CASES CATALOG */}
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold">
          {t("nav.cases")}
        </h2>
        <Badge variant="outline" className="font-mono">
          {scenarios.length} {t("dashboard.casesAvailable")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <Card key={s.id} className="detective-card group overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface">
              <SafeImage
                src={s.coverImage ?? ""}
                alt={getLocalizedText(s.title, locale)}
                fallbackLabel={getLocalizedText(s.title, locale)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <Badge className="absolute top-3 left-3 backdrop-blur-md bg-card/70">
                {t("dashboard.startCase")}
              </Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-display text-xl font-semibold mb-1">
                {getLocalizedText(s.title, locale)}
              </h3>
              {s.subtitle && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {getLocalizedText(s.subtitle, locale)}
                </p>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < s.difficulty
                          ? "size-3.5 fill-primary text-primary"
                          : "size-3.5 text-muted"
                      }
                    />
                  ))}
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Clock className="size-3.5" />
                  {s.estimatedMinutes} {t("dashboard.minutes")}
                </span>
              </div>
              <Button asChild className="w-full group/btn">
                <Link href={`/student/case/${s.id}` as never}>
                  {t("dashboard.startCase")}
                  <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  progress,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | number;
  tone: "primary" | "secondary" | "warning" | "success";
  progress?: number;
}) {
  const toneClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/30 text-primary",
    secondary: "from-secondary/20 to-secondary/5 border-secondary/30 text-secondary",
    warning: "from-warning/20 to-warning/5 border-warning/30 text-warning",
    success: "from-success/20 to-success/5 border-success/30 text-success",
  };

  return (
    <Card className={`bg-gradient-to-br ${toneClasses[tone]} border`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Icon className="size-5" strokeWidth={1.5} />
        </div>
        <div className="text-2xl font-bold font-numeric text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-2 h-1" />
        )}
      </CardContent>
    </Card>
  );
}
