import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck, Ticket, Plus } from 'lucide-react';
import { fetchCartThunk, clearCartThunk } from '../../cart/state/cart.slice.js';
import { createOrderThunk, checkoutPaymentThunk, verifyPaymentThunk, applyCouponLocally, removeCoupon } from '../state/order.slice.js';
import { useAuth } from '../../auth/hooks/index.js';
import { toast } from 'react-hot-toast';

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { items: cartItems, totalPrice } = useSelector((state) => state.cart);
  const { coupon, loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  // Address State
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressLabel, setAddressLabel] = useState("Home");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'razorpay'
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchCartThunk());
    if (user?.addresses && user.addresses.length > 0) {
      setSelectedAddressIndex(0);
      const addr = user.addresses[0];
      setStreet(addr.street || "");
      setCity(addr.city || "");
      setState(addr.state || "");
      setPincode(addr.pincode || "");
      setAddressLabel(addr.label || "Home");
    }
  }, [dispatch, user]);

  const selectSavedAddress = (idx) => {
    setSelectedAddressIndex(idx);
    if (idx >= 0 && user?.addresses?.[idx]) {
      const addr = user.addresses[idx];
      setStreet(addr.street || "");
      setCity(addr.city || "");
      setState(addr.state || "");
      setPincode(addr.pincode || "");
      setAddressLabel(addr.label || "Home");
    } else {
      setStreet("");
      setCity("");
      setState("");
      setPincode("");
      setAddressLabel("Custom");
    }
  };

  // Calculate Discount
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percentage") {
      discount = Math.round((totalPrice * coupon.value) / 100);
    } else if (coupon.type === "flat") {
      discount = Math.min(coupon.value, totalPrice);
    }
  }
  const finalTotal = totalPrice - discount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    dispatch(applyCouponLocally(couponCode));
    setCouponCode("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!street || !city || !state || !pincode) {
      toast.error("Please fill in all address details");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }

    setProcessing(true);
    try {
      const shippingAddress = {
        label: addressLabel,
        street,
        city,
        state,
        pincode
      };

      // 1. Create order on database
      const order = await dispatch(createOrderThunk({ shippingAddress, discount })).unwrap();
      const orderId = order._id;

      // 2. Initiate Payment Session
      const sessionResult = await dispatch(checkoutPaymentThunk({ orderId, paymentMethod })).unwrap();

      if (paymentMethod === "cod") {
        toast.success("Order confirmed successfully!");
        navigate(`/order-success?orderId=${orderId}`);
      } else {
        // Razorpay checkout
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you connected to the internet?");
          setProcessing(false);
          return;
        }

        const options = {
          key: sessionResult.keyId,
          amount: sessionResult.razorpayOrder.amount,
          currency: "INR",
          name: "Softwear Store",
          description: `Payment for Order #${orderId.slice(-6)}`,
          order_id: sessionResult.razorpayOrder.id,
          handler: async function (response) {
            try {
              const verifyPayload = {
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              };
              
              await dispatch(verifyPaymentThunk(verifyPayload)).unwrap();
              toast.success("Payment verified and order confirmed!");
              navigate(`/order-success?orderId=${orderId}`);
            } catch (err) {
              toast.error(err || "Payment verification failed");
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#0f0f0f"
          },
          modal: {
            ondismiss: function () {
              toast.warn("Payment modal cancelled. You can complete payment in order history.");
              navigate("/profile?tab=orders");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err || "Order placement failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Header */}
      <section className="border-b border-neutral-100 py-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-light font-serif italic tracking-wide text-neutral-900">
            Checkout
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            Specify shipping address and select checkout options
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Left Columns: Forms */}
          <div className="lg:col-span-2 space-y-10">
            {/* Shipping Address Section */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 pb-2 border-b border-neutral-100">
                1. Shipping Destination
              </h3>

              {/* Saved Addresses Selector */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Select Saved Address</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectSavedAddress(idx)}
                        className={`p-4 border text-left flex flex-col justify-between transition-all ${selectedAddressIndex === idx ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider">{addr.label || `Address ${idx + 1}`}</span>
                        <span className="text-xs text-neutral-500 mt-2 line-clamp-2">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => selectSavedAddress(-1)}
                      className={`p-4 border border-dashed text-left flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-all ${selectedAddressIndex === -1 ? 'border-neutral-900 bg-neutral-50' : ''}`}
                    >
                      <Plus className="w-4 h-4" /> <span className="text-xs font-semibold">New Address</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Address Form Fields */}
              <form className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => { setSelectedAddressIndex(-1); setStreet(e.target.value); }}
                    className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="123 Minimalism St."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => { setSelectedAddressIndex(-1); setCity(e.target.value); }}
                    className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="New Delhi"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => { setSelectedAddressIndex(-1); setState(e.target.value); }}
                    className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="Delhi"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => { setSelectedAddressIndex(-1); setPincode(e.target.value); }}
                    className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="110001"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Address Label</label>
                  <input
                    type="text"
                    value={addressLabel}
                    onChange={(e) => { setSelectedAddressIndex(-1); setAddressLabel(e.target.value); }}
                    className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. Home, Office"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-400 pb-2 border-b border-neutral-100">
                2. Transaction Profile
              </h3>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex-1 p-5 border text-left flex flex-col justify-between transition-all ${paymentMethod === "cod" ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">Cash on Delivery</span>
                  <span className="text-xs text-neutral-400 mt-2">Pay in cash when order is inspected and delivered.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex-1 p-5 border text-left flex flex-col justify-between transition-all ${paymentMethod === "razorpay" ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">Online Card / UPI</span>
                  <span className="text-xs text-neutral-400 mt-2">Pay securely using Razorpay gateway. (10% welcome discounts auto-applicable)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="space-y-6">
            {/* Bag Review Summary */}
            <div className="bg-neutral-50 p-8 border border-neutral-100 space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 pb-3 border-b border-neutral-200">
                Checkout Summary
              </h3>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id || item.productId?._id} className="py-3 first:pt-0 flex gap-4 text-xs">
                    <img 
                      src={item.productId?.images?.[0]?.url} 
                      alt={item.productId?.name} 
                      className="w-10 aspect-[3/4] object-cover bg-white border border-neutral-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.productId?.name}</p>
                      <p className="text-neutral-400 mt-0.5">Qty: {item.quantity} | Size: M</p>
                    </div>
                    <span className="font-semibold text-neutral-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Coupons Form */}
              <div className="pt-4 border-t border-neutral-200">
                {coupon ? (
                  <div className="flex items-center justify-between bg-neutral-200/50 p-2 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                      <Ticket className="w-3.5 h-3.5" /> {coupon.code} (-₹{discount})
                    </span>
                    <button 
                      onClick={() => dispatch(removeCoupon())}
                      className="text-neutral-400 hover:text-neutral-950 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 border border-neutral-900 text-xs font-semibold uppercase hover:bg-neutral-950 hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                <p className="text-[9px] text-neutral-400 mt-1">Try WELCOME20 (20% off) or SOFTWEAR10 (10% off)</p>
              </div>

              {/* Mathematical Summary */}
              <div className="space-y-4 pt-4 border-t border-neutral-200 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Cart Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount Applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping & Duty</span>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400">Free</span>
                </div>
                <div className="h-px bg-neutral-200" />
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-semibold text-neutral-900">Final Price</span>
                  <span className="text-lg font-bold text-neutral-900">₹{finalTotal}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={processing || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-widest uppercase transition-all py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>
                    Confirm & Place Order <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex justify-center items-center gap-2 text-neutral-400 text-[10px]">
                <ShieldCheck className="w-4 h-4 shrink-0" /> SSL Encrypted Checkout Session
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
