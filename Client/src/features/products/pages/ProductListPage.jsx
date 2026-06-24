import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProductsThunk, setFilters, resetFilters, toggleWishlist } from '../state/product.slice.js';

export const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, filters, pagination, wishlist } = useSelector((state) => state.products);

  // Sync route query parameters with Redux store on mount or url change
  useEffect(() => {
    const queryParams = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
      page: Number(searchParams.get('page')) || 1,
    };
    dispatch(setFilters(queryParams));
  }, [searchParams, dispatch]);

  // Trigger API fetch whenever filters change in store
  useEffect(() => {
    const cleanParams = {};
    if (filters.search) cleanParams.search = filters.search;
    if (filters.category) cleanParams.category = filters.category;
    if (filters.minPrice) cleanParams.minPrice = filters.minPrice;
    if (filters.maxPrice) cleanParams.maxPrice = filters.maxPrice;
    if (filters.sort) cleanParams.sort = filters.sort;
    if (filters.page) cleanParams.page = filters.page;
    cleanParams.limit = 8; // Fetch 8 products per page

    dispatch(fetchProductsThunk(cleanParams));
  }, [filters, dispatch]);

  const updateQueryParams = (newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    setSearchParams(nextParams);
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({ [key]: value, page: 1 });
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const categories = ["Outerwear", "Knitwear", "Basics", "Accessories"];

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Top Banner / Heading */}
      <section className="border-b border-neutral-100 py-12 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-light font-serif italic tracking-wide text-neutral-900">
            {filters.category ? filters.category : "Catalog"}
          </h1>
          <p className="text-neutral-500 text-xs mt-1">
            {pagination.totalProducts || 0} products matching profiles
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left Side: Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
            <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </span>
            <button 
              onClick={handleReset}
              className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Search</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full text-xs py-2.5 pl-3 pr-8 border border-neutral-200 focus:outline-none focus:border-neutral-900 rounded-none bg-neutral-50/50"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-2.5 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Category</label>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                  className={`text-left text-xs py-1.5 hover:text-neutral-900 transition-colors ${filters.category === cat ? 'font-semibold text-neutral-900 underline underline-offset-4' : 'text-neutral-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Price Thresholds</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-1/2 text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 rounded-none"
              />
              <input 
                type="number" 
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-1/2 text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 rounded-none"
              />
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full text-xs py-2.5 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 rounded-none bg-white"
            >
              <option value="">Default sorting</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-createdAt">Newest arrivals</option>
            </select>
          </div>
        </aside>

        {/* Right Side: Products Grid & Pagination */}
        <div className="flex-1 space-y-12">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-100" />
                  <div className="h-4 bg-neutral-100 w-2/3" />
                  <div className="h-3 bg-neutral-100 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200">
              <p className="text-neutral-400 text-sm">No items found matching the selected profiles.</p>
              <button 
                onClick={handleReset}
                className="mt-4 px-6 py-2 border border-neutral-900 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="group relative space-y-4">
                  {/* Product Card Container */}
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
                    
                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={() => dispatch(toggleWishlist(product))}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 transition-colors ${isWishlisted(product._id) ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-neutral-900'}`} 
                      />
                    </button>

                    {product.discountPrice && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                        Sale
                      </span>
                    )}

                    {product.stock === 0 && (
                      <span className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center text-xs uppercase tracking-widest font-semibold text-neutral-500">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-neutral-100">
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateQueryParams({ page: pagination.page - 1 })}
                className="p-2 border border-neutral-200 hover:border-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs tracking-wider font-semibold text-neutral-500">
                PAGE {pagination.page} OF {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateQueryParams({ page: pagination.page + 1 })}
                className="p-2 border border-neutral-200 hover:border-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

export default ProductListPage;
