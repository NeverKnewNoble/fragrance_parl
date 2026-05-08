"use server";

import { eq, desc } from "drizzle-orm";

import { db } from "@/db";
import {
  products,
  productImages,
  productNotes,
  productVariants,
  userRole,
} from "@/db/schema";
import { auth } from "@/auth";
import type { getAllProductsWithLinkages } from "@/types/product";

// !! Require an authenticated admin or throw
async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not authenticated");
  const [row] = await db
    .select({ role: userRole.role })
    .from(userRole)
    .where(eq(userRole.userId, session.user.id))
    .limit(1);
  if (row?.role !== "admin") throw new Error("Admin access required");
  return session.user.id;
}

// !! Map Drizzle row (camelCase, nested 'with') to legacy snake_case shape
function mapProductRow(p: any): getAllProductsWithLinkages {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price ?? 0,
    slug: p.slug,
    is_active: p.isActive,
    fragrance_families: p.fragranceFamily
      ? [
          {
            id: p.fragranceFamily.id,
            name: p.fragranceFamily.name,
            icon: p.fragranceFamily.icon ?? undefined,
          },
        ]
      : [],
    product_images: (p.images ?? []).map((i: any) => ({
      id: i.id,
      product_id: i.productId,
      image_url: i.imageUrl,
      is_primary: i.isPrimary,
    })),
    product_notes: (p.notes ?? []).map((n: any) => ({
      id: n.id,
      product_id: n.productId,
      note_name: n.noteName,
      note_type: n.noteType,
    })),
    product_variants: (p.variants ?? []).map((v: any) => ({
      id: v.id,
      product_id: v.productId,
      size_ml: v.sizeMl,
      price: v.price,
      is_out_of_stock: v.isOutOfStock,
      is_restocked: v.isRestocked,
    })),
    created_at: p.createdAt,
  };
}

// !! Fetch latest N products for New Arrivals
export async function getLatestProducts(
  limit: number = 5
): Promise<getAllProductsWithLinkages[]> {
  try {
    const rows = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      limit,
      with: {
        fragranceFamily: true,
        images: true,
        notes: true,
        variants: true,
      },
    });
    return rows.map(mapProductRow);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }
}

// !! Fetch all products with their variants/notes/images/family
export async function getAllProductsAndLinkages(): Promise<
  getAllProductsWithLinkages[]
> {
  try {
    const rows = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      with: {
        fragranceFamily: true,
        images: true,
        notes: true,
        variants: true,
      },
    });
    return rows.map(mapProductRow);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// !! Delete a product (admin only). Cascades through FKs.
export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
}

// !! Update variant stock status (admin only)
export async function updateVariantStockStatus(
  variantId: number,
  field: "is_out_of_stock" | "is_restocked",
  value: boolean
): Promise<void> {
  await requireAdmin();
  const patch =
    field === "is_out_of_stock"
      ? { isOutOfStock: value }
      : { isRestocked: value };
  await db
    .update(productVariants)
    .set(patch)
    .where(eq(productVariants.id, variantId));
}

// !! Toggle product active flag (admin only)
export async function isActiveSwitch(
  id: string,
  is_active: boolean
): Promise<void> {
  await requireAdmin();
  await db
    .update(products)
    .set({ isActive: is_active })
    .where(eq(products.id, id));
}

// !! Input shape for createProduct
export interface CreateProductInput {
  name: string;
  description: string;
  fragranceFamilyId: number;
  slug: string;
  isActive: boolean;
  variants: Array<{
    sizeMl: number;
    price: number;
    stockQuantity: number;
    isOutOfStock?: boolean;
    isRestocked?: boolean;
  }>;
  notes: Array<{ noteName: string; noteType: "top" | "middle" | "base" }>;
  images: Array<{ imageUrl: string; isPrimary: boolean }>;
}

// !! Create a new product with variants, notes, and images (admin only)
export async function createProduct(input: CreateProductInput): Promise<{
  id: string;
}> {
  await requireAdmin();

  const [created] = await db
    .insert(products)
    .values({
      name: input.name.trim(),
      description: input.description.trim() || null,
      fragranceFamilyId: input.fragranceFamilyId,
      slug: input.slug,
      isActive: input.isActive,
    })
    .returning({ id: products.id });

  if (input.variants.length > 0) {
    await db.insert(productVariants).values(
      input.variants.map((v) => ({
        productId: created.id,
        sizeMl: v.sizeMl,
        price: v.price,
        stockQuantity: v.stockQuantity,
        isOutOfStock: v.isOutOfStock ?? false,
        isRestocked: v.isRestocked ?? false,
      }))
    );
  }

  if (input.notes.length > 0) {
    await db.insert(productNotes).values(
      input.notes.map((n) => ({
        productId: created.id,
        noteName: n.noteName,
        noteType: n.noteType,
      }))
    );
  }

  if (input.images.length > 0) {
    await db.insert(productImages).values(
      input.images.map((img) => ({
        productId: created.id,
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      }))
    );
  }

  return { id: created.id };
}
