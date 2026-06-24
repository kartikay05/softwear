import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchProductsThunk, setFilters, resetFilters, toggleWishlist } from '../state/product.slice.js';

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, filters, pagination, wishlist } = useSelector((state) => state.products);

  useEffect(() => {
    const queryParams = {
      search:   searchParams.get('search')   || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort:     searchParams.get('sort')     || '',
      page:     Number(searchParams.get('page')) || 1,
    };
    dispatch(setFilters(queryParams));
  }, [searchParams, dispatch]);

  useEffect(() => {
    const cleanParams = {};
    if (filters.search)   cleanParams.search   = filters.search;
    if (filters.category) cleanParams.category = filters.category;
    if (filters.minPrice) cleanParams.minPrice = filters.minPrice;
    if (filters.maxPrice) cleanParams.maxPrice = filters.maxPrice;
    if (filters.sort)     cleanParams.sort     = filters.sort;
    if (filters.page)     cleanParams.page     = filters.page;
    cleanParams.limit = 8;
    dispatch(fetchProductsThunk(cleanParams));
  }, [filters, dispatch]);

  const updateQueryParams = (newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) nextParams.set(key, val);
      else     nextParams.delete(key);
    });
    setSearchParams(nextParams);
  };

  const handleFilterChange = (key, value) => updateQueryParams({ [key]: value, page: 1 });
  const handleReset = () => { dispatch(resetFilters()); setSearchParams({}); };
  const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);

  const categories = ['Outerwear', 'Knitwear', 'Basics', 'Accessories'];

  const hasFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div style={{ backgroundColor: 'var(--sw-surface)', color: 'var(--sw-on-surface)' }} className="min-h-screen pb-24">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section
        className="border-b py-14"
        style={{ backgroundColor: 'var(--sw-surface-container-low)', borderColor: 'var(--sw-outline-variant)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <h1
            className="text-5xl sm:text-6xl italic"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, color: 'var(--sw-on-surface)' }}
          >
            {filters.category ? filters.category : 'Catalog'}
          </h1>
          <p className="text-xs mt-2" style={{ color: 'var(--sw-on-surface-variant)' }}>
            {pagination.totalProducts || 0} products matching profiles
          </p>
          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.category && (
                <FilterPill label={filters.category} onRemove={() => handleFilterChange('category', '')} />
              )}
              {filters.search && (
                <FilterPill label={`"${filters.search}"`} onRemove={() => handleFilterChange('search', '')} />
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <FilterPill
                  label={`₹${filters.minPrice || '0'} – ₹${filters.maxPrice || '∞'}`}
                  onRemove={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Main Grid ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 flex flex-col lg:flex-row gap-12">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 shrink-0 space-y-8">
          <div
            className="flex justify-between items-center pb-4 border-b"
            style={{ borderColor: 'var(--sw-outline-variant)' }}
          >
            <span
              className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-2"
              style={{ color: 'var(--sw-on-surface)' }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
              style={{ color: 'var(--sw-outline)' }}
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label
              className="text-[10px] tracking-widest uppercase font-semibold block"
              style={{ color: 'var(--sw-on-surface-variant)' }}
            >
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="sw-input pr-8 text-xs"
                style={{ borderRadius: 'var(--sw-radius-sm)' }}
                aria-label="Search products"
              />
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--sw-outline)' }} />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              className="text-[10px] tracking-widest uppercase font-semibold block"
              style={{ color: 'var(--sw-on-surface-variant)' }}
            >
              Category
            </label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                  className="text-left text-sm py-1.5 relative transition-colors duration-200 group flex items-center gap-2"
                  style={{
                    color: filters.category === cat ? 'var(--sw-primary)' : 'var(--sw-on-surface-variant)',
                    fontWeight: filters.category === cat ? 600 : 400,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                    style={{
                      backgroundColor: filters.category === cat ? 'var(--sw-primary)' : 'var(--sw-outline-variant)',
                    }}
                  />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label
              className="text-[10px] tracking-widest uppercase font-semibold block"
              style={{ color: 'var(--sw-on-surface-variant)' }}
            >
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="sw-input text-xs w-1/2"
                aria-label="Minimum price"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="sw-input text-xs w-1/2"
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label
              className="text-[10px] tracking-widest uppercase font-semibold block"
              style={{ color: 'var(--sw-on-surface-variant)' }}
            >
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="sw-input text-sm"
              style={{ cursor: 'pointer', borderRadius: 'var(--sw-radius-sm)' }}
              aria-label="Sort products"
            >
              <option value="">Default sorting</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-createdAt">Newest arrivals</option>
            </select>
          </div>
        </aside>

        {/* Products Area */}
        <div className="flex-1 space-y-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--sw-radius-lg)' }} />
                    <div className="skeleton h-3.5 w-2/3" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 border border-dashed"
                style={{ borderColor: 'var(--sw-outline-variant)', borderRadius: 'var(--sw-radius-lg)' }}
              >
                <p className="text-sm mb-4" style={{ color: 'var(--sw-on-surface-variant)' }}>
                  No items found matching the selected profiles.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-primary !py-2.5 !px-6"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
              >
                {products.map((product) => (
                  <motion.div key={product._id} variants={fadeUp} className="group relative">
                    {/* Card image — no border per Stitch spec */}
                    <div
                      className="relative overflow-hidden mb-3"
                      style={{
                        aspectRatio: '3/4',
                        backgroundColor: 'var(--sw-surface-container-low)',
                        borderRadius: 'var(--sw-radius-lg)',
                      }}
                    >
                      <Link to={`/products/${product._id}`} className="block w-full h-full">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs"
                            style={{ color: 'var(--sw-outline)' }}
                          >
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* Quick-view overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Link
                          to={`/products/${product._id}`}
                          className="btn-primary !py-2 !px-5 !text-[10px] shadow-lg"
                          style={{ boxShadow: 'var(--sw-shadow-warm)' }}
                        >
                          View Details
                        </Link>
                      </div>

                      {/* Wishlist heart */}
                      <button
                        onClick={() => dispatch(toggleWishlist(product))}
                        className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(252,249,248,0.90)',
                          color: isWishlisted(product._id) ? 'var(--sw-primary)' : 'var(--sw-outline)',
                        }}
                        aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart
                          className="w-3.5 h-3.5 transition-all"
                          fill={isWishlisted(product._id) ? 'currentColor' : 'none'}
                        />
                      </button>

                      {/* Sale badge */}
                      {product.discountPrice && (
                        <span
                          className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold"
                          style={{
                            backgroundColor: 'var(--sw-primary)',
                            color: 'var(--sw-on-primary)',
                            borderRadius: 'var(--sw-radius)',
                          }}
                        >
                          Sale
                        </span>
                      )}

                      {/* Out of stock overlay */}
                      {product.stock === 0 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-widest font-semibold backdrop-blur-[2px]"
                          style={{
                            backgroundColor: 'rgba(252,249,248,0.72)',
                            color: 'var(--sw-on-surface-variant)',
                          }}
                        >
                          Sold Out
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <span
                      className="text-[10px] uppercase tracking-[0.15em] block truncate"
                      style={{ color: 'var(--sw-secondary)', fontWeight: 600 }}
                    >
                      {product.brand}
                    </span>
                    <Link to={`/products/${product._id}`}>
                      <h4
                        className="text-sm mt-0.5 truncate hover:underline underline-offset-2"
                        style={{ color: 'var(--sw-on-surface)', fontWeight: 500 }}
                      >
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {product.discountPrice ? (
                        <>
                          <span className="text-sm font-semibold" style={{ color: 'var(--sw-primary)' }}>
                            ₹{product.discountPrice}
                          </span>
                          <span className="text-xs line-through" style={{ color: 'var(--sw-outline)' }}>
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold" style={{ color: 'var(--sw-on-surface)' }}>
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div
              className="flex items-center justify-center gap-4 pt-8 border-t"
              style={{ borderColor: 'var(--sw-outline-variant)' }}
            >
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateQueryParams({ page: pagination.page - 1 })}
                className="p-2.5 border rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-current"
                style={{
                  borderColor: 'var(--sw-outline-variant)',
                  color: 'var(--sw-on-surface)',
                  borderRadius: 'var(--sw-radius)',
                }}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className="text-[11px] tracking-widest font-semibold uppercase"
                style={{ color: 'var(--sw-on-surface-variant)' }}
              >
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateQueryParams({ page: pagination.page + 1 })}
                className="p-2.5 border rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-current"
                style={{
                  borderColor: 'var(--sw-outline-variant)',
                  color: 'var(--sw-on-surface)',
                  borderRadius: 'var(--sw-radius)',
                }}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* Filter Pill component */
const FilterPill = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5"
    style={{
      backgroundColor: 'var(--sw-primary-fixed)',
      color: 'var(--sw-on-surface)',
      borderRadius: 'var(--sw-radius-full)',
    }}
  >
    {label}
    <button
      onClick={onRemove}
      className="ml-0.5 hover:opacity-70 transition-opacity"
      aria-label={`Remove ${label} filter`}
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default ProductListPage;
