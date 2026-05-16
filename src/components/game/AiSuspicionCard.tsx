import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

// Локализация имён флагов (короткие теги от Claude → человеко-читаемые ярлыки)
const FLAG_LABELS: Record<string, { kk: string; ru: string }> = {
  generic_intro: {
    kk: "Шаблонды кіріспе",
    ru: "Шаблонное вступление",
  },
  uniform_sentences: {
    kk: "Біркелкі сөйлемдер",
    ru: "Однообразные предложения",
  },
  list_phrases: {
    kk: "Тізімдік құрылым",
    ru: "Списковая структура",
  },
  no_personal_voice: {
    kk: "Жеке көзқарас жоқ",
    ru: "Нет личного мнения",
  },
  advanced_vocab: {
    kk: "Тым күрделі лексика",
    ru: "Слишком сложная лексика",
  },
  hedging_cliches: {
    kk: "Канцеляризмдер",
    ru: "Канцеляризмы",
  },
  perfect_structure: {
    kk: "Тым тегіс құрылым",
    ru: "Идеальная структура",
  },
  abstract_language: {
    kk: "Жалпы абстрактты тіл",
    ru: "Абстрактный язык",
  },
  no_local_detail: {
    kk: "Жергілікті деталь жоқ",
    ru: "Нет локальных деталей",
  },
  balanced_framing: {
    kk: "Жасанды теңгерім",
    ru: "Искусственный баланс «за/против»",
  },
};

function localizeFlag(tag: string, locale: "kk" | "ru"): string {
  const entry = FLAG_LABELS[tag];
  if (!entry) {
    // Unknown tag — show as-is, replace underscores
    return tag.replace(/_/g, " ");
  }
  return entry[locale];
}

export function AiSuspicionCard({
  score,
  flags,
  locale,
}: {
  score: number;
  flags: string[];
  locale: string;
}) {
  const loc: "kk" | "ru" = locale === "ru" ? "ru" : "kk";
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  // Risk level
  const level: "low" | "mid" | "high" =
    clamped < 35 ? "low" : clamped < 70 ? "mid" : "high";

  const levelMeta = {
    low: {
      icon: ShieldCheck,
      color: "text-success",
      bgGradient: "from-success/15 via-success/5 to-transparent",
      border: "border-success/30",
      progressClass: "[&>div]:bg-success",
      title:
        loc === "ru"
          ? "Похоже на работу ученика"
          : "Оқушы өзі жазған сияқты",
    },
    mid: {
      icon: AlertTriangle,
      color: "text-warning",
      bgGradient: "from-warning/15 via-warning/5 to-transparent",
      border: "border-warning/30",
      progressClass: "[&>div]:bg-warning",
      title:
        loc === "ru" ? "Подозрительные признаки" : "Күмәнді белгілер бар",
    },
    high: {
      icon: ShieldAlert,
      color: "text-danger",
      bgGradient: "from-danger/15 via-danger/5 to-transparent",
      border: "border-danger/30",
      progressClass: "[&>div]:bg-danger",
      title:
        loc === "ru"
          ? "Похоже на AI-генерацию"
          : "Жасанды интеллект жазған сияқты",
    },
  } as const;

  const meta = levelMeta[level];
  const Icon = meta.icon;

  return (
    <Card
      className={`detective-card mb-6 bg-gradient-to-br ${meta.bgGradient} ${meta.border}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`size-12 rounded-xl bg-card/60 backdrop-blur flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`size-6 ${meta.color}`} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {loc === "ru"
                ? "Проверка на ЖИ-генерацию"
                : "ЖИ-генерация тексеру"}
            </div>
            <h3 className="font-display text-lg font-bold leading-tight">
              {meta.title}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div
              className={`text-3xl font-display font-bold font-numeric ${meta.color}`}
            >
              {clamped}
              <span className="text-base text-muted-foreground">%</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {loc === "ru" ? "ЖИ-балл" : "ЖИ-балл"}
            </div>
          </div>
        </div>

        <Progress value={clamped} className={`h-2 mb-4 ${meta.progressClass}`} />

        {flags.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-mono uppercase text-muted-foreground mb-2">
              {loc === "ru" ? "Признаки" : "Белгілер"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {flags.slice(0, 6).map((tag, i) => (
                <span
                  key={i}
                  className={`inline-block px-2 py-0.5 rounded-md bg-card/60 border ${meta.border} text-xs`}
                >
                  {localizeFlag(tag, loc)}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic">
          {loc === "ru"
            ? "Приблизительная оценка стилистических признаков. ЖИ-детекторы часто ошибаются на работах не-носителей языка — балл выше 70 % требует проверки учителем."
            : "Стилистикалық белгілерді шамамен бағалау. ЖИ-детекторлары ана тілді емес адамдардың жұмыстарында жиі қателеседі — 70 %-дан жоғары балл мұғалім тексеруін қажет етеді."}
        </p>
      </CardContent>
    </Card>
  );
}
