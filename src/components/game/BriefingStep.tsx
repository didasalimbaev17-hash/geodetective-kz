"use client";

import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalizedText } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";
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
      <Card className="detective-card overflow-hidden">
        <div className="relative aspect-[21/9] overflow-hidden">
          <SafeImage
            src={scenario.briefing.backgroundImage ?? ""}
            alt=""
            fallbackLabel={getLocalizedText(scenario.meta.title, locale)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute inset-0 scan-effect" />
        </div>

        <CardContent className="p-8 md:p-12">
          <div className="flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-widest text-primary">
            <FileWarning className="size-4" />
            <span>
              {scenario.briefing.narrator ?? t("narrator")}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold mb-2 text-balance leading-tight">
            {getLocalizedText(scenario.meta.title, locale)}
          </h1>

          {scenario.meta.subtitle && (
            <p className="text-lg text-muted-foreground mb-8">
              {getLocalizedText(scenario.meta.subtitle, locale)}
            </p>
          )}

          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-secondary" />
            <span className="font-mono">
              {scenario.region.center.lat.toFixed(2)}°N,{" "}
              {scenario.region.center.lng.toFixed(2)}°E
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-primary/40 mb-10">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90">
              {getLocalizedText(scenario.briefing.intro, locale)}
            </p>
          </div>

          <Button onClick={onStart} size="lg" className="gap-2 group">
            {t("startInvestigation")}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
