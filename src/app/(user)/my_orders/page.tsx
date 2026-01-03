'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Package, Eye, RotateCcw, Truck } from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';
import { getStatusConfig, filterOrdersByStatus, handleReorder } from '@/utils/orderUtils';
import { formatDate } from '@/utils/dateUtils';
import { loadOrders } from '@/utils/orderStorage';
import Image from 'next/image';
import Link from 'next/link';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');

  //!! Load orders (in production, this would come from a database)
  useEffect(() => {
    if (user && !loading) {
      const userOrders = loadOrders(user.id);
      setOrders(userOrders);
    }
  }, [user, loading]);

  //!! Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  //!! Filter orders by status
  const filteredOrders = filterOrdersByStatus(orders, selectedStatus);

  //!! Show loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }




  
  //!! Return the orders page
  return (
    <div className="relative">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-white py-10 sm:py-20 lg:py-24 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                <Package className="h-6 w-6 sm:h-7 sm:w-7 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
                My{' '}
                <span className="bg-linear-to-r from-[#D4AF37] via-[#f5e3a1] to-[#D4AF37] bg-clip-text text-transparent">
                  Orders
                </span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Track and manage all your orders in one place
            </p>
          </div>

          {/* Status Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                selectedStatus === 'all'
                  ? 'bg-[#D4AF37] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders
            </button>
            {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(
              (status) => {
                const config = getStatusConfig(status);
                const Icon = config.icon;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      selectedStatus === status
                        ? `${config.bgColor} ${config.color} border-2 ${config.borderColor}`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              }
            )}
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={order.id}
                    className="rounded-[32px] border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
                  >
                    {/* Order Header */}
                    <div className="bg-linear-to-r from-gray-50 to-white px-6 sm:px-8 py-4 sm:py-5 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
                          >
                            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                              Order Number
                            </p>
                            <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600 mt-1">{formatDate(order.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} px-4 py-1.5 text-sm font-semibold ${statusConfig.color}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 sm:px-8 py-6">
                      <div className="space-y-4 mb-6">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                          >
                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                              {item.product.image ? (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                                {item.product.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.size_ml}ml × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-bold text-gray-900">
                                ₵{(item.product.price * item.quantity).toLocaleString('en-US')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Subtotal:</span>
                              <span>₵{order.subtotal.toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Shipping:</span>
                              <span>₵{order.shipping.toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex items-center justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                              <span>Total:</span>
                              <span>₵{order.total.toLocaleString('en-US')}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {order.trackingNumber && (
                              <button className="flex items-center gap-2 rounded-lg border-2 border-[#D4AF37] bg-white px-4 py-2 text-sm font-semibold text-[#D4AF37] transition-all duration-200 hover:bg-[#D4AF37]/5">
                                <Truck className="h-4 w-4" />
                                Track Order
                              </button>
                            )}
                            <button
                              onClick={() => handleReorder(order)}
                              className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Reorder
                            </button>
                            <Link
                              href={`/orders/${order.id}`}
                              className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>
                          </div>
                        </div>
                        {order.shippingAddress && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                              Shipping Address
                            </p>
                            <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Package className="h-12 w-12 text-[#D4AF37]/40" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">No orders found</h2>
              <p className="mb-6 text-sm text-gray-600 max-w-md">
                {selectedStatus === 'all'
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `You don't have any ${getStatusConfig(selectedStatus as OrderStatus).label.toLowerCase()} orders.`}
              </p>
              <a
                href="/category"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(212,175,55,0.4)] transition-all duration-200 hover:bg-[#e3c55d] hover:shadow-[0_6px_24px_rgba(212,175,55,0.5)]"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

