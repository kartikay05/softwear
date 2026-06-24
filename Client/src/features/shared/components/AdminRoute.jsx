import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/index.js';

/**
 * AdminRoute wraps any dashboard pages restricted to Administrator accounts.
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce" />
          </div>
          <p className="text-sm text-neutral-400">Verifying privileges…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
