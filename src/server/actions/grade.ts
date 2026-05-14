"use server";

import { gradeEssay } from "@/server/ai/gradeEssay";
import { getScenarioById } from "@/data/cases";
import { getCurrentUserProfile } from "@/server/auth/get-user";
import type { AiGradingResponse } from "@/schemas/ai.schema";

export type GradeErrorCode =
  | "scenario_not_found"
  | "essay_too_short"
  | "grading_failed";

export type GradeResult =
  | { ok: true; grade: AiGradingResponse }
  | { ok: false; errorCode: GradeErrorCode; errorDetail?: string };

/**
 * @deprecated Use POST /api/grade directly from client (better timeout handling)
 */
export async function gradeEssayAction(input: {
  scenarioId: string;
  essayText: string;
  chosenSolutionId: string;
  investigationAnswers: Record<string, number | number[]>;
  evidenceViewed: string[];
  locale?: "kk" | "ru";
}): Promise<GradeResult> {
  const user = await getCurrentUserProfile();

  const scenario = getScenarioById(input.scenarioId);
  if (!scenario) return { ok: false, errorCode: "scenario_not_found" };

  if (
    input.essayText.trim().split(/\s+/).length <
    scenario.explanationTask.minWords
  ) {
    return { ok: false, errorCode: "essay_too_short" };
  }

  try {
    const grade = await gradeEssay({
      scenario,
      essayText: input.essayText,
      chosenSolutionId: input.chosenSolutionId,
      investigationAnswers: input.investigationAnswers,
      evidenceViewed: input.evidenceViewed,
      locale: input.locale,
    });

    if (user) {
      // TODO: persist case_sessions + ai_evaluations
    }

    return { ok: true, grade };
  } catch (err) {
    console.error("[gradeEssayAction]", err);
    return {
      ok: false,
      errorCode: "grading_failed",
      errorDetail: err instanceof Error ? err.message : undefined,
    };
  }
}
