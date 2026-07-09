import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight, X, Package } from 'lucide-react';
import { fetchProductsThunk, setFilters, resetFilters, toggleWishlist } from '../state/product.slice.js';

const CATEGORIES = ['Outerwear', 'Knitwear', 'Basics', 'Accessories'];

const SORT_OPTIONS = [
  { value: '',          label: 'Default' },
  { value: 'price',     label: 'Price: Low → High' },
  { value: '-price',    label: 'Price: High → Low' },
  { value: '-createdAt',label: 'Newest First' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4 stars & above' },
  { value: '3', label: '3 stars & above' },
  { value: '2', label: '2 stars & above' },
];

const ProductCard = ({ product, isWishlisted, onWishlist }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
    className="group relative"
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

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {product.discountPrice && <span className="badge badge-primary">Sale</span>}
        {product.isFeatured && <span className="badge badge-secondary">Featured</span>}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => onWishlist(product)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(252,249,248,0.92)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-outline-variant)',
          backdropFilter: 'blur(4px)',
          boxShadow: 'var(--shadow-sm)',
        }}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={14}
          style={{
            fill: isWishlisted ? 'var(--color-primary-container)' : 'transparent',
            color: isWishlisted ? 'var(--color-primary-container)' : 'var(--color-on-surface-variant)',
            transition: 'all 200ms',
          }}
        />
      </button>

      {/* Out of stock overlay */}
      {product.stock === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(252,249,248,0.75)', backdropFilter: 'blur(2px)' }}
        >
          <span className="text-label-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Out of Stock
          </span>
        </div>
      )}
    </div>

    {/* Metadata */}
    <div className="mt-3 px-0.5">
      <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
        {product.brand}
      </p>
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
    </div>
  </motion.div>
);

const ProductSkeleton = () => (
  <div>
    <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
    <div className="mt-3 space-y-2">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/4" />
    </div>
  </div>
);

export const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, filters, pagination, wishlist } = useSelector((state) => state.products);
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') || '');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const updateQueryParams = useCallback((newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) nextParams.set(key, val);
      else nextParams.delete(key);
    });
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const queryParams = {
      search:    searchParams.get('search')    || '',
      category:  searchParams.get('category')  || '',
      minPrice:  searchParams.get('minPrice')  || '',
      maxPrice:  searchParams.get('maxPrice')  || '',
      minRating: searchParams.get('minRating') || '',
      sort:      searchParams.get('sort')      || '',
      page:      Number(searchParams.get('page')) || 1,
    };
    dispatch(setFilters(queryParams));
  }, [searchParams, dispatch]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft !== filters.search) updateQueryParams({ search: searchDraft, page: 1 });
    }, 400);
    return () => clearTimeout(handle);
  }, [searchDraft, filters.search, updateQueryParams]);

  useEffect(() => {
    const cleanParams = {};
    if (filters.search)    cleanParams.search    = filters.search;
    if (filters.category)  cleanParams.category  = filters.category;
    if (filters.minPrice)  cleanParams.minPrice  = filters.minPrice;
    if (filters.maxPrice)  cleanParams.maxPrice  = filters.maxPrice;
    if (filters.minRating) cleanParams.minRating = filters.minRating;
    if (filters.sort)      cleanParams.sort      = filters.sort;
    if (filters.page)      cleanParams.page      = filters.page;
    cleanParams.limit = 8;
    dispatch(fetchProductsThunk(cleanParams));
  }, [filters, dispatch]);

  const handleFilterChange = (key, value) => updateQueryParams({ [key]: value, page: 1 });

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchDraft('');
    setSearchParams({});
  };

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.minRating;

  // ── Sidebar panel (shared between desktop sidebar + mobile drawer)
  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-2 text-label-md"
          style={{ color: 'var(--color-on-surface)' }}
        >
          <SlidersHorizontal size={14} /> Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-label-sm transition-colors duration-150"
            style={{ color: 'var(--color-primary-container)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="text-label-sm block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Keywords..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            className="input"
            style={{ paddingRight: '2.5rem' }}
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-label-sm block mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
              className="flex items-center justify-between w-full px-3 py-2 text-body-sm transition-all duration-150"
              style={{
                background: filters.category === cat ? 'var(--color-primary-fixed)' : 'transparent',
                borderRadius: 'var(--radius)',
                color: filters.category === cat ? 'var(--color-primary-dark)' : 'var(--color-on-surface-variant)',
                fontWeight: filters.category === cat ? 600 : 400,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {cat}
              {filters.category === cat && <X size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-label-sm block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input"
            style={{ width: '50%' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input"
            style={{ width: '50%' }}
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-label-sm block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          Min Rating
        </label>
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          className="input"
          style={{ cursor: 'pointer' }}
        >
          {RATING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-label-sm block mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="input"
          style={{ cursor: 'pointer' }}
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>

      {/* ── Page Header ── */}
      <section style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
        <div className="page-container py-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-headline-lg" style={{ color: 'var(--color-on-surface)', fontStyle: 'italic' }}>
              {filters.category || 'All Products'}
            </h1>
            <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              {pagination.totalProducts || 0} items found
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setFilterPanelOpen(true)}
            className="lg:hidden flex items-center gap-2 btn btn-secondary btn-sm"
          >
            <SlidersHorizontal size={14} /> Filters
            {hasActiveFilters && (
              <span
                className="w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-full)' }}
              >
                !
              </span>
            )}
          </button>
        </div>
      </section>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {filterPanelOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterPanelOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(27,28,28,0.4)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 overflow-y-auto p-6"
              style={{ background: 'var(--color-surface-container-lowest)', boxShadow: 'var(--shadow-xl)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-label-md" style={{ color: 'var(--color-on-surface)' }}>Filters</span>
                <button
                  onClick={() => setFilterPanelOpen(false)}
                  className="p-1.5 transition-colors duration-150"
                  style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                >
                  <X size={16} />
                </button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="page-container py-10 flex flex-col lg:flex-row gap-10">

        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:block w-64 shrink-0 self-start sticky top-24"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <FilterPanel />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Package size={52} />
              <h3>No Products Found</h3>
              <p className="text-body-sm mt-1 mb-5" style={{ color: 'var(--color-on-surface-variant)' }}>
                No items match your current filters.
              </p>
              <button onClick={handleReset} className="btn btn-secondary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <AnimatePresence>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isWishlisted={isWishlisted(product._id)}
                    onWishlist={(p) => dispatch(toggleWishlist(p))}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-8" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateQueryParams({ page: pagination.page - 1 })}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <ChevronLeft size={15} />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const p = i + 1;
                const isActive = p === pagination.page;
                return (
                  <button
                    key={p}
                    onClick={() => updateQueryParams({ page: p })}
                    className="w-9 h-9 flex items-center justify-center text-body-sm font-semibold transition-all duration-150"
                    style={{
                      borderRadius: 'var(--radius)',
                      background: isActive ? 'var(--color-primary-container)' : 'transparent',
                      color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      border: isActive ? 'none' : '1px solid var(--color-outline-variant)',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateQueryParams({ page: pagination.page + 1 })}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
