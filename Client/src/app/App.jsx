import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Styling
import "./App.css";

// Auth Hooks and Thunks
import { checkAuthThunk } from '../features/auth/state/auth.slice.js';
import { useTokenRefresh } from '../features/auth/hooks/index.js';

// Shared Components
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary.jsx';
import { Nav } from '../features/shared/components/Nav.jsx';
import { Footer } from '../features/shared/components/Footer.jsx';
import { ProtectedRoute } from '../features/shared/components/ProtectedRoute.jsx';
import { AdminRoute } from '../features/shared/components/AdminRoute.jsx';

// Pages
import HomePage from '../features/products/pages/HomePage.jsx';
import ProductListPage from '../features/products/pages/ProductListPage.jsx';
import ProductDetailPage from '../features/products/pages/ProductDetailPage.jsx';
import WishlistPage from '../features/products/pages/WishlistPage.jsx';
import CartPage from '../features/cart/pages/CartPage.jsx';
import CheckoutPage from '../features/orders/pages/CheckoutPage.jsx';
import OrderSuccessPage from '../features/orders/pages/OrderSuccessPage.jsx';
import ProfilePage from '../features/auth/pages/ProfilePage.jsx';
import AdminDashboard from '../features/admin/pages/AdminDashboard.jsx';

// 404 Page — Stitch design system
const NotFoundPage = () => (
  <div
    className="min-h-[70vh] flex flex-col items-center justify-center px-6"
    style={{ backgroundColor: 'var(--sw-surface)' }}
  >
    <h1
      className="text-[10rem] leading-none italic"
      style={{ fontFamily: 'var(--font-headline)', color: 'var(--sw-surface-container-high)', fontWeight: 400 }}
    >
      404
    </h1>
    <h2 className="text-lg font-semibold mt-4 mb-2" style={{ color: 'var(--sw-on-surface)', fontFamily: 'var(--font-body)' }}>
      Page Not Found
    </h2>
    <p className="text-sm mb-8 text-center max-w-sm" style={{ color: 'var(--sw-on-surface-variant)' }}>
      The page or route you requested does not exist.
    </p>
    <Link to="/" className="btn-primary">
      Back to Home
    </Link>
  </div>
);

// Router Layout Shell
const AppContent = () => {
  // Silent background token refresh check every 5 minutes
  useTokenRefresh(5 * 60 * 1000);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--sw-surface)' }}>
      <Nav />
      <main className="flex-grow">
        <Routes>
          {/* Public Catalog Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Protected Buyer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            backgroundColor: 'var(--sw-inverse-surface)',
            color: 'var(--sw-inverse-on-surface)',
            borderRadius: 'var(--sw-radius)',
            boxShadow: 'var(--sw-shadow-warm)',
          },
          success: {
            iconTheme: { primary: 'var(--sw-secondary)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: 'var(--sw-error)', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};

// Root App Component
export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Verify user session cookie on mount
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;