"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Scenario, Solution } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocalizedText } from "@/lib/utils";
import {
  Shield,
  Leaf,
  GitBranch,
  Wheat,
  AlertTriangle,
  ArrowRight,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  leaf: Leaf,
  pipeline: GitBranch,
  wheat: Wheat,
  "alert-triangle": AlertTriangle,
  dam: Shield,
};

export function SolutionStep({
  scenario,
  onChoose,
}: {
  scenario: Scenario;
  onChoose: (solutionId: string) => void;
}) {
  const t = useTranslations("game.solution");
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {scenario.solutions.map((sol) => (
          <SolutionCard
            key={sol.id}
            solution={sol}
            locale={locale}
            selected={selected === sol.id}
            onSelect={() => setSelected(sol.id)}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        disabled={!selected}
        onClick={() => selected && onChoose(selected)}
      >
        {t("choose")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function SolutionCard({
  solution,
  locale,
  selected,
  onSelect,
}: {
  solution: Solution;
  locale: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations("game.solution");
  const Icon = ICONS[solution.icon ?? ""] ?? Shield;

  return (
    <Card
      className={cn(
        "detective-card cursor-pointer transition-all",
        selected
          ? "border-primary ring-2 ring-primary/30 -translate-y-1"
          : "hover:border-primary/40 hover:-translate-y-0.5"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="size-5 text-primary" />
          </div>
          {selected && (
            <Badge variant="success" className="font-mono uppercase text-xs">
              ✓
            </Badge>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg leading-tight mb-1">
          {getLocalizedText(solution.title, locale)}
        </h3>

        {solution.short && (
          <p className="text-sm text-muted-foreground mb-4">
            {getLocalizedText(solution.short, locale)}
          </p>
        )}

        {solution.tradeoffs && (
          <div className="text-xs bg-warning/10 border-l-2 border-warning p-2 rounded mb-4">
            <div className="font-semibold text-warning mb-1">
              {t("tradeoffs")}:
            </div>
            <div className="text-foreground/80">
              {getLocalizedText(solution.tradeoffs, locale)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border text-xs font-mono">
          {solution.costMillionUsd !== undefined && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="size-3" />
              <span>{solution.costMillionUsd} {t("millionUsd")}</span>
            </div>
          )}
          {solution.timeYears !== undefined && solution.timeYears > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3" />
              <span>{solution.timeYears} {t("timeYears")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
