import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, Eye, RefreshCw, X, Loader2, LogOut } from 'lucide-react';
import { fetchMyOrdersThunk, cancelOrderThunk } from '../../orders/state/order.slice.js';
import { logoutThunk } from '../state/auth.slice.js';
import { toast } from 'react-hot-toast';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

  // Active Tab: 'profile' | 'orders' | 'addresses'
  const activeTab = searchParams.get('tab') || 'profile';

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      dispatch(fetchMyOrdersThunk());
    }
  }, [dispatch, activeTab]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await dispatch(cancelOrderThunk({ id: orderId, reason: cancelReason || "Cancelled by buyer" })).unwrap();
      toast.success("Order cancelled successfully");
      setSelectedOrder(null); // Close modal
    } catch (err) {
      toast.error(err || "Failed to cancel order");
    } finally {
      setCancellingId(null);
      setCancelReason("");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'processing': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="store-page profile-page min-h-screen pb-20">
      {/* Header */}
      <section className="border-b border-neutral-100 py-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-light font-serif italic tracking-wide text-neutral-900">
              Account Dashboard
            </h1>
            <p className="text-neutral-500 text-xs mt-1">
              Welcome back, {user?.fullName || user?.name || "Guest"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:border-red-500 text-red-500 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </section>

      {/* Tabs Layout */}
      <section className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 flex flex-col gap-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'orders', label: 'Order History', icon: Package },
            { id: 'addresses', label: 'My Addresses', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase border text-left transition-all ${activeTab === tab.id ? 'border-neutral-900 bg-neutral-50 font-bold' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50/50'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panels */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 max-w-xl"
              >
                <h2 className="text-sm font-semibold tracking-widest uppercase pb-3 border-b border-neutral-100 text-neutral-400">
                  Profile Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Full Name</label>
                    <p className="text-sm font-medium mt-1 text-neutral-800">{user?.fullName || user?.name || "N/A"}</p>
                    
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Email Address</label>
                    <p className="text-sm font-medium mt-1 text-neutral-800">{user?.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Access Tier</label>
                    <p className="text-sm font-medium mt-1 text-neutral-800 uppercase tracking-widest">{user?.role || "Buyer"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Member Since</label>
                    <p className="text-sm font-medium mt-1 text-neutral-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-sm font-semibold tracking-widest uppercase pb-3 border-b border-neutral-100 text-neutral-400">
                  Order Archives
                </h2>

                {ordersLoading ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200">
                    <p className="text-neutral-400 text-xs">You have no previous orders.</p>
                  </div>
                ) : (
                  <div className="border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
                    {orders.map((order) => (
                      <div key={order._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-neutral-50/50 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500">
                            Placed: {new Date(order.createdAt).toLocaleDateString()} | Total: ₹{order.totalAmount}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:text-neutral-600 self-start sm:self-auto transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-sm font-semibold tracking-widest uppercase pb-3 border-b border-neutral-100 text-neutral-400">
                  My Destinations
                </h2>

                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr, idx) => (
                      <div key={idx} className="p-5 border border-neutral-200 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider">{addr.label || "Home"}</span>
                          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200">
                    <p className="text-neutral-400 text-xs">No saved shipping addresses. You can add one during checkout.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-neutral-200 w-full max-w-lg p-8 space-y-6 z-10 relative overflow-y-auto max-h-[85vh]"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold border-b border-neutral-100 pb-4 tracking-wide uppercase text-neutral-400">
              Order Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Reference ID</span>
                <span className="font-semibold">#{selectedOrder._id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Status</span>
                <span className={`font-semibold uppercase tracking-wider border px-2 py-0.5 ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-semibold">Date Placed</span>
                <span className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 pb-1 border-b border-neutral-100">Items</h4>
              <div className="divide-y divide-neutral-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex gap-4 text-xs items-center">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-8 aspect-[3/4] object-cover border border-neutral-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.name}</p>
                      <p className="text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="space-y-2 text-xs">
              <h4 className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 pb-1 border-b border-neutral-100">Shipping</h4>
              <p className="text-neutral-600 leading-relaxed">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
            </div>

            {/* Checkout Pricing Summary */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs">
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline font-semibold">
                <span className="text-sm">Paid Total</span>
                <span className="text-base font-bold text-neutral-900">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Cancel Action */}
            {["pending", "processing"].includes(selectedOrder.orderStatus) && (
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <input
                  type="text"
                  placeholder="Reason for cancellation (optional)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-950 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  disabled={cancellingId === selectedOrder._id}
                  className="w-full flex justify-center items-center py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-widest uppercase transition-colors"
                >
                  {cancellingId === selectedOrder._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Cancel Order"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
