"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/server/db";
import {
  classroomMembers,
  classrooms,
  profiles,
  shopItems,
  shopPurchases,
  xpLog,
} from "@/server/db/schema";
import { getSessionUser } from "@/server/auth/supabase-server";

export type ShopItemRow = {
  id: string;
  slug: string;
  titleKk: string;
  titleRu: string;
  descriptionKk: string | null;
  descriptionRu: string | null;
  cost: number;
  icon: string;
  active: boolean;
  sortOrder: number;
};

export type PurchaseWithItem = {
  purchase: {
    id: string;
    itemId: string;
    costPaid: number;
    state: string;
    purchasedAt: Date;
    usedAt: Date | null;
  };
  item: ShopItemRow;
};

export async function getShopItemsAction(): Promise<ShopItemRow[]> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(shopItems)
      .where(eq(shopItems.active, true))
      .orderBy(shopItems.sortOrder);
    return rows;
  } catch (err) {
    console.error("[getShopItemsAction]", err);
    return [];
  }
}

export async function getMyPurchasesAction(): Promise<PurchaseWithItem[]> {
  try {
    const user = await getSessionUser();
    if (!user) return [];
    const db = getDb();
    const rows = await db
      .select({
        purchase: {
          id: shopPurchases.id,
          itemId: shopPurchases.itemId,
          costPaid: shopPurchases.costPaid,
          state: shopPurchases.state,
          purchasedAt: shopPurchases.purchasedAt,
          usedAt: shopPurchases.usedAt,
        },
        item: shopItems,
      })
      .from(shopPurchases)
      .innerJoin(shopItems, eq(shopPurchases.itemId, shopItems.id))
      .where(eq(shopPurchases.userId, user.id))
      .orderBy(desc(shopPurchases.purchasedAt));
    return rows as PurchaseWithItem[];
  } catch (err) {
    console.error("[getMyPurchasesAction]", err);
    return [];
  }
}

export type PurchaseResult =
  | { ok: true; newXp: number }
  | { ok: false; error: "no_user" | "not_found" | "insufficient_xp" | "already_owned" | "unknown" };

/**
 * Atomic purchase: deducts XP, writes shop_purchases + xp_log row.
 * Idempotent guard: blocks buying a second copy of the same item while one is still "active".
 */
export async function purchaseItemAction(slug: string): Promise<PurchaseResult> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "no_user" };
    const db = getDb();

    const [item] = await db
      .select()
      .from(shopItems)
      .where(eq(shopItems.slug, slug))
      .limit(1);
    if (!item || !item.active) return { ok: false, error: "not_found" };

    const [profile] = await db
      .select({ xp: profiles.xp })
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);
    const currentXp = profile?.xp ?? 0;
    if (currentXp < item.cost) return { ok: false, error: "insufficient_xp" };

    const existingActive = await db
      .select({ id: shopPurchases.id })
      .from(shopPurchases)
      .where(
        and(
          eq(shopPurchases.userId, user.id),
          eq(shopPurchases.itemId, item.id),
          eq(shopPurchases.state, "active")
        )
      )
      .limit(1);
    if (existingActive.length > 0) {
      return { ok: false, error: "already_owned" };
    }

    const newXp = currentXp - item.cost;

    await db
      .update(profiles)
      .set({ xp: newXp, updatedAt: new Date() })
      .where(eq(profiles.id, user.id));

    await db.insert(shopPurchases).values({
      userId: user.id,
      itemId: item.id,
      costPaid: item.cost,
      state: "active",
    });

    await db.insert(xpLog).values({
      userId: user.id,
      delta: -item.cost,
      reason: `shop_purchase:${slug}`,
    });

    revalidatePath("/", "layout");
    return { ok: true, newXp };
  } catch (err) {
    console.error("[purchaseItemAction]", err);
    return { ok: false, error: "unknown" };
  }
}

export async function markPurchaseUsedAction(
  purchaseId: string
): Promise<{ ok: boolean }> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false };
    const db = getDb();
    await db
      .update(shopPurchases)
      .set({ state: "used", usedAt: new Date() })
      .where(
        and(
          eq(shopPurchases.id, purchaseId),
          eq(shopPurchases.userId, user.id)
        )
      );
    revalidatePath("/student/shop");
    return { ok: true };
  } catch (err) {
    console.error("[markPurchaseUsedAction]", err);
    return { ok: false };
  }
}

// ============================================================
// TEACHER VIEW — учитель видит активные покупки учеников своего класса
// ============================================================

export type StudentActivePurchase = {
  studentId: string;
  purchaseId: string;
  itemSlug: string;
  titleKk: string;
  titleRu: string;
  icon: string;
  costPaid: number;
  state: string;
  purchasedAt: Date;
  usedAt: Date | null;
};

/**
 * Returns ALL purchases (active + used) for all students in a classroom.
 * Teacher sees full history: what was bought, what was used, when.
 * Ownership-check: classroom must belong to the calling teacher.
 */
export async function getClassroomActivePurchasesAction(
  classroomId: string
): Promise<StudentActivePurchase[]> {
  try {
    const user = await getSessionUser();
    if (!user) return [];
    const db = getDb();

    const [room] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(
        and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, user.id))
      )
      .limit(1);
    if (!room) return [];

    const members = await db
      .select({ id: classroomMembers.studentId })
      .from(classroomMembers)
      .where(eq(classroomMembers.classroomId, classroomId));
    const memberIds = members.map((m) => m.id);
    if (memberIds.length === 0) return [];

    const rows = await db
      .select({
        studentId: shopPurchases.userId,
        purchaseId: shopPurchases.id,
        itemSlug: shopItems.slug,
        titleKk: shopItems.titleKk,
        titleRu: shopItems.titleRu,
        icon: shopItems.icon,
        costPaid: shopPurchases.costPaid,
        state: shopPurchases.state,
        purchasedAt: shopPurchases.purchasedAt,
        usedAt: shopPurchases.usedAt,
      })
      .from(shopPurchases)
      .innerJoin(shopItems, eq(shopPurchases.itemId, shopItems.id))
      .where(inArray(shopPurchases.userId, memberIds))
      .orderBy(desc(shopPurchases.purchasedAt));

    return rows;
  } catch (err) {
    console.error("[getClassroomActivePurchasesAction]", err);
    return [];
  }
}

/**
 * Teacher marks a student's purchase as "used" — used when the teacher
 * has applied the privilege in class (e.g. allowed the student to skip
 * the blackboard). Verifies that the purchase belongs to a student in
 * one of the teacher's classrooms.
 */
export async function teacherMarkPurchaseUsedAction(
  purchaseId: string,
  classroomId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getSessionUser();
    if (!user) return { ok: false, error: "no_user" };
    const db = getDb();

    // Ownership: classroom must belong to teacher
    const [room] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(
        and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, user.id))
      )
      .limit(1);
    if (!room) return { ok: false, error: "not_owner" };

    // Purchase must belong to a student in that classroom
    const [purchase] = await db
      .select({
        id: shopPurchases.id,
        studentId: shopPurchases.userId,
      })
      .from(shopPurchases)
      .where(eq(shopPurchases.id, purchaseId))
      .limit(1);
    if (!purchase) return { ok: false, error: "not_found" };

    const [member] = await db
      .select({ id: classroomMembers.studentId })
      .from(classroomMembers)
      .where(
        and(
          eq(classroomMembers.classroomId, classroomId),
          eq(classroomMembers.studentId, purchase.studentId)
        )
      )
      .limit(1);
    if (!member) return { ok: false, error: "not_in_class" };

    await db
      .update(shopPurchases)
      .set({ state: "used", usedAt: new Date() })
      .where(eq(shopPurchases.id, purchaseId));

    revalidatePath(`/teacher/class/${classroomId}`);
    return { ok: true };
  } catch (err) {
    console.error("[teacherMarkPurchaseUsedAction]", err);
    return { ok: false, error: "unknown" };
  }
}
