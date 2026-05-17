import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Microscope, Brain, Globe2, GraduationCap } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isRu = locale === "ru";

  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-balance">
        {isRu ? "О проекте" : "Жоба туралы"}
      </h1>
      <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
        {isRu
          ? "GeoDetective KZ — образовательная веб-игра-расследование по географии для учеников 10-11 классов Казахстана. Дипломный проект."
          : "GeoDetective KZ — Қазақстанның 10-11 сынып оқушыларына арналған географияны тергеу арқылы оқыту веб-ойыны. Дипломдық жоба."}
      </p>

      <div className="grid gap-4 mb-12">
        <Feature
          icon={Microscope}
          title={isRu ? "Научный подход" : "Ғылыми тәсіл"}
          text={
            isRu
              ? "Кейсы основаны на реальных экологических данных: NASA Earth Observatory, отчёты Всемирного банка и ООН, публикации Минэкологии РК."
              : "Кейстер шынайы экологиялық деректерге негізделген: NASA Earth Observatory, Дүниежүзілік Банк пен БҰҰ есептері, ҚР Экология министрлігінің жарияланымдары."
          }
        />
        <Feature
          icon={Brain}
          title={isRu ? "AI-оценка" : "ЖИ бағалауы"}
          text={
            isRu
              ? "Текстовые объяснения учеников оценивает Claude API по педагогически выверенной рубрике из 5 критериев."
              : "Оқушылардың мәтіндік түсіндірмелерін Claude API 5 критерийден тұратын педагогикалық рубрика бойынша бағалайды."
          }
        />
        <Feature
          icon={Globe2}
          title={isRu ? "Интерактивные карты" : "Интерактивті карталар"}
          text={
            isRu
              ? "Динамическая визуализация: карта меняется после каждого решения. SVG-морфинг водоёмов, анимация рек."
              : "Динамикалық визуализация: әрбір шешімнен кейін карта өзгереді. Су қоймаларының SVG-морфингі, өзендердің анимациясы."
          }
        />
        <Feature
          icon={GraduationCap}
          title={isRu ? "Для учителей и учеников" : "Мұғалімдер мен оқушыларға"}
          text={
            isRu
              ? "Учительский кабинет: классы, прогресс учеников, контроль покупок. Для учеников: XP, магазин наград с привилегиями в классе."
              : "Мұғалім кабинеті: сыныптар, оқушылар прогресі, сатып алуларды бақылау. Оқушыларға: XP, сыныптағы артықшылықтары бар сыйлықтар дүкені."
          }
        />
      </div>

      <Card className="detective-card">
        <CardContent className="p-6">
          <h2 className="font-display text-2xl font-bold mb-3">
            {isRu ? "Технологии" : "Технологиялар"}
          </h2>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Supabase",
              "Drizzle ORM",
              "Claude API",
              "Leaflet",
              "XState",
              "next-intl",
            ].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded bg-surface border border-border"
              >
                {t}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="detective-card">
      <CardContent className="p-5 flex gap-4">
        <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
