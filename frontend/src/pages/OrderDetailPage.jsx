import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  AlertTriangle,
  Printer,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import OrderStatusTimeline from '../components/order/OrderStatusTimeline';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Any payment made will be refunded and inventory restored.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.patch(`/orders/${id}/cancel`);
      if (res.success) {
        toast.success('Order has been cancelled');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/my-orders" className="text-sm font-semibold text-blue-600 hover:underline">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const isCancellable = order.orderStatus === 'Order Placed' || order.orderStatus === 'Processing';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link to="/my-orders" className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Order {order.trackingNumber || order._id}
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>

          {isCancellable && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Visual Order Status Timeline */}
      <OrderStatusTimeline currentStatus={order.orderStatus} timeline={order.statusTimeline} />

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Shipping Address</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">{order.shippingAddress?.recipient}</p>
            <p>{order.shippingAddress?.addressLines}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
            <p className="text-slate-400">Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Payment Summary</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                order.paymentStatus === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : order.paymentStatus === 'Refunded'
                  ? 'bg-purple-50 text-purple-700'
                  : 'bg-amber-50 text-amber-800'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.paymentDetails?.transactionId && (
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono text-slate-500">{order.paymentDetails.transactionId}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Items Snapshot Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Order Items Snapshot</h3>
          <span className="text-xs text-slate-400">{order.items?.length} items</span>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || ''}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100"
                />
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase">{item.brand}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-800">₹{order.totals?.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          {order.totals?.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount:</span>
              <span>- ₹{order.totals?.discount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Delivery:</span>
            <span className="font-semibold text-slate-800">
              {order.totals?.deliveryCharge === 0 ? 'FREE' : `₹${order.totals?.deliveryCharge}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes:</span>
            <span className="font-semibold text-slate-800">₹{order.totals?.tax?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-slate-200">
            <span>Grand Total:</span>
            <span className="text-blue-600">₹{order.totals?.finalTotal?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetailPage;

