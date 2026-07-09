import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useLogin } from '../hooks/index.js';

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
      <p className="text-body-sm mt-1" style={{ color: 'var(--color-error)' }}>
        {error}
      </p>
    )}
  </div>
);

export const LoginForm = ({ onSuccess }) => {
  const { login, loading, error } = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      if (onSuccess) onSuccess();
    } catch (_) { /* handled by hook */ }
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
          onFocus={(e)  => { e.target.style.borderColor = 'var(--color-primary-container)'; }}
          onBlur={(e)   => { e.target.style.borderColor = errors.email ? 'var(--color-error)' : 'var(--color-outline-variant)'; }}
        />
      </InputField>

      {/* Password */}
      <InputField icon={Lock} label="Password" error={errors.password?.message}>
        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          style={inputBase}
          placeholder="••••••••"
          onFocus={(e)  => { e.target.style.borderColor = 'var(--color-primary-container)'; }}
          onBlur={(e)   => { e.target.style.borderColor = errors.password ? 'var(--color-error)' : 'var(--color-outline-variant)'; }}
        />
      </InputField>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full mt-2"
        style={{ justifyContent: 'center' }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
