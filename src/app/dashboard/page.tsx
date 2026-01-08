"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useAuth } from "@/hooks/useAuth";
import ProductUploadForm from "@/components/admin/ProductUploadForm";
import ProductList from "@/components/admin/ProductList";
import { Package, Clock, Truck, CheckCircle, TrendingUp, ShoppingBag, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { fetchAllOrders, updateOrderStatus, OrderWithItems } from "@/utils/orders";
import { toast } from "@/components/ui/alert";
import FragranceFamilyManager from "@/components/admin/FragranceFamilyManager";

type Tab = "add_product" | "products" | "orders" | "fragrance_families";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("add_product");
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        const fetchedOrders = await fetchAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.error("Failed to load orders", { durationMs: 3000 });
      } finally {
        setLoadingOrders(false);
      }
    };
    
    void loadOrders();
  }, [user]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    };
  }, [orders]);
  
  //!! Pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const totalProducts = useMemo(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem("products");
      if (!stored) return 0;
      const products = JSON.parse(stored);
      return Array.isArray(products) ? products.length : 0;
    } catch {
      return 0;
    }
  }, [tab]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully", { durationMs: 3000 });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status", { durationMs: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />
      <section className="relative w-full overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-50 pt-24 pb-10 sm:pt-28 sm:pb-16 min-h-screen">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-600">Manage products and customer orders</p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Orders */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#D4AF37]/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="mt-2 text-3xl font-bold text-black">{orderStats.total}</p>
                  <p className="mt-1 text-xs text-gray-500">All time</p>
                </div>
                <div className="rounded-xl bg-linear-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 p-3">
                  <Package className="h-6 w-6 text-[#D4AF37]" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-[#D4AF37] to-[#e3c55d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            {/* Pending Orders */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-yellow-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-black">{orderStats.pending}</p>
                  <p className="mt-1 text-xs text-gray-500">Awaiting processing</p>
                </div>
                <div className="rounded-xl bg-linear-to-br from-yellow-500/10 to-yellow-500/5 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-yellow-500 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            {/* Shipped Orders */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipped</p>
                  <p className="mt-2 text-3xl font-bold text-black">{orderStats.shipped}</p>
                  <p className="mt-1 text-xs text-gray-500">In transit</p>
                </div>
                <div className="rounded-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 p-3">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-purple-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            {/* Total Products */}
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-green-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="mt-2 text-3xl font-bold text-black">{totalProducts}</p>
                  <p className="mt-1 text-xs text-gray-500">In catalog</p>
                </div>
                <div className="rounded-xl bg-linear-to-br from-green-500/10 to-green-500/5 p-3">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-green-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </div>

          {/* Modern Tab Navigation */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setTab("add_product")}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                tab === "add_product"
                  ? "bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white shadow-lg shadow-[#D4AF37]/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-md"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Add Product
              </span>
            </button>
            <button
              onClick={() => setTab("products")}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                tab === "products"
                  ? "bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white shadow-lg shadow-[#D4AF37]/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-md"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
              </span>
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                tab === "orders"
                  ? "bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white shadow-lg shadow-[#D4AF37]/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-md"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </span>
            </button>
            <button
              onClick={() => setTab("fragrance_families")}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                tab === "fragrance_families"
                  ? "bg-linear-to-r from-[#D4AF37] to-[#e3c55d] text-white shadow-lg shadow-[#D4AF37]/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-md"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Fragrance Families
              </span>
            </button>
          </div>

          {tab === "add_product" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">Add New Product</h2>
                <p className="mt-1 text-sm text-gray-600">Fill in the details to add a new perfume to your catalog</p>
              </div>
              <ProductUploadForm onProductCreated={() => setTab("products")} />
            </div>
          )}

          {tab === "products" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">Product Catalog</h2>
                <p className="mt-1 text-sm text-gray-600">Manage your perfume inventory and availability</p>
              </div>
              <ProductList />
            </div>
          )}

          {tab === "fragrance_families" && (
            <FragranceFamilyManager />
          )}

          {tab === "orders" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">Order Management</h2>
                <p className="mt-1 text-sm text-gray-600">View and update customer orders</p>
              </div>
              {loadingOrders ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xl">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xl">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-base font-medium text-gray-900">No orders found</p>
                  <p className="mt-1 text-sm text-gray-500">Orders will appear here once customers place them</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {expandedOrders.has(order.id) ? (
                                <ChevronUp className="h-4 w-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                              )}
                            </button>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order Number</p>
                              <p className="text-sm font-bold text-black break-all">{order.order_number}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total</p>
                              <p className="text-sm font-bold text-black">₵{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                          <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                          <span>Subtotal: ₵{order.subtotal.toFixed(2)}</span>
                          <span>Delivery: ₵{order.delivery_fee.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Order Status</p>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Update Status</p>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs text-black focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* {(() => {
                          console.log("Order addresses:", order.addresses); // Debug log
                          return null;
                        })()} */}
                        {order.addresses && expandedOrders.has(order.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Customer Information</p>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-900 font-medium">{order.addresses.full_name || 'N/A'}</p>
                              <p className="text-xs text-gray-600">{order.addresses.email || 'N/A'}</p>
                              <p className="text-xs text-gray-600">{order.addresses.phone || 'N/A'}</p>
                              <div className="mt-2 pt-2 border-t border-gray-50">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Delivery Address</p>
                                <p className="text-xs text-gray-900">{order.addresses.address_line || 'N/A'}</p>
                                <p className="text-xs text-gray-600">{order.addresses.city || 'N/A'}, {order.addresses.region || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {expandedOrders.has(order.id) && (
                        <div className="border-t border-gray-200 bg-gray-50 p-3">
                          <h4 className="text-xs font-bold text-black mb-2">Order Items</h4>
                          {order.order_items.length === 0 ? (
                            <p className="text-xs text-gray-500">No items in this order</p>
                          ) : (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {order.order_items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200"
                                >
                                  <div className="flex-1">
                                    <p className="font-semibold text-xs text-black truncate">{item.product_name}</p>
                                    <p className="text-xs text-gray-500">{item.size_ml}ml</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                    <p className="text-xs font-bold text-black">₵{item.price.toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
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
            )}
        </div>
        )}
        </div>
      </section>
      <Footer />
    </div>
  );
}