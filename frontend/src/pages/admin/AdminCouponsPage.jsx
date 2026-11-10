import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discounts & Promo Coupons</h1>
        <p className="text-xs text-slate-500 mt-1">Manage festive campaign discounts, referral codes, and order caps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-sm">Create Discount Code</h3>
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. FLASH30"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Discount Percentage (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newCoupon.discountPercent}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={newCoupon.maxDiscount}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={newCoupon.minOrderValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors"
            >
              Generate Coupon
            </button>
          </form>
        </div>

        {/* Existing Coupons */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Active Coupons ({coupons.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-mono font-bold text-sm text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-lg">
                    {c.code}
                  </span>
                  <p className="font-bold text-slate-800 text-sm">{c.discountPercent}% Instant Off</p>
                  <p className="text-[11px] text-slate-500">Max Discount: ₹{c.maxDiscount}</p>
                  <p className="text-[10px] text-slate-400">Min Order: ₹{c.minOrderValue}</p>
                </div>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
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

