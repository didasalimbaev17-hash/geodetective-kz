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
    <div className="mt-3 pt-3 border-t border-border/40 space-y-4">
      {active.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider font-semibold">
            <ShoppingBag className="size-3.5 text-success" />
            <span className="text-success">
              {locale === "ru" ? "Купил — ждёт применения" : "Сатып алды — қолдануды күтуде"}
            </span>
            <span className="text-muted-foreground">({active.length})</span>
          </div>
          <div className="space-y-1.5">
            {active.map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Sparkles;
              const title = locale === "ru" ? p.titleRu : p.titleKk;
              const purchasedAt = dateFormatter.format(new Date(p.purchasedAt));
              return (
                <div
                  key={p.purchaseId}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-md bg-success/5 border border-success/20"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="size-8 rounded-md bg-success/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="size-4 text-success" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium leading-tight">
                        {title}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        −{p.costPaid} XP ·{" "}
                        {locale === "ru" ? "куплено " : "сатып алынды "}
                        {purchasedAt}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs gap-1 border-success/40 text-success hover:bg-success/10 flex-shrink-0"
                    disabled={pending}
                    onClick={() => handleApply(p.purchaseId)}
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
          <div className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider font-semibold">
            <Clock className="size-3.5" />
            <span>
              {locale === "ru"
                ? "Уже применено учителем"
                : "Мұғалім қолдандыр"}
            </span>
            <span className="text-muted-foreground">({used.length})</span>
            <span className="ml-auto font-mono normal-case text-[11px] text-muted-foreground">
              {locale === "ru" ? "Потрачено: " : "Жұмсалды: "}
              <span className="text-foreground">{totalSpent} XP</span>
            </span>
          </div>
          <div className="space-y-1">
            {used.slice(0, 6).map((p) => {
              const Icon = ICON_MAP[p.icon] ?? Sparkles;
              const title = locale === "ru" ? p.titleRu : p.titleKk;
              const purchasedAt = dateFormatter.format(new Date(p.purchasedAt));
              const usedAt = p.usedAt
                ? dateFormatter.format(new Date(p.usedAt))
                : "—";
              return (
                <div
                  key={p.purchaseId}
                  className="flex items-center gap-2.5 p-2 rounded-md bg-muted/10 border border-border/30"
                >
                  <div className="size-7 rounded-md bg-muted/30 flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="size-3.5 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium leading-tight text-muted-foreground">
                      {title}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">
                      −{p.costPaid} XP ·{" "}
                      {locale === "ru" ? "куплено " : "сатып алынды "}
                      {purchasedAt}
                      {p.usedAt && (
                        <>
                          {" · "}
                          {locale === "ru" ? "применено " : "қолданылды "}
                          {usedAt}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {used.length > 6 && (
              <div className="text-[10px] text-muted-foreground px-2 py-1 text-center">
                +{used.length - 6}{" "}
                {locale === "ru" ? "ещё" : "тағы"}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
