"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { addresses } from "@/db/schema";
import { auth } from "@/auth";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/address";

async function requireUserId(passedUserId?: string): Promise<string> {
  const session = await auth();
  const sessionId = session?.user?.id;
  if (!sessionId) throw new Error("User not authenticated");
  if (passedUserId && passedUserId !== sessionId) {
    throw new Error("User mismatch");
  }
  return sessionId;
}

function mapAddress(a: any): Address {
  return {
    id: a.id,
    user_id: a.userId,
    full_name: a.fullName,
    email: a.email,
    phone: a.phone,
    address_line: a.addressLine,
    city: a.city,
    region: a.region,
    instructions: a.instructions ?? undefined,
    is_default: a.isDefault,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

// !! All addresses for the current user (defaults first, newest after)
export async function getUserAddresses(userId: string): Promise<Address[]> {
  const sessionId = await requireUserId(userId);
  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, sessionId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  return rows.map(mapAddress);
}

// !! The default address (or null)
export async function getDefaultAddress(
  userId: string
): Promise<Address | null> {
  try {
    const sessionId = await requireUserId(userId);
    const [row] = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.userId, sessionId), eq(addresses.isDefault, true))
      )
      .limit(1);
    return row ? mapAddress(row) : null;
  } catch (error) {
    console.error("Error getting default address:", error);
    return null;
  }
}

// !! Create address; if marked default, clear other defaults first
export async function createAddress(
  userId: string,
  input: CreateAddressInput
): Promise<Address> {
  const sessionId = await requireUserId(userId);

  if (input.is_default) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, sessionId));
  }

  const [created] = await db
    .insert(addresses)
    .values({
      userId: sessionId,
      fullName: input.full_name,
      email: input.email,
      phone: input.phone,
      addressLine: input.address_line,
      city: input.city,
      region: input.region,
      instructions: input.instructions ?? null,
      isDefault: input.is_default ?? false,
    })
    .returning();

  return mapAddress(created);
}

// !! Update address (scoped to current user). Clears other defaults if needed.
export async function updateAddress(
  addressId: string,
  userId: string,
  input: UpdateAddressInput
): Promise<Address> {
  const sessionId = await requireUserId(userId);

  if (input.is_default) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, sessionId));
  }

  const patch: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (input.full_name !== undefined) patch.fullName = input.full_name;
  if (input.email !== undefined) patch.email = input.email;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.address_line !== undefined) patch.addressLine = input.address_line;
  if (input.city !== undefined) patch.city = input.city;
  if (input.region !== undefined) patch.region = input.region;
  if (input.instructions !== undefined)
    patch.instructions = input.instructions || null;
  if (input.is_default !== undefined) patch.isDefault = input.is_default;

  const [updated] = await db
    .update(addresses)
    .set(patch)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, sessionId)))
    .returning();

  if (!updated) throw new Error("Address not found");
  return mapAddress(updated);
}

// !! Delete an address (scoped to user)
export async function deleteAddress(
  addressId: string,
  userId: string
): Promise<void> {
  const sessionId = await requireUserId(userId);
  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, sessionId)));
}

// !! Mark a single address as the user's default; clears all others
export async function setDefaultAddress(
  addressId: string,
  userId: string
): Promise<Address> {
  const sessionId = await requireUserId(userId);

  await db
    .update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, sessionId));

  const [updated] = await db
    .update(addresses)
    .set({ isDefault: true, updatedAt: new Date().toISOString() })
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, sessionId)))
    .returning();

  if (!updated) throw new Error("Address not found");
  return mapAddress(updated);
}
