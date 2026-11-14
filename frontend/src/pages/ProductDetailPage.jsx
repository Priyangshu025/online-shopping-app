import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  Heart, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ChevronRight, 
  Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Price from '../components/ui/Price';
import Badge from '../components/ui/Badge';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

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
      <div className="container-page py-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-ink">Product not found</h2>
        <Link to="/products" className="text-accent hover:underline text-sm font-medium">
          Return to catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const hasDiscount = product.discountPrice > 0 && product.price > product.discountPrice;
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to write a review');
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
        toast.success('Review submitted');
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
    <div className="container-page py-8 sm:py-12 space-y-12">
      
      {/* Quiet Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-line" />
        <Link to="/products" className="hover:text-ink transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-line" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-ink transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-line" />
        <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase: Left Gallery, Right Purchase Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] sm:aspect-square w-full rounded-card bg-surface-alt border border-line/60 overflow-hidden flex items-center justify-center p-8 sm:p-12 relative">
            <img
              src={selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <Badge variant="accent">
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl border bg-surface-alt p-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-accent ring-2 ring-accent/20' : 'border-line/60 hover:border-line'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Purchase Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              {product.brand}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="pt-2">
              <Price value={activePrice} old={hasDiscount ? product.price : null} size="lg" />
              <p className="text-xs text-ink-muted mt-1">MRP inclusive of all taxes.</p>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-ink-muted leading-relaxed">
            {product.description}
          </p>

          {/* Stock & Delivery status */}
          <div className="space-y-2 pt-2 border-t border-line/60 text-xs">
            <div className="flex items-center gap-2 text-ink">
              <Truck className="w-4 h-4 text-ink-muted" />
              <span>Free express delivery on this order</span>
            </div>
            {product.stock <= 0 ? (
              <p className="text-danger font-medium">Currently out of stock</p>
            ) : product.stock <= 5 ? (
              <p className="text-ink-muted font-medium">Only {product.stock} units remaining</p>
            ) : (
              <p className="text-success font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> In stock and ready to dispatch
              </p>
            )}
          </div>

          {/* Quantity Selector & Primary Add Button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-line rounded-full bg-surface-alt px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-1.5 text-ink-muted hover:text-ink disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-medium text-ink min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 text-ink-muted hover:text-ink disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-3 rounded-full border border-line transition-colors ${
                  wishlisted ? 'text-danger bg-surface-alt border-danger/40' : 'text-ink-muted hover:text-ink'
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              className="w-full"
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {/* Trust Row */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-line/60 text-xs text-ink-muted">
            <div className="flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-ink-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-ink">7-Day Returns</p>
                <p className="text-[11px] mt-0.5">Hassle-free doorstep pickup</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-ink-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-ink">Genuine Warranty</p>
                <p className="text-[11px] mt-0.5">1-year manufacturer guarantee</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs / Specifications & Reviews */}
      <div className="pt-12 border-t border-line/60 space-y-8">
        <div className="flex border-b border-line gap-8 text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'overview' ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Specifications
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'reviews' ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="max-w-3xl space-y-6 text-sm text-ink leading-relaxed">
            <p>{product.description}</p>
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border border-line/60 rounded-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-line/60">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key} className="even:bg-surface-alt">
                        <td className="py-3 px-5 font-semibold text-ink-muted w-1/3">{key}</td>
                        <td className="py-3 px-5 text-ink">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl space-y-8">
            {/* Submit Review */}
            <div className="bg-surface-alt p-6 rounded-card border border-line/60 space-y-4">
              <h3 className="text-sm font-semibold text-ink">Write a review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-ink-muted block mb-1.5">Rating (1 to 5 stars)</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                        aria-label={`Select ${star} stars`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-amber-400 stroke-amber-400'
                              : 'text-line stroke-line'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-ink-muted block mb-1.5">Review feedback</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience with build quality, battery, or design..."
                    className="w-full text-sm p-3 bg-white border border-line rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Post review'}
                </Button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev._id} className="p-5 rounded-card border border-line/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink">{rev.userName}</span>
                      <span className="text-ink-muted">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-line stroke-line'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-ink leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">No reviews yet for this product.</p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductDetailPage;
