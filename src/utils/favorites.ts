"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { favorites } from "@/db/schema";
import { auth } from "@/auth";
import type { Favorites } from "@/types/favorites";

async function requireUserId(passedUserId?: string): Promise<string> {
  const session = await auth();
  const sessionId = session?.user?.id;
  if (!sessionId) throw new Error("User not authenticated");
  if (passedUserId && passedUserId !== sessionId) {
    throw new Error("User mismatch");
  }
  return sessionId;
}

// !! Load all favorites for a user
export async function loadFavorites(userId: string): Promise<Favorites[]> {
  try {
    const sessionId = await requireUserId(userId);
    const rows = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, sessionId));
    return rows.map((r) => ({
      id: r.id,
      user_id: r.userId,
      product_id: r.productId,
    }));
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

// !! Remove a favorite. Returns true on success.
export async function removeFavorite(
  userId: string,
  productId: string
): Promise<boolean> {
  try {
    const sessionId = await requireUserId(userId);
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, sessionId), eq(favorites.productId, productId))
      );
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
}

// !! Toggle: returns true if added, false if removed (mirrors original semantics)
export async function toggleFavorite(
  userId: string | undefined,
  productId: string
): Promise<boolean> {
  if (!userId) return false;
  try {
    const sessionId = await requireUserId(userId);
    const [existing] = await db
      .select({ id: favorites.id })
      .from(favorites)
      .where(
        and(eq(favorites.userId, sessionId), eq(favorites.productId, productId))
      )
      .limit(1);

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      return false;
    }
    await db.insert(favorites).values({ userId: sessionId, productId });
    return true;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}

// !! Returns true if the product is favorited by the user
export async function isFavorite(
  userId: string | undefined,
  productId: string
): Promise<boolean> {
  if (!userId) return false;
  try {
    const sessionId = await requireUserId(userId);
    const [row] = await db
      .select({ id: favorites.id })
      .from(favorites)
      .where(
        and(eq(favorites.userId, sessionId), eq(favorites.productId, productId))
      )
      .limit(1);
    return !!row;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
}
