"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Scenario } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLocalizedText } from "@/lib/utils";
import {
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Waves,
  Fish,
  TestTube2,
  Users,
} from "lucide-react";

const INDICATOR_META: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; label_kk: string; label_ru: string; unit: string; tone: string }
> = {
  waterLevel: {
    icon: Waves,
    label_kk: "Су деңгейі",
    label_ru: "Уровень воды",
    unit: "м",
    tone: "text-secondary",
  },
  fishTons: {
    icon: Fish,
    label_kk: "Балық аулау",
    label_ru: "Улов рыбы",
    unit: "т/жыл",
    tone: "text-success",
  },
  salinityGL: {
    icon: TestTube2,
    label_kk: "Тұздылық",
    label_ru: "Солёность",
    unit: "г/л",
    tone: "text-warning",
  },
  populationAralsk: {
    icon: Users,
    label_kk: "Аралск халқы",
    label_ru: "Население",
    unit: "адам",
    tone: "text-primary",
  },
};

export function SimulationStep({
  scenario,
  onContinue,
}: {
  scenario: Scenario;
  onContinue: () => void;
}) {
  const t = useTranslations("game.simulation");
  const locale = useLocale();

  const [progress, setProgress] = useState(0); // 0..1
  const [playing, setPlaying] = useState(true);
  const durationMs = (scenario.simulation.durationSeconds ?? 8) * 1000;

  useEffect(() => {
    if (!playing) return;
    const start = Date.now() - progress * durationMs;
    let frame: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, durationMs]);

  // Find current and next snapshot for interpolation
  const snapshots = scenario.simulation.snapshots;
  const currentSnap =
    [...snapshots].reverse().find((s) => s.t <= progress) ?? snapshots[0];
  const nextSnap =
    snapshots.find((s) => s.t > progress) ?? snapshots[snapshots.length - 1];

  const interpolatedIndicators: Record<string, number> = {};
  if (currentSnap && nextSnap && currentSnap !== nextSnap) {
    const span = nextSnap.t - currentSnap.t;
    const localT = span === 0 ? 0 : (progress - currentSnap.t) / span;
    for (const key of Object.keys(currentSnap.indicators ?? {})) {
      const a = Number(currentSnap.indicators?.[key] ?? 0);
      const b = Number(nextSnap.indicators?.[key] ?? a);
      interpolatedIndicators[key] = a + (b - a) * localT;
    }
  } else if (currentSnap?.indicators) {
    for (const key of Object.keys(currentSnap.indicators)) {
      interpolatedIndicators[key] = Number(currentSnap.indicators[key]);
    }
  }

  // For map morphing — simplified: SVG circle that grows
  const lakeArea = interpolatedIndicators.waterLevel
    ? (interpolatedIndicators.waterLevel / 30) * 100
    : 50;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="font-display text-3xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* MAP / VISUALIZATION */}
        <Card className="detective-card lg:col-span-2 overflow-hidden">
          <CardContent className="p-0 relative aspect-video bg-gradient-to-br from-surface to-card">
            <svg
              viewBox="0 0 400 240"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Desert / land base */}
              <rect width="400" height="240" fill="hsl(38 30% 25%)" opacity="0.3" />

              {/* Lake — area scales with waterLevel */}
              <motion.ellipse
                cx="200"
                cy="120"
                rx={50 + lakeArea * 0.8}
                ry={30 + lakeArea * 0.5}
                fill="hsl(193 56% 51%)"
                fillOpacity="0.7"
                stroke="hsl(193 60% 70%)"
                strokeWidth="1.5"
                animate={{
                  rx: 50 + lakeArea * 0.8,
                  ry: 30 + lakeArea * 0.5,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Salt crust around lake (visible when salinity high) */}
              {interpolatedIndicators.salinityGL > 80 && (
                <ellipse
                  cx="200"
                  cy="120"
                  rx={60 + lakeArea * 0.9}
                  ry={40 + lakeArea * 0.6}
                  fill="none"
                  stroke="hsl(0 0% 90%)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity={Math.min(0.8, (interpolatedIndicators.salinityGL - 80) / 80)}
                />
              )}

              {/* Rivers */}
              <path
                d="M 30 60 Q 100 80 180 110"
                fill="none"
                stroke="hsl(193 56% 51%)"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="200"
                strokeDashoffset={200 - progress * 200}
              />
              <path
                d="M 370 70 Q 290 90 220 115"
                fill="none"
                stroke="hsl(193 56% 51%)"
                strokeWidth="2"
                strokeOpacity="0.7"
                strokeDasharray="200"
                strokeDashoffset={200 - progress * 200}
              />

              {/* Scanline overlay */}
              <rect
                width="400"
                height="2"
                y={progress * 240}
                fill="hsl(38 78% 57%)"
                opacity="0.6"
              />
            </svg>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPlaying((p) => !p)}
                className="bg-card/80 backdrop-blur-sm"
              >
                {playing ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setProgress(0);
                  setPlaying(true);
                }}
                className="bg-card/80 backdrop-blur-sm"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>{t("today")}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentSnap?.t}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-primary font-bold"
                  >
                    {getLocalizedText(currentSnap?.label, locale)}
                  </motion.span>
                </AnimatePresence>
                <span>{t("future20y")}</span>
              </div>
              <Progress value={progress * 100} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* INDICATORS */}
        <div className="space-y-3">
          {Object.entries(interpolatedIndicators).map(([key, value]) => {
            const meta = INDICATOR_META[key];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <Card key={key} className="bg-surface/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${meta.tone}`} />
                      <span className="text-xs text-muted-foreground">
                        {locale === "ru" ? meta.label_ru : meta.label_kk}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-2xl font-bold font-numeric ${meta.tone}`}>
                      {value.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {meta.unit}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        disabled={progress < 1}
        onClick={onContinue}
      >
        {progress < 1 ? `${Math.round(progress * 100)}%` : t("title")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
