import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, Loader2, ToggleLeft, ToggleRight, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORY_TEMPLATE = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  parentCategory: '',
  displayOrder: 0,
  isActive: true,
};

const CategoryFormModal = ({ isOpen, onClose, editingCategory, onSubmit }) => {
  const [form, setForm] = React.useState(editingCategory || { ...CATEGORY_TEMPLATE });

  React.useEffect(() => {
    setForm(editingCategory || { ...CATEGORY_TEMPLATE });
  }, [editingCategory, isOpen]);

  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm((f) => ({ ...f, name, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Category name is required'); return; }
    onSubmit(form);
  };

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
            transition={{ duration: 0.2 }}
            style={{ maxWidth: '540px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
              <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.375rem 0.75rem' }}>✕</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Name <span style={{ color: 'var(--color-error)' }}>*</span>
                  </label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Outerwear"
                  />
                </div>
                <div>
                  <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Slug (auto-generated)
                  </label>
                  <input
                    className="input"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="outerwear"
                    style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>Description</label>
                <textarea
                  className="input"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this category..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Image URL
                </label>
                <div className="flex gap-3 items-start">
                  <input
                    className="input flex-1"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover flex-shrink-0"
                      style={{ borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              {/* Parent & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Parent Category
                  </label>
                  <input
                    className="input"
                    value={form.parentCategory}
                    onChange={(e) => setForm((f) => ({ ...f, parentCategory: e.target.value }))}
                    placeholder="Leave empty for top-level"
                  />
                </div>
                <div>
                  <label className="text-label-sm block mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={form.displayOrder}
                    onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                    min={0}
                  />
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className="relative w-10 h-5 flex-shrink-0 transition-colors duration-200"
                  style={{
                    background: form.isActive ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
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
                      left: form.isActive ? 'calc(100% - 1.125rem)' : '0.125rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
                <span className="text-body-sm" style={{ color: 'var(--color-on-surface)' }}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const CategoryList = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Outerwear',   slug: 'outerwear',   description: 'Tailored structures and layering pieces.', imageUrl: '', parentCategory: '', displayOrder: 1, isActive: true },
    { id: 2, name: 'Knitwear',    slug: 'knitwear',    description: 'Fine-knit textures and relaxed silhouettes.',  imageUrl: '', parentCategory: '', displayOrder: 2, isActive: true },
    { id: 3, name: 'Basics',      slug: 'basics',      description: 'Essential cuts for every wardrobe.',           imageUrl: '', parentCategory: '', displayOrder: 3, isActive: true },
    { id: 4, name: 'Accessories', slug: 'accessories', description: 'Finishing profiles to complete your look.',    imageUrl: '', parentCategory: '', displayOrder: 4, isActive: true },
  ]);

  const [modalOpen, setModalOpen]       = useState(false);
  const [editingCategory, setEditing]   = useState(null);

  const handleAdd    = ()    => { setEditing(null); setModalOpen(true); };
  const handleEdit   = (cat) => { setEditing(cat);  setModalOpen(true); };
  const handleClose  = ()    => { setModalOpen(false); setEditing(null); };

  const handleSubmit = (form) => {
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, ...form } : c));
      toast.success('Category updated');
    } else {
      setCategories((prev) => [...prev, { ...form, id: Date.now() }]);
      toast.success('Category added');
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Category deleted');
    }
  };

  const handleToggle = (id) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-sm" style={{ color: 'var(--color-on-surface)' }}>Categories</h2>
          <p className="text-body-sm mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
            {categories.length} categories — API-ready for future backend connection
          </p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary btn-sm">
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 p-4"
        style={{
          background: 'var(--color-secondary-container)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline-variant)',
        }}
      >
        <Tag size={16} style={{ color: 'var(--color-on-secondary-container)', flexShrink: 0, marginTop: 1 }} />
        <p className="text-body-sm" style={{ color: 'var(--color-on-secondary-container)' }}>
          Category management is UI-ready. Connect to your backend <code>/api/admin/categories</code> endpoint to persist data.
          The structure supports unlimited nested categories via the Parent Category field.
        </p>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'var(--color-surface-container-lowest)', overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-9 h-9 object-cover"
                          style={{ borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)' }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 flex items-center justify-center"
                          style={{
                            background: 'var(--color-primary-fixed)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--color-primary-dark)',
                          }}
                        >
                          <Tag size={14} />
                        </div>
                      )}
                      <div>
                        <p className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>{cat.name}</p>
                        {cat.description && (
                          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.7, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', fontFamily: 'monospace' }}>
                      {cat.slug}
                    </code>
                  </td>
                  <td>
                    <span className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {cat.parentCategory || <span style={{ opacity: 0.4 }}>—</span>}
                    </span>
                  </td>
                  <td>
                    <span className="text-body-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                      {cat.displayOrder}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(cat.id)}
                      className="flex items-center gap-1.5 text-body-sm transition-colors duration-150"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {cat.isActive
                        ? <ToggleRight size={20} style={{ color: 'var(--color-secondary)' }} />
                        : <ToggleLeft  size={20} style={{ color: 'var(--color-on-surface-variant)', opacity: 0.4 }} />}
                      <span style={{ color: cat.isActive ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)' }}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 transition-colors duration-150"
                        style={{ background: 'var(--color-surface-container)', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 transition-colors duration-150"
                        style={{ background: 'var(--color-error-container)', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
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
      </div>

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={handleClose}
        editingCategory={editingCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CategoryList;
