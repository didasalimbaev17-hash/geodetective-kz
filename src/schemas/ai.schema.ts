import { z } from "zod";

export const aiGradingResponseSchema = z.object({
  scores: z.record(z.string(), z.number().min(0).max(100)),
  comments: z.record(z.string(), z.string()),
  total: z.number().min(0).max(100),
  overall: z.string(),
  flags: z
    .object({
      promptInjectionSuspected: z.boolean().default(false),
      offTopic: z.boolean().default(false),
      tooShort: z.boolean().default(false),
    })
    .optional(),
  // AI-генерация эссе: эвристическая оценка стилистических признаков.
  // 0 = текст похож на ученика-школьника, 100 = ярко выраженные признаки AI.
  // Точность ограничена — особенно для не-носителей казахского. В UI
  // явно маркируется как "приблизительная оценка".
  aiSuspicionScore: z.number().min(0).max(100).optional().default(0),
  aiSuspicionFlags: z.array(z.string()).optional().default([]),
});

export type AiGradingResponse = z.infer<typeof aiGradingResponseSchema>;
