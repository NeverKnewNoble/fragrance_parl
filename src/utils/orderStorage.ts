import { Order } from '@/types/order';
import { sampleOrders } from './sampleData';

const ORDER_INDEX_KEY = 'orders_index';

const getOrderStorageKey = (userId: string) => `orders_${userId}`;

const loadOrderIndex = (): string[] => {
  const storedIndex = localStorage.getItem(ORDER_INDEX_KEY);
  if (!storedIndex) return [];
  try {
    const parsed = JSON.parse(storedIndex);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const saveOrderIndex = (userIds: string[]): void => {
  try {
    localStorage.setItem(ORDER_INDEX_KEY, JSON.stringify(Array.from(new Set(userIds))));
  } catch (error) {
    console.error('Error saving order index:', error);
  }
};

const ensureUserInOrderIndex = (userId: string): void => {
  const index = loadOrderIndex();
  if (index.includes(userId)) return;
  saveOrderIndex([...index, userId]);
};

//!! Load orders from localStorage or use sample data
//!! Retrieves orders from localStorage if available, otherwise uses sample data
export const loadOrders = (userId: string): Order[] => {
  ensureUserInOrderIndex(userId);
  const storedOrders = localStorage.getItem(getOrderStorageKey(userId));
  if (storedOrders) {
    try {
      return JSON.parse(storedOrders);
    } catch (error) {
      console.error('Error parsing stored orders:', error);
      return sampleOrders;
    }
  } else {
    // Use sample data for demo and save to localStorage
    localStorage.setItem(getOrderStorageKey(userId), JSON.stringify(sampleOrders));
    return sampleOrders;
  }
};

//!! Save orders to localStorage
//!! Stores orders in localStorage for the given user
export const saveOrders = (userId: string, orders: Order[]): void => {
  try {
    ensureUserInOrderIndex(userId);
    localStorage.setItem(getOrderStorageKey(userId), JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

export const loadAllOrders = (): Array<{ userId: string; orders: Order[] }> => {
  const results: Array<{ userId: string; orders: Order[] }> = [];

  const discoveredUserIds = new Set<string>();

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('orders_') && key !== ORDER_INDEX_KEY) {
      const userId = key.replace('orders_', '');
      if (userId) discoveredUserIds.add(userId);
    }
  }

  for (const userId of loadOrderIndex()) {
    discoveredUserIds.add(userId);
  }

  for (const userId of discoveredUserIds) {
    const orders = loadOrders(userId);
    results.push({ userId, orders });
  }

  return results;
};

export const updateOrderStatus = (userId: string, orderId: string, status: Order['status']): Order[] => {
  const orders = loadOrders(userId);
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  saveOrders(userId, updated);
  return updated;
};

