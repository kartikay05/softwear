import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
import AuthPage from '../features/auth/pages/AuthPage.jsx';
import OAuthCallbackPage from '../features/auth/pages/OAuthCallbackPage.jsx';
import AdminDashboard from '../features/admin/pages/AdminDashboard.jsx';

// 404 Page
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6">
    <h1 className="text-9xl font-light font-serif italic text-neutral-200">404</h1>
    <h2 className="text-lg font-semibold text-neutral-900 mt-4 mb-2">Page Not Found</h2>
    <p className="text-neutral-500 text-sm mb-6 text-center max-w-sm">The profile page or route you requested does not exist.</p>
    <Link to="/" className="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase">
      Back to Home
    </Link>
  </div>
);

// Router Layout Shell
const AppContent = () => {
  // Silent background token refresh check every 5 minutes
  useTokenRefresh(5 * 60 * 1000);

  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900 mb-4"></div>
        <p className="text-neutral-600 font-medium tracking-wide">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Nav />
      <main className="flex-grow">
        <Routes>
          {/* Public Catalog Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* OAuth Callback */}
          <Route path="/login" element={<AuthPage initialView="login" />} />
          <Route path="/register" element={<AuthPage initialView="register" />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />

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
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
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
