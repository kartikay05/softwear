import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useLogin } from '../hooks/index.js';

export const LoginForm = ({ onSuccess }) => {
  const { login, loading, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error is handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">Email address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' }
            })}
            type="email"
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            {...register('password', { required: 'Password is required' })}
            type="password"
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="••••••••"
          />
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
      </button>
    </form>
  );
};
