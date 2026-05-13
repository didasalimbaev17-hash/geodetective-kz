import type { Scenario } from "@/schemas/case.schema";

export const irtyshScenario: Scenario = {
  id: "case-irtysh-2025",
  version: "1.0.0",
  localeDefault: "kk",

  meta: {
    title: { kk: "Ертіс өзенінің тағдыры", ru: "Судьба реки Иртыш" },
    subtitle: {
      kk: "Трансшекаралық су: 3 ел, 1 өзен",
      ru: "Трансграничная вода: 3 страны, 1 река",
    },
    difficulty: 3,
    estimatedMinutes: 20,
    tags: ["өзен", "трансшекаралық", "ластану", "ҚХР"],
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Irtysh_river_Pavlodar.jpg/1280px-Irtysh_river_Pavlodar.jpg",
  },

  region: { center: { lat: 51.5, lng: 78.0 }, zoom: 5, basemap: "dark" },

  briefing: {
    narrator: "ҚР Су ресурстары комитеті",
    intro: {
      kk: "Ертіс — Қазақстанның басты өзендерінің бірі. Бастауы — Қытайда (Қара Ертіс), ағысы — арқылы Қазақстан (Шығыс ҚР, Павлодар, Семей), сосын Ресейге (Омбы) барып, Об өзеніне құяды. Үш мемлекет, бір өзен. Қазір — су аз, ластану көп. Кім жауапты? Сіз тергеңіз.",
      ru: "Иртыш — одна из главных рек Казахстана. Исток в Китае (Чёрный Иртыш), течёт через Казахстан (ВКО, Павлодар, Семей), потом в Россию (Омск) и впадает в Обь. Три страны, одна река. Сейчас — мало воды, много загрязнения. Расследуйте.",
    },
  },

  evidence: [
    {
      id: "ev1",
      type: "chart",
      title: { kk: "Қара Ертістен Қазақстанға ағын", ru: "Сток в Казахстан" },
      required: true,
      content: {
        chartType: "line",
        xAxis: "year",
        yAxis: { kk: "Ағын (км³/жыл)", ru: "Сток (км³/год)" },
        data: [
          { year: 1990, flow: 9.5 },
          { year: 2000, flow: 8.7 },
          { year: 2010, flow: 7.2 },
          { year: 2015, flow: 6.5 },
          { year: 2020, flow: 5.8 },
          { year: 2024, flow: 5.2 },
        ],
        caption: {
          kk: "30 жылда ағын 45%-ға азайды.",
          ru: "За 30 лет сток снизился на 45%.",
        },
      },
    },
    {
      id: "ev2",
      type: "text_doc",
      title: { kk: "Қара Ертіс каналы", ru: "Канал Чёрный Иртыш" },
      required: true,
      content: {
        source: {
          kk: "Геофизикалық сараптама, 2023",
          ru: "Геофизическая экспертиза, 2023",
        },
        body: {
          kk: "ҚХР Шыңжаң АР-да Қара Ертіс өзенінен жылына 4 км³ су тартатын канал салынды (Қарамай қаласы үшін). Канал ұзындығы 500 км, мұнай өнеркәсібіне су береді. Қазақстан аумағында Ертіс деңгейі түсуде, Бұқтырма су қоймасы толмай қалуда.",
          ru: "В Синьцзяне КНР построен канал, забирающий 4 км³/год из Чёрного Иртыша (для г. Карамай и нефтепрома). Длина 500 км. На территории РК уровень Иртыша падает, Бухтарминское водохранилище не наполняется.",
        },
      },
    },
    {
      id: "ev3",
      type: "stat_card",
      title: { kk: "Ластану көрсеткіштері", ru: "Показатели загрязнения" },
      required: true,
      content: {
        values: [
          {
            label: { kk: "Мырыш (НДК норма ×)", ru: "Цинк (× ПДК)" },
            value: 18,
            unit: { kk: "есе", ru: "раз" },
          },
          {
            label: { kk: "Мыс (НДК норма ×)", ru: "Медь (× ПДК)" },
            value: 12,
            unit: { kk: "есе", ru: "раз" },
          },
          {
            label: { kk: "Мұнай өнімдері (мг/л)", ru: "Нефтепродукты (мг/л)" },
            value: 0.8,
            unit: { kk: "мг/л", ru: "мг/л" },
          },
        ],
        caption: {
          kk: "Өскемен өнеркәсіптік ластану — норманы 18 есе асырады.",
          ru: "Усть-Каменогорск: загрязнение в 18 раз выше нормы.",
        },
      },
    },
    {
      id: "ev4",
      type: "migration_data",
      title: { kk: "Жағалаудағы тұрғындар", ru: "Прибрежное население" },
      required: false,
      content: {
        regions: [
          {
            name: { kk: "Семей", ru: "Семей" },
            population1960: 340000,
            population2020: 322000,
          },
          {
            name: { kk: "Павлодар", ru: "Павлодар" },
            population1960: 350000,
            population2020: 360000,
          },
          {
            name: { kk: "Өскемен", ru: "Усть-Каменогорск" },
            population1960: 340000,
            population2020: 330000,
          },
        ],
        caption: {
          kk: "Үлкен қалалар әлі тұрады, бірақ ауылдар бос қалуда.",
          ru: "Города ещё держатся, но сёла пустеют.",
        },
      },
    },
  ],

  investigationQuestions: [
    {
      id: "q_problem",
      kind: "multi_choice",
      prompt: { kk: "Ертіс мәселелері?", ru: "Проблемы Иртыша?" },
      options: {
        kk: [
          "Су ағынының азаюы",
          "Ауыр металдармен ластану",
          "Жанартау",
          "Мұнай өнімдерімен ластану",
        ],
        ru: [
          "Снижение стока",
          "Загрязнение тяжёлыми металлами",
          "Вулкан",
          "Нефтяное загрязнение",
        ],
      },
      correct: [0, 1, 3],
      weight: 15,
    },
    {
      id: "q_country",
      kind: "single_choice",
      prompt: { kk: "Қай мемлекеттер өзенді бөліседі?", ru: "Какие страны делят реку?" },
      options: {
        kk: [
          "ҚР, Қырғызстан, Өзбекстан",
          "ҚХР, Қазақстан, Ресей",
          "ҚР, Иран, Әзірбайжан",
          "ҚР, Моңғолия, Қытай",
        ],
        ru: [
          "РК, Кыргызстан, Узбекистан",
          "КНР, Казахстан, Россия",
          "РК, Иран, Азербайджан",
          "РК, Монголия, Китай",
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
          "ҚХР Қара Ертістен су тартуы",
          "Өскемен металлургия зауыттары",
          "Көмір өндіру қалдықтары",
          "Жанартау тыныстауы",
        ],
        ru: [
          "Забор воды КНР из Чёрного Иртыша",
          "Металлургия Усть-Каменогорска",
          "Отходы угледобычи",
          "Вулканическая активность",
        ],
      },
      correct: [0, 1, 2],
      weight: 15,
    },
  ],

  solutions: [
    {
      id: "sol_treaty",
      title: {
        kk: "Үшжақты ҚХР-РФ-ҚР келісімі",
        ru: "Трёхстороннее соглашение КНР-РФ-РК",
      },
      short: {
        kk: "Әділ су бөлу + БҰҰ кепілдігі",
        ru: "Справедливый раздел + гарант ООН",
      },
      icon: "shield",
      recommended: true,
      effects: { waterFlow: { delta: 2 } },
      tradeoffs: {
        kk: "Дипломатиялық күрделілік, уақыт 5-15 жыл.",
        ru: "Сложная дипломатия, 5-15 лет.",
      },
      costMillionUsd: 10,
      timeYears: 10,
    },
    {
      id: "sol_clean",
      title: { kk: "Өскемен зауыттарын модернизациялау", ru: "Модернизация заводов Усть-Каменогорска" },
      short: { kk: "Заманауи тазалау жүйелері", ru: "Современная очистка" },
      icon: "leaf",
      effects: { pollution: { delta: -70 } },
      tradeoffs: {
        kk: "Қымбат, өнеркәсіптің қарсылығы.",
        ru: "Дорого, сопротивление промышленности.",
      },
      costMillionUsd: 1500,
      timeYears: 8,
    },
    {
      id: "sol_monitoring",
      title: { kk: "Спутник мониторингі + штрафтар", ru: "Спутниковый мониторинг + штрафы" },
      short: { kk: "Заңсыз төгілуді табу", ru: "Выявление нелегальных сбросов" },
      icon: "shield",
      effects: { pollution: { delta: -30 } },
      tradeoffs: {
        kk: "Тек ластануды бақылау, ағынға әсер етпейді.",
        ru: "Только мониторинг, не влияет на сток.",
      },
      costMillionUsd: 50,
      timeYears: 3,
    },
    {
      id: "sol_nothing",
      title: { kk: "Ештеңе істемеу", ru: "Бездействие" },
      short: { kk: "Ертіс — өлі өзенге айналуы", ru: "Иртыш — мёртвая река" },
      icon: "alert-triangle",
      effects: { waterFlow: { delta: -2 }, pollution: { delta: 30 } },
      tradeoffs: {
        kk: "Балық кетеді, ауыз су тапшылығы.",
        ru: "Рыба исчезнет, дефицит питьевой воды.",
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
        indicators: { waterFlow: 5.2, pollutionIndex: 85, fishTons: 800 },
      },
      {
        t: 0.5,
        label: { kk: "+10 жыл", ru: "+10 лет" },
        indicators: { waterFlow: 6.5, pollutionIndex: 50, fishTons: 1400 },
      },
      {
        t: 1,
        label: { kk: "+25 жыл", ru: "+25 лет" },
        indicators: { waterFlow: 7.5, pollutionIndex: 25, fishTons: 2200 },
      },
    ],
    animation: { riversRedraw: true },
  },

  explanationTask: {
    prompt: {
      kk: "Сіздің шешіміңіз неліктен Ертісті құтқарады? Үш мемлекет арасында теңгерімді қалай табасыз? 150-400 сөз.",
      ru: "Почему ваше решение спасает Иртыш? Как найти баланс между тремя странами? 150-400 слов.",
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
        description: { kk: "Ертіс, ҚХР, РФ географиясы", ru: "География Иртыша, КНР, РФ" },
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
        description: { kk: "Графиктер, ластану", ru: "Графики, загрязнение" },
      },
      {
        id: "diplomacy",
        name: { kk: "Дипломатия", ru: "Дипломатия" },
        weight: 15,
        description: { kk: "Үш ел арасындағы теңгерім", ru: "Баланс трёх стран" },
      },
      {
        id: "language_clarity",
        name: { kk: "Тіл", ru: "Язык" },
        weight: 10,
        description: { kk: "Қазақ тілі", ru: "Казахский" },
      },
    ],
    aiInstructions:
      "Grade a Kazakh 10-11 grade essay about the Irtysh river — transboundary water issue with China and Russia. Reply in Kazakh.",
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
      kk: "Қазақстан 1990 жылдардан бері ҚХР-мен Ертіс бойынша келіссөздер жүргізіп жатыр. Ресей трансшекаралық су конвенциясын ратификациялады, бірақ ҚХР — жоқ. Бұл — Орталық Азиядағы ең күрделі су геосаясаты.",
      ru: "Казахстан с 1990-х ведёт переговоры с КНР по Иртышу. Россия ратифицировала конвенцию по трансграничным водам, КНР — нет. Это самая сложная водная геополитика в Центральной Азии.",
    },
    sources: [
      {
        label: { kk: "Irtysh River — Wikipedia", ru: "Иртыш — Википедия" },
        url: "https://en.wikipedia.org/wiki/Irtysh_River",
      },
    ],
  },
};
