import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRegister } from '../hooks/index.js';

export const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser, loading, error } = useRegister();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);

  const password = watch("password", "");
  
  // Simple password strength calculator
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };
  
  const strengthScore = getStrength(password);
  const strengthColors = ["bg-neutral-200", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  const currentStrengthColor = password.length > 0 ? strengthColors[strengthScore] : "bg-neutral-200";

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      // Error handled by hook
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center space-y-4"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-medium text-neutral-900">Welcome to Softwear</h3>
          <p className="text-neutral-500 text-sm mt-1">Your account has been created successfully.</p>
        </div>
      </motion.div>
    );
  }

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
        <label className="text-sm font-medium text-neutral-700">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Min 3 characters' }})}
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
            placeholder="John Doe"
          />
        </div>
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
              type="password"
              className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          {/* Password Strength Indicator */}
          <div className="flex gap-1 mt-1.5 h-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex-1 rounded-full ${i <= Math.max(1, strengthScore) && password.length > 0 ? currentStrengthColor : 'bg-neutral-200'} transition-colors duration-300`} />
            ))}
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">Contact</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              {...register('contact', { 
                required: 'Phone is required',
                pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' }
              })}
              type="tel"
              className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
              placeholder="10-digit number"
            />
          </div>
          {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          {...register('isSeller')}
          type="checkbox"
          id="isSeller"
          className="w-4 h-4 text-neutral-900 bg-neutral-100 border-neutral-300 rounded focus:ring-neutral-900 focus:ring-2 cursor-pointer"
        />
        <label htmlFor="isSeller" className="text-sm text-neutral-600 cursor-pointer select-none">
          Register as Seller account
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
      </button>
    </form>
  );
};
