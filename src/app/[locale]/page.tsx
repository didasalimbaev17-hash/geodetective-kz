import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { getAllScenarios, getScenarioMeta } from "@/data/cases";
import { getLocalizedText } from "@/lib/utils";
import {
  Satellite,
  Microscope,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  GraduationCap,
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

  const features = [
    {
      icon: Satellite,
      titleKey: "landing.features.items.0.title",
      descKey: "landing.features.items.0.description",
    },
    {
      icon: Microscope,
      titleKey: "landing.features.items.1.title",
      descKey: "landing.features.items.1.description",
    },
    {
      icon: Compass,
      titleKey: "landing.features.items.2.title",
      descKey: "landing.features.items.2.description",
    },
    {
      icon: Sparkles,
      titleKey: "landing.features.items.3.title",
      descKey: "landing.features.items.3.description",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-40 left-20 size-[400px] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container py-20 md:py-32">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 font-mono text-xs uppercase tracking-wider">
              {t("landing.hero.kicker")}
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
              <span className="gradient-text">{t("landing.hero.title")}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-balance max-w-2xl leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="text-base group">
                <Link href="/auth/register">
                  {t("landing.hero.ctaPrimary")}
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/about">{t("landing.hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">
          {t("landing.features.title")}
        </h2>
        <div className="h-px w-16 bg-primary mx-auto mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="detective-card group hover:border-primary/40 transition-all hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="size-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="font-mono text-xs text-muted-foreground mb-1">
                  0{idx + 1}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
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
      <section className="container py-20 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {t("landing.casesPreview.title")}
          </h2>
          <div className="h-px w-16 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("landing.casesPreview.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((s) => (
            <Link
              key={s.id}
              href={`/student/case/${s.id}` as never}
              className="block"
            >
              <Card className="overflow-hidden group h-full hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                  <SafeImage
                    src={s.coverImage ?? ""}
                    alt={getLocalizedText(s.title, locale)}
                    fallbackLabel={getLocalizedText(s.title, locale)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-xl font-semibold mb-2 line-clamp-1">
                    {getLocalizedText(s.title, locale)}
                  </h3>
                  {s.subtitle && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {getLocalizedText(s.subtitle, locale)}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < s.difficulty
                              ? "size-3 fill-primary text-primary"
                              : "size-3 text-muted"
                          }
                        />
                      ))}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {s.estimatedMinutes}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FOR TEACHERS */}
      <section className="container py-20">
        <Card className="detective-card overflow-hidden">
          <CardContent className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="size-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                <GraduationCap className="size-6 text-secondary" strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">
                {t("landing.forTeachers.title")}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("landing.forTeachers.description")}
              </p>
              <Button asChild variant="secondary" className="gap-2">
                <Link href="/auth/register?role=teacher">
                  {t("landing.forTeachers.cta")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent rounded-2xl" />
              <div className="absolute inset-4 bg-card border border-border rounded-xl flex items-center justify-center">
                <Compass
                  className="size-32 text-primary opacity-40 animate-pulse-glow rounded-full"
                  strokeWidth={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
