import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES = {
  pending:    { bg: '#fff3e0', color: '#e67e22' },
  processing: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  shipped:    { bg: '#e3f2fd', color: '#1565c0' },
  delivered:  { bg: 'var(--color-success-container)', color: 'var(--color-success)' },
  cancelled:  { bg: 'var(--color-error-container)', color: 'var(--color-error)' },
};

const PAY_STYLES = {
  paid:    { bg: 'var(--color-success-container)', color: 'var(--color-success)' },
  pending: { bg: '#fff3e0', color: '#e67e22' },
  failed:  { bg: 'var(--color-error-container)', color: 'var(--color-error)' },
};

export const OrdersPanel = ({ orders, onStatusUpdate }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
    const matchSearch = search
      ? o._id?.includes(search) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Orders</h2>
          <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            {filtered.length} of {orders.length} orders
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.25rem', width: '210px' }}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'var(--color-surface-container-lowest)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} />
            <h3>No Orders Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const ss = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
                  const ps = PAY_STYLES[order.paymentInfo?.status] || PAY_STYLES.pending;
                  const isExpanded = expandedId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      <motion.tr
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : order._id)}
                            className="flex items-center gap-1.5 font-mono text-body-sm transition-colors duration-150"
                            style={{ color: 'var(--color-primary-container)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            #{order._id?.slice(-8).toUpperCase()}
                            <ChevronDown
                              size={12}
                              style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
                            />
                          </button>
                        </td>
                        <td>
                          <p className="text-body-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                            {order.shippingAddress?.fullName || 'N/A'}
                          </p>
                          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.7 }}>
                            {order.shippingAddress?.city}
                          </p>
                        </td>
                        <td>
                          <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: ss.bg, color: ss.color }}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: ps.bg, color: ps.color }}>
                            {order.paymentInfo?.status || 'pending'}
                          </span>
                        </td>
                        <td>
                          <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>
                        <td>
                          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                            <select
                              className="input"
                              style={{ width: 'auto', fontSize: '0.75rem', padding: '0.375rem 0.625rem', cursor: 'pointer' }}
                              value={order.orderStatus}
                              onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          )}
                          {(order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') && (
                            <span className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>
                              Final
                            </span>
                          )}
                        </td>
                      </motion.tr>

                      {/* Expanded row — order items */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ background: 'var(--color-surface-container-low)', padding: '1rem 1.5rem' }}>
                            <p className="text-label-sm mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                              Order Items
                            </p>
                            <div className="space-y-2">
                              {(order.orderItems || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-9 h-9 object-cover"
                                      style={{ borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)' }}
                                    />
                                  )}
                                  <span className="text-body-sm" style={{ color: 'var(--color-on-surface)' }}>{item.name}</span>
                                  <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>× {item.quantity}</span>
                                  <span className="text-body-sm font-semibold ml-auto" style={{ color: 'var(--color-on-surface)' }}>
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                              <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                                <strong>Address:</strong>{' '}
                                {[order.shippingAddress?.street, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode]
                                  .filter(Boolean).join(', ')}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default OrdersPanel;
