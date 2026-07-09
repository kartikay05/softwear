import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MoveRight, Leaf, Star } from 'lucide-react';
import { fetchProductsThunk } from '../state/product.slice.js';

const CATEGORIES = [
  {
    name: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
    link: '/products?category=Outerwear',
    tagline: 'Tailored structures',
  },
  {
    name: 'Knitwear',
    img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop',
    link: '/products?category=Knitwear',
    tagline: 'Fine textures',
  },
  {
    name: 'Basics',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    link: '/products?category=Basics',
    tagline: 'Essential cuts',
  },
  {
    name: 'Accessories',
    img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600&auto=format&fit=crop',
    link: '/products?category=Accessories',
    tagline: 'Finishing profiles',
  },
];

const BRAND_PILLARS = [
  { icon: Leaf,    title: 'Ethical Sourcing',   desc: 'Every fibre traced from loom to label.' },
  { icon: Star,    title: 'Artisan Quality',     desc: 'Precision cut, constructed to endure.' },
  { icon: ArrowRight, title: 'Circular Returns', desc: 'Return old pieces, earn store credit.' },
];

// Reusable product card used on home page
const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.45 }}
  >
    <Link to={`/products/${product._id}`} className="group block" style={{ textDecoration: 'none' }}>
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
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-body-sm"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            No Image
          </div>
        )}
        {product.discountPrice && (
          <span
            className="absolute top-3 left-3 badge badge-primary"
            style={{ fontWeight: 700 }}
          >
            Sale
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 badge badge-secondary">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          {product.brand}
        </p>
        <h4
          className="text-body-sm font-semibold mt-0.5 truncate transition-colors duration-150"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          {product.discountPrice ? (
            <>
              <span className="text-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                ₹{product.discountPrice}
              </span>
              <span className="text-body-sm line-through" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6 }}>
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

// Skeleton card
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

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 4 }));
  }, [dispatch]);

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100vh' }}>

      {/* ════ Hero ════ */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: '88vh', background: 'var(--color-surface-container-low)' }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop"
            alt="Hero — Softwear Collection"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%', filter: 'brightness(0.88) contrast(1.05)' }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(252,249,248,0.75) 0%, rgba(252,249,248,0.35) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="page-container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-label-md block mb-5"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Spring / Summer Collection 2026
            </motion.span>

            <h1 className="text-headline-display mb-6" style={{ color: 'var(--color-on-surface)' }}>
              Quiet{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>Elevations</em>
            </h1>

            <p
              className="text-body-lg mb-8 max-w-sm"
              style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.7 }}
            >
              Structural shapes, breathable raw materials, and monochromatic silhouettes. Made to adapt.
            </p>

            <div className="flex items-center gap-6 flex-wrap">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Collection
              </Link>
              <Link
                to="/products?sort=-createdAt"
                className="flex items-center gap-2 text-label-md transition-all duration-200 group"
                style={{ color: 'var(--color-on-surface)', textDecoration: 'none' }}
              >
                New Arrivals
                <MoveRight
                  size={16}
                  style={{ transition: 'transform 200ms' }}
                  className="group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Studio tag */}
        <div className="absolute bottom-8 right-8 hidden md:block">
          <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)', letterSpacing: '0.2em' }}>
            Softwear Design Studio®
          </p>
        </div>
      </section>

      {/* ════ Brand Pillars ════ */}
      <section style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-lowest)' }}>
        <div className="page-container py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRAND_PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--color-primary-fixed)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-primary-dark)',
                }}
              >
                <Icon size={16} />
              </div>
              <div>
                <h4 className="text-body-sm font-semibold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>
                  {title}
                </h4>
                <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.8 }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════ Categories ════ */}
      <section className="section page-container">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-12">
          <div>
            <h2 className="text-headline-lg" style={{ color: 'var(--color-on-surface)' }}>
              Curated Portfolios
            </h2>
            <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              Browse by structural archetype.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-label-md transition-colors duration-150 group"
            style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-on-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
          >
            View All <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              onClick={() => navigate(cat.link)}
              className="group cursor-pointer relative overflow-hidden"
              style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-outline-variant)' }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ filter: 'grayscale(30%)' }}
              />
              {/* Dark gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(27,28,28,0.65) 0%, transparent 60%)' }}
              />
              {/* Text */}
              <div className="absolute bottom-5 left-5">
                <span
                  className="text-label-sm block mb-1"
                  style={{ color: 'rgba(243,240,240,0.65)' }}
                >
                  {cat.tagline}
                </span>
                <h3
                  className="text-headline-sm"
                  style={{ color: '#ffffff', fontStyle: 'italic' }}
                >
                  {cat.name}
                </h3>
              </div>
              {/* Hover arrow */}
              <div
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                style={{
                  background: 'rgba(252,249,248,0.9)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-on-surface)',
                }}
              >
                <ArrowRight size={13} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════ Brand Quote ════ */}
      <section
        className="section"
        style={{ background: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="page-container text-center"
          style={{ maxWidth: '680px', margin: '0 auto' }}
        >
          <div
            className="w-10 h-px mx-auto mb-8"
            style={{ background: 'var(--color-primary-container)' }}
          />
          <blockquote
            className="text-headline-lg"
            style={{ fontStyle: 'italic', color: 'var(--color-on-surface)', lineHeight: 1.35 }}
          >
            "Simplicity is the final layer of sophistication."
          </blockquote>
          <p
            className="text-body-sm mt-5 max-w-md mx-auto"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Softwear creates clothes that perform silently. No loud logos. No unnecessary decorations.
            Just clean cuts, ethically sourced yarns, and precise craftsmanship.
          </p>
          <div
            className="w-10 h-px mx-auto mt-8"
            style={{ background: 'var(--color-primary-container)' }}
          />
        </motion.div>
      </section>

      {/* ════ Featured Products ════ */}
      <section className="section page-container">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-12">
          <div>
            <h2 className="text-headline-lg" style={{ color: 'var(--color-on-surface)' }}>
              Trending Now
            </h2>
            <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
              Highly requested pieces this week.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-label-md transition-colors duration-150 group"
            style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-on-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
          >
            Browse Catalog <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 4).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
        </div>
      </section>

      {/* ════ CTA Banner ════ */}
      <section
        className="section"
        style={{ background: 'var(--color-on-surface)', borderTop: '1px solid var(--color-surface-dim)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="page-container flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h2
              className="text-headline-lg"
              style={{ fontStyle: 'italic', color: 'var(--color-primary-fixed-dim)' }}
            >
              Every stitch, intentional.
            </h2>
            <p className="text-body-sm mt-2" style={{ color: 'rgba(243,240,240,0.55)' }}>
              Explore the full Softwear catalogue — from essentials to seasonal statements.
            </p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg flex-shrink-0">
            Shop Everything <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
