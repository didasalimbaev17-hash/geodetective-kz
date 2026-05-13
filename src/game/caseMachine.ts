import { setup, assign } from "xstate";
import type { Scenario } from "@/schemas/case.schema";

export type CaseContext = {
  scenario: Scenario;
  evidenceViewed: Set<string>;
  investigationAnswers: Record<string, number | number[]>;
  chosenSolutionId: string | null;
  explanationText: string;
  scores: {
    investigation: number;
    solution: number;
    ai: number;
    total: number;
  };
  aiEvaluation: {
    scores: Record<string, number>;
    comments: Record<string, string>;
    total: number;
    overall: string;
  } | null;
  hintsUsed: number;
  startedAt: number;
};

export type CaseEvent =
  | { type: "START" }
  | { type: "VIEW_EVIDENCE"; evidenceId: string }
  | { type: "GO_TO_INVESTIGATION" }
  | {
      type: "SUBMIT_INVESTIGATION";
      answers: Record<string, number | number[]>;
    }
  | { type: "CHOOSE_SOLUTION"; solutionId: string }
  | { type: "SIMULATION_DONE" }
  | { type: "SUBMIT_EXPLANATION"; text: string }
  | {
      type: "RECEIVE_AI_GRADE";
      grade: NonNullable<CaseContext["aiEvaluation"]>;
    }
  | { type: "GRADING_FAILED" }
  | { type: "FINISH" }
  | { type: "RESET" };

export const caseStages = [
  "briefing",
  "evidence",
  "investigation",
  "solution",
  "simulation",
  "explanation",
  "debrief",
] as const;

export type CaseStage = (typeof caseStages)[number];

function scoreInvestigation(
  scenario: Scenario,
  answers: Record<string, number | number[]>
): number {
  let earned = 0;
  let total = 0;
  for (const q of scenario.investigationQuestions) {
    total += q.weight;
    const userAns = answers[q.id];
    if (userAns === undefined) continue;
    if (q.kind === "single_choice") {
      if (userAns === q.correct) earned += q.weight;
    } else if (q.kind === "multi_choice") {
      const userSet = new Set(Array.isArray(userAns) ? userAns : []);
      const correctSet = new Set(q.correct);
      // Jaccard-like partial credit
      const intersection = [...userSet].filter((x) => correctSet.has(x))
        .length;
      const union = new Set([...userSet, ...correctSet]).size;
      earned += union === 0 ? 0 : (q.weight * intersection) / union;
    }
  }
  // normalize to scenario.scoring.breakdown.investigation
  if (total === 0) return 0;
  return Math.round(
    (earned / total) * scenario.scoring.breakdown.investigation
  );
}

function scoreSolution(scenario: Scenario, solutionId: string | null): number {
  if (!solutionId) return 0;
  const sol = scenario.solutions.find((s) => s.id === solutionId);
  if (!sol) return 0;
  const breakdown = scenario.scoring.breakdown.solutionChoice;
  // recommended → full, status_quo / unfeasible → 30%, others → 70%
  if (sol.recommended) return breakdown;
  if (
    sol.id.includes("status_quo") ||
    (sol.effects as { feasibility?: string }).feasibility === "low"
  ) {
    return Math.round(breakdown * 0.3);
  }
  return Math.round(breakdown * 0.7);
}

export const createCaseMachine = (scenario: Scenario) =>
  setup({
    types: {
      context: {} as CaseContext,
      events: {} as CaseEvent,
    },
    actions: {
      markEvidenceViewed: assign({
        evidenceViewed: ({ context, event }) => {
          if (event.type !== "VIEW_EVIDENCE") return context.evidenceViewed;
          const next = new Set(context.evidenceViewed);
          next.add(event.evidenceId);
          return next;
        },
      }),
      saveInvestigationAnswers: assign({
        investigationAnswers: ({ event, context }) =>
          event.type === "SUBMIT_INVESTIGATION"
            ? event.answers
            : context.investigationAnswers,
        scores: ({ event, context }) => {
          if (event.type !== "SUBMIT_INVESTIGATION") return context.scores;
          const investigation = scoreInvestigation(
            context.scenario,
            event.answers
          );
          return { ...context.scores, investigation };
        },
      }),
      saveSolution: assign({
        chosenSolutionId: ({ event, context }) =>
          event.type === "CHOOSE_SOLUTION"
            ? event.solutionId
            : context.chosenSolutionId,
        scores: ({ event, context }) => {
          if (event.type !== "CHOOSE_SOLUTION") return context.scores;
          const solution = scoreSolution(context.scenario, event.solutionId);
          return { ...context.scores, solution };
        },
      }),
      saveExplanation: assign({
        explanationText: ({ event, context }) =>
          event.type === "SUBMIT_EXPLANATION"
            ? event.text
            : context.explanationText,
      }),
      saveAiGrade: assign({
        aiEvaluation: ({ event, context }) =>
          event.type === "RECEIVE_AI_GRADE" ? event.grade : context.aiEvaluation,
        scores: ({ event, context }) => {
          if (event.type !== "RECEIVE_AI_GRADE") return context.scores;
          const ai = Math.round(
            (event.grade.total / 100) *
              context.scenario.scoring.breakdown.aiExplanation
          );
          const total =
            context.scores.investigation + context.scores.solution + ai;
          return { ...context.scores, ai, total };
        },
      }),
    },
    guards: {
      enoughEvidenceViewed: ({ context }) => {
        const required = context.scenario.evidence.filter((e) => e.required);
        const requiredIds = new Set(required.map((e) => e.id));
        const viewedRequired = [...context.evidenceViewed].filter((id) =>
          requiredIds.has(id)
        ).length;
        const ratio = required.length === 0 ? 1 : viewedRequired / required.length;
        return ratio >= 0.7;
      },
    },
  }).createMachine({
    id: "case",
    initial: "briefing",
    context: {
      scenario,
      evidenceViewed: new Set<string>(),
      investigationAnswers: {},
      chosenSolutionId: null,
      explanationText: "",
      scores: { investigation: 0, solution: 0, ai: 0, total: 0 },
      aiEvaluation: null,
      hintsUsed: 0,
      startedAt: Date.now(),
    },
    states: {
      briefing: {
        on: { START: "evidence" },
      },
      evidence: {
        on: {
          VIEW_EVIDENCE: { actions: "markEvidenceViewed" },
          GO_TO_INVESTIGATION: {
            target: "investigation",
            guard: "enoughEvidenceViewed",
          },
        },
      },
      investigation: {
        on: {
          SUBMIT_INVESTIGATION: {
            target: "solution",
            actions: "saveInvestigationAnswers",
          },
        },
      },
      solution: {
        on: {
          CHOOSE_SOLUTION: {
            target: "simulation",
            actions: "saveSolution",
          },
        },
      },
      simulation: {
        on: { SIMULATION_DONE: "explanation" },
      },
      explanation: {
        on: {
          SUBMIT_EXPLANATION: {
            // remain in "explanation" state — UI shows loader; no need for separate grading state
            actions: "saveExplanation",
          },
          RECEIVE_AI_GRADE: {
            target: "debrief",
            actions: "saveAiGrade",
          },
        },
      },
      grading: {
        on: {
          RECEIVE_AI_GRADE: {
            target: "debrief",
            actions: "saveAiGrade",
          },
          GRADING_FAILED: {
            target: "explanation",
          },
        },
      },
      debrief: {
        on: { FINISH: "completed", RESET: "briefing" },
      },
      completed: { type: "final" },
    },
  });

export type CaseMachine = ReturnType<typeof createCaseMachine>;
