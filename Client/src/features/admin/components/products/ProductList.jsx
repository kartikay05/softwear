import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Package, Loader2, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['Outerwear', 'Knitwear', 'Basics', 'Accessories'];

const ProductFormModal = ({ isOpen, onClose, onSubmit, editingProduct, loading }) => {
  const [form, setForm] = React.useState({
    name: editingProduct?.name || '',
    description: editingProduct?.description || '',
    price: editingProduct?.price || '',
    discountPrice: editingProduct?.discountPrice || '',
    category: editingProduct?.category || CATEGORIES[0],
    brand: editingProduct?.brand || 'Softwear Studio',
    stock: editingProduct?.stock || '',
    isFeatured: editingProduct?.isFeatured || false,
  });
  const [images, setImages] = React.useState(null);

  React.useEffect(() => {
    setForm({
      name: editingProduct?.name || '',
      description: editingProduct?.description || '',
      price: editingProduct?.price || '',
      discountPrice: editingProduct?.discountPrice || '',
      category: editingProduct?.category || CATEGORIES[0],
      brand: editingProduct?.brand || 'Softwear Studio',
      stock: editingProduct?.stock || '',
      isFeatured: editingProduct?.isFeatured || false,
    });
    setImages(null);
  }, [editingProduct, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) fd.append('images', images[i]);
    }
    onSubmit(fd);
  };

  const field = (label, key, type = 'text', required = false, placeholder = '') => (
    <div>
      <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
        {label}{required && <span style={{ color: 'var(--color-error)' }}> *</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="input"
          rows={3}
          placeholder={placeholder}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="input"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22 }}
            style={{ maxWidth: '640px' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
            >
              <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.375rem 0.75rem' }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('Product Name', 'name', 'text', true, 'e.g. Linen Field Jacket')}
                {field('Brand', 'brand', 'text', false, 'Softwear Studio')}
              </div>
              {field('Description', 'description', 'textarea', true, 'Describe the product...')}
              <div className="grid grid-cols-2 gap-4">
                {field('Price (₹)', 'price', 'number', true, '999')}
                {field('Discount Price (₹)', 'discountPrice', 'number', false, 'Optional')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Category <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {field('Stock Quantity', 'stock', 'number', true, '10')}
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                  className="relative w-10 h-5 flex-shrink-0 transition-colors duration-200"
                  style={{
                    background: form.isFeatured ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 transition-all duration-200"
                    style={{
                      background: '#fff',
                      borderRadius: 'var(--radius-full)',
                      left: form.isFeatured ? 'calc(100% - 1.125rem)' : '0.125rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
                <label className="text-body-sm" style={{ color: 'var(--color-on-surface)' }}>
                  Featured product
                </label>
              </div>

              {/* Images */}
              <div>
                <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Product Images
                </label>
                <label
                  className="flex flex-col items-center justify-center gap-2 p-5 cursor-pointer transition-all duration-150"
                  style={{
                    border: '2px dashed var(--color-outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-container-low)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary-container)'; e.currentTarget.style.background = 'var(--color-primary-fixed)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-outline-variant)'; e.currentTarget.style.background = 'var(--color-surface-container-low)'; }}
                >
                  <Image size={22} style={{ color: 'var(--color-on-surface-variant)' }} />
                  <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {images && images.length > 0
                      ? `${images.length} file(s) selected`
                      : 'Click to upload images'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImages(e.target.files)}
                  />
                </label>
              </div>

              {/* Existing images */}
              {editingProduct?.images?.length > 0 && (
                <div>
                  <p className="text-label-sm mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>Current Images</p>
                  <div className="flex gap-2 flex-wrap">
                    {editingProduct.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={`Product ${i + 1}`}
                        className="w-16 h-16 object-cover"
                        style={{ borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                className="flex justify-end gap-3 pt-4"
                style={{ borderTop: '1px solid var(--color-outline-variant)' }}
              >
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  ) : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ProductList = ({
  products,
  loading,
  onEdit,
  onDelete,
  onAdd,
  modalOpen,
  onModalClose,
  onModalSubmit,
  editingProduct,
  submitLoading,
}) => {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Products</h2>
          <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            {filtered.length} of {products.length} products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.25rem', width: '220px' }}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-on-surface-variant)' }} />
          </div>
          <button onClick={onAdd} className="btn btn-primary btn-sm">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="card overflow-hidden"
        style={{ background: 'var(--color-surface-container-lowest)' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16" style={{ color: 'var(--color-on-surface-variant)' }}>
            <Loader2 size={24} className="animate-spin mr-2" /> Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={40} />
            <h3>No Products Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 flex-shrink-0 overflow-hidden"
                          style={{ borderRadius: 'var(--radius)', background: 'var(--color-surface-container)', border: '1px solid var(--color-outline-variant)' }}
                        >
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="m-auto mt-2.5" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.4 }} />
                          )}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{product.name}</p>
                          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.7 }}>{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{product.category}</span>
                    </td>
                    <td>
                      <div>
                        {product.discountPrice ? (
                          <>
                            <p className="text-body-sm font-semibold" style={{ color: 'var(--color-primary)' }}>₹{product.discountPrice}</p>
                            <p className="text-body-sm line-through" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6, fontSize: '0.75rem' }}>₹{product.price}</p>
                          </>
                        ) : (
                          <p className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>₹{product.price}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className="text-body-sm font-semibold"
                        style={{ color: product.stock < 10 ? 'var(--color-error)' : 'var(--color-on-surface)' }}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.isFeatured
                        ? <span className="badge badge-secondary">Yes</span>
                        : <span className="badge badge-neutral">No</span>}
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 transition-colors duration-150"
                          style={{
                            background: 'var(--color-surface-container)',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-on-surface-variant)',
                          }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(product._id)}
                          className="p-1.5 transition-colors duration-150"
                          style={{
                            background: 'var(--color-error-container)',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-error)',
                          }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={onModalClose}
        onSubmit={onModalSubmit}
        editingProduct={editingProduct}
        loading={submitLoading}
      />
    </div>
  );
};

export default ProductList;
