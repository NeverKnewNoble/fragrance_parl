'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Package, Truck } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { getStatusConfig, filterOrdersByStatus } from '@/utils/orderUtils';
import { formatDate } from '@/utils/dateUtils';
import { getUserOrders } from '@/services/orderService';
import { OrderWithDetails, OrderItem } from '@/services/orderService';
import Image from 'next/image';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  //!! Load orders from database
  useEffect(() => {
    const loadUserOrders = async () => {
      if (user && !loading) {
        try {
          const userOrders = await getUserOrders(user.id);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    loadUserOrders();
  }, [user, loading]);

  //!! Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  //!! Filter orders by status
  const filteredOrders = filterOrdersByStatus(orders, selectedStatus);
  
  //!! Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  //!! Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  //!! Show loading state
  if (loading || isLoadingOrders) {
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
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
          {paginatedOrders.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOrders.map((order: OrderWithDetails) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] h-full"
                  >
                    {/* Order Header */}
                    <div className="bg-linear-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
                            >
                              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} px-2 py-0.5 text-xs font-semibold ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-1">
                            Order Number
                          </p>
                          <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-600 mt-1">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-4 py-4">
                      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {order.order_items.slice(0, 3).map((item: OrderItem, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                              {item.products?.product_images && item.products.product_images.length > 0 ? (
                                <Image
                                  src={item.products.product_images.find((img) => img.is_primary)?.image_url || item.products.product_images[0].image_url}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
                                {item.product_name}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {item.size_ml}ml × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                ₵{(item.price * item.quantity).toLocaleString('en-US')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.order_items.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{order.order_items.length - 3} more items
                          </p>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Subtotal:</span>
                            <span>₵{order.subtotal.toLocaleString('en-US')}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Shipping:</span>
                            <span>₵{order.delivery_fee.toLocaleString('en-US')}</span>
                          </div>
                          <div className="flex items-center justify-center pt-2">
                            <span className="text-lg font-bold text-[#D4AF37]">
                              Total: ₵{order.total.toLocaleString('en-US')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#D4AF37] text-white'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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

