import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MoveRight } from 'lucide-react';
import { fetchProductsThunk } from '../state/product.slice.js';

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch products for featured list on homepage load
    dispatch(fetchProductsThunk({ limit: 4 }));
  }, [dispatch]);

  const categories = [
    {
      name: "Outerwear",
      img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop",
      link: "/products?category=Outerwear",
      tagline: "Tailored structures"
    },
    {
      name: "Knitwear",
      img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
      link: "/products?category=Knitwear",
      tagline: "Fine textures"
    },
    {
      name: "Basics",
      img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
      link: "/products?category=Basics",
      tagline: "Essential cuts"
    },
    {
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop",
      link: "/products?category=Accessories",
      tagline: "Finishing profiles"
    }
  ];

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-20">
      {/* Editorial Hero Banner */}
      <section className="relative h-[85vh] bg-[#f5f5f5] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-[50%_30%] filter grayscale contrast-110 brightness-95 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-neutral-500 block mb-4">
              SPRING / SUMMER COLLECTION 2026
            </span>
            <h1 className="text-6xl sm:text-8xl font-light tracking-tight leading-[1.05] text-neutral-900 font-serif italic mb-6">
              Quiet <br />
              <span className="font-sans not-italic font-semibold text-neutral-900">Elevations</span>
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide leading-relaxed mb-8 max-w-sm">
              An inspection of structural shapes, breathable raw materials, and monochromatic silhouettes. Made to adapt.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/products" 
                className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors duration-200"
              >
                Shop Collection
              </Link>
              <Link 
                to="/products" 
                className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2 group hover:text-neutral-600 transition-colors"
              >
                Explore S/S26 <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-8 text-right hidden md:block">
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">Softwear Design Studio®</p>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Curated Portfolios</h2>
            <p className="text-neutral-500 text-xs mt-1">Browse by structural archetype.</p>
          </div>
          <Link to="/products" className="text-xs font-semibold tracking-widest uppercase hover:underline mt-4 md:mt-0">
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => navigate(cat.link)}
              className="group cursor-pointer relative aspect-[3/4] overflow-hidden bg-neutral-100"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] tracking-widest uppercase text-neutral-300 block mb-1">
                  {cat.tagline}
                </span>
                <h3 className="text-lg font-medium tracking-wide">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Ethos Highlight */}
      <section className="bg-neutral-50 py-24 border-y border-neutral-100">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Sparkles className="w-6 h-6 mx-auto text-neutral-400 mb-6" />
          <h2 className="text-3xl font-light font-serif italic mb-6">"Simplicity is the final layer of sophistication."</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Softwear creates clothes that perform silently. No loud logos. No unnecessary decorations. Just clean cuts, ethically sourced yarns, and precise craftsmanship.
          </p>
          <div className="h-px w-12 bg-neutral-300 mx-auto" />
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Trending Items</h2>
            <p className="text-neutral-500 text-xs mt-1">Highly requested pieces this week.</p>
          </div>
          <Link to="/products" className="text-xs font-semibold tracking-widest uppercase hover:underline">
            Browse Catalog
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-neutral-100" />
                <div className="h-4 bg-neutral-100 w-2/3" />
                <div className="h-3 bg-neutral-100 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link 
                to={`/products/${product._id}`} 
                key={product._id} 
                className="group block space-y-4"
              >
                <div className="aspect-[3/4] bg-neutral-50 overflow-hidden relative border border-neutral-100">
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                      No Image Available
                    </div>
                  )}
                  {product.discountPrice && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                      Sale
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-500 block truncate">{product.brand}</h3>
                  <h4 className="text-sm font-medium text-neutral-900 mt-0.5 truncate group-hover:underline">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
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
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
