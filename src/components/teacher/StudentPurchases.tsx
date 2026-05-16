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

  function handleApply(purchaseId: string) {
    setError(null);
    startTransition(async () => {
      const res = await teacherMarkPurchaseUsedAction(purchaseId, classroomId);
      if (!res.ok) {
        setError(locale === "ru" ? "Ошибка" : "Қате");
      }
    });
  }

  return (
    <div className="mt-3 pt-3 border-t border-border/40">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
        <ShoppingBag className="size-3" />
        {t("title")} ({purchases.length})
      </div>
      <div className="flex flex-wrap gap-2">
        {purchases.map((p) => {
          const Icon = ICON_MAP[p.icon] ?? Sparkles;
          const title = locale === "ru" ? p.titleRu : p.titleKk;
          return (
            <div
              key={p.purchaseId}
              className="inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-md bg-secondary/15 border border-secondary/30 text-xs"
            >
              <Icon className="size-3.5 text-secondary" strokeWidth={1.5} />
              <span className="font-medium truncate max-w-[200px]">
                {title}
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
      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
