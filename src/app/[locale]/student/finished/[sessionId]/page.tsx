import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import { getDb } from "@/server/db";
import {
  aiEvaluations,
  caseSessions,
  scenarios as scenariosTable,
} from "@/server/db/schema";
import { getScenarioById } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Brain,
  ExternalLink,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

type AiRubric = {
  rubricScores: Record<string, number>;
  rubricComments: Record<string, string>;
  overallComment: string | null;
  totalScore: number;
};

export default async function FinishedSessionPage({
  params,
}: {
  params: Promise<{ locale: string; sessionId: string }>;
}) {
  const { locale, sessionId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const user = await getCurrentUserProfile();
  if (!user) redirect("/auth/login");

  const db = getDb();

  // Session: must belong to current user
  const [session] = await db
    .select({
      id: caseSessions.id,
      scenarioId: caseSessions.scenarioId,
      investigationScore: caseSessions.investigationScore,
      solutionScore: caseSessions.solutionScore,
      aiScore: caseSessions.aiScore,
      totalScore: caseSessions.totalScore,
      explanationText: caseSessions.explanationText,
      chosenSolutionId: caseSessions.chosenSolutionId,
      finishedAt: caseSessions.finishedAt,
      timeSpentSeconds: caseSessions.timeSpentSeconds,
    })
    .from(caseSessions)
    .where(
      and(eq(caseSessions.id, sessionId), eq(caseSessions.userId, user.id))
    )
    .limit(1);

  if (!session) notFound();

  // Scenario slug → local data
  const [scenarioRow] = await db
    .select({ slug: scenariosTable.slug })
    .from(scenariosTable)
    .where(eq(scenariosTable.id, session.scenarioId))
    .limit(1);
  if (!scenarioRow) notFound();

  const scenario = getScenarioById(scenarioRow.slug);
  if (!scenario) notFound();

  // AI evaluation (optional — might be missing for sessions without AI grade)
  const [aiRow] = await db
    .select({
      rubricScores: aiEvaluations.rubricScores,
      rubricComments: aiEvaluations.rubricComments,
      overallComment: aiEvaluations.overallComment,
      totalScore: aiEvaluations.totalScore,
    })
    .from(aiEvaluations)
    .where(eq(aiEvaluations.sessionId, sessionId))
    .limit(1);

  const ai: AiRubric | null = aiRow
    ? {
        rubricScores: (aiRow.rubricScores as Record<string, number>) ?? {},
        rubricComments:
          (aiRow.rubricComments as Record<string, string>) ?? {},
        overallComment: aiRow.overallComment,
        totalScore: aiRow.totalScore ?? 0,
      }
    : null;

  const chosenSolution = session.chosenSolutionId
    ? scenario.solutions.find((s) => s.id === session.chosenSolutionId)
    : undefined;

  const finishedAt = session.finishedAt
    ? new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(session.finishedAt))
    : "—";

  const title = getLocalizedText(scenario.meta.title, locale);
  const breakdown = scenario.scoring.breakdown;
  const total = session.totalScore ?? 0;

  return (
    <div className="container py-10 max-w-4xl">
      <Link
        href="/student/finished"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t("finished.title")}
      </Link>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="size-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30">
          <Trophy
            className="size-10 text-primary-foreground"
            strokeWidth={1.5}
          />
        </div>
        <Badge variant="outline" className="mb-3 font-mono text-xs">
          {t("finished.completedOn", { date: finishedAt })}
        </Badge>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {title}
        </h1>
        <div className="text-6xl md:text-7xl font-display font-bold gradient-text font-numeric mt-4">
          {total}
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ScoreCard
          icon={Target}
          label={t("game.debrief.investigation")}
          score={session.investigationScore ?? 0}
          max={breakdown.investigation}
        />
        <ScoreCard
          icon={Sparkles}
          label={t("game.debrief.solutionQuality")}
          score={session.solutionScore ?? 0}
          max={breakdown.solutionChoice}
        />
        <ScoreCard
          icon={Brain}
          label={t("game.debrief.aiGrade")}
          score={session.aiScore ?? 0}
          max={breakdown.aiExplanation}
        />
      </div>

      {/* Chosen solution */}
      {chosenSolution && (
        <Card className="detective-card mb-6">
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {locale === "ru"
                ? "Выбранное решение"
                : "Таңдалған шешім"}
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              {getLocalizedText(chosenSolution.title, locale)}
            </h3>
            {chosenSolution.tradeoffs && (
              <p className="text-sm text-muted-foreground italic">
                {getLocalizedText(chosenSolution.tradeoffs, locale)}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student essay */}
      {session.explanationText && (
        <Card className="detective-card mb-6">
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              {locale === "ru" ? "Ваше эссе" : "Сіздің эссеңіз"}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {session.explanationText}
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI rubric */}
      {ai && (
        <Card className="detective-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-5 text-primary" />
              <h3 className="font-display text-xl font-bold">
                {t("game.debrief.aiGrade")}
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              {scenario.evaluationRubric.criteria.map((c) => {
                const score = ai.rubricScores[c.id] ?? 0;
                const comment = ai.rubricComments[c.id];
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {getLocalizedText(c.name, locale)}
                      </span>
                      <span className="font-mono">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                    {comment && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        {comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {ai.overallComment && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <p className="text-sm italic text-muted-foreground">
                  {ai.overallComment}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Real world facts */}
      <Card className="detective-card mb-6">
        <CardContent className="p-6">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {t("game.debrief.realWorld")}
          </div>
          <p className="text-sm leading-relaxed">
            {getLocalizedText(scenario.debrief.realWorld, locale)}
          </p>
        </CardContent>
      </Card>

      {/* Sources */}
      {scenario.debrief.sources.length > 0 && (
        <Card className="detective-card mb-6">
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              {t("game.debrief.sources")}
            </div>
            <ul className="space-y-2">
              {scenario.debrief.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="size-3.5" />
                    {getLocalizedText(src.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  score,
  max,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  score: number;
  max: number;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((score / max) * 100)) : 0;
  return (
    <Card className="detective-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="size-4 text-primary" strokeWidth={1.5} />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="text-3xl font-display font-bold font-numeric mb-2">
          {score}
          <span className="text-base text-muted-foreground">/{max}</span>
        </div>
        <Progress value={percent} className="h-1" />
      </CardContent>
    </Card>
  );
}
