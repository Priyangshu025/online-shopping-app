import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../ui/Button';
import Price from '../ui/Price';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product._id);
  const hasDiscount = product.discountPrice > 0 && product.price > product.discountPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <article className="group relative flex flex-col rounded-card bg-surface-alt p-5 sm:p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lift border border-line/40">
      
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-white p-5 flex items-center justify-center">
        <Link to={`/products/${product._id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Subtle Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">
              Save {discountPercent}%
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product._id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            wishlisted
              ? 'text-danger bg-white shadow-sm'
              : 'text-ink-muted/80 hover:text-ink bg-white/80 hover:bg-white shadow-sm'
          }`}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info Container */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
            <span>{product.brand || 'ShopNova'}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-ink-muted">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
                {product.numReviews > 0 && <span>({product.numReviews})</span>}
              </span>
            )}
          </div>

          <Link to={`/products/${product._id}`} className="block">
            <h3 className="line-clamp-2 text-base font-semibold text-ink group-hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add Action */}
        <div className="pt-4 mt-auto flex items-end justify-between gap-3">
          <div>
            <Price value={activePrice} old={hasDiscount ? product.price : null} />
            {product.stock <= 0 ? (
              <p className="text-xs font-medium text-danger mt-1">Out of stock</p>
            ) : product.stock <= 5 ? (
              <p className="text-xs font-medium text-ink-muted mt-1">Only {product.stock} left</p>
            ) : null}
          </div>

          <Button
            size="sm"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            aria-label={`Add ${product.name} to cart`}
            className="px-4 py-2 text-xs font-medium"
          >
            Add to cart
          </Button>
        </div>

      </div>

    </article>
  );
};

export default ProductCard;
