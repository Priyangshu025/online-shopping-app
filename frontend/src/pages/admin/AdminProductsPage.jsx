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
import Badge from '../../components/ui/Badge';
import Price from '../../components/ui/Price';
import Button from '../../components/ui/Button';

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
          <h1 className="text-2xl font-bold text-ink tracking-tight">Product Catalog</h1>
          <p className="text-sm text-ink-muted mt-1">Manage listings, stock availability, pricing, and promotions</p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="sm"
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface p-4 rounded-card border border-line shadow-card flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, brand, or category..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-alt border border-line rounded-xl text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
        </div>
        <span className="text-xs font-medium text-ink-muted whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-alt text-ink-muted uppercase tracking-wider font-semibold text-[11px] border-b border-line">
              <tr>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-normal">
              {filtered.map((p) => {
                const finalPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
                return (
                  <tr key={p._id} className="hover:bg-surface-alt/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface-alt border border-line/60 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={p.images?.[0] || ''}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-ink line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-accent font-medium">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-ink-muted">{p.category}</td>
                    <td className="py-3.5 px-5">
                      <Price
                        amount={finalPrice}
                        originalAmount={p.discountPrice > 0 ? p.price : null}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-5">
                      {p.stock <= 0 ? (
                        <Badge variant="danger" size="sm">Out of stock</Badge>
                      ) : p.stock <= 5 ? (
                        <Badge variant="neutral" size="sm" className="text-amber-800 bg-amber-50">Only {p.stock} left</Badge>
                      ) : (
                        <Badge variant="success" size="sm">{p.stock} in stock</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-ink">★ {p.rating > 0 ? p.rating.toFixed(1) : 'New'}</span>
                      <span className="text-[10px] text-ink-muted block">({p.numReviews})</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge
                        variant={p.status === 'active' ? 'accent' : 'neutral'}
                        size="sm"
                        className="capitalize"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-ink-muted hover:text-accent hover:bg-accent-soft rounded-lg transition-colors"
                          title="Edit Product"
                          aria-label="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Delete Product"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-line max-w-lg w-full p-6 shadow-lift space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-ink text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ink-muted hover:text-ink rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Sony"
                    required
                    className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29990"
                    required
                    className="w-full px-3 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink block mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="26990"
                    className="w-full px-3 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    required
                    className="w-full px-3 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">Product Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Detailed product specifications and highlights..."
                  className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-ink font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;


