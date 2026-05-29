import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../auth/hooks/index.js';
import { AuthModal } from '../../auth/components/index.js';

/**
 * Global navigation bar for the Softwear e-commerce platform.
 * Reactively shows auth state from the Redux store via useAuth().
 */
export const Nav = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openLogin = () => { setAuthView('login'); setIsAuthOpen(true); };
  const openRegister = () => { setAuthView('register'); setIsAuthOpen(true); };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neutral-700" />
              <span className="text-2xl font-serif italic font-bold tracking-tighter text-neutral-900">
                Softwear
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Collections</a>
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">New Arrivals</a>
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Sale</a>
            </div>

            {/* Auth Controls */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-200">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3 h-3 text-neutral-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-700 rounded-xl transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
              <button className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </button>
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
                <a href="#" className="block text-sm text-neutral-600">Collections</a>
                <a href="#" className="block text-sm text-neutral-600">New Arrivals</a>
                <a href="#" className="block text-sm text-neutral-600">Sale</a>
                <hr className="border-neutral-100" />
                {isAuthenticated ? (
                  <button onClick={logout} className="flex items-center gap-2 text-sm text-red-500">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={openLogin} className="flex-1 py-2 text-sm border border-neutral-200 rounded-xl text-center">Sign In</button>
                    <button onClick={openRegister} className="flex-1 py-2 text-sm bg-neutral-900 text-white rounded-xl text-center">Register</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* The Auth Modal — mounted at Nav level to be globally accessible */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
};
