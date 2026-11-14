import React from 'react';
import { RotateCcw, Star } from 'lucide-react';

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
    <div className="bg-surface p-6 rounded-card border border-line/60 space-y-6">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-line/50">
        <h3 className="font-semibold text-ink text-sm tracking-tight">Refine</h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-ink-muted hover:text-ink flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold text-ink-muted mb-2.5">Category</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onCategoryChange('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-ink text-white'
                : 'bg-surface-alt text-ink hover:bg-surface-alt/80 border border-line/50'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-ink text-white'
                  : 'bg-surface-alt text-ink hover:bg-surface-alt/80 border border-line/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-xs font-semibold text-ink-muted mb-2">Brand</h4>
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full text-sm bg-surface-alt border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-accent"
        >
          <option value="All">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-semibold text-ink-muted mb-2">Price (₹)</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Min</label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full text-sm bg-surface-alt border border-line rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-[11px] text-ink-muted block mb-1">Max</label>
            <input
              type="number"
              placeholder="100000"
              value={priceRange.max}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full text-sm bg-surface-alt border border-line rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-semibold text-ink-muted mb-2">Customer rating</h4>
        <div className="space-y-1">
          {[4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? 0 : stars)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                minRating === stars
                  ? 'bg-ink text-white font-medium'
                  : 'text-ink hover:bg-surface-alt'
              }`}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < stars ? 'fill-amber-400 stroke-amber-400' : 'text-line stroke-line'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-ink-muted">{stars}★ & up</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock toggle */}
      <div className="pt-2 border-t border-line/50">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-line text-accent focus:ring-accent"
          />
          <span>In stock items only</span>
        </label>
      </div>

    </div>
  );
};

export default ProductFilters;
