"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Question, Scenario } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocalizedText, getLocalizedArray } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function InvestigationStep({
  scenario,
  onSubmit,
}: {
  scenario: Scenario;
  onSubmit: (answers: Record<string, number | number[]>) => void;
}) {
  const t = useTranslations("game.investigation");
  const locale = useLocale();
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});

  function setSingle(qId: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  }

  function toggleMulti(qId: string, idx: number) {
    setAnswers((prev) => {
      const current = (prev[qId] as number[]) ?? [];
      const set = new Set(current);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      return { ...prev, [qId]: [...set].sort() };
    });
  }

  const allAnswered = scenario.investigationQuestions.every(
    (q) => answers[q.id] !== undefined
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {scenario.investigationQuestions.map((q, qIdx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={qIdx}
            locale={locale}
            value={answers[q.id]}
            onSingle={(idx) => setSingle(q.id, idx)}
            onToggleMulti={(idx) => toggleMulti(q.id, idx)}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="w-full mt-8 gap-2"
        disabled={!allAnswered}
        onClick={() => onSubmit(answers)}
      >
        {t("title")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  locale,
  value,
  onSingle,
  onToggleMulti,
}: {
  question: Question;
  index: number;
  locale: string;
  value: number | number[] | undefined;
  onSingle: (idx: number) => void;
  onToggleMulti: (idx: number) => void;
}) {
  const options = getLocalizedArray(question.options, locale);
  const isMulti = question.kind === "multi_choice";

  return (
    <Card className="detective-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-sm text-primary">
              {index + 1}
            </div>
            <h3 className="font-semibold leading-tight">
              {getLocalizedText(question.prompt, locale)}
            </h3>
          </div>
          {isMulti && (
            <Badge variant="outline" className="text-xs">
              Бірнеше
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {options.map((opt, i) => {
            const selected = isMulti
              ? Array.isArray(value) && value.includes(i)
              : value === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() =>
                  isMulti ? onToggleMulti(i) : onSingle(i)
                }
                className={cn(
                  "w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-border/80 hover:bg-surface"
                )}
              >
                <div
                  className={cn(
                    "size-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors",
                    isMulti ? "rounded-md" : "rounded-full",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </div>
                <span className="text-sm">{opt}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
