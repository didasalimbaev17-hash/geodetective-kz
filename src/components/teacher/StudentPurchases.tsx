"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  RefreshCcw,
  PlusCircle,
  Shield,
  MapPin,
  Users,
  Zap,
  Music,
  Sparkles,
  ShoppingBag,
  Clock,
} from "lucide-react";
import {
  teacherMarkPurchaseUsedAction,
  type StudentActivePurchase,
} from "@/server/actions/shop";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "refresh-ccw": RefreshCcw,
  "plus-circle": PlusCircle,
  shield: Shield,
  "map-pin": MapPin,
  users: Users,
  zap: Zap,
  music: Music,
};

export function StudentPurchases({
  purchases,
  classroomId,
  locale,
}: {
  purchases: StudentActivePurchase[];
  classroomId: string;
  locale: "kk" | "ru";
}) {
  const t = useTranslations("teacher.purchases");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (purchases.length === 0) return null;

  const active = purchases.filter((p) => p.state === "active");
  const used = purchases.filter((p) => p.state === "used");

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-RU" : "kk-KZ",
    { day: "2-digit", month: "short" }
  );

  function handleApply(purchaseId: string) {
    setError(null);
    startTransition(async () => {
      const res = await teacherMarkPurchaseUsedAction(purchaseId, classroomId);
      if (!res.ok) {
        setError(locale === "ru" ? "Ошибка" : "Қате");
      }
    });
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.costPaid, 0);

  return (
    <div className="mt-3 pt-3 border-t border-border/40 space-y-3">
      {active.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
            <ShoppingBag className="size-3 text-success" />
            {t("title")} ({active.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {active.map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Sparkles;
              const title = locale === "ru" ? p.titleRu : p.titleKk;
              return (
                <div
                  key={p.purchaseId}
                  className="inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-md bg-success/10 border border-success/30 text-xs"
                >
                  <Icon className="size-3.5 text-success" strokeWidth={1.5} />
                  <span className="font-medium truncate max-w-[200px]">
                    {title}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    −{p.costPaid} XP
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs gap-1 text-success hover:text-success hover:bg-success/10"
                    disabled={pending}
                    onClick={() => handleApply(p.purchaseId)}
                    title={t("apply")}
                  >
                    <CheckCircle2 className="size-3.5" />
                    {t("apply")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {used.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Clock className="size-3" />
            {locale === "ru" ? "Использовано" : "Қолданылған"} ({used.length})
            <span className="ml-auto font-mono normal-case text-[10px]">
              {locale === "ru" ? "Всего: " : "Барлығы: "}
              {totalSpent} XP
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {used.slice(0, 8).map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Sparkles;
              const title = locale === "ru" ? p.titleRu : p.titleKk;
              const date = p.usedAt
                ? dateFormatter.format(new Date(p.usedAt))
                : "—";
              return (
                <div
                  key={p.purchaseId}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/20 border border-border/40 text-[11px] text-muted-foreground"
                  title={`${title} · ${p.costPaid} XP · ${date}`}
                >
                  <Icon className="size-3 opacity-70" strokeWidth={1.5} />
                  <span className="truncate max-w-[140px] line-through">
                    {title}
                  </span>
                  <span className="font-mono">{date}</span>
                </div>
              );
            })}
            {used.length > 8 && (
              <span className="text-[10px] text-muted-foreground px-2 py-0.5">
                +{used.length - 8}
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
