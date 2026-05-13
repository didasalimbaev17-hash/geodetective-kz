import { NextRequest, NextResponse } from "next/server";
import { gradeEssay } from "@/server/ai/gradeEssay";
import { getScenarioById } from "@/data/cases";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, essayText, chosenSolutionId, investigationAnswers, evidenceViewed } = body;

    if (!scenarioId || !essayText || !chosenSolutionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const grade = await gradeEssay({
      scenario,
      essayText,
      chosenSolutionId,
      investigationAnswers: investigationAnswers ?? {},
      evidenceViewed: evidenceViewed ?? [],
    });

    return NextResponse.json({ grade });
  } catch (err) {
    console.error("[/api/grade]", err);
    return NextResponse.json(
      { error: "Grading failed" },
      { status: 500 }
    );
  }
}
