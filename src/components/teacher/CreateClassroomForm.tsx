"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { createClassroomAction } from "@/server/actions/classrooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Loader2, AlertCircle, X } from "lucide-react";

export function CreateClassroomForm({
  triggerLabel,
}: {
  triggerLabel: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<"10" | "11">("10");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError(
        locale === "ru" ? "Введите имя класса" : "Сынып атауын енгізіңіз"
      );
      return;
    }
    startTransition(async () => {
      const res = await createClassroomAction({ name: name.trim(), grade });
      if (!res.ok) {
        setError(
          locale === "ru"
            ? `Не удалось создать класс (${res.error})`
            : `Сынып құру сәтсіз (${res.error})`
        );
        return;
      }
      setOpen(false);
      setName("");
      router.refresh();
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="size-4" />
        {triggerLabel}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <Card
            className="detective-card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold">
                  {t("teacher.createClass")}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="className">
                    {locale === "ru" ? "Имя класса" : "Сынып атауы"}
                  </Label>
                  <Input
                    id="className"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      locale === "ru" ? "10А, Группа 1..." : "10А, 1-топ..."
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("auth.chooseGrade")}</Label>
                  <div className="grid grid-cols-2 gap-2">
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
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md p-3">
                    <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" disabled={pending} className="w-full">
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {t("common.save")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
