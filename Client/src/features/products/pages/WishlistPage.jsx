import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Package } from 'lucide-react';
import { toggleWishlist } from '../state/product.slice.js';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.products);

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
        <div className="page-container py-10">
          <h1 className="text-headline-lg" style={{ color: 'var(--color-on-surface)', fontStyle: 'italic' }}>
            My Wishlist
          </h1>
          <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            {wishlist.length} saved piece{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
            style={{ minHeight: '50vh' }}
          >
            <Heart size={48} style={{ color: 'var(--color-outline-variant)' }} />
            <h3>Your Wishlist is Empty</h3>
            <p className="text-body-sm mt-1 mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
              Explore the collections and save your favorite pieces.
            </p>
            <Link to="/products" className="btn btn-primary">
              Shop Collections
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence>
              {wishlist.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="group"
                >
                  {/* Image */}
                  <div
                    className="product-card-img relative overflow-hidden"
                    style={{
                      aspectRatio: '3/4',
                      background: 'var(--color-surface-container-low)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-outline-variant)',
                    }}
                  >
                    <Link to={`/products/${product._id}`} className="block w-full h-full" style={{ textDecoration: 'none' }}>
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-on-surface-variant)' }}>
                          <Package size={28} opacity={0.3} />
                        </div>
                      )}
                    </Link>

                    {product.discountPrice && (
                      <span className="absolute top-3 left-3 badge badge-primary">Sale</span>
                    )}

                    {/* Remove heart */}
                    <button
                      onClick={() => dispatch(toggleWishlist(product))}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
                      style={{
                        background: 'rgba(252,249,248,0.92)',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-outline-variant)',
                        backdropFilter: 'blur(4px)',
                      }}
                      title="Remove from wishlist"
                    >
                      <Heart size={14} style={{ fill: 'var(--color-primary-container)', color: 'var(--color-primary-container)' }} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="mt-3 px-0.5">
                    <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{product.brand}</p>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                      <h4 className="text-body-sm font-semibold mt-0.5 truncate" style={{ color: 'var(--color-on-surface)' }}>
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5">
                      {product.discountPrice ? (
                        <>
                          <span className="text-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>₹{product.discountPrice}</span>
                          <span className="text-body-sm line-through" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6 }}>₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>₹{product.price}</span>
                      )}
                    </div>
                    <Link
                      to={`/products/${product._id}`}
                      className="flex items-center gap-1 mt-3 text-label-sm transition-colors duration-150 group"
                      style={{ color: 'var(--color-primary-container)', textDecoration: 'none' }}
                    >
                      View Details <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
