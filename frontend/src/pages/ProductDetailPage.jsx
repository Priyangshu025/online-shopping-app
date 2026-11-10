import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Minus,
  MessageSquare,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Link to="/products" className="text-blue-600 hover:underline text-sm font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = product.discountPrice > 0 && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post a review');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res.success) {
        toast.success('Thank you! Your review was submitted.');
        setReviewComment('');
        fetchProduct();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-700 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-slate-700 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-700 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        
        {/* Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-contain p-6 transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Save {discountPercent}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow ${
                wishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-400 hover:text-rose-500'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 stroke-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-white p-1 transition-all ${
                    selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-medium">| {product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & reviews header */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="text-xs font-bold text-amber-900">
                  {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {product.reviews?.length || 0} customer ratings & reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ₹{activePrice.toLocaleString('en-IN')}
            </span>
            {product.discountPrice > 0 && product.price > product.discountPrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  You Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          {/* Stock State */}
          <div className="flex items-center gap-2">
            {product.stock <= 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl">
                Hurry! Only {product.stock} items remaining in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> In Stock & Ready to Ship
              </span>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-2xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 text-sm font-bold text-slate-800 text-center min-w-[3rem]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                product.stock <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-98 text-white shadow-blue-500/25'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>
          </div>

          {/* Assurance Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-700">Free Delivery</p>
              <p className="text-[10px]">Orders &gt; ₹1000</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <RefreshCw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-700">7 Days Return</p>
              <p className="text-[10px]">Hassle Free</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <p className="font-semibold text-slate-700">1 Year Brand</p>
              <p className="text-[10px]">Warranty</p>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex border-b border-slate-200 gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'description' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Product Overview
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'reviews' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
              {product.reviews?.length || 0}
            </span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'description' ? (
            <div className="space-y-6 max-w-4xl text-sm text-slate-600 leading-relaxed">
              <p>{product.description}</p>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4">Technical Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                        <span className="font-semibold text-slate-500">{key}</span>
                        <span className="font-bold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl">
              
              {/* Write a review form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Leave a Customer Review
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Rating (1 to 5 Stars)</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'fill-amber-400 stroke-amber-400'
                                : 'stroke-slate-300 text-transparent'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Your Feedback</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Share your thoughts on build quality, audio performance, comfort..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;

