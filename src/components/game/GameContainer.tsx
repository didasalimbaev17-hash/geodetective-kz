"use client";

import { useEffect, useMemo, useState } from "react";
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

export function GameContainer({ scenario }: { scenario: Scenario }) {
  const machine = useMemo(() => createCaseMachine(scenario), [scenario]);
  const storageKey = `${STORAGE_KEY_PREFIX}${scenario.id}`;

  // Load persisted state from sessionStorage
  const [initialSnapshot, setInitialSnapshot] = useState<unknown>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.value && parsed.value !== "completed") {
          // Restore Set from array (sessionStorage flattened it)
          if (parsed.context?.evidenceViewed && Array.isArray(parsed.context.evidenceViewed)) {
            parsed.context.evidenceViewed = new Set(parsed.context.evidenceViewed);
          }
          parsed.context.scenario = scenario;
          setInitialSnapshot(parsed);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey, scenario]);

  const [state, send] = useMachine(machine, {
    snapshot: hydrated ? (initialSnapshot as never) : undefined,
  });
  const t = useTranslations();

  // Persist state on every change
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const snapshot = {
        value: state.value,
        context: {
          ...state.context,
          // Convert Set → Array for JSON
          evidenceViewed: [...state.context.evidenceViewed],
          // Don't save the full scenario object (too big, restored from props)
          scenario: undefined,
        },
      };
      sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
      if (state.value === "completed") {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // ignore (quota exceeded, etc.)
    }
  }, [state, storageKey, hydrated]);

  const stage = state.value as string;

  if (!hydrated) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="size-12 text-primary animate-spin mx-auto" />
      </div>
    );
  }

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
          onContinue={() => send({ type: "SIMULATION_DONE" })}
        />
      )}

      {stage === "explanation" && state.context.chosenSolutionId && (
        <ExplanationStep
          scenario={scenario}
          chosenSolutionId={state.context.chosenSolutionId}
          investigationAnswers={state.context.investigationAnswers}
          evidenceViewed={[...state.context.evidenceViewed]}
          onGraded={(grade) =>
            send({ type: "RECEIVE_AI_GRADE", grade })
          }
        />
      )}

      {stage === "grading" && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <Loader2 className="size-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg">{t("game.explanation.gradingInProgress")}</p>
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
