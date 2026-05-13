import type { Scenario } from "@/schemas/case.schema";
import { aralScenario } from "./aral";

export const SEED_SCENARIOS: Scenario[] = [aralScenario];

/**
 * Resolves scenario by ID. In MVP — from in-memory seed.
 * Once DB is populated, this will query `scenarios` table.
 */
export function getScenarioById(id: string): Scenario | null {
  return SEED_SCENARIOS.find((s) => s.id === id) ?? null;
}

export function getAllScenarios(): Scenario[] {
  return SEED_SCENARIOS;
}

/**
 * Метаданные для каталога (без полного контента — лёгкое чтение)
 */
export type ScenarioMeta = {
  id: string;
  slug: string;
  title: { kk: string; ru?: string };
  subtitle?: { kk: string; ru?: string };
  difficulty: number;
  estimatedMinutes: number;
  tags: string[];
  coverImage?: string;
  region: { center: { lat: number; lng: number } };
};

export function getScenarioMeta(s: Scenario): ScenarioMeta {
  return {
    id: s.id,
    slug: s.id,
    title: s.meta.title,
    subtitle: s.meta.subtitle,
    difficulty: s.meta.difficulty,
    estimatedMinutes: s.meta.estimatedMinutes,
    tags: s.meta.tags,
    coverImage: s.meta.coverImage,
    region: { center: s.region.center },
  };
}
