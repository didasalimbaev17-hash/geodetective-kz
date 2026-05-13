"use server";

import { gradeEssay } from "@/server/ai/gradeEssay";
import { getScenarioById } from "@/data/cases";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import type { AiGradingResponse } from "@/schemas/ai.schema";

export type GradeResult =
  | { ok: true; grade: AiGradingResponse }
  | { ok: false; error: string };

export async function gradeEssayAction(input: {
  scenarioId: string;
  essayText: string;
  chosenSolutionId: string;
  investigationAnswers: Record<string, number | number[]>;
  evidenceViewed: string[];
}): Promise<GradeResult> {
  // Allow anon in dev: grading works without auth so user can test flow
  const user = await getCurrentUserProfile();

  const scenario = getScenarioById(input.scenarioId);
  if (!scenario) return { ok: false, error: "Scenario not found" };

  if (
    input.essayText.trim().split(/\s+/).length <
    scenario.explanationTask.minWords
  ) {
    return { ok: false, error: "Эссе тым қысқа" };
  }

  try {
    const grade = await gradeEssay({
      scenario,
      essayText: input.essayText,
      chosenSolutionId: input.chosenSolutionId,
      investigationAnswers: input.investigationAnswers,
      evidenceViewed: input.evidenceViewed,
    });

    // TODO: persist case_sessions + ai_evaluations rows when authed user available
    if (user) {
      // Implementation note: write to DB in production version
    }

    return { ok: true, grade };
  } catch (err) {
    console.error("[gradeEssayAction]", err);
    return { ok: false, error: "Бағалау сәтсіз аяқталды" };
  }
}
