import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCartThunk, updateCartItemThunk, removeCartItemThunk, clearCartThunk } from '../state/cart.slice.js';
import { toast } from 'react-hot-toast';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) { toast.error(`Only ${stock} items available in stock`); return; }
    try {
      await dispatch(updateCartItemThunk({ productId, quantity: newQty })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeCartItemThunk(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCartThunk()).unwrap();
        toast.success('Cart cleared');
      } catch (err) {
        toast.error(err || 'Failed to clear cart');
      }
    }
  };

  /* Not authenticated */
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: 'var(--sw-surface)' }}
      >
        <ShoppingBag className="w-12 h-12 mb-4" style={{ color: 'var(--sw-outline-variant)' }} />
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'var(--font-headline)', color: 'var(--sw-on-surface)', fontWeight: 500 }}
        >
          Sign in to view your bag
        </h2>
        <p className="text-sm mb-6 text-center max-w-sm" style={{ color: 'var(--sw-on-surface-variant)' }}>
          Items you add to your bag are synced across all your devices.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Access Account
        </button>
      </div>
    );
  }

  /* Loading */
  if (loading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center" style={{ backgroundColor: 'var(--sw-surface)' }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--sw-primary)' }} />
      </div>
    );
  }

  const shippingThreshold = 2999;
  const freeShipping = totalPrice >= shippingThreshold;
  const remaining = shippingThreshold - totalPrice;

  return (
    <div style={{ backgroundColor: 'var(--sw-surface)', color: 'var(--sw-on-surface)' }} className="min-h-screen pb-24">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section
        className="border-b py-14"
        style={{ backgroundColor: 'var(--sw-surface-container-low)', borderColor: 'var(--sw-outline-variant)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <h1
            className="text-5xl sm:text-6xl italic"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, color: 'var(--sw-on-surface)' }}
          >
            Your Bag
          </h1>
          <p className="text-xs mt-2" style={{ color: 'var(--sw-on-surface-variant)' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} selected
          </p>

          {/* Free shipping progress */}
          {!freeShipping && items.length > 0 && (
            <div className="mt-4 max-w-sm">
              <p className="text-[11px] mb-1.5" style={{ color: 'var(--sw-on-surface-variant)' }}>
                Add <strong style={{ color: 'var(--sw-primary)' }}>₹{remaining}</strong> more for free shipping
              </p>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sw-surface-container)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalPrice / shippingThreshold) * 100)}%`,
                    backgroundColor: 'var(--sw-primary)',
                  }}
                />
              </div>
            </div>
          )}
          {freeShipping && items.length > 0 && (
            <p className="mt-3 text-[11px] font-semibold" style={{ color: 'var(--sw-secondary)' }}>
              ✓ You qualify for free shipping!
            </p>
          )}
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        {items.length === 0 ? (
          <div
            className="text-center py-24 border border-dashed"
            style={{ borderColor: 'var(--sw-outline-variant)', borderRadius: 'var(--sw-radius-lg)' }}
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--sw-outline-variant)' }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--sw-on-surface)' }}>Your bag is empty</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--sw-on-surface-variant)' }}>Items you add will appear here.</p>
            <Link to="/products" className="btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--sw-outline-variant)' }}>
                <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--sw-on-surface-variant)' }}>
                  Items ({items.length})
                </span>
                <button
                  onClick={handleClearCart}
                  className="text-xs transition-colors hover:underline underline-offset-2"
                  style={{ color: 'var(--sw-outline)' }}
                >
                  Clear Bag
                </button>
              </div>

              <AnimatePresence>
                {items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  return (
                    <motion.div
                      key={item._id || product._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-5 py-5 border-b"
                      style={{ borderColor: 'var(--sw-outline-variant)' }}
                    >
                      {/* Thumbnail */}
                      <Link to={`/products/${product._id}`} className="shrink-0">
                        <div
                          className="w-24 overflow-hidden"
                          style={{
                            aspectRatio: '3/4',
                            backgroundColor: 'var(--sw-surface-container-low)',
                            borderRadius: 'var(--sw-radius)',
                            border: `1px solid var(--sw-outline-variant)`,
                          }}
                        >
                          <img
                            src={product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="min-w-0 pr-4">
                              <span
                                className="text-[10px] uppercase tracking-[0.15em] font-semibold block"
                                style={{ color: 'var(--sw-secondary)' }}
                              >
                                {product.brand}
                              </span>
                              <Link to={`/products/${product._id}`}>
                                <h4
                                  className="text-sm font-medium mt-0.5 truncate hover:underline underline-offset-2"
                                  style={{ color: 'var(--sw-on-surface)' }}
                                >
                                  {product.name}
                                </h4>
                              </Link>
                              <p className="text-xs mt-1" style={{ color: 'var(--sw-outline)' }}>Size: M</p>
                            </div>
                            <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--sw-on-surface)' }}>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center mt-4">
                          <div
                            className="flex items-center"
                            style={{
                              border: `1.5px solid var(--sw-outline-variant)`,
                              borderRadius: 'var(--sw-radius)',
                            }}
                          >
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity - 1, product.stock)}
                              className="px-2.5 py-2 transition-colors"
                              style={{ color: 'var(--sw-on-surface-variant)' }}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-sm font-semibold min-w-[2rem] text-center" style={{ color: 'var(--sw-on-surface)' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity + 1, product.stock)}
                              className="px-2.5 py-2 transition-colors"
                              style={{ color: 'var(--sw-on-surface-variant)' }}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="p-1.5 rounded transition-colors hover:bg-red-50"
                            style={{ color: 'var(--sw-outline)' }}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div
              className="p-7 space-y-6 sticky top-24"
              style={{
                backgroundColor: 'var(--sw-surface-container-low)',
                borderRadius: 'var(--sw-radius-lg)',
                border: `1px solid var(--sw-outline-variant)`,
              }}
            >
              <h3
                className="text-[11px] uppercase tracking-widest font-semibold pb-3 border-b"
                style={{ color: 'var(--sw-on-surface)', borderColor: 'var(--sw-outline-variant)' }}
              >
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--sw-on-surface-variant)' }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: 'var(--sw-on-surface)' }}>
                    ₹{totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--sw-on-surface-variant)' }}>Shipping</span>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: freeShipping ? 'var(--sw-secondary)' : 'var(--sw-on-surface-variant)' }}
                  >
                    {freeShipping ? 'Free' : `₹${(shippingThreshold - totalPrice)}`}
                  </span>
                </div>
                <div className="h-px" style={{ backgroundColor: 'var(--sw-outline-variant)' }} />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold" style={{ color: 'var(--sw-on-surface)' }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--sw-on-surface)' }}>
                    ₹{totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full justify-center"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-center leading-relaxed" style={{ color: 'var(--sw-outline)' }}>
                Shipping, taxes & delivery dates confirmed at checkout.
              </p>

              <Link
                to="/products"
                className="flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors"
                style={{ color: 'var(--sw-on-surface-variant)' }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CartPage;
