import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { SlidersHorizontal, ArrowUpDown, X, PackageX } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States initialized from URL or defaults
  const currentCategory = searchParams.get('category') || 'All';
  const currentBrand = searchParams.get('brand') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentRating = Number(searchParams.get('rating')) || 0;
  const currentInStock = searchParams.get('inStock') === 'true';

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });

  // Fetch filter metadata (categories, brands)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/products/meta/filters');
        if (res.success && res.data) {
          setCategories(res.data.categories || []);
          setBrands(res.data.brands || []);
        }
      } catch (err) {
        console.error('Filter meta error:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '0') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const handlePriceChange = (type, val) => {
    const next = { ...priceRange, [type]: val };
    setPriceRange(next);
    const params = new URLSearchParams(searchParams);
    if (next.min) params.set('minPrice', next.min);
    else params.delete('minPrice');
    if (next.max) params.set('maxPrice', next.max);
    else params.delete('maxPrice');
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {currentCategory !== 'All' ? currentCategory : currentSearch ? `Results for "${currentSearch}"` : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{products.length}</strong> items matching your preferences
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Mobile Filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="flex items-start gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={currentCategory}
            onCategoryChange={(cat) => updateParam('category', cat)}
            selectedBrand={currentBrand}
            onBrandChange={(b) => updateParam('brand', b)}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            minRating={currentRating}
            onRatingChange={(r) => updateParam('rating', r.toString())}
            inStockOnly={currentInStock}
            onInStockChange={(v) => updateParam('inStock', v ? 'true' : '')}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Mobile Filters Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
            <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-slate-800">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters
                categories={categories}
                brands={brands}
                selectedCategory={currentCategory}
                onCategoryChange={(cat) => updateParam('category', cat)}
                selectedBrand={currentBrand}
                onBrandChange={(b) => updateParam('brand', b)}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                minRating={currentRating}
                onRatingChange={(r) => updateParam('rating', r.toString())}
                inStockOnly={currentInStock}
                onInStockChange={(v) => updateParam('inStock', v ? 'true' : '')}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Products Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your active filters. Try adjusting price ranges, category, or search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProductsPage;

