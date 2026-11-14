import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import LinkButton from '../components/ui/LinkButton';
import Price from '../components/ui/Price';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!isAuthenticated || wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/products');
        if (res.success) {
          const filtered = res.data.filter((p) => wishlist.includes(p._id));
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Wishlist fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-surface-alt border border-line flex items-center justify-center mx-auto text-ink-muted">
          <Heart className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">Your Wishlist</h1>
          <p className="text-sm text-ink-muted">Sign in to view and save your favorite devices.</p>
        </div>
        <LinkButton to="/login" variant="primary" size="sm">
          Sign in
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Wishlist</h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-surface-alt rounded-card animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-card bg-surface-alt p-16 text-center space-y-4">
          <Heart className="w-8 h-8 text-ink-muted mx-auto" />
          <h2 className="text-lg font-semibold text-ink">No items in your wishlist yet</h2>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            Tap the heart icon on any product to save it here for later.
          </p>
          <LinkButton to="/products" variant="secondary" size="sm">
            Browse products
          </LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <div
                key={product._id}
                className="group relative flex flex-col rounded-card bg-surface-alt p-5 border border-line/40 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-square rounded-xl bg-white p-4 flex items-center justify-center mb-4">
                  <Link to={`/products/${product._id}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-ink-muted hover:text-danger bg-white shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-ink-muted">{product.brand}</p>
                    <Link to={`/products/${product._id}`} className="block">
                      <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="pt-2">
                      <Price value={activePrice} old={product.discountPrice > 0 ? product.price : null} size="sm" />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product._id);
                    }}
                    disabled={product.stock <= 0}
                    className="w-full text-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to bag</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
