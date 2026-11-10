import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
  const itemTotal = unitPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:border-slate-300">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/products/${item.productId}`} className="flex-shrink-0">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
            alt={item.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 border border-slate-100"
          />
        </Link>

        <div className="space-y-1">
          <Link
            to={`/products/${item.productId}`}
            className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-900">
              ₹{unitPrice.toLocaleString('en-IN')}
            </span>
            {item.discountPrice > 0 && item.price > item.discountPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Controls & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Counter */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-200 transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-200 transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total price for this item */}
        <div className="text-right min-w-[5rem]">
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            ₹{itemTotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeFromCart(item.productId)}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default CartItem;

