import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Price from '../ui/Price';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
  const itemTotal = unitPrice * item.quantity;

  return (
    <div className="py-5 border-b border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/products/${item.productId}`} className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl bg-surface-alt border border-line/40 p-2 flex items-center justify-center">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        <div className="space-y-1">
          <Link
            to={`/products/${item.productId}`}
            className="text-sm font-semibold text-ink hover:text-accent transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          <Price value={unitPrice} old={item.discountPrice > 0 ? item.price : null} size="sm" />
        </div>
      </div>

      {/* Quantity & Item Total Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        
        {/* Quantity Stepper */}
        <div className="flex items-center border border-line rounded-full bg-surface-alt px-2 py-0.5">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="p-1.5 text-ink-muted hover:text-ink"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-semibold text-ink min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="p-1.5 text-ink-muted hover:text-ink"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[5rem]">
          <Price value={itemTotal} size="sm" />
        </div>

        {/* Remove */}
        <button
          onClick={() => removeFromCart(item.productId)}
          className="p-1.5 text-ink-muted hover:text-danger rounded-full transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default CartItem;
