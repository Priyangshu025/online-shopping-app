import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    brand: '',
    price: '',
    discountPrice: '',
    stock: 10,
    imageUrl: '',
    isFeatured: false,
    status: 'active',
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Electronics',
      brand: '',
      price: '',
      discountPrice: '',
      stock: 10,
      imageUrl: '',
      isFeatured: false,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      imageUrl: product.images?.[0] || '',
      isFeatured: Boolean(product.isFeatured),
      status: product.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.brand) {
      toast.error('Please enter name, brand, and price');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      brand: formData.brand,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      stock: Number(formData.stock),
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      isFeatured: formData.isFeatured,
      status: formData.status,
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage listings, stock availability, pricing, and promotions</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, brand, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
          {filtered.length} products
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price (₹)</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || ''}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-blue-600 font-semibold">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">{p.category}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900">
                      ₹{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString('en-IN')}
                    </span>
                    {p.discountPrice > 0 && (
                      <span className="text-[10px] text-slate-400 line-through block">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock <= 0
                        ? 'bg-rose-50 text-rose-600'
                        : p.stock <= 5
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-amber-600">★ {p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                    <span className="text-[10px] text-slate-400 block">({p.numReviews})</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      p.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Sony"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29990"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="26990"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Detailed product specifications and highlights..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;

