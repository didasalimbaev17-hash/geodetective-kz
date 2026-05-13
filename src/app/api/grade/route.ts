import { NextRequest, NextResponse } from "next/server";
import { gradeEssay } from "@/server/ai/gradeEssay";
import { getScenarioById } from "@/data/cases";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      scenarioId,
      essayText,
      chosenSolutionId,
      investigationAnswers,
      evidenceViewed,
    } = body;

    if (!scenarioId || !essayText || !chosenSolutionId) {
      return NextResponse.json(
        { error: "Missing required fields (scenarioId/essayText/chosenSolutionId)" },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    console.log(
      `[/api/grade] grading ${scenarioId} for solution=${chosenSolutionId}, words=${essayText.split(/\s+/).length}`
    );

    const grade = await gradeEssay({
      scenario,
      essayText,
      chosenSolutionId,
      investigationAnswers: investigationAnswers ?? {},
      evidenceViewed: evidenceViewed ?? [],
    });

    console.log(`[/api/grade] grade total=${grade.total}`);

    return NextResponse.json({ grade });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/grade] ERROR:", msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
