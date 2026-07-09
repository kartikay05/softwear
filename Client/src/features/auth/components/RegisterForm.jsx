import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRegister } from '../hooks/index.js';

const inputBase = {
  width: '100%',
  paddingLeft: '2.5rem',
  paddingRight: '0.875rem',
  paddingTop: '0.625rem',
  paddingBottom: '0.625rem',
  border: '1.5px solid var(--color-outline-variant)',
  borderRadius: 'var(--radius)',
  background: 'var(--color-surface-container-low)',
  color: 'var(--color-on-surface)',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 150ms ease',
  boxSizing: 'border-box',
};

const InputField = ({ icon: Icon, error, children, label }) => (
  <div>
    <label
      className="text-label-sm block mb-1.5"
      style={{ color: 'var(--color-on-surface-variant)' }}
    >
      {label}
    </label>
    <div className="relative">
      <div
        className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
        style={{ paddingLeft: '0.75rem' }}
      >
        <Icon size={16} style={{ color: 'var(--color-on-surface-variant)' }} />
      </div>
      {children}
    </div>
    {error && (
      <p className="text-body-sm mt-1" style={{ color: 'var(--color-error)', fontSize: '0.75rem' }}>
        {error}
      </p>
    )}
  </div>
);

const STRENGTH_COLORS = [
  'var(--color-surface-container-high)',
  'var(--color-error)',
  '#e67e22',
  '#f39c12',
  'var(--color-secondary)',
  'var(--color-success)',
];

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

export const RegisterForm = ({ onSuccess }) => {
  const { register: registerUser, loading, error } = useRegister();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [success, setSuccess] = useState(false);

  const password = watch('password', '');

  const getStrength = (p) => {
    let s = 0;
    if (p.length > 5)          s++;
    if (p.length > 8)          s++;
    if (/[A-Z]/.test(p))       s++;
    if (/[0-9]/.test(p))       s++;
    if (/[^A-Za-z0-9]/.test(p))s++;
    return s;
  };
  const strengthScore = getStrength(password);
  const strengthColor = password.length > 0
    ? STRENGTH_COLORS[strengthScore]
    : STRENGTH_COLORS[0];

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setSuccess(true);
      setTimeout(() => { if (onSuccess) onSuccess(); }, 1800);
    } catch (_) { /* handled by hook */ }
  };

  // ── Success state ──
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center gap-4"
      >
        <div
          className="w-16 h-16 flex items-center justify-center"
          style={{
            background: 'var(--color-success-container)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-success)',
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h3 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
            Welcome to Softwear
          </h3>
          <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
            Your account was created successfully.
          </p>
        </div>
      </motion.div>
    );
  }

  const focusHandler  = (e) => { e.target.style.borderColor = 'var(--color-primary-container)'; };
  const blurHandler   = (fieldErr) => (e) => {
    e.target.style.borderColor = fieldErr ? 'var(--color-error)' : 'var(--color-outline-variant)';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Server error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3"
            style={{
              background: 'var(--color-error-container)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-error)',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <p className="text-body-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Name */}
      <InputField icon={User} label="Full Name" error={errors.fullName?.message}>
        <input
          {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Min 3 characters' } })}
          type="text"
          style={inputBase}
          placeholder="Jane Doe"
          onFocus={focusHandler}
          onBlur={blurHandler(errors.fullName)}
        />
      </InputField>

      {/* Email */}
      <InputField icon={Mail} label="Email address" error={errors.email?.message}>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' },
          })}
          type="email"
          style={inputBase}
          placeholder="you@example.com"
          onFocus={focusHandler}
          onBlur={blurHandler(errors.email)}
        />
      </InputField>

      {/* Password — full width on mobile, responsive */}
      <InputField icon={Lock} label="Password" error={errors.password?.message}>
        <input
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          type="password"
          style={inputBase}
          placeholder="••••••••"
          onFocus={focusHandler}
          onBlur={blurHandler(errors.password)}
        />
        {/* Strength indicator */}
        {password.length > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex gap-1 flex-1 h-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-300"
                  style={{
                    background: i <= strengthScore ? strengthColor : 'var(--color-surface-container-high)',
                  }}
                />
              ))}
            </div>
            <span
              className="text-body-sm flex-shrink-0"
              style={{ fontSize: '0.7rem', color: strengthColor, fontWeight: 600 }}
            >
              {STRENGTH_LABELS[strengthScore]}
            </span>
          </div>
        )}
      </InputField>

      {/* Contact — full width so it's readable on mobile */}
      <InputField icon={Phone} label="Phone Number" error={errors.contact?.message}>
        <input
          {...register('contact', {
            required: 'Phone is required',
            pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' },
          })}
          type="tel"
          style={inputBase}
          placeholder="10-digit number"
          onFocus={focusHandler}
          onBlur={blurHandler(errors.contact)}
        />
      </InputField>

      {/* Seller checkbox */}
      <div className="flex items-center gap-3 pt-1">
        <input
          {...register('isSeller')}
          type="checkbox"
          id="isSeller"
          className="w-4 h-4 cursor-pointer"
          style={{
            accentColor: 'var(--color-primary-container)',
            borderRadius: 'var(--radius-sm)',
          }}
        />
        <label
          htmlFor="isSeller"
          className="text-body-sm cursor-pointer select-none"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Register as a Seller account
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full mt-2"
        style={{ justifyContent: 'center' }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
