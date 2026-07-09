import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Loader2, Minus, Plus, Package } from 'lucide-react';
import { fetchCartThunk, updateCartItemThunk, removeCartItemThunk, clearCartThunk } from '../state/cart.slice.js';
import { toast } from 'react-hot-toast';

export const CartPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { isAuthenticated }           = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCartThunk());
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) { toast.error(`Only ${stock} units available`); return; }
    try {
      await dispatch(updateCartItemThunk({ productId, quantity: newQty })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeCartItemThunk(itemId)).unwrap();
      toast.success('Item removed');
    } catch (err) {
      toast.error(err || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Clear all items from your bag?')) {
      try {
        await dispatch(clearCartThunk()).unwrap();
        toast.success('Bag cleared');
      } catch (err) {
        toast.error(err || 'Failed to clear bag');
      }
    }
  };

  // ── Not Authenticated ──
  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: '70vh', background: 'var(--color-background)', padding: '3rem 1.5rem' }}
      >
        <ShoppingBag size={48} style={{ color: 'var(--color-outline-variant)', marginBottom: '1.25rem' }} />
        <h2 className="text-headline-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>Sign in to view your bag</h2>
        <p className="text-body-sm mb-6 text-center" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '28rem' }}>
          Items you add to your cart are synced across all your devices.
        </p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  // ── Loading ──
  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh', background: 'var(--color-background)' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
        <div className="page-container py-10">
          <h1 className="text-headline-lg" style={{ color: 'var(--color-on-surface)', fontStyle: 'italic' }}>
            Shopping Bag
          </h1>
          <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
            style={{ minHeight: '45vh' }}
          >
            <ShoppingBag size={48} style={{ color: 'var(--color-outline-variant)' }} />
            <h3>Your Bag is Empty</h3>
            <p className="text-body-sm mt-1 mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
              Add items from the collections to get started.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* ── Items List ── */}
            <div className="lg:col-span-2">
              {/* Toolbar */}
              <div
                className="flex items-center justify-between pb-4 mb-2"
                style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
              >
                <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Items
                </span>
                <button
                  onClick={handleClear}
                  className="text-body-sm transition-colors duration-150"
                  style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-surface-variant)')}
                >
                  Clear Bag
                </button>
              </div>

              <div className="divide-y" style={{ '--tw-divide-color': 'var(--color-outline-variant)' }}>
                {items.map((item, i) => {
                  const product = item.productId;
                  if (!product) return null;
                  return (
                    <motion.div
                      key={item._id || product._id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-5 py-6 first:pt-2"
                      style={{ borderBottom: '1px solid var(--color-surface-container)' }}
                    >
                      {/* Image */}
                      <div
                        className="flex-shrink-0 overflow-hidden"
                        style={{
                          width: '90px',
                          aspectRatio: '3/4',
                          background: 'var(--color-surface-container-low)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-outline-variant)',
                        }}
                      >
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                            <Package size={20} opacity={0.3} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-label-sm truncate" style={{ color: 'var(--color-on-surface-variant)' }}>{product.brand}</p>
                              <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                                <h4 className="text-body-sm font-semibold mt-0.5 truncate" style={{ color: 'var(--color-on-surface)' }}>
                                  {product.name}
                                </h4>
                              </Link>
                            </div>
                            <span className="text-body-sm font-semibold flex-shrink-0" style={{ color: 'var(--color-on-surface)' }}>
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-body-sm mt-1.5" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.65 }}>
                            Unit: ₹{item.price}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity stepper */}
                          <div
                            className="flex items-center gap-0"
                            style={{
                              border: '1.5px solid var(--color-outline-variant)',
                              borderRadius: 'var(--radius)',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity - 1, product.stock)}
                              className="w-8 h-8 flex items-center justify-center transition-all duration-150"
                              style={{
                                background: 'var(--color-surface-container-low)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-on-surface-variant)',
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span
                              className="w-9 text-center text-body-sm font-semibold"
                              style={{ color: 'var(--color-on-surface)', borderLeft: '1px solid var(--color-outline-variant)', borderRight: '1px solid var(--color-outline-variant)' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity + 1, product.stock)}
                              className="w-8 h-8 flex items-center justify-center transition-all duration-150"
                              style={{
                                background: 'var(--color-surface-container-low)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-on-surface-variant)',
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="p-1.5 transition-all duration-150"
                            style={{
                              background: 'var(--color-error-container)',
                              borderRadius: 'var(--radius)',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--color-error)',
                            }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div
              className="sticky top-24 p-6 space-y-5"
              style={{
                background: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3 className="text-label-md pb-4" style={{ color: 'var(--color-on-surface)', borderBottom: '1px solid var(--color-outline-variant)' }}>
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)
                  </span>
                  <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    ₹{totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Shipping</span>
                  <span className="text-label-sm" style={{ color: 'var(--color-secondary)' }}>FREE</span>
                </div>

                <div className="h-px" style={{ background: 'var(--color-outline-variant)' }} />

                <div className="flex justify-between items-baseline">
                  <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>Total</span>
                  <span className="text-headline-sm" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                    ₹{totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                Proceed to Checkout <ArrowRight size={15} />
              </Link>

              <p className="text-body-sm text-center" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.65, lineHeight: 1.5 }}>
                Taxes and delivery details confirmed at checkout.
              </p>

              <div className="pt-3" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-1.5 text-label-sm transition-colors duration-150"
                  style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-on-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-on-surface-variant)')}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
