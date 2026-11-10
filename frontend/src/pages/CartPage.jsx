import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import PriceSummary from '../components/cart/PriceSummary';

const CartPage = () => {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Looks like you haven't added any products to your cart yet. Explore our top tech deals and headphones!
          </p>
        </div>
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start Shopping Now</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to secure payment</p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Empty Cart</span>
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="lg:col-span-1">
          <PriceSummary showCheckoutBtn={true} />
        </div>

      </div>

    </div>
  );
};

export default CartPage;

