import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import PriceSummary from '../components/cart/PriceSummary';
import LinkButton from '../components/ui/LinkButton';

const CartPage = () => {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-24 sm:py-32 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-surface-alt border border-line flex items-center justify-center mx-auto text-ink-muted">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Your bag is empty.</h1>
          <p className="text-sm text-ink-muted max-w-sm mx-auto">
            Free shipping on all orders over ₹1,000. Discover top audio, displays, and gear.
          </p>
        </div>
        <div>
          <LinkButton to="/products" variant="primary" size="md">
            Continue shopping
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-16 space-y-8">
      
      {/* Title & Empty Cart Action */}
      <div className="flex items-end justify-between pb-6 border-b border-line/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">Review your bag.</h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">Free express delivery and 7-day returns on every order.</p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-ink-muted hover:text-danger transition-colors font-medium"
        >
          Remove all
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-7 divide-y divide-line/60">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}

          <div className="pt-6">
            <Link
              to="/products"
              className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue shopping</span>
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-5">
          <PriceSummary showCheckoutBtn={true} />
        </div>

      </div>

    </div>
  );
};

export default CartPage;
