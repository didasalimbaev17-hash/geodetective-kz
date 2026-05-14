"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { setGradeAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, GraduationCap, Loader2 } from "lucide-react";

export function GradePicker({ currentGrade }: { currentGrade: "10" | "11" | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [grade, setGrade] = useState<"10" | "11">(currentGrade ?? "10");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await setGradeAction(grade);
      if (!res.ok) {
        setError(
          locale === "ru"
            ? `Не удалось сохранить (${res.error ?? "ошибка"})`
            : `Сақтау сәтсіз (${res.error ?? "қате"})`
        );
        return;
      }
      router.refresh();
    });
  }

  return (
    <Card className="mb-6 border-warning/40 bg-warning/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <GraduationCap className="size-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">
              {locale === "ru" ? "Укажите класс" : "Сыныпты көрсетіңіз"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {locale === "ru"
                ? "Чтобы видеть кейсы своего класса. Можно изменить позже."
                : "Сыныбыңыздың кейстерін көру үшін. Кейін өзгертуге болады."}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {(["10", "11"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={cn(
                "py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                grade === g
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-border/80 text-muted-foreground"
              )}
            >
              {g === "10" ? t("auth.grade10") : t("auth.grade11")}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md p-3 mb-3">
            <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button onClick={handleSave} disabled={pending} className="w-full sm:w-auto">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("common.save")}
        </Button>
      </CardContent>
    </Card>
  );
}
