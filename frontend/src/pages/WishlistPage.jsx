import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Sign in to view your Wishlist</h2>
        <p className="text-xs text-slate-500">
          Save your favourite gadgets, check price drops, and move items to cart anytime.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
        <p className="text-xs text-slate-500 mt-1">{products.length} items saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our store and tap the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
          >
            <span>Discover Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-slate-100">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-rose-600 rounded-full shadow hover:bg-white transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
                    <Link to={`/products/${product._id}`} className="block hover:text-blue-600 transition-colors">
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mt-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-extrabold text-slate-900 mt-2">
                      ₹{activePrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product._id);
                    }}
                    disabled={product.stock <= 0}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
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

