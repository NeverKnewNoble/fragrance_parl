"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { fragranceFamilies, userRole } from "@/db/schema";
import { auth } from "@/auth";
import type { fragrance_family } from "@/types/family_fragrance";

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not authenticated");
  const [row] = await db
    .select({ role: userRole.role })
    .from(userRole)
    .where(eq(userRole.userId, session.user.id))
    .limit(1);
  if (row?.role !== "admin") throw new Error("Admin access required");
}

// !! Fetch all fragrance families (name + icon)
export async function fetchAllFragranceFamilies(): Promise<fragrance_family[]> {
  const rows = await db
    .select({ name: fragranceFamilies.name, icon: fragranceFamilies.icon })
    .from(fragranceFamilies);
  return rows
    .filter((r) => typeof r.name === "string" && r.name.length > 0)
    .map((r) => ({ name: r.name, icon: r.icon ?? undefined }));
}

// !! Fetch just the names
export async function fetchAllFragranceFamilyNames(): Promise<string[]> {
  const families = await fetchAllFragranceFamilies();
  return families.map((f) => f.name);
}

// !! Fetch families with IDs (for admin selects)
export async function fetchFragranceFamiliesWithIds(): Promise<
  Array<{ id: number; name: string; icon?: string }>
> {
  const rows = await db
    .select({
      id: fragranceFamilies.id,
      name: fragranceFamilies.name,
      icon: fragranceFamilies.icon,
    })
    .from(fragranceFamilies);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon ?? undefined,
  }));
}

// !! Admin: create a fragrance family
export async function createFragranceFamily(input: {
  name: string;
  icon?: string;
}): Promise<{ id: number }> {
  await requireAdmin();
  const [created] = await db
    .insert(fragranceFamilies)
    .values({ name: input.name.trim(), icon: input.icon ?? null })
    .returning({ id: fragranceFamilies.id });
  return { id: created.id };
}

// !! Admin: rename / re-icon a family by its current name
export async function updateFragranceFamilyByName(
  oldName: string,
  input: { name: string; icon?: string }
): Promise<void> {
  await requireAdmin();
  await db
    .update(fragranceFamilies)
    .set({ name: input.name.trim(), icon: input.icon ?? null })
    .where(eq(fragranceFamilies.name, oldName));
}

// !! Admin: delete a family by its name
export async function deleteFragranceFamilyByName(name: string): Promise<void> {
  await requireAdmin();
  await db.delete(fragranceFamilies).where(eq(fragranceFamilies.name, name));
}
