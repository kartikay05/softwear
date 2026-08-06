import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Styling
import "./App.css";

// Auth Hooks and Thunks
import { checkAuthThunk } from '../features/auth/state/auth.slice.js';
import { useTokenRefresh } from '../features/auth/hooks/index.js';

// Shared Components
import { ErrorBoundary } from '../features/shared/components/ErrorBoundary.jsx';
import { Nav }           from '../features/shared/components/Nav.jsx';
import { Footer }        from '../features/shared/components/Footer.jsx';
import { ProtectedRoute } from '../features/shared/components/ProtectedRoute.jsx';
import { AdminRoute }     from '../features/shared/components/AdminRoute.jsx';

// Pages
import HomePage         from '../features/products/pages/HomePage.jsx';
import ProductListPage  from '../features/products/pages/ProductListPage.jsx';
import ProductDetailPage from '../features/products/pages/ProductDetailPage.jsx';
import WishlistPage     from '../features/products/pages/WishlistPage.jsx';
import CartPage         from '../features/cart/pages/CartPage.jsx';
import CheckoutPage     from '../features/orders/pages/CheckoutPage.jsx';
import OrderSuccessPage from '../features/orders/pages/OrderSuccessPage.jsx';
import ProfilePage      from '../features/auth/pages/ProfilePage.jsx';
import AuthPage         from '../features/auth/pages/AuthPage.jsx';
import OAuthCallbackPage from '../features/auth/pages/OAuthCallbackPage.jsx';
import AdminDashboard   from '../features/admin/pages/AdminDashboard.jsx';

// ── 404 Page ────────────────────────────────────────────────
const NotFoundPage = () => (
  <div
    className="animate-fadeIn flex flex-col items-center justify-center"
    style={{ minHeight: '70vh', background: 'var(--color-background)', padding: '3rem 1.5rem' }}
  >
    <p
      className="text-headline-display"
      style={{ color: 'var(--color-surface-container-highest)', fontStyle: 'italic', fontSize: '8rem', lineHeight: 1 }}
    >
      404
    </p>
    <h1
      className="text-headline-sm mt-4 mb-2"
      style={{ color: 'var(--color-on-surface)' }}
    >
      Page Not Found
    </h1>
    <p
      className="text-body-sm mb-8 text-center"
      style={{ color: 'var(--color-on-surface-variant)', maxWidth: '28rem' }}
    >
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn btn-primary">
      Back to Home
    </Link>
  </div>
);

// ── Loading Spinner ──────────────────────────────────────────
const AppLoading = () => (
  <div
    className="flex flex-col items-center justify-center"
    style={{ minHeight: '100vh', background: 'var(--color-background)' }}
  >
    <div className="spinner spinner-lg mb-4" />
    <p
      className="text-label-md animate-pulse-soft"
      style={{ color: 'var(--color-on-surface-variant)' }}
    >
      Loading…
    </p>
  </div>
);

// ── Storefront Layout (with Nav + Footer) ────────────────────
const StorefrontLayout = ({ children }) => (
  <div
    className="flex flex-col"
    style={{ minHeight: '100vh', background: 'var(--color-background)' }}
  >
    <Nav />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// ── Router Content ───────────────────────────────────────────
const AppContent = () => {
  useTokenRefresh(); // defaults to 14 min, just under the 15m access-token expiry
  const { loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <AppLoading />;

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin routes get their own full-screen layout (no Nav/Footer)
  if (isAdminRoute) {
    return (
      <>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
            },
          }}
        />
      </>
    );
  }

  // All other routes use the storefront layout
  return (
    <StorefrontLayout>
      <Routes>
        {/* Public Catalog */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/products"  element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/wishlist"  element={<WishlistPage />} />
        <Route path="/cart"      element={<CartPage />} />

        {/* Auth */}
        <Route path="/login"         element={<AuthPage initialView="login" />} />
        <Route path="/register"      element={<AuthPage initialView="register" />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* Protected Buyer */}
        <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'var(--font-body)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
          },
        }}
      />
    </StorefrontLayout>
  );
};

// ── Root App ─────────────────────────────────────────────────
export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
