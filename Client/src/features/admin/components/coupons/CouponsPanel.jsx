import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';

const INITIAL_COUPONS = [
  { id: 1, code: 'WELCOME20',   type: 'percentage', value: 20,  minOrder: 500,  expiry: '2026-12-31', usedCount: 12, isActive: true },
  { id: 2, code: 'SOFTWEAR10',  type: 'percentage', value: 10,  minOrder: 0,    expiry: '2026-12-31', usedCount: 45, isActive: true },
  { id: 3, code: 'FLAT500',     type: 'flat',       value: 500, minOrder: 3000, expiry: '2026-09-30', usedCount: 8,  isActive: true },
];

export const CouponsPanel = () => {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrder: '', expiry: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.code || !form.value) { toast.error('Code and value are required'); return; }
    const newCoupon = {
      id:        Date.now(),
      code:      form.code.trim().toUpperCase(),
      type:      form.type,
      value:     Number(form.value),
      minOrder:  Number(form.minOrder) || 0,
      expiry:    form.expiry || '2026-12-31',
      usedCount: 0,
      isActive:  true,
    };
    setCoupons([newCoupon, ...coupons]);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', expiry: '' });
    toast.success('Coupon created');
  };

  const handleDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success('Coupon deleted');
  };

  const handleToggle = (id) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Coupons</h2>
        <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
          {coupons.length} coupons — UI state only, connect to <code>/api/admin/coupons</code> to persist.
        </p>
      </div>

      {/* Add Coupon Form */}
      <div
        className="card p-5"
        style={{ background: 'var(--color-surface-container-lowest)' }}
      >
        <h3 className="text-headline-sm mb-4" style={{ color: 'var(--color-on-surface)', fontSize: '1rem' }}>
          Create Coupon
        </h3>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                Code <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                className="input"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="SUMMER20"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                Value <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                type="number"
                className="input"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'percentage' ? '20' : '500'}
                min={1}
              />
            </div>
            <div>
              <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>Min Order (₹)</label>
              <input
                type="number"
                className="input"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                placeholder="0"
                min={0}
              />
            </div>
            <div>
              <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>Expiry Date</label>
              <input
                type="date"
                className="input"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={14} /> Create Coupon
          </button>
        </form>
      </div>

      {/* Coupon Table */}
      <div className="card" style={{ background: 'var(--color-surface-container-lowest)', overflow: 'hidden' }}>
        {coupons.length === 0 ? (
          <div className="empty-state">
            <Ticket size={40} />
            <h3>No Coupons</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Expiry</th>
                  <th>Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const expired = isExpired(c.expiry);
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td>
                        <code
                          className="text-body-sm font-semibold"
                          style={{
                            color: 'var(--color-primary-dark)',
                            background: 'var(--color-primary-fixed)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {c.code}
                        </code>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {c.type === 'percentage' ? 'Percentage' : 'Flat'}
                        </span>
                      </td>
                      <td>
                        <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                          {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                        </span>
                      </td>
                      <td>
                        <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                          {c.minOrder > 0 ? `₹${c.minOrder}` : 'None'}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-body-sm"
                          style={{ color: expired ? 'var(--color-error)' : 'var(--color-on-surface-variant)' }}
                        >
                          {c.expiry || '—'}
                          {expired && <span className="text-label-sm ml-1" style={{ color: 'var(--color-error)' }}>(Expired)</span>}
                        </span>
                      </td>
                      <td>
                        <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{c.usedCount}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggle(c.id)}
                          className={`badge cursor-pointer ${c.isActive && !expired ? 'badge-success' : 'badge-neutral'}`}
                          style={{ border: 'none' }}
                          title="Toggle active status"
                        >
                          {c.isActive && !expired ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 transition-colors duration-150"
                          style={{ background: 'var(--color-error-container)', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPanel;
