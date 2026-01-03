import { Package, Truck, CheckCircle, Clock, XCircle, LucideIcon } from 'lucide-react';
import { OrderStatus, Order } from '@/types/order';

//!! Status configuration interface
export interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}

//!! Get status icon and color configuration
//!! Returns the appropriate icon, colors, and label for each order status
export const getStatusConfig = (status: OrderStatus): StatusConfig => {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        label: 'Pending',
      };
    case 'processing':
      return {
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'Processing',
      };
    case 'shipped':
      return {
        icon: Truck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        label: 'Shipped',
      };
    case 'delivered':
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Delivered',
      };
    case 'cancelled':
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'Cancelled',
      };
    default:
      return {
        icon: Clock,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Unknown',
      };
  }
};

//!! Filter orders by status
//!! Filters an array of orders based on the selected status
export const filterOrdersByStatus = (
  orders: Order[],
  selectedStatus: OrderStatus | 'all'
): Order[] => {
  return orders.filter(
    (order) => selectedStatus === 'all' || order.status === selectedStatus
  );
};

//!! Handle reorder functionality
//!! Adds all items from an order back to the cart
export const handleReorder = (order: Order) => {
  // TODO: Implement reorder functionality
  // This would typically add all items from the order back to the cart
  console.log('Reorder:', order.orderNumber);
};

