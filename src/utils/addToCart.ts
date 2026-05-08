// !! Client-side helper for the "Add to cart" button
// Reads the current user via next-auth/react (browser fetch to /api/auth/session),
// then forwards to the cart server action and emits a cart_updated event.

import { getSession } from "next-auth/react";
import { addToCart as addToCartService } from "@/services/cartService";
import type { AddToCartInput } from "@/types/cart";

export const handleAddToCart = async (input: any) => {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return;
  }

  let addToCartInput: AddToCartInput;
  if (input?.product?.id) {
    // Legacy shape: { product: { id, ... }, quantity, size_ml }
    addToCartInput = {
      product_id: input.product.id,
      quantity: input.quantity || 1,
      size_ml: input.size_ml || input.product.size_ml || 50,
    };
  } else {
    addToCartInput = {
      product_id: input.product_id,
      quantity: input.quantity || 1,
      size_ml: input.size_ml || 50,
    };
  }

  try {
    await addToCartService(userId, addToCartInput);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart_updated"));
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
