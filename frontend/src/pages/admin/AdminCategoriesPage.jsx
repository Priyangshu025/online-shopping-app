import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Categories Management</h1>
        <p className="text-xs text-slate-500 mt-1">Organize catalogue sections and visual storefront tiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-sm">Add New Category</h3>
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Category Title</label>
              <input
                type="text"
                placeholder="e.g. Smart Audio"
                value={newCat.categoryName}
                onChange={(e) => setNewCat({ ...newCat, categoryName: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief category summary"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Cover Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newCat.image}
                onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors"
            >
              Save Category
            </button>
          </form>
        </div>

        {/* Existing Categories */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Active Categories ({categories.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {cat.categoryName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-800">{cat.categoryName}</p>
                    <p className="text-[10px] text-slate-400">{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
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

