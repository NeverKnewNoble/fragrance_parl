import { CartItem } from '@/types/cart';

//!! Load cart from localStorage
//!! Retrieves cart items from localStorage for the given user
export const loadCart = (userId: string): CartItem[] => {
  const storedCart = localStorage.getItem(`cart_${userId}`);
  if (storedCart) {
    try {
      return JSON.parse(storedCart);
    } catch (error) {
      console.error('Error parsing stored cart:', error);
      return [];
    }
  }
  return [];
};

//!! Save cart to localStorage
//!! Stores cart items in localStorage for the given user
export const saveCart = (userId: string, cart: CartItem[]): void => {
  try {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart_updated'));
    }
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};
 
//!! Add item to cart
//!! Adds a product to the cart or increases quantity if already present
export const addToCart = (
  userId: string,
  product: CartItem['product'],
  size_ml: number,
  quantity: number = 1
): CartItem[] => {
  const cart = loadCart(userId);
  const existingItemIndex = cart.findIndex(
    (item) => item.product.title === product.title && item.size_ml === size_ml
  );

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({ product, quantity, size_ml });
  }

  saveCart(userId, cart);
  return cart;
};

//!! Remove item from cart
//!! Removes a specific item from the cart
export const removeFromCart = (userId: string, productTitle: string, size_ml: number): CartItem[] => {
  const cart = loadCart(userId);
  const updatedCart = cart.filter(
    (item) => !(item.product.title === productTitle && item.size_ml === size_ml)
  );
  saveCart(userId, updatedCart);
  return updatedCart;
};

//!! Update item quantity in cart
//!! Updates the quantity of a specific cart item
export const updateCartItemQuantity = (
  userId: string,
  productTitle: string,
  size_ml: number,
  quantity: number
): CartItem[] => {
  const cart = loadCart(userId);
  const updatedCart = cart.map((item) => {
    if (item.product.title === productTitle && item.size_ml === size_ml) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });
  saveCart(userId, updatedCart);
  return updatedCart;
};

//!! Clear cart
//!! Removes all items from the cart
export const clearCart = (userId: string): void => {
  localStorage.removeItem(`cart_${userId}`);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart_updated'));
  }
};

//!! Calculate cart totals
//!! Calculates subtotal, shipping, and total for the cart
export const calculateCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 15 : 0; // Fixed shipping cost
  const total = subtotal + shipping;

  return { subtotal, shipping, total };
};

