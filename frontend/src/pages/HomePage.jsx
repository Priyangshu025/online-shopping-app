import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Truck, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Section from '../components/ui/Section';
import LinkButton from '../components/ui/LinkButton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products?isFeatured=true');
        if (res.success) {
          setFeaturedProducts(res.data.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    {
      name: 'Audio',
      desc: 'Noise-cancelling headphones & earbuds',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      path: '/products?category=Audio',
    },
    {
      name: 'Electronics',
      desc: 'Cameras, lenses & creator accessories',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
      path: '/products?category=Electronics',
    },
    {
      name: 'Computers & Accessories',
      desc: 'Mechanical keyboards, 4K displays & mice',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
      path: '/products?category=Computers%20%26%20Accessories',
    },
    {
      name: 'Wearables',
      desc: 'Health sensors & premium smartwatches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      path: '/products?category=Wearables',
    },
  ];

  return (
    <div className="w-full">
      
      {/* Light, Spacious Centered Hero */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20 bg-surface">
        <div className="container-page flex flex-col items-center text-center space-y-6">
          
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-accent uppercase">
            ShopNova Series
          </p>

          <h1 className="max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight text-ink leading-[1.08]">
            Pro sound. Intelligent gear. Pure design.
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
            Precision-engineered headphones, mechanical workstation peripherals, and personal technology crafted for focus.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <LinkButton to="/products" variant="primary" size="md">
              Shop now
            </LinkButton>
            <Link
              to="/products?category=Audio"
              className="text-sm sm:text-base font-medium text-accent hover:underline inline-flex items-center gap-1"
            >
              <span>Explore audio</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hero Showcase Image */}
          <div className="w-full max-w-4xl pt-10 sm:pt-14">
            <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden bg-surface-alt border border-line/60 flex items-center justify-center p-6 sm:p-12">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85"
                alt="Sony WH-1000XM5 Premium Audio"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Featured Categories on soft grey bg-surface-alt */}
      <Section alt id="categories">
        <div className="flex flex-col items-center text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-semibold text-ink tracking-tight">
            Explore by category.
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-md">
            Purpose-built technology tailored to every moment of your creative flow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group flex flex-col rounded-card bg-surface p-6 border border-line/50 transition duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="aspect-square w-full rounded-xl bg-surface-alt overflow-hidden p-6 flex items-center justify-center mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="text-base font-semibold text-ink group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-snug">
                {cat.desc}
              </p>
              <span className="text-xs font-medium text-accent mt-4 inline-flex items-center gap-1">
                Browse collection <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured / Handpicked Products on clean white bg-surface */}
      <Section id="featured">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-semibold text-ink tracking-tight">
              Handpicked. Engineered to last.
            </h2>
            <p className="text-sm text-ink-muted">
              Explore our highest-rated hardware and verified customer favorites.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-surface-alt rounded-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Section>

      {/* Quiet Promotional Notice Block */}
      <Section alt className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto rounded-card bg-surface p-8 sm:p-10 border border-line/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Special Welcome Promotion
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-ink">
              10% off your initial purchase.
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted">
              Apply code <span className="font-mono text-ink font-semibold bg-surface-alt px-2 py-0.5 rounded">WELCOME10</span> at checkout. Free express shipping included.
            </p>
          </div>

          <LinkButton to="/products" variant="primary" size="sm" className="flex-shrink-0">
            Shop with code
          </LinkButton>
        </div>
      </Section>

    </div>
  );
};

export default HomePage;
