"use server";

import { and, eq, sql, inArray, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/server/db";
import {
  classrooms,
  classroomMembers,
  profiles,
  caseSessions,
  scenarios as scenariosTable,
} from "@/server/db/schema";
import { getSessionUser } from "@/server/auth/supabase-server";
import { generateClassroomCode } from "@/lib/utils";

type Grade = "10" | "11";

export type ClassroomSummary = {
  id: string;
  name: string;
  code: string;
  grade: Grade | null;
  studentCount: number;
  createdAt: string;
};

export type StudentRow = {
  id: string;
  email: string;
  fullName: string | null;
  grade: Grade | null;
  xp: number;
  completedCount: number;
};

export type ClassroomDetails = {
  id: string;
  name: string;
  code: string;
  grade: Grade | null;
  students: StudentRow[];
};

async function assertTeacher() {
  const user = await getSessionUser();
  if (!user) return null;
  const db = getDb();
  const [profile] = await db
    .select({ id: profiles.id, role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    return null;
  }
  return profile;
}

function normalizeGrade(value: unknown): Grade | null {
  return value === "10" || value === "11" ? value : null;
}

export async function createClassroomAction(input: {
  name: string;
  grade: Grade;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return { ok: false, error: "not_teacher" };
    if (!input.name.trim()) return { ok: false, error: "missing_name" };
    if (input.grade !== "10" && input.grade !== "11") {
      return { ok: false, error: "invalid_grade" };
    }

    const db = getDb();
    // Retry on rare code collision (32^6 space, unlikely but possible)
    let attempt = 0;
    while (attempt < 5) {
      attempt += 1;
      const code = generateClassroomCode();
      try {
        const [row] = await db
          .insert(classrooms)
          .values({
            teacherId: teacher.id,
            name: input.name.trim(),
            code,
            grade: input.grade,
          })
          .returning({ id: classrooms.id });
        if (!row) continue;
        revalidatePath("/teacher/dashboard");
        return { ok: true, id: row.id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("classrooms_code_unique") || msg.includes("duplicate")) {
          continue;
        }
        throw err;
      }
    }
    return { ok: false, error: "code_collision" };
  } catch (err) {
    console.error("[createClassroomAction]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

export async function getMyClassroomsAction(): Promise<ClassroomSummary[]> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return [];
    const db = getDb();

    const rows = await db
      .select({
        id: classrooms.id,
        name: classrooms.name,
        code: classrooms.code,
        grade: classrooms.grade,
        createdAt: classrooms.createdAt,
        studentCount: sql<number>`(
          SELECT COUNT(*)::int FROM ${classroomMembers}
          WHERE ${classroomMembers.classroomId} = ${classrooms.id}
        )`,
      })
      .from(classrooms)
      .where(eq(classrooms.teacherId, teacher.id));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      grade: normalizeGrade(r.grade),
      studentCount: r.studentCount ?? 0,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[getMyClassroomsAction]", err);
    return [];
  }
}

export async function getClassroomDetailsAction(
  classroomId: string
): Promise<ClassroomDetails | null> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return null;
    const db = getDb();

    const [room] = await db
      .select()
      .from(classrooms)
      .where(
        and(
          eq(classrooms.id, classroomId),
          eq(classrooms.teacherId, teacher.id)
        )
      )
      .limit(1);
    if (!room) return null;

    const members = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
        grade: profiles.grade,
        xp: profiles.xp,
      })
      .from(classroomMembers)
      .innerJoin(profiles, eq(profiles.id, classroomMembers.studentId))
      .where(eq(classroomMembers.classroomId, classroomId));

    // Count completed sessions per student
    const memberIds = members.map((m) => m.id);
    let completionMap = new Map<string, number>();
    if (memberIds.length > 0) {
      const completedRows = await db
        .select({
          userId: caseSessions.userId,
          n: sql<number>`COUNT(*)::int`,
        })
        .from(caseSessions)
        .where(
          and(
            inArray(caseSessions.userId, memberIds),
            eq(caseSessions.state, "completed")
          )
        )
        .groupBy(caseSessions.userId);
      completionMap = new Map(completedRows.map((r) => [r.userId, r.n]));
    }

    return {
      id: room.id,
      name: room.name,
      code: room.code,
      grade: normalizeGrade(room.grade),
      students: members.map((m) => ({
        id: m.id,
        email: m.email,
        fullName: m.fullName,
        grade: normalizeGrade(m.grade),
        xp: m.xp ?? 0,
        completedCount: completionMap.get(m.id) ?? 0,
      })),
    };
  } catch (err) {
    console.error("[getClassroomDetailsAction]", err);
    return null;
  }
}

export async function getAvailableStudentsAction(
  classroomId: string,
  _grade: Grade | null
): Promise<StudentRow[]> {
  // Show ALL registered students regardless of their grade — teacher
  // decides who fits. The student's grade is rendered as a badge in the
  // UI list so the teacher can spot mismatches at a glance.
  void _grade;
  try {
    const teacher = await assertTeacher();
    if (!teacher) return [];
    const db = getDb();

    // Already-in-class student IDs
    const existingMembers = await db
      .select({ id: classroomMembers.studentId })
      .from(classroomMembers)
      .where(eq(classroomMembers.classroomId, classroomId));
    const existingIds = existingMembers.map((m) => m.id);

    const conditions = [eq(profiles.role, "student")];
    if (existingIds.length > 0) {
      conditions.push(notInArray(profiles.id, existingIds));
    }

    const rows = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
        grade: profiles.grade,
        xp: profiles.xp,
      })
      .from(profiles)
      .where(and(...conditions))
      .limit(200);

    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      fullName: r.fullName,
      grade: normalizeGrade(r.grade),
      xp: r.xp ?? 0,
      completedCount: 0,
    }));
  } catch (err) {
    console.error("[getAvailableStudentsAction]", err);
    return [];
  }
}

export async function addStudentToClassroomAction(input: {
  classroomId: string;
  studentId: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return { ok: false, error: "not_teacher" };
    const db = getDb();

    // Verify the classroom belongs to this teacher
    const [room] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(
        and(
          eq(classrooms.id, input.classroomId),
          eq(classrooms.teacherId, teacher.id)
        )
      )
      .limit(1);
    if (!room) return { ok: false, error: "not_owner" };

    await db
      .insert(classroomMembers)
      .values({
        classroomId: input.classroomId,
        studentId: input.studentId,
      })
      .onConflictDoNothing();

    revalidatePath(`/teacher/class/${input.classroomId}`);
    revalidatePath("/teacher/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("[addStudentToClassroomAction]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

export async function removeStudentFromClassroomAction(input: {
  classroomId: string;
  studentId: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return { ok: false, error: "not_teacher" };
    const db = getDb();

    const [room] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(
        and(
          eq(classrooms.id, input.classroomId),
          eq(classrooms.teacherId, teacher.id)
        )
      )
      .limit(1);
    if (!room) return { ok: false, error: "not_owner" };

    await db
      .delete(classroomMembers)
      .where(
        and(
          eq(classroomMembers.classroomId, input.classroomId),
          eq(classroomMembers.studentId, input.studentId)
        )
      );

    revalidatePath(`/teacher/class/${input.classroomId}`);
    revalidatePath("/teacher/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("[removeStudentFromClassroomAction]", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

export type ScenarioCompletion = {
  scenarioSlug: string;
  completedBy: number; // unique students
};

/**
 * For a classroom's grade, return completion counts per scenario across
 * all classroom members. Used to render the "X of N students passed"
 * line per case on the teacher's class detail page.
 */
export async function getClassroomCaseProgressAction(
  classroomId: string
): Promise<ScenarioCompletion[]> {
  try {
    const teacher = await assertTeacher();
    if (!teacher) return [];
    const db = getDb();

    const [room] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(
        and(
          eq(classrooms.id, classroomId),
          eq(classrooms.teacherId, teacher.id)
        )
      )
      .limit(1);
    if (!room) return [];

    const members = await db
      .select({ id: classroomMembers.studentId })
      .from(classroomMembers)
      .where(eq(classroomMembers.classroomId, classroomId));
    const memberIds = members.map((m) => m.id);
    if (memberIds.length === 0) return [];

    // Join sessions → scenarios to get slug
    const rows = await db
      .select({
        slug: scenariosTable.slug,
        userId: caseSessions.userId,
      })
      .from(caseSessions)
      .innerJoin(scenariosTable, eq(scenariosTable.id, caseSessions.scenarioId))
      .where(
        and(
          inArray(caseSessions.userId, memberIds),
          eq(caseSessions.state, "completed")
        )
      );

    // Count unique users per slug
    const perSlug = new Map<string, Set<string>>();
    for (const r of rows) {
      const set = perSlug.get(r.slug) ?? new Set<string>();
      set.add(r.userId);
      perSlug.set(r.slug, set);
    }

    return Array.from(perSlug.entries()).map(([slug, set]) => ({
      scenarioSlug: slug,
      completedBy: set.size,
    }));
  } catch (err) {
    console.error("[getClassroomCaseProgressAction]", err);
    return [];
  }
}
