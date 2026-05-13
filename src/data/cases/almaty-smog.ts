import type { Scenario } from "@/schemas/case.schema";

export const almatySmogScenario: Scenario = {
  id: "case-almaty-smog-2025",
  version: "1.0.0",
  localeDefault: "kk",

  meta: {
    title: { kk: "Алматы: тұманның құпиясы", ru: "Алматы: загадка смога" },
    subtitle: {
      kk: "Қыста қала неге тұтығады?",
      ru: "Почему зимой город задыхается?",
    },
    difficulty: 2,
    estimatedMinutes: 18,
    tags: ["ауа", "Алматы", "ТЭЦ", "автокөлік"],
    coverImage:
      "https://picsum.photos/seed/almaty-mountains-smog/1280/720",
  },

  region: { center: { lat: 43.25, lng: 76.95 }, zoom: 10, basemap: "dark" },

  briefing: {
    narrator: { kk: "Алматы әкімдігі", ru: "Акимат Алматы" },
    intro: {
      kk: "Алматы — Қазақстанның ең ірі қаласы, 2 миллион тұрғын. Әр қыста қала қалың сұр тұманмен жабылады — PM2.5 деңгейі ДДҰ нормасынан 10-20 есе асады. Балалар, кәрілер ауырады. Себебі неде? Сіз шешуіңіз керек.",
      ru: "Алматы — крупнейший город Казахстана, 2 млн жителей. Каждую зиму город накрывает серым смогом — PM2.5 в 10-20 раз выше нормы ВОЗ. Болеют дети, старики. Почему? Найдите причину.",
    },
  },

  evidence: [
    {
      id: "ev1",
      type: "chart",
      title: { kk: "PM2.5 деңгейі (мкг/м³)", ru: "Уровень PM2.5 (мкг/м³)" },
      required: true,
      content: {
        chartType: "line",
        xAxis: "month",
        yAxis: { kk: "PM2.5 (мкг/м³)", ru: "PM2.5 (мкг/м³)" },
        data: [
          { month: "Қаң", pm25: 180 },
          { month: "Ақп", pm25: 140 },
          { month: "Нау", pm25: 60 },
          { month: "Сәу", pm25: 35 },
          { month: "Мам", pm25: 25 },
          { month: "Мау", pm25: 20 },
          { month: "Шіл", pm25: 22 },
          { month: "Там", pm25: 28 },
          { month: "Қыр", pm25: 40 },
          { month: "Қаз", pm25: 75 },
          { month: "Қар", pm25: 130 },
          { month: "Жел", pm25: 190 },
        ],
        caption: {
          kk: "ДДҰ нормасы — 15 мкг/м³. Қыста 12 есе асады.",
          ru: "Норма ВОЗ — 15 мкг/м³. Зимой превышение в 12 раз.",
        },
      },
    },
    {
      id: "ev2",
      type: "stat_card",
      title: { kk: "Ластану көздері", ru: "Источники загрязнения" },
      required: true,
      content: {
        values: [
          {
            label: { kk: "ТЭЦ-2 (көмір)", ru: "ТЭЦ-2 (уголь)" },
            value: 35,
            unit: { kk: "%", ru: "%" },
          },
          {
            label: { kk: "Жеке үй жылыту", ru: "Частное отопление" },
            value: 30,
            unit: { kk: "%", ru: "%" },
          },
          {
            label: { kk: "Автокөлік", ru: "Автотранспорт" },
            value: 28,
            unit: { kk: "%", ru: "%" },
          },
          {
            label: { kk: "Өнеркәсіп", ru: "Промышленность" },
            value: 7,
            unit: { kk: "%", ru: "%" },
          },
        ],
        caption: {
          kk: "Қала қазанында жатыр — желсіз, ластану жиналады.",
          ru: "Город в котловине — нет ветра, загрязнение копится.",
        },
      },
    },
    {
      id: "ev3",
      type: "text_doc",
      title: { kk: "Климатологтың есебі", ru: "Отчёт климатолога" },
      required: true,
      content: {
        source: { kk: "ҚазГидроМет, 2024", ru: "Казгидромет, 2024" },
        body: {
          kk: "Алматы — тау бөктеріндегі қазаншұңқыр. Қыста температуралық инверсия пайда болады: жоғарыда жылы ауа, төменде суық. Жел жоқ, ластанған ауа қалада жиналады. Тау Іле-Алатау желге кедергі. Бұл табиғи фактор — өзгерту мүмкін емес. Бірақ көздерді азайтуға болады.",
          ru: "Алматы — котловина у подножия гор. Зимой возникает температурная инверсия: тёплый воздух выше, холодный внизу. Ветра нет, загрязнение копится. Иле-Алатау блокирует ветер. Природный фактор не изменить — но источники можно сократить.",
        },
      },
    },
    {
      id: "ev4",
      type: "stat_card",
      title: { kk: "Денсаулық статистикасы", ru: "Здоровье населения" },
      required: false,
      content: {
        values: [
          {
            label: { kk: "Балалар бронхит (2024)", ru: "Бронхит у детей (2024)" },
            value: 42,
            unit: { kk: "%", ru: "%" },
          },
          {
            label: { kk: "Демікпе өсуі (10 жылда)", ru: "Рост астмы (10 лет)" },
            value: 60,
            unit: { kk: "%", ru: "%" },
          },
        ],
        caption: {
          kk: "Балалар ауруы 10 жылда 60%-ға өсті.",
          ru: "Детская заболеваемость выросла на 60% за 10 лет.",
        },
      },
    },
  ],

  investigationQuestions: [
    {
      id: "q_problem",
      kind: "single_choice",
      prompt: { kk: "Басты мәселе?", ru: "Главная проблема?" },
      options: {
        kk: [
          "Өзен ластануы",
          "Ауаның PM2.5 ластануы",
          "Жер сілкінісі",
          "Орман өрттері",
        ],
        ru: [
          "Загрязнение реки",
          "Загрязнение воздуха PM2.5",
          "Землетрясение",
          "Лесные пожары",
        ],
      },
      correct: 1,
      weight: 10,
    },
    {
      id: "q_cause",
      kind: "multi_choice",
      prompt: { kk: "Себептері?", ru: "Причины?" },
      options: {
        kk: [
          "ТЭЦ көмірмен жұмыс",
          "Жеке үйлерде көмір жағу",
          "Көп автокөлік",
          "Қазаншұңқыр + инверсия",
          "Жанартау",
        ],
        ru: [
          "Угольная ТЭЦ",
          "Угольное отопление в частном секторе",
          "Большой автопарк",
          "Котловина + инверсия",
          "Вулкан",
        ],
      },
      correct: [0, 1, 2, 3],
      weight: 15,
    },
    {
      id: "q_consequences",
      kind: "multi_choice",
      prompt: { kk: "Салдарлары?", ru: "Последствия?" },
      options: {
        kk: [
          "Балалар ауруы",
          "Өмір сүру ұзақтығының қысқаруы",
          "Туризм құлдырауы",
          "Тропик орман өсуі",
        ],
        ru: [
          "Болезни детей",
          "Снижение продолжительности жизни",
          "Падение туризма",
          "Рост тропических лесов",
        ],
      },
      correct: [0, 1, 2],
      weight: 15,
    },
  ],

  solutions: [
    {
      id: "sol_gas",
      title: { kk: "ТЭЦ-ті газға көшіру + жеке секторды газдандыру", ru: "Газификация ТЭЦ и частного сектора" },
      short: { kk: "Көмірден таза газға", ru: "От угля к чистому газу" },
      icon: "leaf",
      recommended: true,
      effects: { pm25: { delta: -60, unit: "%" } },
      tradeoffs: {
        kk: "Қымбат, бірақ ұзақ мерзімді шешім.",
        ru: "Дорого, но долгосрочно эффективно.",
      },
      costMillionUsd: 800,
      timeYears: 6,
    },
    {
      id: "sol_transport",
      title: { kk: "Электробус + метро кеңейту + автокөлік шектеу", ru: "Электробусы + расширение метро + ограничение авто" },
      short: { kk: "Қоғамдық көлікке басымдық", ru: "Приоритет общественному" },
      icon: "leaf",
      effects: { pm25: { delta: -25, unit: "%" } },
      tradeoffs: {
        kk: "Тұрғындардың ыңғайсыздығы.",
        ru: "Неудобство для жителей.",
      },
      costMillionUsd: 1200,
      timeYears: 10,
    },
    {
      id: "sol_filters",
      title: { kk: "ТЭЦ-ке заманауи сүзгілер", ru: "Современные фильтры на ТЭЦ" },
      short: { kk: "Көмірді қалдырып, тазалау", ru: "Оставить уголь, очистить выбросы" },
      icon: "shield",
      effects: { pm25: { delta: -15, unit: "%" } },
      tradeoffs: {
        kk: "Уақытша шара, көмір қалады.",
        ru: "Временно, уголь остаётся.",
      },
      costMillionUsd: 100,
      timeYears: 2,
    },
    {
      id: "sol_nothing",
      title: { kk: "Ештеңе істемеу", ru: "Бездействие" },
      short: { kk: "Жағдай нашарлай береді", ru: "Ситуация ухудшится" },
      icon: "alert-triangle",
      effects: { pm25: { delta: 10, unit: "%" } },
      tradeoffs: {
        kk: "Балалар ауруы өседі, өлім көбейеді.",
        ru: "Детские болезни и смертность вырастут.",
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
        label: { kk: "Бүгін (қыс)", ru: "Сегодня (зима)" },
        indicators: { pm25Winter: 180, healthIndex: 55 },
      },
      {
        t: 0.5,
        label: { kk: "+5 жыл", ru: "+5 лет" },
        indicators: { pm25Winter: 110, healthIndex: 70 },
      },
      {
        t: 1,
        label: { kk: "+15 жыл", ru: "+15 лет" },
        indicators: { pm25Winter: 50, healthIndex: 85 },
      },
    ],
    animation: { colorOverlay: "pm25_heatmap" },
  },

  explanationTask: {
    prompt: {
      kk: "Сіздің шешіміңіз неліктен Алматы ауасын тазартады? Қазаншұңқыр факторын ескердіңіз бе? 50-400 сөз.",
      ru: "Почему ваше решение очистит воздух? Учли ли вы фактор котловины? 50-400 слов.",
    },
    minWords: 50,
    maxWords: 400,
    language: "kk",
  },

  evaluationRubric: {
    criteria: [
      {
        id: "geo_accuracy",
        name: { kk: "Географиялық дәлдік", ru: "Точность" },
        weight: 25,
        description: { kk: "Алматы геогр. ерекшеліктері", ru: "Геогр. особенности Алматы" },
      },
      {
        id: "causal_reasoning",
        name: { kk: "Себеп-салдар", ru: "Причина-следствие" },
        weight: 30,
        description: { kk: "Шешім → ауа сапасы", ru: "Решение → качество воздуха" },
      },
      {
        id: "evidence_use",
        name: { kk: "Дәлелдер", ru: "Улики" },
        weight: 20,
        description: { kk: "PM2.5, көздер", ru: "PM2.5, источники" },
      },
      {
        id: "tradeoff_awareness",
        name: { kk: "Жағымсыз салдар", ru: "Негатив" },
        weight: 15,
        description: { kk: "Шығындар, ыңғайсыздық", ru: "Затраты, неудобства" },
      },
      {
        id: "language_clarity",
        name: { kk: "Тіл", ru: "Язык" },
        weight: 10,
        description: { kk: "Қазақ тілі", ru: "Казахский" },
      },
    ],
    aiInstructions:
      "Grade a 10-11 grade Kazakh essay about Almaty air pollution. Reply in Kazakh, strict rubric.",
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
      kk: "Алматы 2025 жылдан бастап жеке секторды газдандыру бағдарламасын іске қосты. ТЭЦ-2-ні газға көшіру 2030 жылға жоспарланған. PM2.5 деңгейі біртіндеп төмендеуде, бірақ қыс әлі ауыр.",
      ru: "С 2025 Алматы запустил программу газификации частного сектора. Перевод ТЭЦ-2 на газ запланирован к 2030. Уровень PM2.5 постепенно снижается, но зима всё ещё тяжёлая.",
    },
    sources: [
      {
        label: { kk: "IQAir Алматы", ru: "IQAir Алматы" },
        url: "https://www.iqair.com/kazakhstan/almaty",
      },
    ],
    nextCaseHintId: "case-semey-2025",
  },
};
