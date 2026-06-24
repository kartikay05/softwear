import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu, X, Heart, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/index.js';
import { AuthModal } from '../../auth/components/index.js';
import { fetchCartThunk } from '../../cart/state/cart.slice.js';

export const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Cart state for badge count
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const openLogin    = () => { setAuthView('login');    setIsAuthOpen(true); };
  const openRegister = () => { setAuthView('register'); setIsAuthOpen(true); };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));

  const navLinkClass = (path) =>
    `relative text-sm transition-colors duration-200 group ${
      isActive(path)
        ? 'text-[#1b1c1c] font-semibold'
        : 'text-[#56423d] hover:text-[#1b1c1c]'
    }`;

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{ backgroundColor: 'var(--sw-secondary)', color: 'var(--sw-on-secondary)' }}
        className="w-full py-2 text-center text-[11px] font-medium tracking-[0.08em] uppercase"
      >
        Free shipping on orders over ₹2,999 &nbsp;·&nbsp; New S/S26 Collection Now Live
      </div>

      {/* Main Nav */}
      <nav
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? 'rgba(252, 249, 248, 0.92)'
            : 'var(--sw-surface)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: `1px solid var(--sw-outline-variant)`,
          boxShadow: scrolled ? 'var(--sw-shadow-warm)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand Wordmark */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Softwear home">
              <Sparkles
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                style={{ color: 'var(--sw-primary)' }}
              />
              <span
                className="text-2xl font-light tracking-tighter"
                style={{ fontFamily: 'var(--font-headline)', color: 'var(--sw-on-surface)', fontStyle: 'italic' }}
              >
                Softwear
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Collections', path: '/products' },
                { label: 'New Arrivals', path: '/products?sort=-createdAt' },
                { label: 'Essentials', path: '/products?category=Basics' },
              ].map(({ label, path }) => (
                <Link key={label} to={path} className={navLinkClass(path)}>
                  {label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: 'var(--sw-primary)' }}
                  />
                </Link>
              ))}
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--sw-surface-container)',
                    color: 'var(--sw-on-surface)',
                    border: `1px solid var(--sw-outline-variant)`,
                  }}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Auth & Icons */}
            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <div
                  className="w-8 h-8 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--sw-surface-container)' }}
                />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--sw-surface-container-low)',
                      border: `1px solid var(--sw-outline-variant)`,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: 'var(--sw-surface-container-high)' }}
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3" style={{ color: 'var(--sw-on-surface-variant)' }} />
                      )}
                    </div>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--sw-on-surface-variant)' }}
                    >
                      {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full transition-all duration-200 hover:bg-red-50"
                    style={{ color: 'var(--sw-outline)' }}
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-[11px] font-semibold tracking-widest uppercase transition-colors duration-200"
                    style={{ color: 'var(--sw-on-surface-variant)' }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="btn-primary !py-2 !px-4 !text-[11px]"
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'var(--sw-on-surface-variant)' }}
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              {/* Cart Bag with terracotta badge */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'var(--sw-on-surface-variant)' }}
                aria-label={`Shopping bag, ${cartItemsCount} items`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: 'var(--sw-primary)', color: 'var(--sw-on-primary)' }}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>

            {/* Mobile: Cart + Menu Toggle */}
            <div className="md:hidden flex items-center gap-1">
              <Link
                to="/cart"
                className="relative p-2 rounded-lg"
                style={{ color: 'var(--sw-on-surface-variant)' }}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: 'var(--sw-primary)', color: 'var(--sw-on-primary)' }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--sw-on-surface-variant)' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: `1px solid var(--sw-outline-variant)`, backgroundColor: 'var(--sw-surface)' }}
            >
              <div className="px-5 py-5 space-y-4">
                {[
                  { label: 'Collections', path: '/products' },
                  { label: 'New Arrivals', path: '/products?sort=-createdAt' },
                  { label: 'Essentials', path: '/products?category=Basics' },
                  { label: 'Wishlist', path: '/wishlist' },
                ].map(({ label, path }) => (
                  <Link
                    key={label}
                    to={path}
                    className="block text-sm font-medium transition-colors"
                    style={{ color: isActive(path) ? 'var(--sw-primary)' : 'var(--sw-on-surface-variant)' }}
                  >
                    {label}
                  </Link>
                ))}
                {isAuthenticated && user?.role === 'admin' && (
                  <Link to="/admin" className="block text-sm font-semibold" style={{ color: 'var(--sw-on-surface)' }}>
                    Admin Dashboard
                  </Link>
                )}
                <hr style={{ borderColor: 'var(--sw-outline-variant)' }} />
                {isAuthenticated ? (
                  <div className="flex justify-between items-center">
                    <Link
                      to="/profile"
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: 'var(--sw-on-surface-variant)' }}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--sw-error)' }}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={openLogin}
                      className="flex-1 py-2.5 text-[11px] font-semibold text-center uppercase tracking-widest rounded"
                      style={{ border: `1.5px solid var(--sw-outline-variant)`, color: 'var(--sw-on-surface)' }}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={openRegister}
                      className="flex-1 btn-primary !py-2.5 !text-[11px]"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};

export default Nav;
