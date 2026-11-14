import React, { useState } from 'react';
import { Tag, Check, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import LinkButton from '../ui/LinkButton';
import Price from '../ui/Price';
import Button from '../ui/Button';

const PriceSummary = ({ showCheckoutBtn = true }) => {
  const { totals, coupon, applyCouponCode, removeCoupon, items } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    const success = await applyCouponCode(couponInput.trim());
    if (success) setCouponInput('');
    setApplying(false);
  };

  const amountNeededForFreeShipping = Math.max(0, 1000 - totals.subtotal);

  return (
    <div className="bg-surface-alt p-6 sm:p-7 rounded-card border border-line/60 space-y-6">
      
      <h3 className="font-semibold text-ink text-base">
        Order Summary
      </h3>

      {/* Free delivery indicator */}
      <div className="text-xs text-ink-muted">
        {amountNeededForFreeShipping > 0 ? (
          <p>
            Add <strong className="text-ink font-semibold">₹{amountNeededForFreeShipping}</strong> more to qualify for Free Express Delivery.
          </p>
        ) : (
          <p className="text-success font-medium flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Free Express Delivery unlocked
          </p>
        )}
      </div>

      {/* Coupon Application */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-ink-muted block">
          Promo or Gift Code
        </label>
        {coupon ? (
          <div className="flex items-center justify-between p-3 bg-white border border-line rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <div>
                <p className="font-semibold text-ink">{coupon.code}</p>
                <p className="text-ink-muted">Saved ₹{coupon.discountAmount}</p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="p-1 text-ink-muted hover:text-danger transition-colors"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className="flex-1 h-10 px-3 text-xs uppercase bg-white border border-line rounded-lg focus:outline-none focus:border-accent text-ink"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={applying || !couponInput.trim()}
              className="h-10 px-4 text-xs font-semibold"
            >
              {applying ? 'Applying...' : 'Apply'}
            </Button>
          </form>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-line/60 text-xs sm:text-sm">
        <div className="flex justify-between text-ink-muted">
          <span>Items subtotal</span>
          <span className="text-ink font-medium">₹{totals.subtotal.toLocaleString('en-IN')}</span>
        </div>

        {totals.discount > 0 && (
          <div className="flex justify-between text-success font-medium">
            <span>Coupon discount</span>
            <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-ink-muted">
          <span>Delivery</span>
          <span className="text-ink font-medium">
            {totals.deliveryCharge === 0 ? 'FREE' : `₹${totals.deliveryCharge}`}
          </span>
        </div>

        <div className="flex justify-between text-ink-muted">
          <span>Estimated GST (10%)</span>
          <span className="text-ink font-medium">₹{totals.tax.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-baseline pt-4 border-t border-line/60">
          <span className="text-base font-semibold text-ink">Total</span>
          <Price value={totals.finalTotal} size="md" />
        </div>
      </div>

      {/* Checkout CTA */}
      {showCheckoutBtn && (
        <div className="pt-2">
          <LinkButton
            to="/checkout"
            variant="primary"
            size="md"
            className={`w-full ${items.length === 0 ? 'pointer-events-none opacity-40' : ''}`}
          >
            Check Out
          </LinkButton>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-xs text-ink-muted pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-ink-muted" />
        <span>Secure checkout with SSL encryption</span>
      </div>

    </div>
  );
};

export default PriceSummary;
