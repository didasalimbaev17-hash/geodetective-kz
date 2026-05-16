"use server";

import { and, eq } from "drizzle-orm";
import { getDb } from "@/server/db";
import {
  scenarios,
  caseSessions,
  aiEvaluations,
  xpLog,
  profiles,
} from "@/server/db/schema";
import { getSessionUser } from "@/server/auth/supabase-server";
import { calculateLevel } from "@/lib/utils";
import { getScenarioById } from "@/data/cases";
import { revalidatePath } from "next/cache";

export type FinishCaseInput = {
  scenarioSlug: string;
  scores: {
    investigation: number;
    solution: number;
    ai: number;
    total: number;
  };
  evidenceViewed: string[];
  investigationAnswers: Record<string, number | number[]>;
  chosenSolutionId: string | null;
  explanationText: string;
  aiEvaluation: {
    scores: Record<string, number>;
    comments: Record<string, string>;
    total: number;
    overall: string;
    flags?: {
      promptInjectionSuspected?: boolean;
      offTopic?: boolean;
      tooShort?: boolean;
    };
    aiSuspicionScore?: number;
    aiSuspicionFlags?: string[];
  } | null;
  modelUsed?: string;
  timeSpentSeconds?: number;
};

export type FinishCaseResult =
  | { ok: true; recorded: false; reason: "no_user" | "already_recorded" }
  | {
      ok: true;
      recorded: true;
      xpGained: number;
      newXp: number;
      newLevel: number;
      leveledUp: boolean;
    }
  | { ok: false; error: string };

/**
 * Persists a completed case session: case_sessions, ai_evaluations, xp_log,
 * and increments profiles.xp/level. Idempotent: if a "completed" session for
 * (userId, scenarioId) already exists, returns recorded=false without
 * duplicating rows. Safe to call in demo mode (no user) — returns no_user.
 */
export async function finishCaseAction(
  input: FinishCaseInput
): Promise<FinishCaseResult> {
  try {
    const user = await getSessionUser();
    if (!user) {
      return { ok: true, recorded: false, reason: "no_user" };
    }

    // Allow-list: only persist scenarios that exist in seed data
    // (prevents arbitrary slug spam into scenarios table)
    if (!getScenarioById(input.scenarioSlug)) {
      return { ok: false, error: "unknown_scenario" };
    }

    const db = getDb();

    // 1. Upsert scenario by slug (auto-register cases on first completion)
    const [scenarioRow] = await db
      .insert(scenarios)
      .values({
        slug: input.scenarioSlug,
        status: "published",
        definition: {},
      })
      .onConflictDoUpdate({
        target: scenarios.slug,
        set: { updatedAt: new Date() },
      })
      .returning({ id: scenarios.id });

    if (!scenarioRow) {
      return { ok: false, error: "scenario_upsert_failed" };
    }
    const scenarioId = scenarioRow.id;

    // 2. Don't duplicate if user already finished this scenario
    const existing = await db
      .select({ id: caseSessions.id })
      .from(caseSessions)
      .where(
        and(
          eq(caseSessions.userId, user.id),
          eq(caseSessions.scenarioId, scenarioId),
          eq(caseSessions.state, "completed")
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { ok: true, recorded: false, reason: "already_recorded" };
    }

    // 3. INSERT case_sessions
    const [insertedSession] = await db
      .insert(caseSessions)
      .values({
        userId: user.id,
        scenarioId,
        state: "completed",
        evidenceViewed: input.evidenceViewed,
        investigationAnswers: input.investigationAnswers,
        chosenSolutionId: input.chosenSolutionId,
        explanationText: input.explanationText,
        investigationScore: input.scores.investigation,
        solutionScore: input.scores.solution,
        aiScore: input.scores.ai,
        totalScore: input.scores.total,
        timeSpentSeconds: input.timeSpentSeconds ?? 0,
        startedAt: new Date(),
        finishedAt: new Date(),
      })
      .returning({ id: caseSessions.id });

    if (!insertedSession) {
      return { ok: false, error: "session_insert_failed" };
    }
    const sessionId = insertedSession.id;

    // 4. INSERT ai_evaluations (if Claude grade exists)
    if (input.aiEvaluation) {
      await db.insert(aiEvaluations).values({
        sessionId,
        essayText: input.explanationText,
        modelUsed: input.modelUsed ?? "claude-haiku-4-5",
        rubricScores: input.aiEvaluation.scores ?? {},
        rubricComments: input.aiEvaluation.comments ?? {},
        totalScore: input.scores.ai,
        overallComment: input.aiEvaluation.overall ?? null,
        claudeRawResponse: input.aiEvaluation,
        flaggedForReview: input.aiEvaluation.flags?.offTopic ?? false,
        aiSuspicionScore: input.aiEvaluation.aiSuspicionScore ?? 0,
        aiSuspicionFlags: input.aiEvaluation.aiSuspicionFlags ?? [],
      });
    }

    // 5. XP начисление по ОС 2026-05-16:
    //    - AI оценивает по шкале 0..100 (не трогаем промпт)
    //    - В profiles.xp пишется total / 2
    //    - Максимум XP на счёте = 100 (cap для engagement-петли магазина)
    const xpFromTotal = Math.max(0, Math.round(input.scores.total / 2));

    const [profileRow] = await db
      .select({ xp: profiles.xp, level: profiles.level })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    const oldXp = profileRow?.xp ?? 0;
    const oldLevel = profileRow?.level ?? 1;
    const newXp = Math.min(100, oldXp + xpFromTotal);
    const actualGained = newXp - oldXp;

    if (actualGained > 0) {
      await db.insert(xpLog).values({
        userId: user.id,
        delta: actualGained,
        reason: `case_completed:${input.scenarioSlug}`,
        refSessionId: sessionId,
      });
    }

    const newLevel = calculateLevel(newXp);

    await db
      .update(profiles)
      .set({ xp: newXp, level: newLevel, updatedAt: new Date() })
      .where(eq(profiles.id, user.id));

    revalidatePath("/", "layout");

    return {
      ok: true,
      recorded: true,
      xpGained: actualGained,
      newXp,
      newLevel,
      leveledUp: newLevel > oldLevel,
    };
  } catch (err) {
    console.error("[finishCaseAction]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown_error",
    };
  }
}
