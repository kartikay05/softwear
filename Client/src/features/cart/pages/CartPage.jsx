import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
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
    if (newQty > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }
    try {
      await dispatch(updateCartItemThunk({ productId, quantity: newQty })).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeCartItemThunk(itemId)).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await dispatch(clearCartThunk()).unwrap();
        toast.success("Cart cleared");
      } catch (err) {
        toast.error(err || "Failed to clear cart");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <ShoppingBag className="w-12 h-12 text-neutral-300 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Sign in to view your bag</h2>
        <p className="text-neutral-500 text-sm mb-6 text-center max-w-sm">Items you add to your cart are synced across all your devices.</p>
        <button 
          onClick={() => window.location.reload()} // Reload to trigger auth check / modal
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase"
        >
          Access Account
        </button>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Header */}
      <section className="border-b border-neutral-100 py-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-light font-serif italic tracking-wide text-neutral-900">
            Shopping Bag
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            {items.length || 0} unique profile lines
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold mb-1">Your bag is empty</h2>
            <p className="text-neutral-400 text-xs mb-6">Items you add to your bag will appear here.</p>
            <Link 
              to="/products" 
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left Column: Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-baseline pb-3 border-b border-neutral-100">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Items</span>
                <button 
                  onClick={handleClearCart}
                  className="text-xs text-neutral-400 hover:text-red-500 hover:underline transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;

                  return (
                    <div key={item._id || product._id} className="py-6 first:pt-0 flex gap-6">
                      {/* Image */}
                      <div className="w-24 aspect-[3/4] bg-neutral-50 shrink-0 border border-neutral-100 overflow-hidden">
                        <img 
                          src={product.images?.[0]?.url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">{product.brand}</h3>
                            <span className="text-sm font-semibold text-neutral-900">₹{item.price * item.quantity}</span>
                          </div>
                          <Link to={`/products/${product._id}`}>
                            <h4 className="text-sm font-medium text-neutral-900 mt-0.5 hover:underline">{product.name}</h4>
                          </Link>
                          <p className="text-xs text-neutral-400 mt-1">Size: M</p>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-neutral-200">
                            <button 
                              onClick={() => handleUpdateQuantity(product._id, item.quantity - 1, product.stock)}
                              className="px-2.5 py-1 text-neutral-500 hover:text-neutral-950 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-neutral-900 min-w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(product._id, item.quantity + 1, product.stock)}
                              className="px-2.5 py-1 text-neutral-500 hover:text-neutral-950 font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Checkout Summary */}
            <div className="bg-neutral-50 p-8 border border-neutral-100 space-y-6">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-neutral-900 pb-3 border-b border-neutral-200">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Free</span>
                </div>
                <div className="h-px bg-neutral-200" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-neutral-900">Total</span>
                  <span className="text-lg font-bold text-neutral-900">₹{totalPrice}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-widest uppercase transition-colors py-4 px-6"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[10px] text-neutral-400 leading-relaxed text-center">
                Review sizes and addresses on the next screen. Tax calculations and delivery dates are shown at checkout.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CartPage;
