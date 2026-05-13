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
  {
    icon: React.ComponentType<{ className?: string }>;
    label_kk: string;
    label_ru: string;
    unit_kk: string;
    unit_ru: string;
    tone: string;
  }
> = {
  waterLevel: {
    icon: Waves,
    label_kk: "Су деңгейі",
    label_ru: "Уровень воды",
    unit_kk: "м",
    unit_ru: "м",
    tone: "text-secondary",
  },
  fishTons: {
    icon: Fish,
    label_kk: "Балық аулау",
    label_ru: "Улов рыбы",
    unit_kk: "т/жыл",
    unit_ru: "т/год",
    tone: "text-success",
  },
  salinityGL: {
    icon: TestTube2,
    label_kk: "Тұздылық",
    label_ru: "Солёность",
    unit_kk: "г/л",
    unit_ru: "г/л",
    tone: "text-warning",
  },
  populationAralsk: {
    icon: Users,
    label_kk: "Аралск халқы",
    label_ru: "Население Аральска",
    unit_kk: "адам",
    unit_ru: "чел.",
    tone: "text-primary",
  },
  pm25Winter: {
    icon: Waves,
    label_kk: "PM2.5 қыста",
    label_ru: "PM2.5 зимой",
    unit_kk: "мкг/м³",
    unit_ru: "мкг/м³",
    tone: "text-warning",
  },
  healthIndex: {
    icon: Users,
    label_kk: "Денсаулық индексі",
    label_ru: "Индекс здоровья",
    unit_kk: "%",
    unit_ru: "%",
    tone: "text-success",
  },
  cancerCases: {
    icon: TestTube2,
    label_kk: "Қатерлі ісік (100 000-ға)",
    label_ru: "Онкология (на 100 000)",
    unit_kk: "жағдай",
    unit_ru: "случ.",
    tone: "text-danger",
  },
  sealPopulation: {
    icon: Fish,
    label_kk: "Тюлень саны",
    label_ru: "Популяция тюленей",
    unit_kk: "дана",
    unit_ru: "особ.",
    tone: "text-primary",
  },
  oilProd: {
    icon: TestTube2,
    label_kk: "Мұнай өндірісі",
    label_ru: "Добыча нефти",
    unit_kk: "млн т/жыл",
    unit_ru: "млн т/год",
    tone: "text-warning",
  },
  waterFlow: {
    icon: Waves,
    label_kk: "Су ағыны",
    label_ru: "Сток",
    unit_kk: "км³/жыл",
    unit_ru: "км³/год",
    tone: "text-secondary",
  },
  pollutionIndex: {
    icon: TestTube2,
    label_kk: "Ластану индексі",
    label_ru: "Индекс загрязнения",
    unit_kk: "%",
    unit_ru: "%",
    tone: "text-danger",
  },
};

type SolutionEffects = Record<string, unknown>;

/**
 * Применяет эффекты выбранного решения к базовым snapshot-индикаторам.
 * Возвращает три новых snapshot'а (t=0, t=0.5, t=1.0) с правильными значениями.
 */
function buildScenarioSnapshots(
  scenario: Scenario,
  chosenSolutionId: string | null
) {
  const baseSnaps = scenario.simulation.snapshots;
  if (!chosenSolutionId) return baseSnaps;

  const solution = scenario.solutions.find((s) => s.id === chosenSolutionId);
  if (!solution) return baseSnaps;

  const effects = (solution.effects ?? {}) as SolutionEffects;
  const baseIndicators = (baseSnaps[0]?.indicators ?? {}) as Record<
    string,
    number
  >;

  // Compute final indicators (t=1.0)
  const finalIndicators: Record<string, number> = { ...baseIndicators };
  for (const key of Object.keys(baseIndicators)) {
    const base = Number(baseIndicators[key] ?? 0);
    const eff = effects[key] as
      | { delta?: number; north?: number; south?: number; west?: number; east?: number; unit?: string }
      | undefined;
    if (!eff) continue;

    // 1) Absolute delta in physical unit (m, °C, и т.д.)
    if (typeof eff.delta === "number" && (!eff.unit || eff.unit === "m" || eff.unit === "%")) {
      if (eff.unit === "%") {
        finalIndicators[key] = base * (1 + eff.delta / 100);
      } else {
        finalIndicators[key] = base + eff.delta;
      }
    } else if (typeof eff.north === "number") {
      // Two-part lake: take north
      if (eff.unit === "%") {
        finalIndicators[key] = base * (1 + eff.north / 100);
      } else {
        finalIndicators[key] = base + eff.north;
      }
    } else if (typeof eff.west === "number") {
      finalIndicators[key] = base + eff.west;
    }
  }

  // Cross-mappings (when effect key != indicator key)
  // fishIndustry % → fishTons
  const fish = (effects.fishIndustry as { delta?: number } | undefined)?.delta;
  if (typeof fish === "number" && "fishTons" in baseIndicators) {
    finalIndicators.fishTons = Math.max(0, baseIndicators.fishTons * (1 + fish / 100));
  }
  // populationAralsk
  const popAralsk = (effects.populationAralsk as { delta?: number } | undefined)?.delta;
  if (typeof popAralsk === "number" && "populationAralsk" in baseIndicators) {
    finalIndicators.populationAralsk = Math.max(0, baseIndicators.populationAralsk * (1 + popAralsk / 100));
  }
  // sealPopulation
  const seal = (effects.sealPopulation as { delta?: number } | undefined)?.delta;
  if (typeof seal === "number" && "sealPopulation" in baseIndicators) {
    finalIndicators.sealPopulation = Math.max(0, baseIndicators.sealPopulation * (1 + seal / 100));
  }
  // healthIndex
  const health = (effects.healthIndex as { delta?: number } | undefined)?.delta;
  if (typeof health === "number" && "healthIndex" in baseIndicators) {
    finalIndicators.healthIndex = Math.max(0, Math.min(100, baseIndicators.healthIndex + health));
  }
  // pollution → pollutionIndex
  const pollution = (effects.pollution as { delta?: number } | undefined)?.delta;
  if (typeof pollution === "number" && "pollutionIndex" in baseIndicators) {
    finalIndicators.pollutionIndex = Math.max(0, Math.min(100, baseIndicators.pollutionIndex + pollution));
  }
  // pm25
  const pm25 = (effects.pm25 as { delta?: number } | undefined)?.delta;
  if (typeof pm25 === "number" && "pm25Winter" in baseIndicators) {
    finalIndicators.pm25Winter = Math.max(0, baseIndicators.pm25Winter * (1 + pm25 / 100));
  }
  // cancerCases (positive delta = improvement = lower)
  if (typeof health === "number" && "cancerCases" in baseIndicators) {
    finalIndicators.cancerCases = Math.max(0, baseIndicators.cancerCases * (1 - health / 100));
  }
  // waterFlow (km3/yr)
  const waterFlow = (effects.waterFlow as { delta?: number } | undefined)?.delta;
  if (typeof waterFlow === "number" && "waterFlow" in baseIndicators) {
    finalIndicators.waterFlow = Math.max(0, baseIndicators.waterFlow + waterFlow);
  }

  // Mid snapshot = halfway между base и final
  const midIndicators: Record<string, number> = {};
  for (const key of Object.keys(baseIndicators)) {
    midIndicators[key] = (baseIndicators[key] + (finalIndicators[key] ?? baseIndicators[key])) / 2;
  }

  return [
    { ...baseSnaps[0], indicators: baseIndicators },
    { ...(baseSnaps[1] ?? baseSnaps[0]), t: 0.5, indicators: midIndicators },
    {
      ...(baseSnaps[baseSnaps.length - 1] ?? baseSnaps[0]),
      t: 1,
      indicators: finalIndicators,
    },
  ];
}

export function SimulationStep({
  scenario,
  chosenSolutionId,
  onContinue,
}: {
  scenario: Scenario;
  chosenSolutionId: string | null;
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

  // Snapshots adjusted by chosen solution's effects
  const snapshots = buildScenarioSnapshots(scenario, chosenSolutionId);
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
                      {locale === "ru" ? meta.unit_ru : meta.unit_kk}
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
