"use client";

import dynamic from "next/dynamic";
import type { Scenario } from "@/schemas/case.schema";
import { Loader2 } from "lucide-react";

// Render game ONLY on client to avoid SSR/CSR hydration mismatch
// (sessionStorage available only in browser)
const GameContainerInner = dynamic(
  () => import("./GameContainerInner").then((m) => m.GameContainerInner),
  {
    ssr: false,
    loading: () => (
      <div className="container py-20 text-center">
        <Loader2 className="size-12 text-primary animate-spin mx-auto" />
      </div>
    ),
  }
);

export function GameContainer({ scenario }: { scenario: Scenario }) {
  return <GameContainerInner scenario={scenario} />;
}
