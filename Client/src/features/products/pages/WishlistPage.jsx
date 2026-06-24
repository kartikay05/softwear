import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { toggleWishlist } from '../state/product.slice.js';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.products);

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Header */}
      <section className="border-b border-neutral-100 py-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-light font-serif italic tracking-wide text-neutral-900">
            My Wishlist
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            {wishlist.length || 0} saved profiles
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-neutral-50/50 border border-dashed border-neutral-200">
            <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold mb-1">Your wishlist is empty</h2>
            <p className="text-neutral-400 text-xs mb-6">Explore the collections and save your favorite pieces.</p>
            <Link 
              to="/products" 
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase"
            >
              Shop Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="group relative space-y-4">
                <div className="aspect-[3/4] bg-neutral-50 overflow-hidden relative border border-neutral-100">
                  <Link to={`/products/${product._id}`} className="block w-full h-full">
                    {product.images?.[0]?.url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => dispatch(toggleWishlist(product))}
                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm text-red-500 hover:scale-105 transition-transform"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {product.discountPrice && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                      Sale
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">{product.brand}</h3>
                  <Link to={`/products/${product._id}`}>
                    <h4 className="text-sm font-medium text-neutral-900 mt-0.5 truncate hover:underline">{product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discountPrice ? (
                      <>
                        <span className="text-sm font-semibold text-neutral-900">₹{product.discountPrice}</span>
                        <span className="text-xs text-neutral-400 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-neutral-900">₹{product.price}</span>
                    )}
                  </div>
                  <Link
                    to={`/products/${product._id}`}
                    className="text-[10px] uppercase font-semibold tracking-wider text-neutral-900 hover:text-neutral-500 flex items-center gap-1 mt-3 transition-colors"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WishlistPage;
