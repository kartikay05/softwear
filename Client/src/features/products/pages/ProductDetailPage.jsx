import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, ChevronRight, AlertCircle, Minus, Plus } from 'lucide-react';
import { fetchProductDetailsThunk, toggleWishlist, clearSelectedProduct } from '../state/product.slice.js';
import { addToCartThunk } from '../../cart/state/cart.slice.js';
import { toast } from 'react-hot-toast';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, loading, error, wishlist } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const [reviews, setReviews] = useState([
    { id: 1, name: 'Marcus L.',  rating: 5, comment: 'Exquisite fabric quality. Cut is precisely tailored. Flows beautifully when walking.', date: 'May 14, 2026' },
    { id: 2, name: 'Sophia K.',  rating: 4, comment: 'Perfect minimalist silhouette. Runs slightly larger than expected, but fits the drape styling perfectly.', date: 'June 2, 2026' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    dispatch(fetchProductDetailsThunk(id));
    return () => { dispatch(clearSelectedProduct()); };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to your cart'); return; }
    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId: product._id, quantity: qty })).unwrap();
      toast.success('Added to cart successfully');
    } catch (err) {
      toast.error(err || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviews([{ id: Date.now(), name: 'You (Verified Buyer)', rating: newRating, comment: newComment, date: 'Just now' }, ...reviews]);
    setNewComment('');
    toast.success('Review submitted');
  };

  const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  /* Loading state */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--sw-surface)' }}>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{ backgroundColor: 'var(--sw-primary)', animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* Error state */
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--sw-surface)' }}>
        <AlertCircle className="w-10 h-10 mb-4" style={{ color: 'var(--sw-error)' }} />
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--sw-on-surface)' }}>Product Not Found</h2>
        <p className="text-sm mb-6 text-center max-w-sm" style={{ color: 'var(--sw-on-surface-variant)' }}>
          The item may have been removed or does not exist.
        </p>
        <Link to="/products" className="btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const avgRating = product.ratings?.average || 5;
  const reviewCount = product.ratings?.count || reviews.length;

  return (
    <div style={{ backgroundColor: 'var(--sw-surface)', color: 'var(--sw-on-surface)' }} className="min-h-screen pb-24">

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--sw-outline-variant)', backgroundColor: 'var(--sw-surface-container-low)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center gap-2 text-xs" style={{ color: 'var(--sw-outline)' }}>
          <Link to="/" className="hover:text-current transition-colors" style={{ '--tw-text-opacity': 1 }}>Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-current transition-colors">Catalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="truncate max-w-[200px]" style={{ color: 'var(--sw-on-surface-variant)', fontWeight: 500 }}>
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left: Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden"
            style={{
              aspectRatio: '3/4',
              backgroundColor: 'var(--sw-surface-container-low)',
              borderRadius: 'var(--sw-radius-lg)',
            }}
          >
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--sw-outline)' }}>
                No Image Available
              </div>
            )}
            {product.discountPrice && (
              <span
                className="absolute top-4 left-4 text-[10px] uppercase tracking-wider px-3 py-1.5 font-semibold"
                style={{
                  backgroundColor: 'var(--sw-primary)',
                  color: 'var(--sw-on-primary)',
                  borderRadius: 'var(--sw-radius)',
                }}
              >
                Sale
              </span>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className="w-20 shrink-0 overflow-hidden transition-all duration-200"
                  style={{
                    aspectRatio: '3/4',
                    borderRadius: 'var(--sw-radius)',
                    outline: idx === activeImage
                      ? `2px solid var(--sw-primary)`
                      : `1.5px solid var(--sw-outline-variant)`,
                    outlineOffset: '2px',
                  }}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img.url} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-start lg:pt-2">
          {/* Brand */}
          <span
            className="text-[11px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: 'var(--sw-secondary)', fontFamily: 'var(--font-body)' }}
          >
            {product.brand}
          </span>

          {/* Product Name */}
          <h1
            className="text-3xl sm:text-4xl mt-2 leading-snug"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, color: 'var(--sw-on-surface)' }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5"
                  style={{ color: i < Math.round(avgRating) ? '#d97706' : 'var(--sw-outline-variant)' }}
                  fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: 'var(--sw-on-surface-variant)' }}>
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div
            className="flex items-baseline gap-4 mt-6 pb-6 border-b"
            style={{ borderColor: 'var(--sw-outline-variant)' }}
          >
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold" style={{ color: 'var(--sw-primary)' }}>
                  ₹{product.discountPrice}
                </span>
                <span className="text-base line-through" style={{ color: 'var(--sw-outline)' }}>
                  ₹{product.price}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5"
                  style={{
                    backgroundColor: 'var(--sw-primary-fixed)',
                    color: 'var(--sw-primary)',
                    borderRadius: 'var(--sw-radius)',
                  }}
                >
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold" style={{ color: 'var(--sw-on-surface)' }}>
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="py-6 border-b space-y-2" style={{ borderColor: 'var(--sw-outline-variant)' }}>
            <h3
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: 'var(--sw-on-surface-variant)' }}
            >
              Overview
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--sw-on-surface-variant)' }}>
              {product.description || 'A meticulously structured apparel piece featuring high quality fabric drape, refined silhouette cuts, and minimalist layout lines.'}
            </p>
          </div>

          {/* Size Selector */}
          <div className="py-6 border-b" style={{ borderColor: 'var(--sw-outline-variant)' }}>
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--sw-on-surface-variant)' }}>
                Select Size
              </h3>
              <button className="text-xs underline underline-offset-2 transition-colors" style={{ color: 'var(--sw-outline)' }}>
                Size Chart
              </button>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="w-12 h-12 text-xs font-semibold tracking-wider transition-all duration-200 active:scale-95"
                  style={{
                    borderRadius: 'var(--sw-radius)',
                    border: selectedSize === size
                      ? '2px solid var(--sw-primary)'
                      : `1.5px solid var(--sw-outline-variant)`,
                    backgroundColor: selectedSize === size ? 'var(--sw-primary)' : 'transparent',
                    color: selectedSize === size ? 'var(--sw-on-primary)' : 'var(--sw-on-surface-variant)',
                  }}
                  aria-pressed={selectedSize === size}
                  aria-label={`Size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Actions */}
          <div className="py-6 space-y-4">
            <div className="flex gap-3">
              {/* Quantity stepper */}
              <div
                className="flex items-center"
                style={{
                  border: `1.5px solid var(--sw-outline-variant)`,
                  borderRadius: 'var(--sw-radius)',
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-3 transition-colors hover:bg-opacity-10"
                  style={{ color: 'var(--sw-on-surface-variant)' }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  className="px-4 text-sm font-semibold min-w-[2.5rem] text-center"
                  style={{ color: 'var(--sw-on-surface)' }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-3 transition-colors"
                  style={{ color: 'var(--sw-on-surface-variant)' }}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag — terracotta, full-width, with press effect */}
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Bag'}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className="p-3 border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: isWishlisted(product._id) ? 'var(--sw-primary)' : 'var(--sw-outline-variant)',
                  borderRadius: 'var(--sw-radius)',
                  color: isWishlisted(product._id) ? 'var(--sw-primary)' : 'var(--sw-outline)',
                }}
                aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  className="w-5 h-5 transition-all"
                  fill={isWishlisted(product._id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Low stock warning */}
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs font-semibold" style={{ color: 'var(--sw-error)' }}>
                Only {product.stock} units left in stock — order soon.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ──────────────────────────────────────────────────── */}
      <section
        className="border-t mt-4"
        style={{ borderColor: 'var(--sw-outline-variant)', backgroundColor: 'var(--sw-surface-container-low)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Review form */}
          <div>
            <h2
              className="text-2xl mb-2"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'var(--sw-on-surface)' }}
            >
              Customer Feedback
            </h2>
            <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--sw-on-surface-variant)' }}>
              Share your thoughts on fabric, drape, sizing, and structural lines.
            </p>

            <form
              onSubmit={handleAddReview}
              className="space-y-5 p-6"
              style={{
                backgroundColor: 'var(--sw-surface-container-lowest)',
                borderRadius: 'var(--sw-radius-lg)',
                border: `1px solid var(--sw-outline-variant)`,
              }}
            >
              <h3 className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--sw-on-surface-variant)' }}>
                Write a Review
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--sw-on-surface-variant)' }}>
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setNewRating(stars)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-5 h-5"
                        style={{ color: stars <= newRating ? '#d97706' : 'var(--sw-outline-variant)' }}
                        fill={stars <= newRating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--sw-on-surface-variant)' }}>
                  Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on weave, sizing..."
                  rows={4}
                  required
                  className="sw-input resize-none text-sm"
                  style={{ borderRadius: 'var(--sw-radius-sm)' }}
                  aria-label="Review comment"
                />
              </div>

              <button type="submit" className="btn-primary w-full !py-3">
                Submit Review
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2">
            <h3
              className="text-[11px] uppercase tracking-widest font-semibold pb-4 border-b"
              style={{ color: 'var(--sw-on-surface-variant)', borderColor: 'var(--sw-outline-variant)' }}
            >
              Reviews ({reviews.length})
            </h3>
            <div className="space-y-8 divide-y" style={{ '--tw-divide-opacity': 1 }}>
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-6 first:pt-4 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold" style={{ color: 'var(--sw-on-surface)' }}>{rev.name}</span>
                    <span className="text-[10px]" style={{ color: 'var(--sw-outline)' }}>{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        style={{ color: i < rev.rating ? '#d97706' : 'var(--sw-outline-variant)' }}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--sw-on-surface-variant)' }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
