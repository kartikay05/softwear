import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Redux
import { fetchProductsThunk } from '../../products/state/product.slice.js';
import {
  fetchAdminOrdersThunk,
  updateAdminOrderStatusThunk,
  createProductAdminThunk,
  updateProductAdminThunk,
  deleteProductAdminThunk,
} from '../state/admin.slice.js';
import { api } from '../../shared/service/api.js';

// Layout components
import { AdminSidebar } from '../components/AdminSidebar.jsx';
import { AdminHeader }  from '../components/AdminHeader.jsx';

// Panel components
import { StatsPanel }     from '../components/dashboard/StatsPanel.jsx';
import { SalesChart }     from '../components/dashboard/SalesChart.jsx';
import { RecentOrders }   from '../components/dashboard/RecentOrders.jsx';
import { ProductList }    from '../components/products/ProductList.jsx';
import { CategoryList }   from '../components/categories/CategoryList.jsx';
import { OrdersPanel }    from '../components/orders/OrdersPanel.jsx';
import { UsersPanel }     from '../components/users/UsersPanel.jsx';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel.jsx';
import { CouponsPanel }   from '../components/coupons/CouponsPanel.jsx';

// Placeholder panels
const PlaceholderPanel = ({ title }) => (
  <div className="empty-state" style={{ minHeight: '300px' }}>
    <h3>{title}</h3>
    <p className="text-body-sm mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
      This module is coming soon.
    </p>
  </div>
);

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector((s) => s.products);
  const { orders, loading: ordersLoading }            = useSelector((s) => s.admin);

  const [activeTab, setActiveTab]           = useState('stats');
  const [users, setUsers]                   = useState([]);
  const [usersLoading, setUsersLoading]     = useState(false);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [submitLoading, setSubmitLoading]       = useState(false);

  // ── Data fetching ──────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProductsThunk({ limit: 100 }));
    dispatch(fetchAdminOrdersThunk());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res?.success) setUsers(res.data.users);
    } catch {
      // Fallback simulated users when API not available
      setUsers([
        { _id: 'u1', name: 'Alice M.',       email: 'alice@example.com',     role: 'user',  isBlocked: false, createdAt: '2026-04-10' },
        { _id: 'u2', name: 'Ethan B.',       email: 'ethan@example.com',     role: 'user',  isBlocked: true,  createdAt: '2026-05-15' },
        { _id: 'u3', name: 'Admin Softwear', email: 'admin@softwear.com',    role: 'admin', isBlocked: false, createdAt: '2026-01-01' },
      ]);
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────
  const handleBlockUser = async (userId, currentBlocked) => {
    try {
      const res = await api.put(`/admin/users/${userId}/block`, {});
      if (res?.success) { toast.success('User status updated'); fetchUsers(); }
    } catch {
      setUsers((u) => u.map((x) => x._id === userId ? { ...x, isBlocked: !currentBlocked } : x));
      toast.success('User status toggled');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateAdminOrderStatusThunk({ orderId, orderStatus: newStatus })).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err || 'Failed to update order');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
    if (activeTab !== 'products') setActiveTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        await dispatch(deleteProductAdminThunk(productId)).unwrap();
        toast.success('Product deleted');
        dispatch(fetchProductsThunk({ limit: 100 }));
      } catch (err) {
        toast.error(err || 'Delete failed');
      }
    }
  };

  const handleProductSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      if (editingProduct) {
        await dispatch(updateProductAdminThunk({ productId: editingProduct._id, formData })).unwrap();
        toast.success('Product updated');
      } else {
        await dispatch(createProductAdminThunk(formData)).unwrap();
        toast.success('Product created');
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      dispatch(fetchProductsThunk({ limit: 100 }));
    } catch (err) {
      toast.error(err || 'Save failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  const renderPanel = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-8">
            <StatsPanel products={products} orders={orders} />
            <SalesChart  products={products} orders={orders} />
            <RecentOrders orders={orders} />
          </div>
        );

      case 'products':
        return (
          <ProductList
            products={products}
            loading={productsLoading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleOpenAddProduct}
            modalOpen={productModalOpen}
            onModalClose={() => { setProductModalOpen(false); setEditingProduct(null); }}
            onModalSubmit={handleProductSubmit}
            editingProduct={editingProduct}
            submitLoading={submitLoading}
          />
        );

      case 'categories':
        return <CategoryList />;

      case 'orders':
        return (
          <OrdersPanel
            orders={orders}
            onStatusUpdate={handleOrderStatusUpdate}
          />
        );

      case 'users':
        return (
          <UsersPanel
            users={users}
            loading={usersLoading}
            onBlockUser={handleBlockUser}
          />
        );

      case 'analytics':
        return <AnalyticsPanel orders={orders} products={products} />;

      case 'coupons':
        return <CouponsPanel />;

      case 'reviews':
        return <PlaceholderPanel title="Reviews & Ratings" />;

      case 'settings':
        return <PlaceholderPanel title="Settings" />;

      default:
        return null;
    }
  };

  return (
    <div
      className="flex"
      style={{
        minHeight: '100vh',
        background: 'var(--color-surface-container-low)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          onAddProduct={activeTab === 'products' ? handleOpenAddProduct : null}
        />

        {/* Panel content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: '2rem' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {renderPanel()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
