import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  BarChart3, Star, Ticket, Settings, ChevronLeft, ChevronRight,
  X, Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'stats',      label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'products',   label: 'Products',     icon: Package },
  { id: 'categories', label: 'Categories',   icon: Tag },
  { id: 'orders',     label: 'Orders',       icon: ShoppingBag },
  { id: 'users',      label: 'Customers',    icon: Users },
  { id: 'analytics',  label: 'Analytics',    icon: BarChart3 },
  { id: 'reviews',    label: 'Reviews',      icon: Star },
  { id: 'coupons',    label: 'Coupons',      icon: Ticket },
  { id: 'settings',   label: 'Settings',     icon: Settings },
];

export const AdminSidebar = ({ activeTab, onTabChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span
            className="text-headline-sm"
            style={{
              fontStyle: 'italic',
              color: 'var(--color-primary-container)',
              whiteSpace: 'nowrap',
              display: collapsed && !onClose ? 'none' : 'block',
            }}
          >
            {collapsed && !onClose ? 'S' : 'Softwear'}
          </span>
        </Link>
        {collapsed && !onClose && (
          <span
            className="text-headline-sm"
            style={{ fontStyle: 'italic', color: 'var(--color-primary-container)' }}
          >
            S
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p
          className="text-label-sm px-2 mb-3"
          style={{
            color: 'var(--color-on-surface-variant)',
            opacity: 0.5,
            display: collapsed && !onClose ? 'none' : 'block',
          }}
        >
          Navigation
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { onTabChange(id); if (onClose) onClose(); }}
              className="admin-sidebar-link w-full"
              style={{
                background: isActive ? 'var(--color-primary-fixed)' : 'transparent',
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-on-surface-variant)',
                fontWeight: isActive ? 600 : 400,
                justifyContent: collapsed && !onClose ? 'center' : 'flex-start',
              }}
              title={collapsed && !onClose ? label : undefined}
            >
              <Icon
                size={16}
                style={{ flexShrink: 0, color: isActive ? 'var(--color-primary-container)' : 'currentColor' }}
              />
              {(!collapsed || onClose) && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer — back to store */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--color-outline-variant)' }}
      >
        <Link
          to="/"
          className="admin-sidebar-link w-full"
          style={{
            justifyContent: collapsed && !onClose ? 'center' : 'flex-start',
            textDecoration: 'none',
          }}
          title={collapsed && !onClose ? 'Back to Store' : undefined}
        >
          <ChevronLeft size={15} style={{ flexShrink: 0 }} />
          {(!collapsed || onClose) && <span>Back to Store</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 relative transition-all duration-300"
        style={{
          width: collapsed ? '64px' : '240px',
          background: 'var(--color-surface-container-lowest)',
          borderRight: '1px solid var(--color-outline-variant)',
          minHeight: '100vh',
        }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 flex items-center justify-center z-10 transition-all duration-200"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-on-surface-variant)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight size={12} />
            : <ChevronLeft  size={12} />}
        </button>
      </aside>

      {/* ── Mobile Hamburger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 flex items-center justify-center shadow-lg"
        style={{
          background: 'var(--color-primary-container)',
          color: 'var(--color-on-primary)',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(27,28,28,0.45)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              key="mob-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden"
              style={{ background: 'var(--color-surface-container-lowest)', boxShadow: 'var(--shadow-xl)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5"
                style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
              >
                <X size={16} />
              </button>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
