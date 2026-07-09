import React from 'react';
import { Bell, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';

const TAB_LABELS = {
  stats:      'Dashboard Overview',
  products:   'Product Management',
  categories: 'Category Management',
  orders:     'Order Management',
  users:      'Customer Management',
  analytics:  'Analytics & Reports',
  reviews:    'Reviews & Ratings',
  coupons:    'Coupon Management',
  settings:   'Settings',
};

export const AdminHeader = ({ activeTab, onAddProduct }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header
      className="flex items-center justify-between px-6 h-16 flex-shrink-0 sticky top-0 z-30"
      style={{
        background: 'rgba(252,249,248,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}
    >
      {/* Left: breadcrumb/title */}
      <div>
        <div className="flex items-center gap-2">
          <Shield size={13} style={{ color: 'var(--color-primary-container)', opacity: 0.7 }} />
          <span className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Admin
          </span>
          <span className="text-label-sm" style={{ color: 'var(--color-outline)' }}>/</span>
          <span className="text-label-sm" style={{ color: 'var(--color-on-surface)' }}>
            {TAB_LABELS[activeTab] || activeTab}
          </span>
        </div>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-3">
        {activeTab === 'products' && onAddProduct && (
          <button onClick={onAddProduct} className="btn btn-primary btn-sm">
            + Add Product
          </button>
        )}

        {/* Notification bell — placeholder */}
        <button
          className="w-9 h-9 flex items-center justify-center transition-all duration-150 relative"
          style={{
            background: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-outline-variant)',
            color: 'var(--color-on-surface-variant)',
            cursor: 'pointer',
          }}
          title="Notifications"
        >
          <Bell size={15} />
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold"
            style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-full)' }}
          >
            3
          </span>
        </button>

        {/* User chip */}
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            background: 'var(--color-surface-container)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-outline-variant)',
          }}
        >
          <div
            className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-primary-fixed)', color: 'var(--color-primary-dark)' }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <Shield size={11} />
            )}
          </div>
          <span className="text-label-sm" style={{ color: 'var(--color-on-surface)' }}>
            {user?.fullName?.split(' ')[0] || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
