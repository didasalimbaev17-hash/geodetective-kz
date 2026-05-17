"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  X,
  Loader2,
  Plus,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { submitCaseIdeaAction } from "@/server/actions/caseIdeas";
import { useRouter } from "@/i18n/routing";

export function RequestCaseDialog({ trigger }: { trigger: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const isRu = locale === "ru";

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState<"10" | "11" | "any">("any");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function reset() {
    setTitle("");
    setGrade("any");
    setRegion("");
    setDescription("");
    setError(null);
    setSuccess(false);
  }

  function close() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  function handleSubmit() {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError(isRu ? "Заполните название и описание" : "Атау мен сипаттаманы толтырыңыз");
      return;
    }
    startTransition(async () => {
      const res = await submitCaseIdeaAction({
        title,
        grade: grade === "any" ? null : grade,
        region,
        description,
      });
      if (!res.ok) {
        const msg =
          res.error === "not_teacher"
            ? isRu ? "Только учитель может предлагать кейсы" : "Тек мұғалім кейс ұсына алады"
            : res.error === "missing_fields"
              ? isRu ? "Заполните название и описание" : "Атау мен сипаттаманы толтырыңыз"
              : res.error === "title_too_long"
                ? isRu ? "Название слишком длинное (макс. 200)" : "Атау тым ұзын (макс. 200)"
                : res.error === "description_too_long"
                  ? isRu ? "Описание слишком длинное (макс. 2000)" : "Сипаттама тым ұзын (макс. 2000)"
                  : isRu ? "Ошибка отправки" : "Жіберу қатесі";
        setError(msg);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={close}
        >
          <Card
            className="detective-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="size-10 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center">
                    <Lightbulb className="size-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-tight">
                      {isRu ? "Предложите свой кейс" : "Өз кейсіңізді ұсыныңыз"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isRu
                        ? "Конструктор готовится. А пока расскажите идею — мы добавим её в очередь."
                        : "Конструктор дайындалуда. Ал сіз идеяңызды бөлісіңіз — оны кезекке қосамыз."}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={close}>
                  <X className="size-4" />
                </Button>
              </div>

              {success ? (
                <div className="py-8 text-center">
                  <div className="size-14 mx-auto mb-3 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                    <CheckCircle2 className="size-7 text-success" />
                  </div>
                  <h4 className="font-display text-lg font-bold mb-2">
                    {isRu ? "Спасибо за идею!" : "Идеяңыз үшін рахмет!"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                    {isRu
                      ? "Мы рассмотрим вашу заявку и свяжемся с вами. Статус виден в кабинете."
                      : "Біз сіздің өтінішіңізді қарап шығамыз және сізбен байланысамыз. Мәртебесі кабинетте көрінеді."}
                  </p>
                  <Button onClick={close} variant="outline">
                    {isRu ? "Закрыть" : "Жабу"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="case-title">
                      {isRu ? "Название кейса *" : "Кейс атауы *"}
                    </Label>
                    <Input
                      id="case-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        isRu
                          ? "Например: Соль на полях Кызылорды"
                          : "Мысалы: Қызылорда егістіктеріндегі тұз"
                      }
                      maxLength={200}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{isRu ? "Класс" : "Сынып"}</Label>
                      <div className="flex gap-2">
                        {(["10", "11", "any"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGrade(g)}
                            className={`flex-1 px-3 py-2 rounded-md border text-sm transition-colors ${
                              grade === g
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card/40 hover:border-primary/40"
                            }`}
                          >
                            {g === "any"
                              ? isRu
                                ? "Любой"
                                : "Кез келген"
                              : g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="case-region">
                        {isRu ? "Регион (необяз.)" : "Аймақ (міндетті емес)"}
                      </Label>
                      <Input
                        id="case-region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder={
                          isRu ? "Шымкент, Атырау..." : "Шымкент, Атырау..."
                        }
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="case-desc">
                      {isRu ? "Описание идеи *" : "Идея сипаттамасы *"}
                    </Label>
                    <textarea
                      id="case-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        isRu
                          ? "О чём кейс? Какие данные/факты будут уликами? Какие решения может выбрать ученик? Чему научится?"
                          : "Кейс не туралы? Дәлел ретінде қандай деректер болады? Оқушы қандай шешімдерді таңдай алады? Не үйренеді?"
                      }
                      maxLength={2000}
                      rows={6}
                      className="w-full px-3 py-2 rounded-md border border-border bg-card/40 text-sm resize-y focus:outline-none focus:border-primary"
                    />
                    <div className="text-right text-xs text-muted-foreground font-mono">
                      {description.length}/2000
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-danger bg-danger/10 border border-danger/30 px-3 py-2 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={close}
                      disabled={pending}
                      className="flex-1"
                    >
                      {isRu ? "Отмена" : "Болдырмау"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={pending}
                      className="flex-1 gap-2"
                    >
                      {pending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      {isRu ? "Отправить идею" : "Идеяны жіберу"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

/**
 * Trigger card matching the teacher dashboard tile style.
 * Use inside `<RequestCaseDialog trigger={<RequestCaseDialogTrigger />} />`.
 */
export function RequestCaseDialogTrigger({ locale }: { locale: "ru" | "kk" }) {
  return (
    <Card className="detective-card border-dashed border-warning/40 hover:border-warning hover:shadow-glow-secondary transition-all cursor-pointer h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="size-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <Plus className="size-5 text-warning" />
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-warning/15 text-warning px-2 py-0.5 rounded-full border border-warning/30">
            <Sparkles className="size-2.5" />
            {locale === "ru" ? "Конструктор" : "Конструктор"}
          </span>
        </div>
        <div className="text-lg font-bold font-display leading-tight mb-1">
          {locale === "ru" ? "Создать свой кейс" : "Өз кейсіңізді ұсыну"}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {locale === "ru"
            ? "Расскажите идею — мы добавим её в очередь конструктора"
            : "Идеяңызды бөлісіңіз — конструктор кезегіне қосамыз"}
        </div>
      </CardContent>
    </Card>
  );
}

// Card layouts for displaying user's submitted ideas with status badges
import type { CaseIdeaRow } from "@/server/actions/caseIdeas";
import { Clock, Eye, CircleCheck, CircleX } from "lucide-react";

const STATUS_META: Record<
  CaseIdeaRow["status"],
  {
    icon: React.ComponentType<{ className?: string }>;
    cls: string;
    label: { ru: string; kk: string };
  }
> = {
  pending: {
    icon: Clock,
    cls: "bg-muted/30 text-muted-foreground border-border",
    label: { ru: "На рассмотрении", kk: "Қарауда" },
  },
  reviewed: {
    icon: Eye,
    cls: "bg-primary/15 text-primary border-primary/30",
    label: { ru: "Просмотрено", kk: "Қаралды" },
  },
  approved: {
    icon: CircleCheck,
    cls: "bg-success/15 text-success border-success/30",
    label: { ru: "Принято", kk: "Қабылданды" },
  },
  rejected: {
    icon: CircleX,
    cls: "bg-danger/15 text-danger border-danger/30",
    label: { ru: "Отклонено", kk: "Қабылданбады" },
  },
};

export function MyCaseIdeasList({
  ideas,
  locale,
}: {
  ideas: CaseIdeaRow[];
  locale: "ru" | "kk";
}) {
  if (ideas.length === 0) return null;

  const fmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-3">
      {ideas.map((idea) => {
        const meta = STATUS_META[idea.status];
        const Icon = meta.icon;
        return (
          <Card key={idea.id} className="detective-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm leading-tight mb-1">
                    {idea.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    {idea.grade && (
                      <span className="font-mono">
                        {idea.grade}{" "}
                        {locale === "ru" ? "класс" : "сынып"}
                      </span>
                    )}
                    {idea.region && <span>· {idea.region}</span>}
                    <span>· {fmt.format(new Date(idea.createdAt))}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md border ${meta.cls}`}
                >
                  <Icon className="size-3" />
                  {meta.label[locale]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {idea.description}
              </p>
              {idea.adminNote && (
                <div className="mt-2 pt-2 border-t border-border/40 text-xs italic text-muted-foreground">
                  {locale === "ru" ? "Комментарий: " : "Пікір: "}
                  {idea.adminNote}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
