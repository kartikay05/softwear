import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Package, Shield, Truck } from 'lucide-react';
import "./App.css"
import { checkAuthThunk } from '../features/auth/state/auth.slice.js';
import { useAuth, useTokenRefresh } from '../features/auth/hooks/index.js';
import { ProtectedRoute } from '../features/shared/components/ProtectedRoute.jsx';
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary.jsx';
import { Nav } from '../features/shared/components/Nav.jsx';

/**
 * AccountDashboard — a protected page only visible to authenticated users.
 * Demonstrates how ProtectedRoute + useAuth() work together.
 */
const AccountDashboard = () => {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-neutral-200">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-neutral-500">
                {user?.fullName?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{user?.fullName}</h2>
            <p className="text-sm text-neutral-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
              {user?.role || 'Buyer'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Package, label: 'Orders', value: '0' },
            { icon: Star, label: 'Wishlist', value: '0' },
            { icon: ShoppingBag, label: 'Cart Items', value: '0' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 bg-neutral-50 rounded-2xl text-center">
              <Icon className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-neutral-900">{value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * HeroSection — the public-facing landing page hero.
 */
const HeroSection = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full mb-6 tracking-widest uppercase">
        New Season — SS&apos;26
      </span>
      <h1 className="text-5xl sm:text-7xl font-serif italic font-bold text-neutral-900 leading-tight tracking-tight mb-6">
        Wear the
        <br />
        <span className="text-neutral-400">Difference</span>
      </h1>
      <p className="max-w-lg mx-auto text-neutral-500 text-lg leading-relaxed mb-10">
        Premium fashion, thoughtfully designed. Pieces that move with you through every season.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 text-white font-medium rounded-2xl hover:bg-neutral-700 transition-colors">
          Shop Collection <ArrowRight className="w-4 h-4" />
        </button>
        <button className="w-full sm:w-auto px-8 py-3.5 border border-neutral-200 text-neutral-700 font-medium rounded-2xl hover:bg-neutral-50 transition-colors">
          Explore Looks
        </button>
      </div>
    </motion.div>

    {/* Feature Badges */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
    >
      {[
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹999' },
        { icon: Shield, title: 'Secure Payments', desc: '100% safe transactions' },
        { icon: Package, title: 'Easy Returns', desc: '30-day hassle-free returns' },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex flex-col items-center gap-2 p-5 bg-neutral-50 rounded-2xl">
          <Icon className="w-5 h-5 text-neutral-500" />
          <p className="text-sm font-semibold text-neutral-800">{title}</p>
          <p className="text-xs text-neutral-500">{desc}</p>
        </div>
      ))}
    </motion.div>
  </section>
);

/**
 * AppContent — inner app shell.
 * Runs token refresh silently and conditionally shows protected content.
 */
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // 🔄 Silent background token refresh check every 5 minutes.
  useTokenRefresh(5 * 60 * 1000);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <HeroSection />

        {/* Protected section — only renders when authenticated */}
        {isAuthenticated && (
          <section className="bg-neutral-50 border-t border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h2 className="text-lg font-semibold text-neutral-700 mb-1">My Account</h2>
              <p className="text-sm text-neutral-400 mb-6">Your personal dashboard</p>
            </div>
            <ProtectedRoute>
              <AccountDashboard />
            </ProtectedRoute>
          </section>
        )}
      </main>
    </div>
  );
};

/**
 * App — root component.
 */
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user session cookie is valid on load
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;