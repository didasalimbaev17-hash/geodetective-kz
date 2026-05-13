import type { Scenario } from "@/schemas/case.schema";

export const caspianScenario: Scenario = {
  id: "case-caspian-2025",
  version: "1.0.0",
  localeDefault: "kk",

  meta: {
    title: { kk: "Каспий теңізі: деңгей түсуде", ru: "Каспий: уровень падает" },
    subtitle: { kk: "Тюлень-балалары неге өледі?", ru: "Почему гибнут детёныши тюленей?" },
    difficulty: 3,
    estimatedMinutes: 20,
    tags: ["теңіз", "Маңғыстау", "мұнай", "климат"],
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Caspian_Sea_from_orbit.jpg/1280px-Caspian_Sea_from_orbit.jpg",
  },

  region: { center: { lat: 42.5, lng: 50.5 }, zoom: 5, basemap: "dark" },

  briefing: {
    narrator: "Каспий экология институты",
    intro: {
      kk: "Каспий — әлемдегі ең үлкен ішкі су айдыны. Бес мемлекет жағалайды: Қазақстан, Ресей, Иран, Әзірбайжан, Түркіменстан. 2005 жылдан бері су деңгейі 2 метрге түсті. Каспий тюленінің 70% жоғалды. Себебі мұнай ма? Климат па? Сіз шешіңіз.",
      ru: "Каспий — крупнейший внутренний водоём мира. Пять государств на берегах. С 2005 уровень упал на 2 метра. Популяция каспийского тюленя сократилась на 70%. Виновата нефть? Климат? Решите.",
    },
  },

  evidence: [
    {
      id: "ev1",
      type: "chart",
      title: { kk: "Каспий деңгейі (м)", ru: "Уровень Каспия (м)" },
      required: true,
      content: {
        chartType: "line",
        xAxis: "year",
        yAxis: { kk: "Деңгей (м)", ru: "Уровень (м)" },
        data: [
          { year: 1995, level: -26.7 },
          { year: 2000, level: -27.0 },
          { year: 2005, level: -27.2 },
          { year: 2010, level: -27.5 },
          { year: 2015, level: -27.9 },
          { year: 2020, level: -28.3 },
          { year: 2024, level: -29.0 },
        ],
        caption: {
          kk: "30 жылда деңгей 2.3 метрге түсті.",
          ru: "За 30 лет уровень упал на 2.3 м.",
        },
      },
    },
    {
      id: "ev2",
      type: "stat_card",
      title: { kk: "Каспий тюлені", ru: "Каспийский тюлень" },
      required: true,
      content: {
        values: [
          { year: 1990, value: 400000, unit: { kk: "дана", ru: "особей" } },
          { year: 2024, value: 70000, unit: { kk: "дана", ru: "особей" } },
        ],
        caption: {
          kk: "Тюлень саны 80%-ға азайды. IUCN Red List.",
          ru: "Сократилось на 80%. IUCN Red List.",
        },
      },
    },
    {
      id: "ev3",
      type: "text_doc",
      title: { kk: "Мұнай өндіру есебі", ru: "Отчёт по добыче нефти" },
      required: true,
      content: {
        source: { kk: "Каспий мұнай мониторингі, 2024", ru: "Каспийский нефтемониторинг, 2024" },
        body: {
          kk: "Кашаган, Теңіз, Қарашығанақ — әлемдегі ең үлкен мұнай кен орындары. Жыл сайын 2 миллион тонна мұнай шығарылады. Авариялық төгілулер тіркелуде. Каспий тюлендерінің балалары мұз үстінде туады — мұз ерте еруде. Климат + ластану = қос қауіп.",
          ru: "Кашаган, Тенгиз, Карачаганак — крупнейшие нефтепромыслы. 2 млн тонн добычи в год. Регистрируются разливы. Детёныши тюленей рождаются на льду — лёд тает раньше. Климат + загрязнение = двойная угроза.",
        },
      },
    },
    {
      id: "ev4",
      type: "stat_card",
      title: { kk: "Климат факторы", ru: "Климатический фактор" },
      required: false,
      content: {
        values: [
          {
            label: { kk: "Орта температура өсуі (50 жыл)", ru: "Рост температуры (50 лет)" },
            value: 1.8,
            unit: { kk: "°C", ru: "°C" },
          },
          {
            label: { kk: "Булану өсуі", ru: "Рост испарения" },
            value: 35,
            unit: { kk: "%", ru: "%" },
          },
        ],
        caption: {
          kk: "Жылыну → булану → деңгей түсуі.",
          ru: "Потепление → испарение → падение уровня.",
        },
      },
    },
  ],

  investigationQuestions: [
    {
      id: "q_problem",
      kind: "multi_choice",
      prompt: { kk: "Басты мәселелер?", ru: "Главные проблемы?" },
      options: {
        kk: [
          "Су деңгейінің түсуі",
          "Тюлень популяциясының жоғалуы",
          "Мұнай ластануы",
          "Жанартау атқылауы",
        ],
        ru: [
          "Падение уровня воды",
          "Сокращение популяции тюленей",
          "Загрязнение нефтью",
          "Извержение вулкана",
        ],
      },
      correct: [0, 1, 2],
      weight: 15,
    },
    {
      id: "q_cause",
      kind: "multi_choice",
      prompt: { kk: "Себептері?", ru: "Причины?" },
      options: {
        kk: [
          "Климаттың жылынуы",
          "Еділ өзенінен ағынның азаюы",
          "Мұнай өндіру",
          "Тропик орман өсуі",
        ],
        ru: [
          "Потепление климата",
          "Снижение стока Волги",
          "Нефтедобыча",
          "Рост тропических лесов",
        ],
      },
      correct: [0, 1, 2],
      weight: 15,
    },
    {
      id: "q_consequences",
      kind: "multi_choice",
      prompt: { kk: "Салдарлары?", ru: "Последствия?" },
      options: {
        kk: [
          "Балық экспортының құлдырауы",
          "Жағалау порттары жұмыс істемей қалуы",
          "Биологиялық алуан түрлілік жоғалуы",
          "Каспий толық кебуі келесі 5 жылда",
        ],
        ru: [
          "Падение рыбного экспорта",
          "Прибрежные порты не работают",
          "Потеря биоразнообразия",
          "Каспий пересохнет за 5 лет",
        ],
      },
      correct: [0, 1, 2],
      weight: 15,
    },
  ],

  solutions: [
    {
      id: "sol_protection",
      title: { kk: "Тюленьдерге халықаралық қорғау + резерват", ru: "Защита тюленей + резерват" },
      short: { kk: "5 мемлекет арасында келісім + аумақ", ru: "Соглашение 5 стран + резерват" },
      icon: "shield",
      recommended: true,
      effects: { sealPopulation: { delta: 50 } },
      tradeoffs: {
        kk: "Мұнай өндірісіне шектеу қою керек.",
        ru: "Нужны ограничения на нефтедобычу.",
      },
      costMillionUsd: 200,
      timeYears: 10,
    },
    {
      id: "sol_oil_reduce",
      title: { kk: "Мұнай өндіруді азайту + эко-стандарттар", ru: "Сокращение нефтедобычи + эко-стандарты" },
      short: { kk: "Қатаң экологиялық бақылау", ru: "Жёсткий экоконтроль" },
      icon: "leaf",
      effects: { pollution: { delta: -40 } },
      tradeoffs: {
        kk: "ЖІӨ-ге кері әсер, бюджет кірісі азаяды.",
        ru: "Падение ВВП и бюджетных доходов.",
      },
      costMillionUsd: 5000,
      timeYears: 15,
    },
    {
      id: "sol_volga",
      title: { kk: "Ресеймен Еділ ағыны туралы келісім", ru: "Соглашение с РФ по стоку Волги" },
      short: { kk: "Еділден көп су жіберу", ru: "Больше воды из Волги" },
      icon: "shield",
      effects: { waterLevel: { delta: 0.5 } },
      tradeoffs: {
        kk: "Ресей өз бөгеттерін ашуы керек.",
        ru: "РФ должна открыть плотины.",
      },
      costMillionUsd: 50,
      timeYears: 5,
    },
    {
      id: "sol_nothing",
      title: { kk: "Ештеңе істемеу", ru: "Бездействие" },
      short: { kk: "20 жылда — экологиялық апат", ru: "Через 20 лет — экологическая катастрофа" },
      icon: "alert-triangle",
      effects: { waterLevel: { delta: -2 } },
      tradeoffs: {
        kk: "Тюлень жойылады, балық кетеді, порттар тоқтайды.",
        ru: "Тюлень вымрет, рыба уйдёт, порты встанут.",
      },
      costMillionUsd: 0,
      timeYears: 0,
    },
  ],

  simulation: {
    durationSeconds: 7,
    snapshots: [
      {
        t: 0,
        label: { kk: "Бүгін", ru: "Сегодня" },
        indicators: { waterLevel: -29, sealPopulation: 70000, oilProd: 2 },
      },
      {
        t: 0.5,
        label: { kk: "+10 жыл", ru: "+10 лет" },
        indicators: { waterLevel: -28.5, sealPopulation: 95000, oilProd: 1.5 },
      },
      {
        t: 1,
        label: { kk: "+25 жыл", ru: "+25 лет" },
        indicators: { waterLevel: -28, sealPopulation: 150000, oilProd: 1.2 },
      },
    ],
    animation: { lakeMorph: true },
  },

  explanationTask: {
    prompt: {
      kk: "Сіздің шешіміңіз Каспий экожүйесін қалай қалпына келтіреді? Тюлень мен мұнай арасындағы тепе-теңдікті қалай табасыз? 150-400 сөз.",
      ru: "Как ваше решение восстановит экосистему Каспия? Как найти баланс между тюленями и нефтью? 150-400 слов.",
    },
    minWords: 150,
    maxWords: 400,
    language: "kk",
  },

  evaluationRubric: {
    criteria: [
      {
        id: "geo_accuracy",
        name: { kk: "Географиялық дәлдік", ru: "Точность" },
        weight: 25,
        description: { kk: "Каспий, Еділ, мұнай", ru: "Каспий, Волга, нефть" },
      },
      {
        id: "causal_reasoning",
        name: { kk: "Себеп-салдар", ru: "Причина-следствие" },
        weight: 30,
        description: { kk: "Шешім → нәтиже", ru: "Решение → результат" },
      },
      {
        id: "evidence_use",
        name: { kk: "Дәлелдер", ru: "Использование улик" },
        weight: 20,
        description: { kk: "Графиктер, статистика", ru: "Графики, статистика" },
      },
      {
        id: "tradeoff_awareness",
        name: { kk: "Тепе-теңдік", ru: "Баланс" },
        weight: 15,
        description: { kk: "Экология vs экономика", ru: "Экология vs экономика" },
      },
      {
        id: "language_clarity",
        name: { kk: "Тіл", ru: "Язык" },
        weight: 10,
        description: { kk: "Қазақ тілі", ru: "Казахский" },
      },
    ],
    aiInstructions:
      "Grade a Kazakh 10-11 grade essay on the Caspian Sea ecological situation (water level, seals, oil). Reply in Kazakh.",
    passThreshold: 60,
  },

  scoring: {
    maxPoints: 100,
    breakdown: {
      investigation: 35,
      solutionChoice: 15,
      aiExplanation: 40,
      speedBonus: 5,
      noHintsBonus: 5,
    },
  },

  debrief: {
    realWorld: {
      kk: "2022 жылы Қазақстан жағалауында мыңдаған өлі тюлендер табылды — себебі әлі анықталмаған. 2024 жылы Каспий тюленін «жойылып бара жатқан» санатына көшірілді. 5 ел әлі ортақ келісімге келген жоқ.",
      ru: "В 2022 на казахстанском побережье нашли тысячи мёртвых тюленей — причина неясна. В 2024 каспийский тюлень переведён в категорию «исчезающий». 5 стран ещё не пришли к общему соглашению.",
    },
    sources: [
      {
        label: { kk: "Caspian seal — IUCN", ru: "Caspian seal — IUCN" },
        url: "https://www.iucnredlist.org/species/15269/45228469",
      },
    ],
    nextCaseHintId: "case-irtysh-2025",
  },
};
