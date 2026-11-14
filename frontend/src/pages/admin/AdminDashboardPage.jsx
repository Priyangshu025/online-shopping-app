import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight
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
import Badge from '../../components/ui/Badge';

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
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  const { summary, lowStockProducts, categoryStats, salesTrends, recentOrders } = data || {};
  const BAR_COLORS = ['#0a6cff', '#1d1d1f', '#6e6e73', '#d2d2d7', '#1a7f37'];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Overview</h1>
        <p className="text-xs text-ink-muted mt-0.5">Live store performance and order fulfillment metrics.</p>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${(summary?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          change="+18% growth"
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={summary?.totalOrders || 0}
          icon={ShoppingBag}
          change={`${summary?.pendingOrders || 0} pending`}
          trend="up"
        />
        <StatCard
          title="Active Products"
          value={summary?.totalProducts || 0}
          icon={Package}
          change={`${lowStockProducts?.length || 0} low stock`}
          trend={lowStockProducts?.length > 0 ? 'down' : 'up'}
        />
        <StatCard
          title="Registered Customers"
          value={summary?.totalCustomers || 0}
          icon={Users}
          change="Customer accounts"
          trend="up"
        />
      </div>

      {/* Low-Stock Warning if any */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="bg-surface p-5 rounded-card border border-line/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ink text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low stock warning ({lowStockProducts.length} items)</span>
            </div>
            <Link to="/admin/products" className="text-xs text-accent hover:underline font-medium">
              Manage inventory →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="bg-surface-alt p-3 rounded-xl border border-line/40 flex items-center justify-between text-xs">
                <span className="font-medium text-ink truncate max-w-[180px]">{p.name}</span>
                <Badge variant="danger">{p.stock} left</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trends Chart */}
        <div className="bg-surface p-6 rounded-card border border-line/60 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-ink text-sm">Monthly Revenue Trends</h2>
              <p className="text-xs text-ink-muted">Historical and projected gross sales</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Positive trend</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrends || []}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a6cff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0a6cff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f1ef" />
                <XAxis dataKey="month" stroke="#6e6e73" fontSize={11} tickLine={false} />
                <YAxis stroke="#6e6e73" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0a6cff" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-surface p-6 rounded-card border border-line/60 lg:col-span-1 space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-sm">Products by Category</h2>
            <p className="text-xs text-ink-muted">Stock catalog breakdown</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f1ef" />
                <XAxis type="number" stroke="#6e6e73" fontSize={10} />
                <YAxis type="category" dataKey="name" stroke="#6e6e73" fontSize={10} width={75} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '11px' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {(categoryStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface rounded-card border border-line/60 overflow-hidden">
        <div className="p-5 border-b border-line/50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-ink text-sm">Recent Orders</h2>
            <p className="text-xs text-ink-muted">Latest purchases awaiting dispatch</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-alt text-ink-muted font-medium">
              <tr>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {(recentOrders || []).map((order) => (
                <tr key={order._id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="py-3 px-5 font-semibold text-ink">
                    {order.trackingNumber || order._id.slice(-6)}
                  </td>
                  <td className="py-3 px-5">
                    <p className="font-medium">{order.shippingAddress?.recipient || order.userName}</p>
                    <p className="text-[11px] text-ink-muted">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="py-3 px-5 text-ink-muted">{order.items?.length} items</td>
                  <td className="py-3 px-5 font-semibold text-ink">
                    ₹{order.totals?.finalTotal?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-5 text-ink-muted">
                    {order.paymentMethod}
                  </td>
                  <td className="py-3 px-5">
                    <Badge variant={order.orderStatus === 'Delivered' ? 'success' : order.orderStatus === 'Cancelled' ? 'danger' : 'accent'}>
                      {order.orderStatus}
                    </Badge>
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
