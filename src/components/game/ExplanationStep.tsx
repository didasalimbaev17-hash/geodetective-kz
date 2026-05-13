"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from "@/schemas/case.schema";
import type { AiGradingResponse } from "@/schemas/ai.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { countWords, getLocalizedText } from "@/lib/utils";
import { Loader2, Send, Sparkles, AlertCircle } from "lucide-react";

export function ExplanationStep({
  scenario,
  chosenSolutionId,
  investigationAnswers,
  evidenceViewed,
  onGraded,
}: {
  scenario: Scenario;
  chosenSolutionId: string;
  investigationAnswers: Record<string, number | number[]>;
  evidenceViewed: string[];
  onGraded: (grade: AiGradingResponse) => void;
}) {
  const t = useTranslations("game.explanation");
  const locale = useLocale();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(text);
  const minWords = scenario.explanationTask.minWords;
  const maxWords = scenario.explanationTask.maxWords;
  const valid = wordCount >= minWords && wordCount <= maxWords;

  async function handleSubmit() {
    setError(null);
    setPending(true);

    // Client-side hard timeout 90s (cold start + Claude can take 60+s on first hit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          essayText: text,
          chosenSolutionId,
          investigationAnswers,
          evidenceViewed,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const json = (await res.json()) as { grade: AiGradingResponse };
      if (!json.grade) throw new Error("No grade in response");
      onGraded(json.grade);
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort =
        err instanceof DOMException && err.name === "AbortError";
      const msg = isAbort
        ? "Превышено время ожидания (90с). Проверьте Vercel logs."
        : err instanceof Error
          ? err.message
          : "Unknown error";
      console.error("[grade fetch]", err);
      setError(
        locale === "ru"
          ? `Ошибка: ${msg}. Попробуйте ещё раз.`
          : `Қате: ${msg}. Қайта көріңіз.`
      );
      setPending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-display text-3xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="detective-card">
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-secondary/10 border-l-2 border-secondary rounded">
            <div className="text-xs font-mono uppercase text-secondary mb-1 tracking-wider">
              {locale === "ru" ? "Задание" : "Тапсырма"}
            </div>
            <p className="font-serif text-base">
              {getLocalizedText(scenario.explanationTask.prompt, locale)}
            </p>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            rows={10}
            className="font-serif text-base leading-relaxed"
            disabled={pending}
          />

          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-sm font-mono ${
                valid ? "text-success" : "text-muted-foreground"
              }`}
            >
              {t("wordCount", { count: wordCount })}
            </span>
            <span className="text-xs text-muted-foreground">
              {wordCount < minWords
                ? t("minWords", { min: minWords })
                : wordCount > maxWords
                  ? t("maxWords", { max: maxWords })
                  : ""}
            </span>
          </div>
          <Progress
            value={Math.min(100, (wordCount / minWords) * 100)}
            className="h-1 mt-2"
          />

          {pending && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-md flex items-center gap-3">
              <Sparkles className="size-5 text-primary animate-pulse" />
              <span className="text-sm flex-1">{t("gradingInProgress")}</span>
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-md flex items-start gap-2 text-sm text-danger">
              <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            size="lg"
            className="w-full mt-6 gap-2 shadow-glow-primary"
            disabled={!valid || pending}
            onClick={handleSubmit}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {t("submitForGrading")}
          </Button>

          {pending && (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {locale === "ru"
                ? "Это может занять до 30 секунд..."
                : "Бұл 30 секундқа дейін уақыт алуы мүмкін..."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
