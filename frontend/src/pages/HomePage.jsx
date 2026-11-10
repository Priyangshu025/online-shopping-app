import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Star } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, filterMetaRes] = await Promise.all([
          api.get('/products?isFeatured=true'),
          api.get('/products/meta/filters'),
        ]);

        if (prodRes.success) setFeaturedProducts(prodRes.data.slice(0, 8));
        if (filterMetaRes.success) setCategories(filterMetaRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryVisuals = [
    { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', desc: 'Headphones & ANC' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', desc: 'Cameras & Tech' },
    { name: 'Computers & Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', desc: 'Workstation Gear' },
    { name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', desc: 'Smartwatches' },
    { name: 'Fashion & Lifestyle', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', desc: 'Gear & Bags' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&auto=format&fit=crop&q=80"
          alt="Modern electronics banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 lg:py-32 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold tracking-wide backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Generation E-Commerce Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-2xl">
            Upgrade Your Digital Lifestyle with <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">ShopNova</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Discover precision-engineered headphones, high-refresh displays, mechanical keyboards, and top smart wearables with verified reviews and express India delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products?category=Audio"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl border border-white/20 backdrop-blur transition-all"
            >
              Browse Audio Gear
            </Link>
          </div>

          <div className="pt-6 flex items-center gap-6 text-xs text-slate-400 border-t border-white/10">
            <div>
              <p className="font-extrabold text-white text-base">100%</p>
              <p>Genuine Brands</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-extrabold text-white text-base">2-Day</p>
              <p>Express Dispatch</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-extrabold text-white text-base">4.9 ★</p>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Collections</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoryVisuals.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] text-blue-300 font-medium">{cat.desc}</p>
                <h3 className="font-bold text-sm leading-snug group-hover:text-blue-200 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-blue-600" />
              <span>Trending & Handpicked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            <span>See All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 z-10 max-w-lg">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Student Special Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Save Flat 10% on Your First Order!
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Use promo coupon <strong className="text-white bg-black/30 px-2 py-0.5 rounded font-mono">WELCOME10</strong> at checkout to get an instant discount. Free express delivery included.
            </p>
          </div>

          <div className="z-10 flex-shrink-0">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-95 inline-block"
            >
              Shop Now With Promo
            </Link>
          </div>

          {/* Decorative glow circles */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

    </div>
  );
};

export default HomePage;

