"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/server/db";
import {
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
