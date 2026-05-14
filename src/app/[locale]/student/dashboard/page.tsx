import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getDb } from "@/server/db";
import { caseSessions } from "@/server/db/schema";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CaseCover } from "@/components/art/CaseCover";
import { getAllScenarios, getScenarioMeta } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import { ArrowRight, Clock, Star, Sparkles, Flame, Target } from "lucide-react";

async function getCompletedCasesCount(userId: string): Promise<number> {
  try {
    const db = getDb();
    const rows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(caseSessions)
      .where(
        and(eq(caseSessions.userId, userId), eq(caseSessions.state, "completed"))
      );
    return rows[0]?.count ?? 0;
  } catch (err) {
    console.error("[getCompletedCasesCount]", err);
    return 0;
  }
}

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

  const user = realUser ?? {
    id: "demo",
    email: "demo@geodetective.kz",
    role: "student" as const,
    fullName: "Demo Қолданушы",
    locale: "kk",
    xp: 0,
    level: 1,
    grade: null as "10" | "11" | null,
  };

  const allMeta = getAllScenarios().map(getScenarioMeta);
  // Students see only cases for their class; if grade is missing (legacy users
  // or teachers viewing this page), fall back to showing all cases.
  const scenarios =
    user.role === "student" && user.grade
      ? allMeta.filter((s) => s.grade === user.grade)
      : allMeta;
  const completedCount = realUser
    ? await getCompletedCasesCount(realUser.id)
    : 0;
  const gradeMissing = user.role === "student" && !user.grade;

  return (
    <div className="container py-10 relative">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      {/* WELCOME */}
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 font-mono text-xs">
          {locale === "ru" ? "Личный кабинет" : "Жеке кабинет"}
        </Badge>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-3 text-balance leading-tight">
          {locale === "ru" ? "Привет, " : "Сәлем, "}
          <span className="gradient-text">
            {user.fullName ?? user.email.split("@")[0]}
          </span>
        </h1>
        <p className="text-muted-foreground text-lg font-serif italic">
          {locale === "ru"
            ? "Выбери дело — и начни своё расследование."
            : "Бір істі таңда — және тергеуді баста."}
        </p>
        {gradeMissing && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-warning/10 text-warning border border-warning/30 px-4 py-2 rounded-lg">
            {t("auth.gradeRequired")}
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <StatCard
          icon={Sparkles}
          label="XP"
          value={user.xp}
          tone="secondary"
        />
        <StatCard
          icon={Flame}
          label={t("dashboard.casesAvailable")}
          value={scenarios.length}
          tone="warning"
        />
        <StatCard
          icon={Target}
          label={t("dashboard.completedCases")}
          value={completedCount}
          tone="success"
        />
      </div>

      {/* CASES */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <Badge variant="outline" className="mb-3 font-mono text-xs">
            {locale === "ru" ? "Каталог дел" : "Істер каталогы"}
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            <span className="gradient-text">{t("nav.cases")}</span>
          </h2>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {scenarios.length} {locale === "ru" ? "доступно" : "қолжетімді"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((s, idx) => (
          <Link
            key={s.id}
            href={`/student/case/${s.id}` as never}
            className="block group"
          >
            <Card className="detective-card overflow-hidden h-full">
              <div className="relative aspect-[16/10] overflow-hidden">
                <CaseCover
                  slug={s.id}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60">
                  <span className="font-mono text-xs text-primary">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < s.difficulty
                          ? "size-2.5 fill-primary text-primary"
                          : "size-2.5 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>

                {/* Bottom: action hint */}
                <div className="absolute bottom-3 right-3 size-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300">
                  <ArrowRight className="size-5 text-primary" />
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {getLocalizedText(s.title, locale)}
                </h3>
                {s.subtitle && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-serif italic">
                    {getLocalizedText(s.subtitle, locale)}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock className="size-3.5" />
                    {s.estimatedMinutes} {locale === "ru" ? "мин" : "мин"}
                  </span>
                  <Button size="sm" className="gap-1.5 h-8 text-xs">
                    {t("dashboard.startCase")}
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
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
  const toneStyles = {
    primary: {
      bg: "from-primary/20 via-primary/5 to-transparent",
      border: "border-primary/30",
      iconColor: "text-primary",
      glow: "shadow-glow-primary",
    },
    secondary: {
      bg: "from-secondary/20 via-secondary/5 to-transparent",
      border: "border-secondary/30",
      iconColor: "text-secondary",
      glow: "shadow-glow-secondary",
    },
    warning: {
      bg: "from-warning/20 via-warning/5 to-transparent",
      border: "border-warning/30",
      iconColor: "text-warning",
      glow: "",
    },
    success: {
      bg: "from-success/20 via-success/5 to-transparent",
      border: "border-success/30",
      iconColor: "text-success",
      glow: "",
    },
  };

  const style = toneStyles[tone];

  return (
    <Card
      className={`detective-card bg-gradient-to-br ${style.bg} ${style.border} relative overflow-hidden`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`size-10 rounded-xl bg-card/60 backdrop-blur flex items-center justify-center ${style.glow}`}
          >
            <Icon className={`size-5 ${style.iconColor}`} strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-3xl font-display font-bold font-numeric text-foreground mb-1">
          {value}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1" />
        )}
      </CardContent>
    </Card>
  );
}
