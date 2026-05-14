"use client";

import { useEffect, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { useTranslations } from "next-intl";
import type { Scenario } from "@/schemas/case.schema";
import { createCaseMachine } from "@/game/caseMachine";
import { GameStepIndicator } from "./GameStepIndicator";
import { BriefingStep } from "./BriefingStep";
import { EvidenceStep } from "./EvidenceStep";
import { InvestigationStep } from "./InvestigationStep";
import { SolutionStep } from "./SolutionStep";
import { SimulationStep } from "./SimulationStep";
import { ExplanationStep } from "./ExplanationStep";
import { DebriefStep } from "./DebriefStep";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const STORAGE_KEY_PREFIX = "geodet-case-";

export function GameContainerInner({ scenario }: { scenario: Scenario }) {
  const machine = useMemo(() => createCaseMachine(scenario), [scenario]);
  const storageKey = `${STORAGE_KEY_PREFIX}${scenario.id}`;
  const snapshotKey = `${storageKey}-snapshot`;

  // Try to restore prior XState snapshot from sessionStorage so F5 (or
  // locale switch which reloads the page) keeps the player on the same step.
  // Always re-inject the latest scenario object — content might have changed
  // since the snapshot was written.
  const persistedSnapshot = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const raw = sessionStorage.getItem(snapshotKey);
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return undefined;
      if (parsed.context && typeof parsed.context === "object") {
        parsed.context.scenario = scenario;
      }
      return parsed;
    } catch {
      try {
        sessionStorage.removeItem(snapshotKey);
      } catch {
        // ignore
      }
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const [state, send, actorRef] = useMachine(machine, {
    snapshot: persistedSnapshot,
  });
  const t = useTranslations();

  // Save full snapshot on every state change so the user can refresh / switch
  // locale mid-game without losing progress. Clear once the case is finished:
  // debrief already persisted the session via finishCaseAction.
  useEffect(() => {
    try {
      sessionStorage.setItem(`${storageKey}-stage`, String(state.value));
      if (state.value === "debrief" || state.value === "completed") {
        sessionStorage.removeItem(snapshotKey);
        sessionStorage.removeItem(`${storageKey}-stage`);
        return;
      }
      const snap = actorRef.getPersistedSnapshot();
      sessionStorage.setItem(snapshotKey, JSON.stringify(snap));
    } catch {
      // quota exceeded or storage disabled — non-fatal
    }
  }, [state, actorRef, storageKey, snapshotKey]);

  const stage = state.value as string;

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <GameStepIndicator current={stage} />
      </div>

      {stage === "briefing" && (
        <BriefingStep
          scenario={scenario}
          onStart={() => send({ type: "START" })}
        />
      )}

      {stage === "evidence" && (
        <EvidenceStep
          scenario={scenario}
          viewed={state.context.evidenceViewed}
          onView={(id) => send({ type: "VIEW_EVIDENCE", evidenceId: id })}
          onContinue={() => send({ type: "GO_TO_INVESTIGATION" })}
        />
      )}

      {stage === "investigation" && (
        <InvestigationStep
          scenario={scenario}
          onSubmit={(answers) =>
            send({ type: "SUBMIT_INVESTIGATION", answers })
          }
        />
      )}

      {stage === "solution" && (
        <SolutionStep
          scenario={scenario}
          onChoose={(id) => send({ type: "CHOOSE_SOLUTION", solutionId: id })}
        />
      )}

      {stage === "simulation" && (
        <SimulationStep
          scenario={scenario}
          chosenSolutionId={state.context.chosenSolutionId}
          onContinue={() => send({ type: "SIMULATION_DONE" })}
        />
      )}

      {stage === "explanation" && state.context.chosenSolutionId && (
        <ExplanationStep
          scenario={scenario}
          chosenSolutionId={state.context.chosenSolutionId}
          investigationAnswers={state.context.investigationAnswers}
          evidenceViewed={state.context.evidenceViewed}
          onSubmitText={(text) =>
            send({ type: "SUBMIT_EXPLANATION", text })
          }
          onGraded={(grade) => send({ type: "RECEIVE_AI_GRADE", grade })}
          onGradingFailed={() => send({ type: "GRADING_FAILED" })}
        />
      )}

      {stage === "grading" && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg">
              {t("game.explanation.gradingInProgress")}
            </p>
          </CardContent>
        </Card>
      )}

      {stage === "debrief" && (
        <DebriefStep
          scenario={scenario}
          scores={state.context.scores}
          aiEvaluation={state.context.aiEvaluation}
          evidenceViewed={state.context.evidenceViewed}
          investigationAnswers={state.context.investigationAnswers}
          chosenSolutionId={state.context.chosenSolutionId}
          explanationText={state.context.explanationText}
          startedAt={state.context.startedAt}
        />
      )}
    </div>
  );
}
