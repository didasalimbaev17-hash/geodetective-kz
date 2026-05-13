import { z } from "zod";

// ============================================================
// Локализованный текст (kk обязателен, ru опционален)
// ============================================================
const localizedText = z.object({
  kk: z.string().min(1),
  ru: z.string().optional(),
});

// ============================================================
// EVIDENCE — улики разных типов
// ============================================================
const evidenceBase = z.object({
  id: z.string(),
  title: localizedText,
  icon: z.string().optional(),
  required: z.boolean().default(false),
});

const satelliteCompareEvidence = evidenceBase.extend({
  type: z.literal("satellite_compare"),
  content: z.object({
    before: z.object({ image: z.string(), year: z.number() }),
    after: z.object({ image: z.string(), year: z.number() }),
    annotation: localizedText.optional(),
  }),
});

const chartEvidence = evidenceBase.extend({
  type: z.literal("chart"),
  content: z.object({
    chartType: z.enum(["line", "bar", "area"]),
    xAxis: z.string(),
    yAxis: localizedText,
    data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
    caption: localizedText.optional(),
  }),
});

const statCardEvidence = evidenceBase.extend({
  type: z.literal("stat_card"),
  content: z.object({
    values: z.array(
      z.object({
        year: z.number().optional(),
        label: localizedText.optional(),
        value: z.number(),
        unit: localizedText.optional(),
      })
    ),
    caption: localizedText.optional(),
  }),
});

const migrationDataEvidence = evidenceBase.extend({
  type: z.literal("migration_data"),
  content: z.object({
    regions: z.array(
      z.object({
        name: localizedText,
        population1960: z.number().optional(),
        population2020: z.number().optional(),
        populationByYear: z.record(z.string(), z.number()).optional(),
      })
    ),
    caption: localizedText.optional(),
  }),
});

const photoGalleryEvidence = evidenceBase.extend({
  type: z.literal("photo_gallery"),
  content: z.object({
    images: z.array(
      z.object({
        src: z.string(),
        caption: localizedText.optional(),
      })
    ),
  }),
});

const textDocEvidence = evidenceBase.extend({
  type: z.literal("text_doc"),
  content: z.object({
    source: localizedText.optional(),
    body: localizedText,
  }),
});

export const evidenceSchema = z.discriminatedUnion("type", [
  satelliteCompareEvidence,
  chartEvidence,
  statCardEvidence,
  migrationDataEvidence,
  photoGalleryEvidence,
  textDocEvidence,
]);

export type Evidence = z.infer<typeof evidenceSchema>;

// ============================================================
// INVESTIGATION QUESTIONS
// ============================================================
const singleChoiceQuestion = z.object({
  id: z.string(),
  kind: z.literal("single_choice"),
  prompt: localizedText,
  options: z.object({
    kk: z.array(z.string()),
    ru: z.array(z.string()).optional(),
  }),
  correct: z.number(),
  weight: z.number().default(10),
  feedbackCorrect: localizedText.optional(),
  feedbackWrong: localizedText.optional(),
});

const multiChoiceQuestion = z.object({
  id: z.string(),
  kind: z.literal("multi_choice"),
  prompt: localizedText,
  options: z.object({
    kk: z.array(z.string()),
    ru: z.array(z.string()).optional(),
  }),
  correct: z.array(z.number()),
  weight: z.number().default(15),
  feedbackCorrect: localizedText.optional(),
  feedbackWrong: localizedText.optional(),
});

export const questionSchema = z.discriminatedUnion("kind", [
  singleChoiceQuestion,
  multiChoiceQuestion,
]);

export type Question = z.infer<typeof questionSchema>;

// ============================================================
// SOLUTIONS
// ============================================================
export const solutionSchema = z.object({
  id: z.string(),
  title: localizedText,
  short: localizedText.optional(),
  icon: z.string().optional(),
  realWorldBasis: z.string().optional(),
  effects: z.record(z.string(), z.any()),
  tradeoffs: localizedText.optional(),
  costMillionUsd: z.number().optional(),
  timeYears: z.number().optional(),
  recommended: z.boolean().optional(),
});

export type Solution = z.infer<typeof solutionSchema>;

// ============================================================
// SIMULATION
// ============================================================
export const simulationSnapshotSchema = z.object({
  t: z.number().min(0).max(1),
  label: localizedText,
  indicators: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
  mapOverlay: z.string().optional(),
});

export const simulationSchema = z.object({
  durationSeconds: z.number().default(8),
  snapshots: z.array(simulationSnapshotSchema).min(2),
  animation: z
    .object({
      lakeMorph: z.boolean().optional(),
      riversRedraw: z.boolean().optional(),
      colorOverlay: z.string().optional(),
      easing: z.string().optional(),
    })
    .optional(),
});

// ============================================================
// EVALUATION RUBRIC
// ============================================================
export const rubricCriterionSchema = z.object({
  id: z.string(),
  name: localizedText,
  weight: z.number().min(1).max(100),
  description: localizedText,
});

export const evaluationRubricSchema = z.object({
  criteria: z.array(rubricCriterionSchema).min(1),
  aiInstructions: z.string(),
  passThreshold: z.number().min(0).max(100).default(60),
});

// ============================================================
// FULL SCENARIO
// ============================================================
export const scenarioSchema = z.object({
  id: z.string(),
  version: z.string().default("1.0.0"),
  localeDefault: z.enum(["kk", "ru"]).default("kk"),

  meta: z.object({
    title: localizedText,
    subtitle: localizedText.optional(),
    difficulty: z.number().int().min(1).max(5).default(2),
    estimatedMinutes: z.number().default(20),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
  }),

  region: z.object({
    center: z.object({ lat: z.number(), lng: z.number() }),
    zoom: z.number().default(6),
    bounds: z
      .tuple([
        z.tuple([z.number(), z.number()]),
        z.tuple([z.number(), z.number()]),
      ])
      .optional(),
    basemap: z.enum(["satellite-muted", "dark", "light"]).default("dark"),
  }),

  briefing: z.object({
    narrator: z.string().optional(),
    intro: localizedText,
    backgroundImage: z.string().optional(),
  }),

  evidence: z.array(evidenceSchema).min(2),

  investigationQuestions: z.array(questionSchema).min(1),

  solutions: z.array(solutionSchema).min(2),

  simulation: simulationSchema,

  explanationTask: z.object({
    prompt: localizedText,
    minWords: z.number().default(150),
    maxWords: z.number().default(400),
    language: z.enum(["kk", "ru"]).default("kk"),
  }),

  evaluationRubric: evaluationRubricSchema,

  scoring: z
    .object({
      maxPoints: z.number().default(100),
      breakdown: z.object({
        investigation: z.number().default(35),
        solutionChoice: z.number().default(15),
        aiExplanation: z.number().default(40),
        speedBonus: z.number().default(5),
        noHintsBonus: z.number().default(5),
      }),
    })
    .default({
      maxPoints: 100,
      breakdown: {
        investigation: 35,
        solutionChoice: 15,
        aiExplanation: 40,
        speedBonus: 5,
        noHintsBonus: 5,
      },
    }),

  debrief: z.object({
    realWorld: localizedText,
    sources: z
      .array(
        z.object({
          label: localizedText,
          url: z.string().url(),
        })
      )
      .default([]),
    nextCaseHintId: z.string().optional(),
  }),
});

export type Scenario = z.infer<typeof scenarioSchema>;
export type LocalizedText = z.infer<typeof localizedText>;
