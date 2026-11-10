import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product._id);
  const discountPercent = product.discountPrice > 0 && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product._id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/90 text-slate-500 hover:text-rose-500 hover:scale-110 backdrop-blur'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 stroke-rose-500' : ''}`} />
        </button>

        {/* Quick View Link */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl shadow-md backdrop-blur flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            Quick View
          </Link>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-blue-600">{product.brand || 'ShopNova'}</span>
            <span className="truncate max-w-[100px]">{product.category}</span>
          </div>

          <Link to={`/products/${product._id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
            </span>
            {product.numReviews > 0 && (
              <span className="text-xs text-slate-400">({product.numReviews})</span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {product.discountPrice > 0 && product.price > product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            {product.stock <= 0 ? (
              <span className="text-[11px] font-semibold text-rose-500">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-[11px] font-semibold text-amber-600">Only {product.stock} left!</span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600">In Stock</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-500/20'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;

