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
import Badge from '../../components/ui/Badge';
import Price from '../../components/ui/Price';
import Button from '../../components/ui/Button';

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
        return <Badge variant="success" size="sm">{status}</Badge>;
      case 'Shipped':
      case 'Out for Delivery':
        return <Badge variant="accent" size="sm">{status}</Badge>;
      case 'Processing':
        return <Badge variant="neutral" size="sm" className="bg-blue-50 text-accent font-medium">{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="danger" size="sm">{status}</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Order Management</h1>
          <p className="text-sm text-ink-muted mt-1">Track customer orders, manage shipments, and update fulfillment states</p>
        </div>

        {/* Status Filters Tab */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-surface-alt p-1 rounded-full border border-line">
          {['All', 'Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-surface text-ink shadow-sm font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-card border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-alt text-ink-muted uppercase tracking-wider font-semibold text-[11px] border-b border-line">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Current Status</th>
                <th className="py-3.5 px-5">Update Status</th>
                <th className="py-3.5 px-5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-normal">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-surface-alt/60 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-ink font-mono text-xs">
                    {order.trackingNumber || order._id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-ink">{order.shippingAddress?.recipient || order.userName}</p>
                    <p className="text-[11px] text-ink-muted">{order.shippingAddress?.city}</p>
                  </td>
                  <td className="py-3.5 px-5 text-ink-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-ink">
                    <Price amount={order.totals?.finalTotal || 0} size="sm" />
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-medium text-ink">{order.paymentMethod}</span>
                    <span className={`block text-[11px] font-medium ${
                      order.paymentStatus === 'Completed' ? 'text-success' : 'text-amber-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="py-3.5 px-5">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-surface-alt border border-line text-ink rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
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
                      className="p-1.5 text-ink-muted hover:text-accent hover:bg-accent-soft rounded-lg transition-colors"
                      title="View Details"
                      aria-label="View order details"
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
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-line max-w-2xl w-full p-6 sm:p-8 shadow-lift space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h3 className="font-bold text-ink text-base">
                  Order Details — {selectedOrder.trackingNumber || selectedOrder._id}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-ink-muted hover:text-ink rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-alt rounded-2xl border border-line/60 space-y-1">
                <p className="font-semibold text-ink text-sm">Shipping Address</p>
                <p className="text-ink">{selectedOrder.shippingAddress?.recipient}</p>
                <p className="text-ink-muted">{selectedOrder.shippingAddress?.addressLines}</p>
                <p className="text-ink-muted">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}</p>
                <p className="text-ink-muted">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="p-4 bg-surface-alt rounded-2xl border border-line/60 space-y-1">
                <p className="font-semibold text-ink text-sm">Payment & Fulfillment</p>
                <p className="text-ink">Method: <strong>{selectedOrder.paymentMethod}</strong></p>
                <p className="text-ink">Payment: <strong className="text-success">{selectedOrder.paymentStatus}</strong></p>
                <p className="text-ink">Order Status: <strong className="text-accent">{selectedOrder.orderStatus}</strong></p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-ink text-xs uppercase tracking-wider">
                Ordered Items ({selectedOrder.items?.length})
              </h4>
              <div className="divide-y divide-line max-h-48 overflow-y-auto">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-alt border border-line/60 p-1 flex items-center justify-center flex-shrink-0">
                        <img src={item.image || ''} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="text-ink-muted">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-ink">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-line flex justify-between items-baseline">
              <span className="font-medium text-ink-muted text-sm">Final Order Total</span>
              <Price amount={selectedOrder.totals?.finalTotal || 0} size="lg" className="text-ink font-bold" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;


