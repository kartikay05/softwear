import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, ChevronRight, Check, AlertCircle } from 'lucide-react';
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

  // Simulated reviews for Phase 2 UI completeness
  const [reviews, setReviews] = useState([
    { id: 1, name: "Marcus L.", rating: 5, comment: "Exquisite fabric quality. Cut is precisely tailored. Flows beautifully when walking.", date: "May 14, 2026" },
    { id: 2, name: "Sophia K.", rating: 4, comment: "Perfect minimalist silhouette. Runs slightly larger than expected, but fits the drape styling perfectly.", date: "June 2, 2026" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    dispatch(fetchProductDetailsThunk(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId: product._id, quantity: qty })).unwrap();
      toast.success("Added to cart successfully");
    } catch (err) {
      toast.error(err || "Failed to add item to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newRev = {
      id: Date.now(),
      name: "You (Verified Buyer)",
      rating: newRating,
      comment: newComment,
      date: "Just now"
    };

    setReviews([newRev, ...reviews]);
    setNewComment("");
    toast.success("Review submitted (simulated)");
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-neutral-900 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Product Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6 text-center max-w-sm">The item may have been removed or does not exist.</p>
        <Link to="/products" className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-6 text-xs text-neutral-400 flex items-center gap-2">
        <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-neutral-900 transition-colors">Catalog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-neutral-500 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-neutral-50 overflow-hidden border border-neutral-100 relative">
            {product.images && product.images[activeImage] ? (
              <img 
                src={product.images[activeImage].url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                No Image Available
              </div>
            )}
            
            {product.discountPrice && (
              <span className="absolute top-4 left-4 bg-black text-white text-[9px] uppercase tracking-widest px-3 py-1 font-semibold">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 aspect-[3/4] shrink-0 border transition-all ${idx === activeImage ? 'border-neutral-900' : 'border-neutral-200'}`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Configuration */}
        <div className="flex flex-col justify-start">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
            {product.brand}
          </span>
          <h1 className="text-3xl font-light tracking-wide mt-2 text-neutral-900">
            {product.name}
          </h1>

          {/* Ratings Summary */}
          <div className="flex items-center gap-1.5 mt-3 text-neutral-500">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.round(product.ratings?.average || 5) ? 'fill-current' : 'text-neutral-200'}`} 
                />
              ))}
            </div>
            <span className="text-xs">({product.ratings?.count || reviews.length} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 mt-6 pb-6 border-b border-neutral-100">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-neutral-900">₹{product.discountPrice}</span>
                <span className="text-base text-neutral-400 line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-neutral-900">₹{product.price}</span>
            )}
          </div>

          {/* Description */}
          <div className="py-6 border-b border-neutral-100 space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Overview</h3>
            <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || "A meticulously structured apparel piece featuring high quality fabric drape, refined silhouette cuts, and minimalist layout lines."}
            </p>
          </div>

          {/* Size Selector */}
          <div className="py-6 border-b border-neutral-100">
            <div className="flex justify-between items-baseline mb-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Select Profile / Size</h3>
              <button className="text-neutral-400 hover:text-neutral-900 text-xs underline">Size Chart</button>
            </div>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 text-xs font-semibold tracking-wider transition-all border ${selectedSize === size ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 hover:border-neutral-900 text-neutral-700'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="py-6 space-y-4">
            <div className="flex gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-neutral-200">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 text-neutral-500 hover:text-neutral-900 text-sm font-semibold"
                >
                  -
                </button>
                <span className="px-2 text-sm font-semibold text-neutral-900 min-w-8 text-center">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 text-neutral-500 hover:text-neutral-900 text-sm font-semibold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-widest uppercase transition-colors py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.stock === 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Bag"}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className="p-4 border border-neutral-200 hover:border-neutral-900 transition-colors text-neutral-400 hover:text-neutral-900"
              >
                <Heart className={`w-4 h-4 ${isWishlisted(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-red-500 font-semibold">Only {product.stock} units left in stock!</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 border-t border-neutral-100 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">Customer Feedback</h2>
          <p className="text-neutral-500 text-xs leading-relaxed mb-6">
            Read comments left by buyers regarding fabric weave, drape, sizing accuracy, and structural lines.
          </p>

          <form onSubmit={handleAddReview} className="space-y-4 bg-neutral-50 p-6 border border-neutral-100">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-600">Write an inspection</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => setNewRating(stars)}
                    className="text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${stars <= newRating ? 'fill-current' : 'text-neutral-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Comments</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on weave, sizing..."
                rows="4"
                className="w-full text-xs p-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] tracking-widest uppercase font-semibold"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 pb-4 border-b border-neutral-100">
            Reviews ({reviews.length})
          </h3>

          <div className="space-y-8 divide-y divide-neutral-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-neutral-950">{rev.name}</span>
                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pt-1">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
