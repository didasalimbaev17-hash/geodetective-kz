"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/server/db";
import { caseIdeas, profiles } from "@/server/db/schema";
import { getSessionUser } from "@/server/auth/supabase-server";

export type CaseIdeaRow = {
  id: string;
  title: string;
  grade: "10" | "11" | null;
  region: string | null;
  description: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  adminNote: string | null;
  createdAt: Date;
};

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: "no_user" | "not_teacher" | "missing_fields" | "title_too_long" | "description_too_long" | "unknown" };

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;

export async function submitCaseIdeaAction(input: {
  title: string;
  grade: "10" | "11" | null;
  region: string;
  description: string;
}): Promise<SubmitResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "no_user" };

    const db = getDb();
    const [profile] = await db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
      return { ok: false, error: "not_teacher" };
    }

    const title = input.title.trim();
    const description = input.description.trim();
    const region = input.region.trim();
    if (!title || !description) {
      return { ok: false, error: "missing_fields" };
    }
    if (title.length > MAX_TITLE) return { ok: false, error: "title_too_long" };
    if (description.length > MAX_DESCRIPTION) {
      return { ok: false, error: "description_too_long" };
    }

    const [row] = await db
      .insert(caseIdeas)
      .values({
        teacherId: user.id,
        title,
        grade: input.grade,
        region: region || null,
        description,
        status: "pending",
      })
      .returning({ id: caseIdeas.id });

    if (!row) return { ok: false, error: "unknown" };

    revalidatePath("/teacher/dashboard");
    return { ok: true, id: row.id };
  } catch (err) {
    console.error("[submitCaseIdeaAction]", err);
    return { ok: false, error: "unknown" };
  }
}

export async function getMyCaseIdeasAction(): Promise<CaseIdeaRow[]> {
  try {
    const user = await getSessionUser();
    if (!user) return [];
    const db = getDb();
    const rows = await db
      .select({
        id: caseIdeas.id,
        title: caseIdeas.title,
        grade: caseIdeas.grade,
        region: caseIdeas.region,
        description: caseIdeas.description,
        status: caseIdeas.status,
        adminNote: caseIdeas.adminNote,
        createdAt: caseIdeas.createdAt,
      })
      .from(caseIdeas)
      .where(eq(caseIdeas.teacherId, user.id))
      .orderBy(desc(caseIdeas.createdAt));
    return rows as CaseIdeaRow[];
  } catch (err) {
    console.error("[getMyCaseIdeasAction]", err);
    return [];
  }
}
