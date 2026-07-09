import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu, X, Heart, ChevronDown, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/index.js';
import { AuthModal } from '../../auth/components/index.js';
import { fetchCartThunk } from '../../cart/state/cart.slice.js';

const NAV_LINKS = [
  { label: 'Collections', href: '/products' },
  { label: 'New Arrivals', href: '/products?sort=-createdAt' },
  { label: 'Essentials', href: '/products?category=Basics' },
];

export const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, logout } = useAuth();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCartThunk());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const openLogin    = () => { setAuthView('login');    setIsAuthOpen(true); };
  const openRegister = () => { setAuthView('register'); setIsAuthOpen(true); };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const firstName = user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Account';

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(252, 249, 248, 0.95)'
            : 'rgba(252, 249, 248, 0.80)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${scrolled ? 'var(--color-outline-variant)' : 'transparent'}`,
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">

            {/* ── Brand ── */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              style={{ textDecoration: 'none' }}
            >
              <motion.span
                className="text-headline-md"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-on-surface)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
                whileHover={{ letterSpacing: '0.01em' }}
                transition={{ duration: 0.3 }}
              >
                Softwear
              </motion.span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-body-sm transition-colors duration-200 relative group"
                  style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-on-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                    style={{ background: 'var(--color-primary-container)' }}
                  />
                </Link>
              ))}

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-label-sm px-3 py-1 transition-all duration-200"
                  style={{
                    color: 'var(--color-primary-dark)',
                    background: 'var(--color-primary-fixed)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-primary-fixed-dim)',
                    textDecoration: 'none',
                  }}
                >
                  <Shield size={11} />
                  Admin
                </Link>
              )}
            </div>

            {/* ── Right Controls ── */}
            <div className="hidden md:flex items-center gap-1">

              {/* Auth state */}
              {loading ? (
                <div className="w-8 h-8 rounded-full skeleton" />
              ) : isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 transition-all duration-200"
                    style={{
                      background: userMenuOpen ? 'var(--color-surface-container)' : 'transparent',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => { if (!userMenuOpen) e.currentTarget.style.background = 'var(--color-surface-container-low)'; }}
                    onMouseLeave={(e) => { if (!userMenuOpen) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div
                      className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--color-surface-container-high)' }}
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={13} style={{ color: 'var(--color-on-surface-variant)' }} />
                      )}
                    </div>
                    <span className="text-label-sm" style={{ color: 'var(--color-on-surface)' }}>
                      {firstName}
                    </span>
                    <ChevronDown
                      size={12}
                      style={{
                        color: 'var(--color-on-surface-variant)',
                        transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms',
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 overflow-hidden"
                        style={{
                          background: 'var(--color-surface-container-lowest)',
                          border: '1px solid var(--color-outline-variant)',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-body-sm transition-colors duration-150"
                          style={{ color: 'var(--color-on-surface)', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-container-low)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <User size={14} style={{ color: 'var(--color-on-surface-variant)' }} />
                          My Profile
                        </Link>
                        <div className="divider" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 w-full text-left text-body-sm transition-colors duration-150"
                          style={{ color: 'var(--color-error)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-container)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openLogin}
                    className="text-label-sm px-4 py-2 transition-colors duration-200"
                    style={{ color: 'var(--color-on-surface-variant)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-on-surface)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                  >
                    Sign In
                  </button>
                  <button onClick={openRegister} className="btn btn-primary btn-sm">
                    Get Started
                  </button>
                </div>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 flex items-center justify-center transition-all duration-200"
                style={{ color: 'var(--color-on-surface-variant)', borderRadius: 'var(--radius)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.background = 'var(--color-surface-container-low)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Heart size={18} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 flex items-center justify-center transition-all duration-200 relative"
                style={{ color: 'var(--color-on-surface-variant)', borderRadius: 'var(--radius)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.background = 'var(--color-surface-container-low)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      key={cartItemsCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)' }}
                    >
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>

            {/* ── Mobile Toggle ── */}
            <div className="md:hidden flex items-center gap-2">
              {/* Cart icon for mobile */}
              <Link
                to="/cart"
                className="relative p-2"
                style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}
              >
                <ShoppingBag size={18} />
                {cartItemsCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)' }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 transition-all duration-200"
                style={{
                  color: 'var(--color-on-surface-variant)',
                  background: mobileMenuOpen ? 'var(--color-surface-container)' : 'transparent',
                  borderRadius: 'var(--radius)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-lowest)' }}
            >
              <div className="px-5 py-5 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-3 py-2.5 text-body-sm transition-colors duration-150"
                    style={{ color: 'var(--color-on-surface-variant)', borderRadius: 'var(--radius)', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-container-low)'; e.currentTarget.style.color = 'var(--color-on-surface)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-on-surface-variant)'; }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-3 py-2.5 text-body-sm transition-colors duration-150"
                  style={{ color: 'var(--color-on-surface-variant)', borderRadius: 'var(--radius)', textDecoration: 'none' }}
                >
                  <Heart size={15} /> Wishlist
                </Link>

                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2.5 text-body-sm"
                    style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}
                  >
                    <Shield size={14} /> Admin Dashboard
                  </Link>
                )}

                <div className="divider my-3" />

                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-body-sm"
                      style={{ color: 'var(--color-on-surface)', textDecoration: 'none' }}
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center" style={{ background: 'var(--color-surface-container-high)' }}>
                        {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User size={13} />}
                      </div>
                      {firstName}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-body-sm"
                      style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 px-1">
                    <button onClick={openLogin} className="btn btn-secondary flex-1">Sign In</button>
                    <button onClick={openRegister} className="btn btn-primary flex-1">Get Started</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
    </>
  );
};

export default Nav;
