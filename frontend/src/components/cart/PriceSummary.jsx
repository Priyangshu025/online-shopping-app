import React, { useState } from 'react';
import { Tag, Check, X, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

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
  const freeShippingProgress = Math.min(100, (totals.subtotal / 1000) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      
      <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100">
        Order Summary
      </h3>

      {/* Free shipping progress bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1.5">
          <Truck className="w-4 h-4 text-blue-600" />
          {amountNeededForFreeShipping > 0 ? (
            <span>
              Add <strong className="text-blue-600">₹{amountNeededForFreeShipping}</strong> more for Free Express Delivery!
            </span>
          ) : (
            <span className="text-emerald-600 font-bold">🎉 You have unlocked Free Delivery!</span>
          )}
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Coupon Application Box */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Apply Discount Coupon
        </label>
        {coupon ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800">{coupon.code} Applied</p>
                <p className="text-emerald-600">Saving ₹{coupon.discountAmount}</p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
              title="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="e.g. WELCOME10"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase tracking-wider text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={applying || !couponInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              {applying ? 'Applying...' : 'Apply'}
            </button>
          </form>
        )}
        <p className="text-[11px] text-slate-400 mt-1">Available codes: <strong>WELCOME10</strong> (10% off)</p>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal</span>
          <span className="font-medium text-slate-800">₹{totals.subtotal.toLocaleString('en-IN')}</span>
        </div>

        {totals.discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Coupon Discount</span>
            <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Delivery Charges</span>
          <span className="font-medium text-slate-800">
            {totals.deliveryCharge === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
            ) : (
              `₹${totals.deliveryCharge}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Taxes (10% GST)</span>
          <span className="font-medium text-slate-800">₹{totals.tax.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-slate-900 font-extrabold text-base pt-3 border-t border-slate-200">
          <span>Order Total</span>
          <span className="text-blue-600">₹{totals.finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      {showCheckoutBtn && (
        <Link
          to="/checkout"
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
            items.length === 0
              ? 'bg-slate-200 text-slate-400 pointer-events-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-98'
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
      </div>

    </div>
  );
};

export default PriceSummary;

