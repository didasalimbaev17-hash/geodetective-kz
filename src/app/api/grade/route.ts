import { NextRequest, NextResponse } from "next/server";
import { gradeEssay } from "@/server/ai/gradeEssay";
import { getScenarioById } from "@/data/cases";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Suppress noisy DEP0169 url.parse() warning from a transitive dep
if (process.removeAllListeners) {
  process.removeAllListeners("warning");
}

const HARD_TIMEOUT_MS = 55000; // надёжно влезает в Vercel maxDuration=60

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const body = await req.json();
    const {
      scenarioId,
      essayText,
      chosenSolutionId,
      investigationAnswers,
      evidenceViewed,
      locale,
    } = body;

    if (!scenarioId || !essayText || !chosenSolutionId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (scenarioId/essayText/chosenSolutionId)",
        },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const wordCount = essayText.trim().split(/\s+/).length;
    console.log(
      `[/api/grade] start scenario=${scenarioId} solution=${chosenSolutionId} words=${wordCount}`
    );

    // Race the AI call against a hard timeout — гарантия что клиент получит ответ
    const gradePromise = gradeEssay({
      scenario,
      essayText,
      chosenSolutionId,
      investigationAnswers: investigationAnswers ?? {},
      evidenceViewed: evidenceViewed ?? [],
      locale: locale === "ru" ? "ru" : "kk",
    });

    const timeoutPromise = new Promise<"__timeout__">((resolve) =>
      setTimeout(() => resolve("__timeout__"), HARD_TIMEOUT_MS)
    );

    const result = await Promise.race([gradePromise, timeoutPromise]);

    if (result === "__timeout__") {
      console.warn(
        `[/api/grade] HARD TIMEOUT ${HARD_TIMEOUT_MS}ms exceeded for ${scenarioId}`
      );
      return NextResponse.json(
        {
          error: "AI provider timed out",
          hint: "Try again or check ANTHROPIC_GRADING_MODEL env (use claude-haiku-4-5 for speed)",
        },
        { status: 504 }
      );
    }

    const elapsed = Date.now() - startedAt;
    console.log(
      `[/api/grade] OK ${scenarioId} total=${result.total} elapsed=${elapsed}ms`
    );

    return NextResponse.json({ grade: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const elapsed = Date.now() - startedAt;
    console.error(`[/api/grade] ERROR elapsed=${elapsed}ms:`, msg, err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
