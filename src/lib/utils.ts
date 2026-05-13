import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedText(
  text: { kk: string; ru?: string } | undefined,
  locale: string
): string {
  if (!text) return "";
  if (locale === "ru" && text.ru) return text.ru;
  return text.kk;
}

export function getLocalizedArray(
  arr: { kk: string[]; ru?: string[] } | undefined,
  locale: string
): string[] {
  if (!arr) return [];
  if (locale === "ru" && arr.ru) return arr.ru;
  return arr.kk;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function calculateLevel(xp: number): number {
  // Lvl N = 100 * N^1.4 → invert
  if (xp < 100) return 1;
  return Math.floor(Math.pow(xp / 100, 1 / 1.4)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.4));
}

export function generateClassroomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
