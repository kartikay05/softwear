import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/index.js';
import { AuthModal } from '../../auth/components/index.js';

/**
 * ProtectedRoute wraps any component/page that requires authentication.
 *
 * If the auth state is still loading, it renders a subtle loading skeleton.
 * If the user is not authenticated, it renders the AuthModal inline by default.
 */
export const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full animate-bounce" />
          </div>
          <p className="text-sm text-neutral-400">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) return fallback;

    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-neutral-700">
            You need to be signed in to view this page.
          </p>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView="login"
        />
      </div>
    );
  }

  return children;
};
