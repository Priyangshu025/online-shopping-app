import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10,
    maxDiscount: 1000,
    minOrderValue: 1500,
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.success) {
        setCoupons(res.data);
      }
    } catch (err) {
      toast.error('Failed to load coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      const res = await api.post('/coupons', newCoupon);
      if (res.success) {
        toast.success(`Coupon ${newCoupon.code} created`);
        setNewCoupon({ code: '', discountPercent: 10, maxDiscount: 1000, minOrderValue: 1500 });
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon removed');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to remove coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Discounts & Promo Coupons</h1>
        <p className="text-sm text-ink-muted mt-1">Manage festive campaign discounts, referral codes, and order caps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create form */}
        <div className="bg-surface p-6 rounded-card border border-line shadow-card space-y-4 lg:col-span-1">
          <h3 className="font-semibold text-ink text-base">Create Discount Code</h3>
          <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-ink block mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. FLASH30"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block mb-1">Discount Percentage (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newCoupon.discountPercent}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={newCoupon.maxDiscount}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <div>
              <label className="font-semibold text-ink block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={newCoupon.minOrderValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                required
                className="w-full px-3.5 py-2.5 bg-surface-alt border border-line rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
            >
              Generate Coupon
            </Button>
          </form>
        </div>

        {/* Existing Coupons */}
        <div className="bg-surface p-6 rounded-card border border-line shadow-card lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-ink text-base">Active Coupons ({coupons.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c._id} className="p-4 bg-surface-alt rounded-2xl border border-line/60 flex items-start justify-between text-xs hover:border-line transition-colors">
                <div className="space-y-1.5">
                  <span className="font-mono font-bold text-xs tracking-wider text-accent bg-accent-soft px-2.5 py-1 rounded-full inline-block">
                    {c.code}
                  </span>
                  <p className="font-bold text-ink text-base">{c.discountPercent}% Off</p>
                  <p className="text-xs text-ink-muted">Max Discount: ₹{c.maxDiscount.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-ink-muted">Min Order: ₹{c.minOrderValue.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  aria-label="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCouponsPage;

