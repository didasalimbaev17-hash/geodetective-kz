"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Evidence, Scenario } from "@/schemas/case.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLocalizedText, localizeShortLabel } from "@/lib/utils";
import {
  Satellite,
  BarChart3,
  TrendingUp,
  Users,
  Camera,
  FileText,
  Check,
  ArrowRight,
  X,
} from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { SatelliteFrame } from "@/components/art/SatelliteCompare";
import { EvidencePhoto } from "@/components/art/EvidencePhoto";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TYPE_ICONS: Record<Evidence["type"], React.ComponentType<{ className?: string }>> = {
  satellite_compare: Satellite,
  chart: BarChart3,
  stat_card: TrendingUp,
  migration_data: Users,
  photo_gallery: Camera,
  text_doc: FileText,
};

const TYPE_LABELS: Record<Evidence["type"], { kk: string; ru: string }> = {
  satellite_compare: { kk: "Спутник суреттері", ru: "Спутник" },
  chart: { kk: "График", ru: "График" },
  stat_card: { kk: "Статистика", ru: "Статистика" },
  migration_data: { kk: "Көші-қон", ru: "Миграция" },
  photo_gallery: { kk: "Фото", ru: "Фото" },
  text_doc: { kk: "Құжат", ru: "Документ" },
};

export function EvidenceStep({
  scenario,
  viewed,
  onView,
  onContinue,
}: {
  scenario: Scenario;
  viewed: string[];
  onView: (id: string) => void;
  onContinue: () => void;
}) {
  const t = useTranslations("game.evidence");
  const locale = useLocale();
  const [openEvidence, setOpenEvidence] = useState<Evidence | null>(null);

  const required = scenario.evidence.filter((e) => e.required);
  const viewedRequired = required.filter((e) => viewed.includes(e.id)).length;
  const requiredProgress =
    required.length === 0 ? 100 : (viewedRequired / required.length) * 100;
  const canContinue = requiredProgress >= 70;

  function handleOpen(ev: Evidence) {
    setOpenEvidence(ev);
    onView(ev.id);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">{t("title")}</h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <p className="text-xs text-primary mt-3 inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          {locale === "ru"
            ? "💡 Кликни на любую карточку улики ниже — откроется детальная информация"
            : "💡 Төмендегі кез келген дәлел картасын басыңыз — толық ақпарат ашылады"}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">
                {t("viewedCount", {
                  viewed: viewed.length,
                  total: scenario.evidence.length,
                })}
              </span>
              <span className="text-muted-foreground font-mono">
                {Math.round(requiredProgress)}%
              </span>
            </div>
            <Progress value={requiredProgress} />
            <p className="text-xs text-muted-foreground mt-2">
              {t("requiredHint")}
            </p>
          </div>
          <Button onClick={onContinue} disabled={!canContinue} className="gap-2">
            {t("openEvidence")}
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenario.evidence.map((ev) => {
          const Icon = TYPE_ICONS[ev.type] ?? FileText;
          const isViewed = viewed.includes(ev.id);
          return (
            <Card
              key={ev.id}
              className={`detective-card group cursor-pointer transition-all hover:-translate-y-0.5 ${
                isViewed ? "border-success/40" : ""
              }`}
              onClick={() => handleOpen(ev)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  {isViewed && (
                    <Badge variant="success" className="gap-1">
                      <Check className="size-3" />
                    </Badge>
                  )}
                  {ev.required && !isViewed && (
                    <Badge variant="warning" className="text-xs">
                      {locale === "ru" ? "Важно" : "Маңызды"}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold leading-tight mb-1">
                  {getLocalizedText(ev.title, locale)}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {locale === "ru"
                    ? TYPE_LABELS[ev.type].ru
                    : TYPE_LABELS[ev.type].kk}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {openEvidence && (
        <EvidenceModal
          evidence={openEvidence}
          onClose={() => setOpenEvidence(null)}
          locale={locale}
          scenarioId={scenario.id}
        />
      )}
    </div>
  );
}

function EvidenceModal({
  evidence,
  onClose,
  locale,
  scenarioId,
}: {
  evidence: Evidence;
  onClose: () => void;
  locale: string;
  scenarioId: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <Card
        className="detective-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-display text-2xl font-bold">
              {getLocalizedText(evidence.title, locale)}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
          <EvidenceContent evidence={evidence} locale={locale} scenarioId={scenarioId} />
        </CardContent>
      </Card>
    </div>
  );
}

function EvidenceContent({
  evidence,
  locale,
  scenarioId,
}: {
  evidence: Evidence;
  locale: string;
  scenarioId: string;
}) {
  switch (evidence.type) {
    case "satellite_compare": {
      const c = evidence.content;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                {c.before.year}
              </div>
              <SatelliteFrame
                year={c.before.year}
                scenarioId={scenarioId}
                state="before"
                className="w-full aspect-square border border-border"
              />
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                {c.after.year}
              </div>
              <SatelliteFrame
                year={c.after.year}
                scenarioId={scenarioId}
                state="after"
                className="w-full aspect-square border border-border"
              />
            </div>
          </div>
          {c.annotation && (
            <p className="text-sm bg-primary/10 border-l-2 border-primary p-3 rounded">
              {getLocalizedText(c.annotation, locale)}
            </p>
          )}
        </div>
      );
    }
    case "chart": {
      const c = evidence.content;
      const dataKey = Object.keys(c.data[0] ?? {}).find(
        (k) => k !== c.xAxis
      ) as string;
      // Localize short xAxis labels (e.g. Kazakh month abbreviations) for RU
      const localizedData = c.data.map((row) => ({
        ...row,
        [c.xAxis]: localizeShortLabel(row[c.xAxis], locale),
      }));
      return (
        <div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={c.xAxis} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {c.caption && (
            <p className="text-sm text-muted-foreground mt-4">
              {getLocalizedText(c.caption, locale)}
            </p>
          )}
        </div>
      );
    }
    case "stat_card": {
      const c = evidence.content;
      return (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {c.values.map((v, i) => (
              <Card key={i} className="bg-surface">
                <CardContent className="p-4 text-center">
                  {v.year && (
                    <div className="text-xs font-mono text-muted-foreground mb-1">
                      {v.year}
                    </div>
                  )}
                  <div className="text-3xl font-bold font-numeric gradient-text">
                    {v.value.toLocaleString()}
                  </div>
                  {v.unit && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {getLocalizedText(v.unit, locale)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {c.caption && (
            <p className="text-sm text-muted-foreground">
              {getLocalizedText(c.caption, locale)}
            </p>
          )}
        </div>
      );
    }
    case "migration_data": {
      const c = evidence.content;
      return (
        <div>
          <div className="space-y-3 mb-4">
            {c.regions.map((r, i) => {
              const drop =
                r.population1960 && r.population2020
                  ? Math.round(
                      ((r.population1960 - r.population2020) /
                        r.population1960) *
                        100
                    )
                  : 0;
              return (
                <Card key={i} className="bg-surface">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {getLocalizedText(r.name, locale)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {r.population1960?.toLocaleString()} →{" "}
                        {r.population2020?.toLocaleString()}
                      </div>
                    </div>
                    <Badge variant={drop > 30 ? "destructive" : "warning"}>
                      −{drop}%
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {c.caption && (
            <p className="text-sm text-muted-foreground">
              {getLocalizedText(c.caption, locale)}
            </p>
          )}
        </div>
      );
    }
    case "photo_gallery": {
      const c = evidence.content;
      return (
        <div className="space-y-4">
          {c.images.map((img, i) => {
            // Identify themed SVG photo by seed in URL (avoids random picsum)
            const kindMatch = img.src.match(/seed\/([\w-]+)/);
            const kind = kindMatch ? kindMatch[1] : undefined;
            return (
              <div key={i}>
                <EvidencePhoto
                  kind={kind}
                  className="w-full aspect-video rounded-lg border border-border"
                />
                {img.caption && (
                  <p className="text-sm text-muted-foreground mt-2 italic font-serif">
                    {getLocalizedText(img.caption, locale)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    case "text_doc": {
      const c = evidence.content;
      return (
        <div className="prose-sm">
          {c.source && (
            <div className="text-xs font-mono uppercase text-muted-foreground mb-3 pb-3 border-b border-border">
              {getLocalizedText(c.source, locale)}
            </div>
          )}
          <p className="font-serif text-base leading-relaxed whitespace-pre-line">
            {getLocalizedText(c.body, locale)}
          </p>
        </div>
      );
    }
  }
}
