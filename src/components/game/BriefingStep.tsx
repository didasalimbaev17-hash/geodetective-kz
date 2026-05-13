"use client";

import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalizedText } from "@/lib/utils";
import { CaseCover } from "@/components/art/CaseCover";
import { ArrowRight, FileWarning, MapPin } from "lucide-react";

export function BriefingStep({
  scenario,
  onStart,
}: {
  scenario: Scenario;
  onStart: () => void;
}) {
  const t = useTranslations("game.briefing");
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="detective-card overflow-hidden relative">
        <div className="relative aspect-[21/9] overflow-hidden">
          <CaseCover slug={scenario.id} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-card/10" />
          <div className="absolute inset-0 scan-effect" />

          {/* Classified stamp */}
          <div className="absolute top-6 right-6 stamp text-danger border-danger bg-danger/10 backdrop-blur-md">
            CLASSIFIED
          </div>
        </div>

        <CardContent className="p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 w-64 h-64 compass-decor opacity-10 pointer-events-none" />

          <div className="flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-[0.2em] text-primary">
            <div className="size-2 rounded-full bg-primary animate-pulse-glow" />
            <FileWarning className="size-4" />
            <span>
              {(() => {
                const n = scenario.briefing.narrator;
                if (!n) return t("narrator");
                if (typeof n === "string") return n;
                return getLocalizedText(n, locale);
              })()}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-3 text-balance leading-[0.95]">
            <span className="gradient-text">
              {getLocalizedText(scenario.meta.title, locale)}
            </span>
          </h1>

          {scenario.meta.subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-serif italic">
              {getLocalizedText(scenario.meta.subtitle, locale)}
            </p>
          )}

          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel">
            <MapPin className="size-4 text-secondary" />
            <span className="font-mono text-xs">
              {scenario.region.center.lat.toFixed(2)}°N,{" "}
              {scenario.region.center.lng.toFixed(2)}°E
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-primary/60 mb-10 py-1">
            <div className="absolute -left-1.5 top-0 size-3 rounded-full bg-primary shadow-glow-primary" />
            <div className="absolute -left-1.5 bottom-0 size-3 rounded-full bg-primary/40" />
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90">
              {getLocalizedText(scenario.briefing.intro, locale)}
            </p>
          </div>

          <Button onClick={onStart} size="lg" className="gap-2 group shadow-glow-primary h-14 px-8 text-base">
            {t("startInvestigation")}
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
