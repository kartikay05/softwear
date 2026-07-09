import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm }        from './LoginForm.jsx';
import { RegisterForm }     from './RegisterForm.jsx';
import { GoogleAuthButton } from './GoogleAuthButton.jsx';

export const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);

  // Sync view when initialView prop changes
  useEffect(() => { setView(initialView); }, [initialView]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else        document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        /* Full-viewport overlay — scrolls on tiny screens */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ padding: '0.75rem' }}
        >
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: 'rgba(27,28,28,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Card — scrolls internally when content is taller than viewport */}
          <motion.div
            key="auth-card"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full overflow-y-auto"
            style={{
              maxWidth: '440px',
              maxHeight: 'calc(100vh - 1.5rem)',
              background: 'var(--color-surface-container-lowest)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center transition-all duration-150"
              style={{
                background: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-on-surface-variant)',
              }}
              aria-label="Close"
            >
              <X size={15} />
            </button>

            {/* Brand Header */}
            <div
              className="flex items-center justify-center relative overflow-hidden"
              style={{
                height: '100px',
                background: 'var(--color-surface-container-low)',
                borderBottom: '1px solid var(--color-outline-variant)',
              }}
            >
              {/* Subtle dot texture */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(var(--color-outline-variant) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  opacity: 0.5,
                }}
              />
              <div className="relative z-10 text-center">
                <h1
                  className="text-headline-lg"
                  style={{ fontStyle: 'italic', color: 'var(--color-on-surface)', lineHeight: 1 }}
                >
                  Softwear
                </h1>
                <p
                  className="text-label-sm mt-1"
                  style={{ color: 'var(--color-on-surface-variant)', letterSpacing: '0.15em' }}
                >
                  Design Studio®
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Title */}
              <div className="text-center mb-5">
                <h2
                  className="text-headline-sm"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {view === 'login' ? 'Welcome back' : 'Join the Club'}
                </h2>
                <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {view === 'login'
                    ? 'Enter your details to access your account.'
                    : 'Create an account to track your orders.'}
                </p>
              </div>

              {/* Tab Switch */}
              <div
                className="relative flex mb-5"
                style={{
                  background: 'var(--color-surface-container-low)',
                  borderRadius: 'var(--radius-md)',
                  padding: '4px',
                }}
              >
                {['login', 'register'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setView(tab)}
                    className="flex-1 relative z-10 py-2 text-body-sm transition-colors duration-150"
                    style={{
                      fontWeight: view === tab ? 600 : 400,
                      color: view === tab ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {tab === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
                {/* Sliding pill */}
                <motion.div
                  layoutId="auth-tab-pill"
                  animate={{ left: view === 'login' ? '4px' : '50%' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)]"
                  style={{
                    background: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                />
              </div>

              {/* Animated Form */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, x: view === 'login' ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: view === 'login' ? 16 : -16 }}
                    transition={{ duration: 0.18 }}
                  >
                    {view === 'login'
                      ? <LoginForm    onSuccess={onClose} />
                      : <RegisterForm onSuccess={onClose} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div
                    className="w-full"
                    style={{ borderTop: '1px solid var(--color-outline-variant)' }}
                  />
                </div>
                <div className="relative flex justify-center">
                  <span
                    className="px-3 text-body-sm"
                    style={{
                      background: 'var(--color-surface-container-lowest)',
                      color: 'var(--color-on-surface-variant)',
                    }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleAuthButton />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
