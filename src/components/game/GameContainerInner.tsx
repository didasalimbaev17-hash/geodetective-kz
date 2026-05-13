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

  // Start fresh — no snapshot restore for now
  // (XState v5 snapshot persistence had compatibility issues; revisit later)
  const [state, send] = useMachine(machine);
  const t = useTranslations();

  // Save just the stage name for diagnostics (lightweight, no XState deps)
  useEffect(() => {
    try {
      sessionStorage.setItem(`${storageKey}-stage`, String(state.value));
      if (state.value === "completed") {
        sessionStorage.removeItem(`${storageKey}-stage`);
      }
    } catch {
      // ignore
    }
  }, [state.value, storageKey]);

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
          evidenceViewed={[...state.context.evidenceViewed]}
          onGraded={(grade) => send({ type: "RECEIVE_AI_GRADE", grade })}
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
        />
      )}
    </div>
  );
}
