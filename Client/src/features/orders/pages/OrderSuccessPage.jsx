import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { clearCartThunk } from '../../cart/state/cart.slice.js';

export const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';

  useEffect(() => {
    // Proactively clear client-side cart after a successful payment order placement
    dispatch(clearCartThunk());
  }, [dispatch]);

  return (
    <div className="bg-white min-h-screen text-neutral-900 flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <CheckCircle2 className="w-16 h-16 text-neutral-900 mx-auto" />
        
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-emerald-600">
            Payment Verified
          </span>
          <h1 className="text-3xl font-light font-serif italic tracking-wide">
            Thank you for your order.
          </h1>
          <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mx-auto">
            Your payment was completed successfully. Your package is entering packaging, and you will receive a tracking link via email soon.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-neutral-50 border border-neutral-100 p-6 space-y-3">
          <div className="flex justify-between text-xs pb-2 border-b border-neutral-200">
            <span className="text-neutral-400 uppercase tracking-wider font-semibold">Reference ID</span>
            <span className="font-semibold text-neutral-900">{orderId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 uppercase tracking-wider font-semibold">Shipment Dispatch</span>
            <span className="font-semibold text-neutral-900">Within 24 Hours</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to="/profile?tab=orders"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-900 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-50 transition-colors"
          >
            Track Order <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/products"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
