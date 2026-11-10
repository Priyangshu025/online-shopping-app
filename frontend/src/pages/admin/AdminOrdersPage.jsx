import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  ChevronRight, 
  Eye, 
  X, 
  CheckCircle,
  Truck,
  MapPin,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'All' ? '/admin/orders' : `/admin/orders?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        comment: `Order status updated to ${newStatus} by Admin.`,
      });
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-50 text-blue-700';
      case 'Processing':
        return 'bg-indigo-50 text-indigo-700';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-amber-50 text-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-500 mt-1">Track customer orders, manage shipments, and update fulfillment states</p>
        </div>

        {/* Status Filters Tab */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1 rounded-2xl border border-slate-200">
          {['All', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Total (₹)</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Current Status</th>
                <th className="py-3.5 px-5">Transition Status</th>
                <th className="py-3.5 px-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-800">
                    {order.trackingNumber || order._id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-800">{order.shippingAddress?.recipient || order.userName}</p>
                    <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    ₹{order.totals?.finalTotal?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-semibold">{order.paymentMethod}</span>
                    <span className={`block text-[10px] font-bold ${
                      order.paymentStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Order Details — {selectedOrder.trackingNumber || selectedOrder._id}
                </h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Status */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Shipping Address</p>
                <p>{selectedOrder.shippingAddress?.recipient}</p>
                <p>{selectedOrder.shippingAddress?.addressLines}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}</p>
                <p className="text-slate-400">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Payment & Status</p>
                <p>Mode: <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong></p>
                <p>Payment: <strong className="text-emerald-700">{selectedOrder.paymentStatus}</strong></p>
                <p>Order Status: <strong className="text-blue-700">{selectedOrder.orderStatus}</strong></p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs">Ordered Items ({selectedOrder.items?.length})</h4>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image || ''} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-700 text-xs">Final Order Total:</span>
              <span className="text-lg font-black text-blue-600">
                ₹{selectedOrder.totals?.finalTotal?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;

