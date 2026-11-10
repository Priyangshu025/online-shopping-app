import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';

const ProductFilters = ({
  categories = [],
  brands = [],
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Filter Products</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Category</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange('All')}
            className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                selectedCategory === cat
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Brand</h4>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Price Range (₹)</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Max Price</label>
            <input
              type="number"
              placeholder="100000"
              value={priceRange.max}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Customer Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? 0 : stars)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                minRating === stars
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < stars ? 'fill-amber-400 stroke-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px]">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>

    </div>
  );
};

export default ProductFilters;

