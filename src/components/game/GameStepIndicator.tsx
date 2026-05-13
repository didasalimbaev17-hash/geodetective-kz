"use client";

import { useTranslations } from "next-intl";
import { caseStages } from "@/game/caseMachine";
import { cn } from "@/lib/utils";

export function GameStepIndicator({ current }: { current: string }) {
  const t = useTranslations("game.stages");
  const currentIdx = caseStages.indexOf(current as never);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {caseStages.map((stage, i) => (
        <div key={stage} className="flex items-center gap-2 flex-shrink-0">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all",
              i < currentIdx && "bg-success/20 text-success",
              i === currentIdx && "bg-primary text-primary-foreground shadow-md shadow-primary/30",
              i > currentIdx && "bg-surface text-muted-foreground"
            )}
          >
            <span className="font-bold">{i + 1}</span>
            <span className="hidden sm:inline">{t(stage as never)}</span>
          </div>
          {i < caseStages.length - 1 && (
            <div
              className={cn(
                "h-px w-3 sm:w-6",
                i < currentIdx ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
