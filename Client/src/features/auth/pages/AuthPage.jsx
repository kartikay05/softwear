import { Navigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthModal } from '../components/index.js';
import { useAuth } from '../hooks/index.js';

export const AuthPage = ({ initialView = 'login' }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/profile'} replace />;
  }

  return (
    <div className="min-h-[70vh] bg-neutral-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-neutral-900 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-2xl font-serif italic font-bold tracking-tighter">Softwear</span>
        </div>
        <p className="text-sm text-neutral-500">
          {initialView === 'login' ? 'Sign in to continue shopping.' : 'Create your account to track orders and wishlist pieces.'}
        </p>
      </div>
      <AuthModal isOpen onClose={() => {}} initialView={initialView} />
    </div>
  );
};

export default AuthPage;
