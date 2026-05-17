import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getDb } from "@/server/db";
import { caseSessions, scenarios } from "@/server/db/schema";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseCover } from "@/components/art/CaseCover";
import { getScenarioById } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, Trophy } from "lucide-react";

type FinishedRow = {
  sessionId: string;
  scenarioSlug: string;
  totalScore: number | null;
  finishedAt: Date | null;
};

async function getFinishedSessions(userId: string): Promise<FinishedRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select({
        sessionId: caseSessions.id,
        scenarioSlug: scenarios.slug,
        totalScore: caseSessions.totalScore,
        finishedAt: caseSessions.finishedAt,
      })
      .from(caseSessions)
      .innerJoin(scenarios, eq(caseSessions.scenarioId, scenarios.id))
      .where(
        and(eq(caseSessions.userId, userId), eq(caseSessions.state, "completed"))
      )
      .orderBy(desc(caseSessions.finishedAt));
    return rows;
  } catch (err) {
    console.error("[getFinishedSessions]", err);
    return [];
  }
}

export default async function FinishedCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!user && isSupabaseConfigured) redirect("/auth/login");
  if (user && (user.role === "teacher" || user.role === "admin")) {
    redirect("/teacher/dashboard");
  }

  const sessions = user ? await getFinishedSessions(user.id) : [];

  const finishedDateFormatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-RU" : "kk-KZ",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  return (
    <div className="container py-10 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-success/5 rounded-full blur-[120px] -z-10" />

      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {locale === "ru" ? "Кабинет" : "Кабинетке"}
      </Link>

      <div className="mb-10">
        <Badge variant="outline" className="mb-4 font-mono text-xs">
          {locale === "ru" ? "История" : "Тарих"}
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-balance leading-tight">
          <span className="gradient-text">{t("finished.title")}</span>
        </h1>
        <p className="text-muted-foreground text-lg font-serif italic">
          {sessions.length > 0
            ? locale === "ru"
              ? `Завершено: ${sessions.length} ${sessions.length === 1 ? "дело" : "дел"}`
              : `Аяқталды: ${sessions.length} кейс`
            : t("finished.empty")}
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card className="detective-card max-w-2xl">
          <CardContent className="p-8 text-center">
            <Trophy className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-6">{t("finished.empty")}</p>
            <Link href="/student/dashboard">
              <Button>
                {locale === "ru" ? "К каталогу дел" : "Істер каталогына"}
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => {
            const scenario = getScenarioById(s.scenarioSlug);
            if (!scenario) return null;
            const title = getLocalizedText(scenario.meta.title, locale);
            const finishedAt = s.finishedAt
              ? finishedDateFormatter.format(new Date(s.finishedAt))
              : "—";
            const score = s.totalScore ?? 0;
            return (
              <Card
                key={s.sessionId}
                className="detective-card overflow-hidden h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <CaseCover slug={s.scenarioSlug} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-success/20 backdrop-blur-md border border-success/40 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span className="font-mono text-xs text-success">
                      {locale === "ru" ? "Завершено" : "Аяқталған"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60">
                    <span className="font-mono text-xs text-foreground">
                      {Math.round(score / 2)}/50
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-xl font-bold mb-2 line-clamp-1">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mb-4">
                    {t("finished.completedOn", { date: finishedAt })}
                  </p>
                  <Link
                    href={`/student/finished/${s.sessionId}` as never}
                    className="block"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1.5 h-8 text-xs"
                    >
                      {t("finished.viewResult")}
                      <ArrowRight className="size-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
