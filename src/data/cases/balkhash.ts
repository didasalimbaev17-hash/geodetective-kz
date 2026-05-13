import type { Scenario } from "@/schemas/case.schema";

export const balkhashScenario: Scenario = {
  id: "case-balkhash-2025",
  version: "1.0.0",
  localeDefault: "kk",

  meta: {
    title: { kk: "Балқаш көлінің тағдыры", ru: "Судьба озера Балхаш" },
    subtitle: { kk: "Жаңа Арал қаупі?", ru: "Новый Арал на подходе?" },
    difficulty: 3,
    estimatedMinutes: 22,
    tags: ["экология", "су", "Қазақстан", "трансшекаралық"],
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lake_Balkhash_-_Landsat_image.jpg/1280px-Lake_Balkhash_-_Landsat_image.jpg",
  },

  region: {
    center: { lat: 46.2, lng: 74.5 },
    zoom: 6,
    basemap: "dark",
  },

  briefing: {
    narrator: "ҚР Экология министрлігі",
    intro: {
      kk: "Балқаш — әлемдегі бірегей көл: батыс жартысы тұщы, шығыс жартысы тұзды. Бүгін көлдің 80% суы Іле өзенінен келеді. Бірақ Іленің бастауы — Қытайда. ҚХР каналдар салып, су тартып жатыр. Балқаш екінші Арал болуы мүмкін бе? Сіздің тергеуіңіз қажет.",
      ru: "Балхаш — уникальное озеро: западная часть пресная, восточная солёная. 80% воды поступает из реки Или. Но исток Или — в Китае, и КНР строит каналы. Может ли Балхаш стать вторым Аралом? Расследуйте.",
    },
  },

  evidence: [
    {
      id: "ev1",
      type: "satellite_compare",
      title: { kk: "Спутник 1990 vs 2023", ru: "Спутник 1990 vs 2023" },
      required: true,
      content: {
        before: {
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lake_Balkhash_-_Landsat_image.jpg/1280px-Lake_Balkhash_-_Landsat_image.jpg",
          year: 1990,
        },
        after: {
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Lake_Balkhash_-_Landsat_image.jpg/1280px-Lake_Balkhash_-_Landsat_image.jpg",
          year: 2023,
        },
        annotation: {
          kk: "Көл деңгейі 2 метрге төмендеді, шығыс тұзды бөлік шегінуде.",
          ru: "Уровень упал на 2 метра, восточная солёная часть отступает.",
        },
      },
    },
    {
      id: "ev2",
      type: "chart",
      title: { kk: "Іле өзеніндегі су ағыны", ru: "Сток реки Или" },
      required: true,
      content: {
        chartType: "line",
        xAxis: "year",
        yAxis: { kk: "Ағын (км³/жыл)", ru: "Сток (км³/год)" },
        data: [
          { year: 2000, flow: 17.8 },
          { year: 2005, flow: 16.0 },
          { year: 2010, flow: 14.5 },
          { year: 2015, flow: 13.2 },
          { year: 2020, flow: 12.0 },
          { year: 2024, flow: 11.0 },
        ],
        caption: {
          kk: "Қытай аумағында каналдар салынғаннан кейін ағын азайды.",
          ru: "Сток снизился после строительства каналов на территории Китая.",
        },
      },
    },
    {
      id: "ev3",
      type: "text_doc",
      title: { kk: "Дипломатиялық дерек", ru: "Дипломатический отчёт" },
      required: true,
      content: {
        source: { kk: "СІМ есебі, 2024", ru: "Отчёт МИД РК, 2024" },
        body: {
          kk: "ҚХР Шыңжаң АР-да Қара Ертіс пен Іле өзендерінен жылына 5 км³ су тартатын каналдар салды. Қазақстан мен ҚХР арасында су бөлу туралы заңды келісім жоқ — тек ниет хаттамасы 2001 жылдан. ҚХР өзінің су саясатын жария етуден бас тартады.",
          ru: "КНР построил каналы из Чёрного Иртыша и Или, забирая 5 км³/год. Юридического соглашения о водоразделе нет — только меморандум 2001 года.",
        },
      },
    },
    {
      id: "ev4",
      type: "stat_card",
      title: { kk: "Балық аулау көлемі", ru: "Объём улова" },
      required: false,
      content: {
        values: [
          { year: 1990, value: 12000, unit: { kk: "тонна", ru: "тонн" } },
          { year: 2023, value: 6500, unit: { kk: "тонна", ru: "тонн" } },
        ],
        caption: {
          kk: "Балық шаруашылығы 45%-ға төмендеді.",
          ru: "Рыболовство снизилось на 45%.",
        },
      },
    },
  ],

  investigationQuestions: [
    {
      id: "q_problem",
      kind: "single_choice",
      prompt: { kk: "Балқаштың басты қаупі?", ru: "Главная угроза Балхаша?" },
      options: {
        kk: [
          "Жанартау",
          "Іле өзенінен ағынның азаюы",
          "Жаһандық суыну",
          "Көлдің тереңдеуі",
        ],
        ru: [
          "Вулкан",
          "Снижение стока реки Или",
          "Глобальное похолодание",
          "Углубление дна",
        ],
      },
      correct: 1,
      weight: 10,
    },
    {
      id: "q_cause",
      kind: "multi_choice",
      prompt: { kk: "Себептері (бірнеше)?", ru: "Причины (несколько)?" },
      options: {
        kk: [
          "ҚХР каналдары",
          "Жергілікті ауыл шаруашылығы",
          "Климат өзгерісі",
          "Метеорит соғылуы",
        ],
        ru: [
          "Каналы КНР",
          "Местное сельское хозяйство",
          "Изменение климата",
          "Падение метеорита",
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
          "Балық азаюы",
          "Алматы мегаполисіне су тапшылығы",
          "Гүл бағының жайнауы",
          "Тұзды дауылдар",
        ],
        ru: [
          "Снижение рыбы",
          "Дефицит воды для Алматы",
          "Цветение садов",
          "Солёные бури",
        ],
      },
      correct: [0, 1, 3],
      weight: 15,
    },
  ],

  solutions: [
    {
      id: "sol_treaty",
      title: {
        kk: "ҚХР-мен трансшекаралық су туралы заңды келісім",
        ru: "Юридический договор с КНР по трансграничным водам",
      },
      short: {
        kk: "Дипломатиялық қысым + БҰҰ мен халықаралық сот",
        ru: "Дипломатия + ООН + международный суд",
      },
      icon: "shield",
      recommended: true,
      effects: { waterLevel: { delta: 1.5 } },
      tradeoffs: {
        kk: "Уақыт көп қажет (5-10 жыл), сыртқы саясатпен байланысты.",
        ru: "Долго (5-10 лет), зависит от внешней политики.",
      },
      costMillionUsd: 5,
      timeYears: 8,
    },
    {
      id: "sol_save",
      title: { kk: "Су үнемдеу + тамшылатып суару", ru: "Водосбережение + капельный полив" },
      short: {
        kk: "Алматы облысында тиімді технологиялар енгізу",
        ru: "Внедрить эффективные технологии в Алматинской обл.",
      },
      icon: "leaf",
      effects: { waterLevel: { delta: 0.8 } },
      tradeoffs: {
        kk: "Қымбат, фермерлерге субсидия керек.",
        ru: "Дорого, нужны субсидии фермерам.",
      },
      costMillionUsd: 250,
      timeYears: 10,
    },
    {
      id: "sol_dam",
      title: { kk: "Жасанды бөгет — батыс бөлікті құтқару", ru: "Дамба — спасти западную часть" },
      short: { kk: "Балқаштың тұщы бөлігін оқшаулау", ru: "Изолировать пресную часть" },
      icon: "shield",
      effects: { waterLevel: { west: 2, east: -3 } },
      tradeoffs: {
        kk: "Шығыс тұзды бөлік толық жоғалады.",
        ru: "Восточная часть полностью исчезнет.",
      },
      costMillionUsd: 500,
      timeYears: 7,
    },
    {
      id: "sol_nothing",
      title: { kk: "Ештеңе істемеу", ru: "Бездействие" },
      short: { kk: "10 жылда — екінші Арал", ru: "Через 10 лет — второй Арал" },
      icon: "alert-triangle",
      effects: { waterLevel: { delta: -3 } },
      tradeoffs: {
        kk: "Көл толық жоғалуы мүмкін.",
        ru: "Озеро может исчезнуть полностью.",
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
        indicators: { waterLevel: 340, fishTons: 6500, salinityGL: 3 },
      },
      {
        t: 0.5,
        label: { kk: "+10 жыл", ru: "+10 лет" },
        indicators: { waterLevel: 341, fishTons: 9000, salinityGL: 2.5 },
      },
      {
        t: 1,
        label: { kk: "+25 жыл", ru: "+25 лет" },
        indicators: { waterLevel: 342, fishTons: 11000, salinityGL: 2 },
      },
    ],
    animation: { lakeMorph: true, riversRedraw: true },
  },

  explanationTask: {
    prompt: {
      kk: "Сіздің шешіміңіз неліктен Балқашты құтқарады? Іле өзенінің рөлі қандай? 150-400 сөз.",
      ru: "Почему ваше решение спасает Балхаш? Какова роль Или? 150-400 слов.",
    },
    minWords: 150,
    maxWords: 400,
    language: "kk",
  },

  evaluationRubric: {
    criteria: [
      {
        id: "geo_accuracy",
        name: { kk: "Географиялық дәлдік", ru: "Географическая точность" },
        weight: 25,
        description: { kk: "Іле, ҚХР, Балқаш фактілері", ru: "Факты о Или, КНР, Балхаше" },
      },
      {
        id: "causal_reasoning",
        name: { kk: "Себеп-салдар", ru: "Причинно-следствие" },
        weight: 30,
        description: { kk: "Шешім → нәтиже тізбегі", ru: "Решение → результат" },
      },
      {
        id: "evidence_use",
        name: { kk: "Дәлелдер", ru: "Использование улик" },
        weight: 20,
        description: { kk: "Графиктер, статистика", ru: "Графики, статистика" },
      },
      {
        id: "tradeoff_awareness",
        name: { kk: "Жағымсыз салдар", ru: "Негативные последствия" },
        weight: 15,
        description: { kk: "Шешімнің әлсіз жақтары", ru: "Слабые стороны решения" },
      },
      {
        id: "language_clarity",
        name: { kk: "Тіл сапасы", ru: "Качество языка" },
        weight: 10,
        description: { kk: "Қазақ тілі сауаттылығы", ru: "Грамотность" },
      },
    ],
    aiInstructions:
      "You are a geography teacher in Kazakhstan grading a 10-11 grade essay about Lake Balkhash and transboundary water issues with China. Grade strictly against the rubric. Reply in Kazakh.",
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
      kk: "2024 жылы Қазақстан Қытаймен Іле бойынша келіссөздерді жандандырды. БҰҰ деңгейіндегі заңды келісімнің әлі жоқ. Балқаш әлі тірі — бірақ келесі 20 жыл шешуші.",
      ru: "В 2024 году Казахстан активизировал переговоры с КНР. Юридического соглашения на уровне ООН пока нет. Балхаш ещё жив — но следующие 20 лет критичны.",
    },
    sources: [
      {
        label: { kk: "Балқаш — Википедия", ru: "Балхаш — Википедия" },
        url: "https://en.wikipedia.org/wiki/Lake_Balkhash",
      },
    ],
    nextCaseHintId: "case-almaty-smog-2025",
  },
};
