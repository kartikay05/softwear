import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MoveRight, Leaf, RefreshCw, ShieldCheck, Mail } from 'lucide-react';
import { fetchProductsThunk } from '../state/product.slice.js';

/* Fade-up entrance variant for sections */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 4 }));
  }, [dispatch]);

  const categories = [
    {
      name: 'Outerwear',
      img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=700&auto=format&fit=crop',
      link: '/products?category=Outerwear',
      tagline: 'Tailored structures',
    },
    {
      name: 'Knitwear',
      img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=700&auto=format&fit=crop',
      link: '/products?category=Knitwear',
      tagline: 'Fine textures',
    },
    {
      name: 'Basics',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=700&auto=format&fit=crop',
      link: '/products?category=Basics',
      tagline: 'Essential cuts',
    },
    {
      name: 'Accessories',
      img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=700&auto=format&fit=crop',
      link: '/products?category=Accessories',
      tagline: 'Finishing profiles',
    },
  ];

  const values = [
    { Icon: ShieldCheck, title: 'Authentic curation',  body: 'Direct from designers, strictly verified materials.' },
    { Icon: Leaf,        title: 'Sustainably sourced',  body: 'Ethically made from natural, low-impact fibers.' },
    { Icon: RefreshCw,   title: 'Circular fashion',     body: 'Return packaging or old pieces for store credits.' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--sw-surface)', color: 'var(--sw-on-surface)' }} className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] overflow-hidden flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop"
            alt="Softwear S/S26 hero"
            className="w-full h-full object-cover object-[50%_30%] brightness-[0.88]"
          />
          {/* Warm gradient overlay — oatmeal tint from left */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(252,249,248,0.82) 0%, rgba(252,249,248,0.40) 45%, transparent 70%)',
            }}
          />
        </div>

        {/* Hero copy */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <span
              className="text-[11px] uppercase tracking-[0.25em] font-semibold block mb-5"
              style={{ color: 'var(--sw-secondary)', fontFamily: 'var(--font-body)' }}
            >
              Spring / Summer Collection 2026
            </span>
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl leading-[1.02] mb-6"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'var(--sw-on-surface)' }}
            >
              Quiet <br />
              <span
                style={{ fontFamily: 'var(--font-body)', fontStyle: 'normal', fontWeight: 700 }}
              >
                Elevations
              </span>
            </h1>
            <p
              className="text-sm leading-relaxed mb-10 max-w-sm"
              style={{ color: 'var(--sw-on-surface-variant)', fontFamily: 'var(--font-body)' }}
            >
              An inspection of structural shapes, breathable raw materials, and monochromatic silhouettes. Made to adapt.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/products" className="btn-primary">
                Shop Collection
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase group transition-colors"
                style={{ color: 'var(--sw-on-surface)' }}
              >
                Explore S/S26
                <MoveRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Brand credit */}
        <div className="absolute bottom-8 right-8 hidden md:block text-right">
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-medium"
            style={{ color: 'var(--sw-on-surface-variant)' }}
          >
            Softwear Design Studio®
          </p>
        </div>
      </section>

      {/* ── Values Strip ─────────────────────────────────────────────────────── */}
      <section
        className="border-y"
        style={{ borderColor: 'var(--sw-outline-variant)', backgroundColor: 'var(--sw-surface-container-low)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--sw-primary)' }} />
              <div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--sw-on-surface)', fontFamily: 'var(--font-body)' }}>
                  {title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--sw-on-surface-variant)' }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curated Categories ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row justify-between items-baseline mb-12"
        >
          <div>
            <h2
              className="text-3xl sm:text-4xl"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'var(--sw-on-surface)' }}
            >
              Curated Portfolios
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--sw-on-surface-variant)' }}>
              Browse by structural archetype.
            </p>
          </div>
          <Link
            to="/products"
            className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1.5 mt-4 md:mt-0 group"
            style={{ color: 'var(--sw-on-surface-variant)' }}
          >
            View All <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={fadeUp}
              onClick={() => navigate(cat.link)}
              className="group cursor-pointer relative overflow-hidden"
              style={{ borderRadius: 'var(--sw-radius-lg)', aspectRatio: '3/4' }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                style={{ filter: 'saturate(0.7)', transition: 'transform 0.7s ease, filter 0.7s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'saturate(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'saturate(0.7)')}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(27,28,28,0.65) 0%, rgba(27,28,28,0.10) 55%, transparent 100%)' }}
              />
              <div className="absolute bottom-5 left-5 text-white">
                <span
                  className="text-[10px] tracking-[0.18em] uppercase block mb-1"
                  style={{ color: 'var(--sw-primary-fixed-dim)', fontFamily: 'var(--font-body)' }}
                >
                  {cat.tagline}
                </span>
                <h3
                  className="text-lg font-medium"
                  style={{ fontFamily: 'var(--font-headline)', fontWeight: 500 }}
                >
                  {cat.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Brand Ethos ──────────────────────────────────────────────────────── */}
      <section
        className="py-28 border-y"
        style={{ backgroundColor: 'var(--sw-surface-container-low)', borderColor: 'var(--sw-outline-variant)' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          {/* Sage decorative line */}
          <div className="w-10 h-[2px] mx-auto mb-8" style={{ backgroundColor: 'var(--sw-secondary)' }} />
          <blockquote
            className="text-3xl sm:text-4xl mb-8 italic leading-[1.25]"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, color: 'var(--sw-on-surface)' }}
          >
            "Simplicity is the final layer of sophistication."
          </blockquote>
          <p
            className="text-sm leading-relaxed mb-8 max-w-md mx-auto"
            style={{ color: 'var(--sw-on-surface-variant)', fontFamily: 'var(--font-body)' }}
          >
            Softwear creates clothes that perform silently. No loud logos. No unnecessary decorations.
            Just clean cuts, ethically sourced yarns, and precise craftsmanship.
          </p>
          <div className="w-10 h-[2px] mx-auto" style={{ backgroundColor: 'var(--sw-secondary)' }} />
        </motion.div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-between items-baseline mb-12"
        >
          <div>
            <h2
              className="text-3xl sm:text-4xl"
              style={{ fontFamily: 'var(--font-headline)', fontWeight: 500, color: 'var(--sw-on-surface)' }}
            >
              Trending Items
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--sw-on-surface-variant)' }}>
              Highly requested pieces this week.
            </p>
          </div>
          <Link
            to="/products"
            className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1.5 group"
            style={{ color: 'var(--sw-on-surface-variant)' }}
          >
            Browse Catalog <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--sw-radius-lg)' }} />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.slice(0, 4).map((product) => (
              <motion.div key={product._id} variants={fadeUp}>
                <Link to={`/products/${product._id}`} className="group block">
                  {/* Image */}
                  <div
                    className="overflow-hidden mb-4 relative"
                    style={{
                      aspectRatio: '3/4',
                      backgroundColor: 'var(--sw-surface-container-low)',
                      borderRadius: 'var(--sw-radius-lg)',
                    }}
                  >
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
                        No Image Available
                      </div>
                    )}

                    {/* Sale badge — terracotta pill */}
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
                  </div>

                  {/* Metadata */}
                  <div>
                    <span
                      className="text-[10px] uppercase tracking-[0.15em] block truncate"
                      style={{ color: 'var(--sw-secondary)', fontFamily: 'var(--font-body)', fontWeight: 600 }}
                    >
                      {product.brand}
                    </span>
                    <h4
                      className="text-sm mt-0.5 truncate group-hover:underline underline-offset-2"
                      style={{ color: 'var(--sw-on-surface)', fontFamily: 'var(--font-body)', fontWeight: 500 }}
                    >
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      {product.discountPrice ? (
                        <>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: 'var(--sw-primary)' }}
                          >
                            ₹{product.discountPrice}
                          </span>
                          <span
                            className="text-xs line-through"
                            style={{ color: 'var(--sw-outline)' }}
                          >
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold" style={{ color: 'var(--sw-on-surface)' }}>
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Newsletter Strip ──────────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ backgroundColor: 'var(--sw-surface-container)' }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mx-auto px-6 text-center"
        >
          <Mail className="w-7 h-7 mx-auto mb-5" style={{ color: 'var(--sw-primary)' }} />
          <h2
            className="text-3xl sm:text-4xl mb-3 italic"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 400, color: 'var(--sw-on-surface)' }}
          >
            Join The Softwear Circle
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: 'var(--sw-on-surface-variant)', fontFamily: 'var(--font-body)' }}
          >
            Early access to collections, editorial features, and members-only offers.
          </p>
          <form
            className="flex gap-3 max-w-sm mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sw-input rounded"
              style={{ borderRadius: 'var(--sw-radius)' }}
              aria-label="Email address"
            />
            <button type="submit" className="btn-primary !px-5 !py-2.5 shrink-0">
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
