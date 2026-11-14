import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ categoryName: '', description: '', image: '' });
  const [loading, setLoading] = useState(true);

  const fetchCats = async () => {
    try {
      const res = await api.get('/admin/categories');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.categoryName) return;
    try {
      const res = await api.post('/admin/categories', newCat);
      if (res.success) {
        toast.success('Category created');
        setNewCat({ categoryName: '', description: '', image: '' });
        fetchCats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category removed');
      fetchCats();
    } catch (err) {
      toast.error('Failed to remove category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Categories Management</h1>
        <p className="text-sm text-ink-muted mt-1">Organize catalogue sections and visual storefront tiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="bg-surface p-6 rounded-card border border-line shadow-card space-y-4 lg:col-span-1">
          <h3 className="font-semibold text-ink text-base">Add New Category</h3>
          <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-ink block mb-1">Category Title</label>
              <input
                type="text"
                placeholder="e.g. Smart Audio"
                value={newCat.categoryName}
                onChange={(e) => setNewCat({ ...newCat, categoryName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief category summary"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block mb-1">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newCat.image}
                onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              Save Category
            </Button>
          </form>
        </div>

        {/* Existing Categories */}
        <div className="bg-surface p-6 rounded-card border border-line shadow-card lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-ink text-base">Active Categories ({categories.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="p-3.5 bg-surface-alt rounded-2xl border border-line/60 flex items-center justify-between text-xs hover:border-line transition-colors">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <div className="w-11 h-11 rounded-xl bg-surface border border-line/60 p-1 flex items-center justify-center flex-shrink-0">
                      <img src={cat.image} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold text-sm">
                      {cat.categoryName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-ink text-sm">{cat.categoryName}</p>
                    <p className="text-[11px] text-ink-muted">{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  aria-label="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

