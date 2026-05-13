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
});

export type AiGradingResponse = z.infer<typeof aiGradingResponseSchema>;
