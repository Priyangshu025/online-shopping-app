import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const { summary, lowStockProducts, categoryStats, salesTrends, recentOrders } = data || {};

  const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview & Performance</h1>
        <p className="text-xs text-slate-500 mt-1">Live metrics, inventory health, and recent customer activities</p>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${(summary?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          change="+18.4% this month"
          trend="up"
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={summary?.totalOrders || 0}
          icon={ShoppingBag}
          change={`${summary?.pendingOrders || 0} pending processing`}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={summary?.totalProducts || 0}
          icon={Package}
          change={`${lowStockProducts?.length || 0} low stock items`}
          trend={lowStockProducts?.length > 0 ? 'down' : 'up'}
          color="indigo"
        />
        <StatCard
          title="Registered Customers"
          value={summary?.totalCustomers || 0}
          icon={Users}
          change="Verified user accounts"
          trend="up"
          color="amber"
        />
      </div>

      {/* Low-Stock Alert Banner if any */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low-Stock Inventory Warnings ({lowStockProducts.length} items)</span>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-amber-800 hover:underline">
              Restock Products →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">{p.name}</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg flex-shrink-0">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trends Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Monthly Revenue Trends</h3>
              <p className="text-xs text-slate-400">Order volumes and gross revenue</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Growth</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrends || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-1 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Products by Category</h3>
            <p className="text-xs text-slate-400">Catalog inventory distribution</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={75} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {(categoryStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest transactions requiring fulfillment</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(recentOrders || []).map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-800">
                    {order.trackingNumber || order._id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-800">{order.shippingAddress?.recipient || order.userName}</p>
                    <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="py-3.5 px-5">{order.items?.length} items</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    ₹{order.totals?.finalTotal?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;

