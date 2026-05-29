import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm.jsx';
import { RegisterForm } from './RegisterForm.jsx';
import { GoogleAuthButton } from './GoogleAuthButton.jsx';

export const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView); // 'login' | 'register'

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Image/Decoration area for 'Softwear' brand feel */}
          <div className="h-32 bg-neutral-50 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
             <div className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-neutral-900" />
                <h1 className="text-3xl font-serif italic font-bold tracking-tight text-neutral-900">Softwear</h1>
             </div>
          </div>

          <div className="p-6 sm:p-8 pt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">
                {view === 'login' ? 'Welcome back' : 'Join the club'}
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {view === 'login' ? 'Enter your details to access your account' : 'Create an account to track your orders'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-neutral-100/80 rounded-xl mb-6 relative">
              <button
                onClick={() => setView('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${view === 'login' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setView('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${view === 'register' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                Register
              </button>
              
              {/* Animated Tab Indicator */}
              <motion.div
                layoutId="tab-indicator"
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
                initial={false}
                animate={{
                  left: view === 'login' ? '4px' : '50%',
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>

            {/* Form Container with animation */}
            <div className="overflow-hidden relative">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={view}
                   initial={{ opacity: 0, x: view === 'login' ? -20 : 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: view === 'login' ? 20 : -20 }}
                   transition={{ duration: 0.2 }}
                 >
                   {view === 'login' ? (
                     <LoginForm onSuccess={onClose} />
                   ) : (
                     <RegisterForm onSuccess={onClose} />
                   )}
                 </motion.div>
               </AnimatePresence>
            </div>

            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <GoogleAuthButton />
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
