import React from 'react';
import { SalesChart } from '../dashboard/SalesChart.jsx';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPanel = ({ orders, products }) => {
  const totalRevenue = orders
    .filter((o) => o.paymentInfo?.status === 'paid' || o.orderStatus === 'delivered')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(0) : 0;

  const bestSelling = products
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Analytics</h2>
        <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
          Store performance metrics and insights.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',    value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'var(--color-secondary)' },
          { label: 'Avg. Order Value', value: `₹${Number(avgOrderValue).toLocaleString('en-IN')}`, color: 'var(--color-primary-container)' },
          { label: 'Conversion Rate',  value: '—',  color: 'var(--color-tertiary)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="stat-card"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <p className="text-label-sm mb-1" style={{ color: 'var(--color-on-surface-variant)' }}>{label}</p>
            <p className="text-headline-md" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-on-surface)', fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <SalesChart orders={orders} products={products} />

      {/* Best Selling */}
      {bestSelling.length > 0 && (
        <div className="card p-5" style={{ background: 'var(--color-surface-container-lowest)' }}>
          <h3 className="text-headline-sm mb-4" style={{ color: 'var(--color-on-surface)', fontSize: '1rem' }}>
            Best Selling Products
          </h3>
          <div className="space-y-3">
            {bestSelling.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4">
                <span
                  className="w-6 h-6 flex items-center justify-center text-label-sm flex-shrink-0"
                  style={{
                    background: i === 0 ? 'var(--color-primary-fixed)' : 'var(--color-surface-container)',
                    borderRadius: 'var(--radius-full)',
                    color: i === 0 ? 'var(--color-primary-dark)' : 'var(--color-on-surface-variant)',
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="w-9 h-9 object-cover"
                    style={{ borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)', flexShrink: 0 }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold truncate" style={{ color: 'var(--color-on-surface)' }}>{p.name}</p>
                  <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{p.sold} sold</p>
                  <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bestSelling.length === 0 && (
        <div className="empty-state">
          <BarChart3 size={40} />
          <h3>No Sales Data</h3>
          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Sales data will appear once products are sold.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
