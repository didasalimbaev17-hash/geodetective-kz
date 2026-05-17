import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaseCover } from "@/components/art/CaseCover";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { getAllScenarios, getScenarioMeta } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import {
  Satellite,
  Microscope,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  GraduationCap,
  Zap,
  LayoutDashboard,
} from "lucide-react";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const scenarios = getAllScenarios().map(getScenarioMeta);
  const user = await getCurrentUserProfile();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isStudent = user?.role === "student";
  const dashboardHref = isTeacher ? "/teacher/dashboard" : "/student/dashboard";
  const heroCtaLabel = user
    ? locale === "ru"
      ? "Перейти в кабинет"
      : "Кабинетке өту"
    : t("landing.hero.ctaPrimary");

  const features = [
    {
      icon: Satellite,
      titleKey: "landing.features.items.0.title",
      descKey: "landing.features.items.0.description",
      hue: "primary",
    },
    {
      icon: Microscope,
      titleKey: "landing.features.items.1.title",
      descKey: "landing.features.items.1.description",
      hue: "secondary",
    },
    {
      icon: Compass,
      titleKey: "landing.features.items.2.title",
      descKey: "landing.features.items.2.description",
      hue: "primary",
    },
    {
      icon: Sparkles,
      titleKey: "landing.features.items.3.title",
      descKey: "landing.features.items.3.description",
      hue: "secondary",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40 min-h-[88vh] flex items-center">
        <HeroBackground />

        <div className="container py-20 md:py-28 relative z-10">
          <div className="max-w-4xl">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-panel">
              <span className="size-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("landing.hero.kicker")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-balance leading-[0.95] mb-8">
              <span className="block gradient-text">
                {t("landing.hero.title")}
              </span>
            </h1>

            {/* Subhead */}
            <p className="max-w-2xl text-lg md:text-2xl text-muted-foreground text-balance leading-relaxed font-serif italic mb-12">
              {t("landing.hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="text-base group h-14 px-8 shadow-glow-primary"
              >
                <Link href={user ? (dashboardHref as never) : "/auth/register"}>
                  {user ? (
                    <LayoutDashboard className="size-5" />
                  ) : (
                    <Zap className="size-5" />
                  )}
                  {heroCtaLabel}
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base h-14 px-8 backdrop-blur-sm"
              >
                <Link href="/about">{t("landing.hero.ctaSecondary")}</Link>
              </Button>
            </div>

            {/* Stats strip */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden glass-panel">
              {[
                { value: "6", label: locale === "ru" ? "Кейсов готово" : "Кейс дайын" },
                { value: locale === "ru" ? "AI" : "ЖИ", label: locale === "ru" ? "Оценка на казахском" : "Қазақша бағалау" },
                { value: "2", label: locale === "ru" ? "Языка" : "Тіл" },
                { value: "10-11", label: locale === "ru" ? "Класс" : "Сынып" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-card/60 backdrop-blur-md p-5 text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold gradient-text font-numeric">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24 relative">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 font-mono text-xs">
            {locale === "ru" ? "01 — Процесс" : "01 — Үрдіс"}
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-balance">
            <span className="gradient-text">{t("landing.features.title")}</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="detective-card group relative noise-overlay"
            >
              <CardContent className="p-7">
                <div
                  className={`size-14 rounded-2xl flex items-center justify-center mb-5 transition-all ${
                    feature.hue === "primary"
                      ? "bg-primary/10 border border-primary/30 group-hover:bg-primary/20 group-hover:shadow-glow-primary"
                      : "bg-secondary/10 border border-secondary/30 group-hover:bg-secondary/20 group-hover:shadow-glow-secondary"
                  }`}
                >
                  <feature.icon
                    className={`size-7 ${feature.hue === "primary" ? "text-primary" : "text-secondary"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="font-mono text-xs text-muted-foreground mb-2 tracking-widest">
                  STEP / 0{idx + 1}
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 leading-tight">
                  {t(feature.titleKey as never)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(feature.descKey as never)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CASES PREVIEW */}
      <section className="container py-24 border-t border-border/40 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 font-mono text-xs">
            {locale === "ru" ? "02 — Дела" : "02 — Істер"}
          </Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4 text-balance">
            <span className="gradient-text">
              {t("landing.casesPreview.title")}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("landing.casesPreview.subtitle")}
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((s, idx) => (
            <Link
              key={s.id}
              href={`/student/case/${s.id}` as never}
              className="block group"
            >
              <Card className="detective-card overflow-hidden h-full relative">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <CaseCover
                    slug={s.id}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  {/* Case number badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60">
                    <span className="font-mono text-xs text-primary">
                      CASE #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Difficulty stars */}
                  <div className="absolute top-4 right-4 flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < s.difficulty
                            ? "size-2.5 fill-primary text-primary"
                            : "size-2.5 text-muted-foreground/30"
                        }
                      />
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-display text-2xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {getLocalizedText(s.title, locale)}
                  </h3>
                  {s.subtitle && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-serif italic">
                      {getLocalizedText(s.subtitle, locale)}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Clock className="size-3.5" />
                      {s.estimatedMinutes} {locale === "ru" ? "мин" : "мин"}
                    </span>
                    <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {locale === "ru" ? "Расследовать" : "Тергеу"} →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FOR TEACHERS */}
      <section className="container py-24">
        <Card className="detective-card overflow-hidden relative">
          <div className="absolute inset-0 -z-0">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/8 via-transparent to-transparent" />
          </div>
          <CardContent className="p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="size-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center mb-6 shadow-glow-secondary">
                <GraduationCap
                  className="size-7 text-secondary"
                  strokeWidth={1.5}
                />
              </div>
              <Badge variant="outline" className="mb-3 font-mono text-xs">
                {locale === "ru" ? "03 — Кабинет учителя" : "03 — Мұғалім кабинеті"}
              </Badge>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 text-balance">
                {t("landing.forTeachers.title")}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                {t("landing.forTeachers.description")}
              </p>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="gap-2 shadow-glow-secondary"
              >
                <Link
                  href={
                    isTeacher
                      ? "/teacher/dashboard"
                      : isStudent
                        ? (dashboardHref as never)
                        : "/auth/register?role=teacher"
                  }
                >
                  {isTeacher
                    ? locale === "ru"
                      ? "Открыть кабинет учителя"
                      : "Мұғалім кабинетін ашу"
                    : isStudent
                      ? locale === "ru"
                        ? "В свой кабинет"
                        : "Өз кабинетіме"
                      : t("landing.forTeachers.cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent rounded-3xl blur-2xl" />
              <div className="absolute inset-4 glass-panel flex items-center justify-center">
                <Compass
                  className="size-40 text-primary opacity-50 animate-float"
                  strokeWidth={0.8}
                />
              </div>
              <div className="absolute -top-4 -right-4 size-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center">
                <Sparkles className="size-7 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-secondary/20 backdrop-blur-md border border-secondary/40 flex items-center justify-center">
                <Microscope className="size-8 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
