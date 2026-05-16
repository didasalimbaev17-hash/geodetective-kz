"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from "@/schemas/case.schema";
import type { AiGradingResponse } from "@/schemas/ai.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/utils";
import { finishCaseAction, type FinishCaseResult } from "@/server/actions/finishCase";
import {
  Award,
  ExternalLink,
  Home,
  Trophy,
  Sparkles,
  Target,
  Brain,
  TrendingUp,
} from "lucide-react";
import { AiSuspicionCard } from "./AiSuspicionCard";

export function DebriefStep({
  scenario,
  scores,
  aiEvaluation,
  evidenceViewed,
  investigationAnswers,
  chosenSolutionId,
  explanationText,
  startedAt,
}: {
  scenario: Scenario;
  scores: { investigation: number; solution: number; ai: number; total: number };
  aiEvaluation: AiGradingResponse | null;
  evidenceViewed?: string[];
  investigationAnswers?: Record<string, number | number[]>;
  chosenSolutionId?: string | null;
  explanationText?: string;
  startedAt?: number;
}) {
  const t = useTranslations("game.debrief");
  const locale = useLocale();

  const recordedRef = useRef(false);
  const [recordResult, setRecordResult] = useState<FinishCaseResult | null>(
    null
  );

  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const timeSpentSeconds = startedAt
      ? Math.max(0, Math.round((Date.now() - startedAt) / 1000))
      : 0;
    finishCaseAction({
      scenarioSlug: scenario.id,
      scores,
      evidenceViewed: evidenceViewed ?? [],
      investigationAnswers: investigationAnswers ?? {},
      chosenSolutionId: chosenSolutionId ?? null,
      explanationText: explanationText ?? "",
      aiEvaluation: aiEvaluation
        ? {
            scores: aiEvaluation.scores,
            comments: aiEvaluation.comments,
            total: aiEvaluation.total,
            overall: aiEvaluation.overall,
            flags: aiEvaluation.flags,
            aiSuspicionScore: aiEvaluation.aiSuspicionScore,
            aiSuspicionFlags: aiEvaluation.aiSuspicionFlags,
          }
        : null,
      timeSpentSeconds,
    })
      .then((res) => setRecordResult(res))
      .catch((err) => {
        // Never break the debrief UI on persistence failure
        console.error("[DebriefStep.finishCaseAction]", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="size-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse-glow">
          <Trophy className="size-10 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-4xl font-bold mb-2">{t("title")}</h2>
        <div className="text-6xl md:text-7xl font-display font-bold gradient-text font-numeric mt-4">
          {scores.total}
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
      </div>

      {recordResult?.ok && recordResult.recorded && (
        <Card className="mb-6 border-primary/40 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-display text-lg font-bold">
                +{recordResult.xpGained} XP
              </div>
              <div className="text-xs text-muted-foreground">
                {locale === "ru"
                  ? `Прогресс сохранён · Всего XP: ${recordResult.newXp}`
                  : `Прогресс сақталды · Барлық XP: ${recordResult.newXp}`}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {recordResult?.ok &&
        !recordResult.recorded &&
        recordResult.reason === "already_recorded" && (
          <Card className="mb-6 border-border/60 bg-muted/30">
            <CardContent className="p-3 text-sm text-muted-foreground text-center">
              {locale === "ru"
                ? "Этот кейс уже был засчитан — XP начисляется только за первое прохождение."
                : "Бұл кейс бұрын есепке алынған — XP тек алғашқы өту үшін беріледі."}
            </CardContent>
          </Card>
        )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ScoreCard
          icon={Target}
          label={t("investigation")}
          score={scores.investigation}
          max={scenario.scoring.breakdown.investigation}
        />
        <ScoreCard
          icon={Sparkles}
          label={t("solutionQuality")}
          score={scores.solution}
          max={scenario.scoring.breakdown.solutionChoice}
        />
        <ScoreCard
          icon={Brain}
          label={t("aiGrade")}
          score={scores.ai}
          max={scenario.scoring.breakdown.aiExplanation}
        />
      </div>

      {aiEvaluation?.flags?.offTopic && (
        <Card className="border-danger/40 bg-danger/5 mb-4">
          <CardContent className="p-4 flex items-start gap-3">
            <ExternalLink className="size-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-danger text-sm">
                {locale === "ru" ? "Эссе не по теме" : "Эссе тақырыпқа сай емес"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {locale === "ru"
                  ? "AI определил что эссе не относится к расследованию. Балл сильно снижен."
                  : "ЖИ эссе тергеуге қатысты емес деп тапты. Балл айтарлықтай төмендетілді."}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {aiEvaluation && (
        <Card className="detective-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-5 text-primary" />
              <h3 className="font-display text-xl font-bold">
                {t("aiGrade")}
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              {scenario.evaluationRubric.criteria.map((c) => {
                const score = aiEvaluation.scores[c.id] ?? 0;
                const comment = aiEvaluation.comments[c.id];
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

            <div className="p-4 bg-secondary/10 border-l-2 border-secondary rounded">
              <p className="font-serif text-sm leading-relaxed">
                {aiEvaluation.overall}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {aiEvaluation && (
        <AiSuspicionCard
          score={aiEvaluation.aiSuspicionScore ?? 0}
          flags={aiEvaluation.aiSuspicionFlags ?? []}
          locale={locale}
        />
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="size-5 text-warning" />
            <h3 className="font-display text-xl font-bold">{t("realWorld")}</h3>
          </div>
          <p className="font-serif leading-relaxed mb-4">
            {getLocalizedText(scenario.debrief.realWorld, locale)}
          </p>

          {scenario.debrief.sources.length > 0 && (
            <div>
              <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
                {t("sources")}
              </div>
              <div className="flex flex-wrap gap-2">
                {scenario.debrief.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
                  >
                    {getLocalizedText(s.label, locale)}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1 gap-2">
          <Link href="/student/dashboard">
            <Home className="size-4" />
            {t("backToDashboard")}
          </Link>
        </Button>
        {scenario.debrief.nextCaseHintId && (
          <Button asChild variant="outline" className="flex-1 gap-2">
            <Link href={`/student/case/${scenario.debrief.nextCaseHintId}` as never}>
              {t("nextCase")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  score,
  max,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  score: number;
  max: number;
}) {
  const pct = max === 0 ? 0 : Math.round((score / max) * 100);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs uppercase font-mono">
          <Icon className="size-4" />
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-numeric">{score}</span>
          <span className="text-sm text-muted-foreground">/{max}</span>
        </div>
        <Progress value={pct} className="mt-2 h-1" />
      </CardContent>
    </Card>
  );
}
