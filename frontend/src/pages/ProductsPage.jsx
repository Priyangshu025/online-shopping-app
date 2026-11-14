import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import { SlidersHorizontal, ArrowUpDown, X, PackageOpen } from 'lucide-react';
import Button from '../components/ui/Button';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
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
    <div className="container-page py-10 sm:py-16 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            {currentCategory !== 'All' 
              ? currentCategory 
              : currentSearch 
              ? `Results for "${currentSearch}"` 
              : 'All Products'}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {products.length} {products.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Mobile Filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface-alt border border-line rounded-full text-xs font-medium text-ink"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-surface-alt border border-line rounded-full px-3.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-muted" />
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent text-ink font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
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

        {/* Mobile Filters Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex justify-end">
            <div className="w-80 bg-surface h-full p-6 overflow-y-auto space-y-4 shadow-lift">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-semibold text-ink">Filters</h3>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="p-1 text-ink-muted hover:text-ink"
                  aria-label="Close filters"
                >
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
                <div key={i} className="h-80 bg-surface-alt rounded-card animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-surface-alt rounded-card p-12 text-center space-y-4">
              <PackageOpen className="w-10 h-10 text-ink-muted mx-auto" />
              <h3 className="text-lg font-semibold text-ink">No matching products found</h3>
              <p className="text-sm text-ink-muted max-w-sm mx-auto">
                Try clearing one or more filters to discover more items in our catalog.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
              >
                Clear all filters
              </Button>
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
