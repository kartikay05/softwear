import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/index.js';
import { AuthModal } from '../../auth/components/index.js';
import { fetchCartThunk } from '../../cart/state/cart.slice.js';

export const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  // Cart state for badge count
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    }
  }, [dispatch, isAuthenticated]);

  const openLogin = () => { setAuthView('login'); setIsAuthOpen(true); };
  const openRegister = () => { setAuthView('register'); setIsAuthOpen(true); };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neutral-700" />
              <span className="text-2xl font-serif italic font-bold tracking-tighter text-neutral-900">
                Softwear
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Collections</Link>
              <Link to="/products?sort=-createdAt" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">New Arrivals</Link>
              <Link to="/products?category=Basics" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Essentials</Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="text-xs font-bold uppercase tracking-wider text-neutral-900 px-3 py-1 bg-neutral-100 border border-neutral-200">
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200 transition-all">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-neutral-600" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-xs font-bold tracking-wider uppercase text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-white bg-neutral-950 hover:bg-neutral-800 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Shopping Cart Bag */}
              <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neutral-950 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-neutral-600">Collections</Link>
                <Link to="/products?sort=-createdAt" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-neutral-600">New Arrivals</Link>
                <Link to="/products?category=Basics" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-neutral-600">Essentials</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-neutral-600">Wishlist</Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-neutral-600">Shopping Bag ({cartItemsCount})</Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-neutral-900">Admin Dashboard</Link>
                )}
                <hr className="border-neutral-100" />
                {isAuthenticated ? (
                  <div className="flex justify-between items-center">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase text-neutral-700">My Profile</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => { setMobileMenuOpen(false); openLogin(); }} className="flex-1 py-2 text-xs font-semibold border border-neutral-200 text-center uppercase tracking-wider">Sign In</button>
                    <button onClick={() => { setMobileMenuOpen(false); openRegister(); }} className="flex-1 py-2 text-xs font-semibold bg-neutral-950 text-white text-center uppercase tracking-wider">Register</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* The Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};

export default Nav;
