import React from 'react';
import { motion } from 'framer-motion';

const STATUS_STYLES = {
  pending:    { bg: '#fff3e0', color: '#e67e22' },
  processing: { bg: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
  shipped:    { bg: '#e3f2fd', color: '#1565c0' },
  delivered:  { bg: 'var(--color-success-container)', color: 'var(--color-success)' },
  cancelled:  { bg: 'var(--color-error-container)', color: 'var(--color-error)' },
};

const PAY_STYLES = {
  paid:       { bg: 'var(--color-success-container)', color: 'var(--color-success)' },
  pending:    { bg: '#fff3e0', color: '#e67e22' },
  failed:     { bg: 'var(--color-error-container)', color: 'var(--color-error)' },
};

export const RecentOrders = ({ orders }) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div
      className="card"
      style={{ background: 'var(--color-surface-container-lowest)' }}
    >
      <div className="p-5" style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
        <h3 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Recent Orders</h3>
        <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
          Latest {recent.length} orders
        </p>
      </div>

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
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8" style={{ color: 'var(--color-on-surface-variant)' }}>
                  No orders yet.
                </td>
              </tr>
            ) : (
              recent.map((order, i) => {
                const statusStyle = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
                const payStyle    = PAY_STYLES[order.paymentInfo?.status] || PAY_STYLES.pending;
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <span className="font-mono text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <p className="text-body-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                        {order.shippingAddress?.fullName || 'N/A'}
                      </p>
                    </td>
                    <td>
                      <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: payStyle.bg, color: payStyle.color }}
                      >
                        {order.paymentInfo?.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
