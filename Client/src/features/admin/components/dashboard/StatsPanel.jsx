import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, DollarSign } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="stat-card"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-label-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</p>
        <p className="text-headline-md font-semibold" style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-body)' }}>
          {value}
        </p>
        {sub && (
          <p className="text-body-sm mt-1" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.7 }}>{sub}</p>
        )}
      </div>
      <div
        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        style={{ background: color + '22', borderRadius: 'var(--radius-md)', color }}
      >
        <Icon size={18} />
      </div>
    </div>
  </motion.div>
);

export const StatsPanel = ({ products, orders }) => {
  const totalRevenue = orders
    .filter((o) => o.paymentInfo?.status === 'paid' || o.orderStatus === 'delivered')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const totalOrders    = orders.length;
  const totalProducts  = products.length;
  const lowStockCount  = products.filter((p) => p.stock < 10).length;

  const today     = new Date().toDateString();
  const todayOrds = orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;

  const stats = [
    {
      label:  'Total Revenue',
      value:  `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon:   DollarSign,
      color:  'var(--color-secondary)',
      sub:    'From completed orders',
    },
    {
      label:  'Total Orders',
      value:  totalOrders,
      icon:   ShoppingBag,
      color:  'var(--color-primary-container)',
      sub:    `${todayOrds} today`,
    },
    {
      label:  'Products',
      value:  totalProducts,
      icon:   Package,
      color:  'var(--color-tertiary)',
      sub:    `${lowStockCount} low stock`,
    },
    {
      label:  'Pending Orders',
      value:  orders.filter((o) => o.orderStatus === 'pending').length,
      icon:   TrendingUp,
      color:  '#e67e22',
      sub:    'Awaiting action',
    },
    {
      label:  'Delivered',
      value:  orders.filter((o) => o.orderStatus === 'delivered').length,
      icon:   TrendingUp,
      color:  'var(--color-success)',
      sub:    'Completed orders',
    },
    {
      label:  'Low Stock',
      value:  lowStockCount,
      icon:   AlertTriangle,
      color:  'var(--color-error)',
      sub:    'Items need restocking',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Overview</h2>
        <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
          Real-time metrics for your store.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
