import { Order } from '@/types/order';
import { sampleOrders } from './sampleData';

//!! Load orders from localStorage or use sample data
//!! Retrieves orders from localStorage if available, otherwise uses sample data
export const loadOrders = (userId: string): Order[] => {
  const storedOrders = localStorage.getItem(`orders_${userId}`);
  if (storedOrders) {
    try {
      return JSON.parse(storedOrders);
    } catch (error) {
      console.error('Error parsing stored orders:', error);
      return sampleOrders;
    }
  } else {
    // Use sample data for demo and save to localStorage
    localStorage.setItem(`orders_${userId}`, JSON.stringify(sampleOrders));
    return sampleOrders;
  }
};

//!! Save orders to localStorage
//!! Stores orders in localStorage for the given user
export const saveOrders = (userId: string, orders: Order[]): void => {
  try {
    localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

